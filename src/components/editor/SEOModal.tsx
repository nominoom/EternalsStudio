'use client';

import React, { useState } from 'react';
import { X, Search, Globe, Share2, Check } from 'lucide-react';
import { CMSPageSEO } from '@/types/cms';

interface SEOModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageTitle: string;
  pageSlug: string;
  seo: CMSPageSEO;
  onSaveSEO: (updatedSEO: CMSPageSEO) => void;
}

export default function SEOModal({
  isOpen,
  onClose,
  pageTitle,
  pageSlug,
  seo,
  onSaveSEO
}: SEOModalProps) {
  const [formData, setFormData] = useState<CMSPageSEO>({
    title: seo?.title || `${pageTitle} | Eternals Studio`,
    description: seo?.description || 'Premium digital assets, custom Next.js web applications, and immersive 3D graphics.',
    canonicalUrl: seo?.canonicalUrl || '',
    ogTitle: seo?.ogTitle || seo?.title || `${pageTitle} | Eternals Studio`,
    ogDescription: seo?.ogDescription || seo?.description || 'Where Ideas Become Reality.',
    ogImage: seo?.ogImage || '/eternals-logo.jpg',
    noIndex: seo?.noIndex || false
  });

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSEO(formData);
    onClose();
  };

  const domain = 'https://eternals.studio';
  const fullUrl = `${domain}/${pageSlug === 'main' ? '' : pageSlug}`;

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/15 text-teal-400 border border-teal-500/30">
              <Search size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                SEO & Social Meta Configuration
              </h3>
              <p className="text-xs text-slate-400">
                Optimize search engine visibility and social card sharing previews for this page.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Google Search Preview Snippet */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Google Search Result Preview
            </span>
            <div className="text-xs font-mono text-slate-400 truncate">
              {fullUrl}
            </div>
            <div className="text-base font-bold text-blue-400 hover:underline cursor-pointer truncate">
              {formData.title || 'Page Title'}
            </div>
            <div className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {formData.description || 'Page meta description will appear here in search engine results.'}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Page Meta Title (Browser Tab & SERP)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
              <span className="text-[10px] text-slate-500">Recommended: 50-60 characters ({formData.title.length}/60)</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
              <span className="text-[10px] text-slate-500">Recommended: 120-160 characters ({formData.description.length}/160)</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Open Graph Social Share Image URL
              </label>
              <input
                type="text"
                value={formData.ogImage}
                onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
              />
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Search Engine Indexing</span>
                <span className="text-[11px] text-slate-400">Allow Google, Bing, and other search engines to index this page.</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!formData.noIndex}
                  onChange={(e) => setFormData({ ...formData, noIndex: !e.target.checked })}
                  className="rounded border-slate-800 text-teal-500 focus:ring-teal-500"
                />
                <span className="text-xs font-bold text-teal-400">Index Allowed</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-end gap-2 text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-extrabold shadow-md shadow-teal-500/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Check size={14} />
            <span>Save SEO Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
