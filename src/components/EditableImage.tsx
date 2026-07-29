'use client';

import React, { useState } from 'react';
import { useSiteContent } from '../context/SiteContentContext';
import { Image as ImageIcon, Upload, Link as LinkIcon, X, Check, Trash2, Loader2 } from 'lucide-react';

interface EditableImageProps {
  src: string;
  alt: string;
  onChange: (newUrl: string) => void;
  className?: string;
  containerClassName?: string;
  label?: string;
  placeholderText?: string;
}

export default function EditableImage({
  src,
  alt,
  onChange,
  className = '',
  containerClassName = '',
  label = 'Banner Image',
  placeholderText = 'No image selected'
}: EditableImageProps) {
  const { isEditMode } = useSiteContent();
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState(src);
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // If edit mode is OFF, render plain image or placeholder
  if (!isEditMode) {
    if (!src) return null;
    return <img src={src} alt={alt} className={className} />;
  }

  const handleOpenModal = () => {
    setImageUrl(src);
    setUploadError(null);
    setIsEditing(true);
  };

  const handleSave = () => {
    onChange(imageUrl);
    setIsEditing(false);
  };

  const handleClear = () => {
    setImageUrl('');
    onChange('');
    setIsEditing(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP, GIF, SVG)');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;

        try {
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
          if (res.ok && data.attachment?.url) {
            setImageUrl(data.attachment.url);
          } else {
            // Local fallback
            setImageUrl(base64Data);
          }
        } catch (err) {
          // Direct base64 fallback
          setImageUrl(base64Data);
        } finally {
          setIsUploading(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploadError(err.message || 'Error uploading file');
      setIsUploading(false);
    }
  };

  return (
    <div className={`relative group/image-editor inline-block max-w-full ${containerClassName}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          onClick={handleOpenModal}
          className={`${className} cursor-pointer hover:opacity-90 hover:outline-dashed hover:outline-2 hover:outline-teal-400/80 transition-all`}
        />
      ) : (
        <div
          onClick={handleOpenModal}
          className="w-full h-32 rounded-2xl border-2 border-dashed border-teal-500/40 bg-teal-500/5 hover:bg-teal-500/10 flex flex-col items-center justify-center p-4 cursor-pointer transition-all text-center gap-2"
        >
          <ImageIcon className="text-teal-500 h-6 w-6" />
          <span className="text-xs font-bold text-teal-600 dark:text-teal-400">🖼️ Add {label}</span>
          <span className="text-[10px] text-slate-400">{placeholderText}</span>
        </div>
      )}

      {/* Hover Edit Badge */}
      <button
        onClick={handleOpenModal}
        className="opacity-0 group-hover/image-editor:opacity-100 transition-opacity absolute top-3 right-3 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white font-extrabold text-xs shadow-xl backdrop-blur-md hover:scale-105 cursor-pointer border border-teal-500/30"
      >
        <ImageIcon size={14} className="text-teal-400" />
        <span>Change {label}</span>
      </button>

      {/* Upload/Edit Modal */}
      {isEditing && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in"
          onClick={() => setIsEditing(false)}
        >
          <div 
            className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl flex flex-col gap-5 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-500/10 text-teal-500">
                  <ImageIcon size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                    Edit {label}
                  </h4>
                  <p className="text-xs text-slate-400">Set a web URL or upload an image file from your computer.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Sub-tab navigation */}
            <div className="flex border-b border-slate-200/60 dark:border-slate-800/60 gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`pb-2 font-bold text-xs border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'url' ? 'border-teal-500 text-teal-500' : 'border-transparent text-slate-400'
                }`}
              >
                <LinkIcon size={12} />
                <span>Image Web URL</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`pb-2 font-bold text-xs border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'upload' ? 'border-teal-500 text-teal-500' : 'border-transparent text-slate-400'
                }`}
              >
                <Upload size={12} />
                <span>Upload Image File</span>
              </button>
            </div>

            {/* Tab 1: Web URL */}
            {activeTab === 'url' && (
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Image Direct URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or https://domain.com/banner.png"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            )}

            {/* Tab 2: File Upload */}
            {activeTab === 'upload' && (
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Select Local Image File</label>
                <label className="w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 rounded-2xl flex flex-col items-center justify-center p-4 cursor-pointer bg-slate-50 dark:bg-slate-950/50 transition-all text-center gap-2">
                  {isUploading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
                      <span className="text-xs font-bold text-teal-500">Uploading image file...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-teal-500" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Click to choose image file</span>
                      <span className="text-[10px] text-slate-400">PNG, JPG, WebP, GIF, SVG up to 10MB</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>
            )}

            {uploadError && (
              <p className="text-xs font-bold text-red-500 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
                {uploadError}
              </p>
            )}

            {/* Live Image Preview */}
            {imageUrl && (
              <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Live Preview</span>
                <div className="h-36 w-full rounded-2xl overflow-hidden bg-slate-950/40 border border-slate-200 dark:border-slate-800 flex items-center justify-center p-2">
                  <img src={imageUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded-xl" />
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
              {imageUrl ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={13} />
                  <span>Remove Image</span>
                </button>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-teal-500 hover:bg-teal-600 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
                >
                  <Check size={14} />
                  <span>Apply Image</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
