'use client';

import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Search, 
  Trash2, 
  Copy, 
  Check, 
  Image as ImageIcon, 
  FileText, 
  Loader2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { MediaAsset } from '@/types/cms';
import { isAllowedMediaType, isAllowedFileSize } from '@/lib/cms/sanitizer';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaAssets: MediaAsset[];
  onUploadAsset: (asset: MediaAsset) => void;
  onDeleteAsset: (assetId: string) => void;
  onSelectUrl?: (url: string) => void;
}

export default function MediaLibraryModal({
  isOpen,
  onClose,
  mediaAssets,
  onUploadAsset,
  onDeleteAsset,
  onSelectUrl
}: MediaLibraryModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredAssets = mediaAssets.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.alt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isAllowedMediaType(file.type)) {
      setUploadError('Invalid file format. Please choose a PNG, JPG, WebP, GIF, or MP4 file.');
      return;
    }

    if (!isAllowedFileSize(file.size, 15)) {
      setUploadError('File exceeds the 15MB limit.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;

        try {
          // Send to upload API endpoint
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: file.name,
              fileData: base64Data,
              fileSize: file.size,
              fileType: file.type
            })
          });

          const data = await res.json();
          const targetUrl = data.attachment?.url || base64Data;

          const newAsset: MediaAsset = {
            id: `media-${Date.now()}`,
            name: file.name,
            url: targetUrl,
            size: file.size,
            type: file.type,
            alt: file.name.replace(/\.[^/.]+$/, ''),
            uploadedAt: new Date().toISOString()
          };

          onUploadAsset(newAsset);
        } catch {
          // Fallback direct base64
          const newAsset: MediaAsset = {
            id: `media-${Date.now()}`,
            name: file.name,
            url: base64Data,
            size: file.size,
            type: file.type,
            alt: file.name.replace(/\.[^/.]+$/, ''),
            uploadedAt: new Date().toISOString()
          };
          onUploadAsset(newAsset);
        } finally {
          setIsUploading(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setUploadError(errMsg || 'Upload failed');
      setIsUploading(false);
    }
  };

  const handleCopyUrl = (asset: MediaAsset, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="w-full max-w-4xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between flex-shrink-0 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/15 text-teal-400 border border-teal-500/30">
              <ImageIcon size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Media Asset Manager
              </h3>
              <p className="text-xs text-slate-400">
                Browse, upload, and select images for your website.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Toolbar: Search + Upload Input */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/20 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search images by name or alt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer">
            {isUploading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Upload size={14} />
            )}
            <span>{isUploading ? 'Uploading...' : 'Upload Media File'}</span>
            <input
              type="file"
              accept="image/*,video/mp4"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>

        {uploadError && (
          <div className="px-6 py-2 bg-red-500/10 border-b border-red-500/20 text-xs font-bold text-red-400">
            {uploadError}
          </div>
        )}

        {/* Grid of Media Assets */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredAssets.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-500 space-y-2">
              <ImageIcon className="mx-auto h-12 w-12 text-slate-700" />
              <p className="text-sm font-bold">No media assets found</p>
              <p className="text-xs text-slate-600">Upload a PNG, JPG, or WebP to populate your library.</p>
            </div>
          ) : (
            filteredAssets.map((asset) => (
              <div
                key={asset.id}
                onClick={() => {
                  if (onSelectUrl) {
                    onSelectUrl(asset.url);
                    onClose();
                  }
                }}
                className="group relative rounded-2xl bg-slate-950 border border-slate-800 hover:border-teal-500/60 overflow-hidden flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-teal-500/5"
              >
                {/* Thumbnail Preview */}
                <div className="h-32 w-full bg-slate-900/60 flex items-center justify-center overflow-hidden p-2">
                  <img
                    src={asset.url}
                    alt={asset.alt || asset.name}
                    className="max-h-full max-w-full object-contain rounded-lg group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Info & Actions */}
                <div className="p-3 border-t border-slate-800/80 space-y-1">
                  <div className="text-xs font-bold text-white truncate" title={asset.name}>
                    {asset.name}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center justify-between font-mono">
                    <span>{(asset.size / 1024).toFixed(1)} KB</span>
                    <span className="uppercase">{asset.type.split('/')[1] || 'img'}</span>
                  </div>

                  {/* Action buttons on hover */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-800/60">
                    <button
                      onClick={(e) => handleCopyUrl(asset, e)}
                      className="text-[10px] font-bold text-slate-400 hover:text-teal-400 flex items-center gap-1 cursor-pointer"
                      title="Copy direct URL"
                    >
                      {copiedId === asset.id ? <Check size={11} className="text-teal-400" /> : <Copy size={11} />}
                      <span>{copiedId === asset.id ? 'Copied' : 'Copy URL'}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteAsset(asset.id);
                      }}
                      className="text-slate-500 hover:text-red-400 p-1 rounded cursor-pointer"
                      title="Delete asset"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {onSelectUrl && (
                  <div className="absolute inset-0 bg-teal-950/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="px-3 py-1.5 rounded-xl bg-teal-500 text-white font-extrabold text-xs shadow-lg">
                      Select for Block
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
          <span>{mediaAssets.length} total media assets in studio library</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
