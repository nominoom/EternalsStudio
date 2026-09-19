'use client';

import React, { useState } from 'react';
import { 
  X, 
  Sliders, 
  Trash2, 
  Plus, 
  Copy, 
  Palette, 
  Move, 
  Type, 
  Link as LinkIcon, 
  Sparkles,
  ChevronUp,
  ChevronDown,
  Edit2
} from 'lucide-react';
import { useSiteContent, SectionStyle, CustomSectionBlock } from '../../context/SiteContentContext';
import { SECTION_METADATA } from './EditorSidebar';

interface SectionInspectorProps {
  pageId: string;
  sectionId: string | null;
  onClose: () => void;
  onDelete: () => void;
}

export default function SectionInspector({
  pageId,
  sectionId,
  onClose,
  onDelete
}: SectionInspectorProps) {
  const { 
    siteContent, 
    updateSiteContent, 
    updateSectionStyle,
    addStat,
    deleteStat,
    addTeamMember,
    deleteTeamMember,
    addPromoBanner,
    deletePromoBanner
  } = useSiteContent();

  if (!sectionId) return null;

  const currentStyles: SectionStyle = siteContent.sectionStyles?.[sectionId] || {
    bg: 'mesh',
    padding: 'standard',
    align: 'center'
  };

  const meta = SECTION_METADATA[sectionId] || {
    label: sectionId.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    icon: '📦',
    desc: 'Configure appearance and content for this section.'
  };

  const handleStyleChange = (key: keyof SectionStyle, value: any) => {
    updateSectionStyle(pageId, sectionId, { [key]: value });
  };

  return (
    <aside className="w-80 sm:w-96 bg-slate-900 border-l border-slate-800 flex flex-col flex-shrink-0 z-30 select-none overflow-hidden text-slate-100 shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Sliders size={16} />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-teal-400">
              Inspector
            </h4>
            <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
              <span>{meta.icon}</span>
              <span>{meta.label}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="h-8 w-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Style & Appearance Section */}
        <div className="space-y-3">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Palette size={13} className="text-teal-400" />
            <span>Background Style</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'mesh', label: 'Dark Mesh', desc: 'Subtle gradient glow' },
              { id: 'glass', label: 'Frosted Glass', desc: 'Backdrop blur' },
              { id: 'slate', label: 'Solid Slate', desc: 'Crisp minimal dark' },
              { id: 'glow', label: 'Neon Cyber', desc: 'Vibrant glow accent' }
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => handleStyleChange('bg', b.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  currentStyles.bg === b.id
                    ? 'bg-teal-500/20 border-teal-500 text-white font-bold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-bold">{b.label}</div>
                <div className="text-[10px] opacity-70 mt-0.5">{b.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Section Padding Controls */}
        <div className="space-y-3">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Move size={13} className="text-teal-400" />
            <span>Vertical Spacing</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'compact', label: 'Compact' },
              { id: 'standard', label: 'Standard' },
              { id: 'spacious', label: 'Spacious' }
            ].map((pad) => (
              <button
                key={pad.id}
                onClick={() => handleStyleChange('padding', pad.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                  currentStyles.padding === pad.id
                    ? 'bg-teal-500 text-white border-teal-400 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {pad.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Controls based on section type */}
        {sectionId === 'hero' && (
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="text-xs font-extrabold text-teal-400 uppercase tracking-wider">
              Hero Content Properties
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400">Badge Text</label>
              <input
                type="text"
                value={siteContent.hero.badgeText}
                onChange={(e) => updateSiteContent({ hero: { ...siteContent.hero, badgeText: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400">Primary Headline</label>
              <input
                type="text"
                value={siteContent.hero.titleLine1}
                onChange={(e) => updateSiteContent({ hero: { ...siteContent.hero, titleLine1: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400">Gradient Highlight Text</label>
              <input
                type="text"
                value={siteContent.hero.titleHighlight}
                onChange={(e) => updateSiteContent({ hero: { ...siteContent.hero, titleHighlight: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400">Description</label>
              <textarea
                value={siteContent.hero.description}
                rows={3}
                onChange={(e) => updateSiteContent({ hero: { ...siteContent.hero, description: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400">Primary Button</label>
                <input
                  type="text"
                  value={siteContent.hero.primaryCtaText}
                  onChange={(e) => updateSiteContent({ hero: { ...siteContent.hero, primaryCtaText: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-100"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400">Button Link</label>
                <input
                  type="text"
                  value={siteContent.hero.primaryCtaLink}
                  onChange={(e) => updateSiteContent({ hero: { ...siteContent.hero, primaryCtaLink: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-100"
                />
              </div>
            </div>
          </div>
        )}

        {sectionId === 'cta' && (
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="text-xs font-extrabold text-teal-400 uppercase tracking-wider">
              Call To Action Banner Settings
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400">Headline</label>
              <input
                type="text"
                value={siteContent.sections.ctaBannerTitle}
                onChange={(e) => updateSiteContent({ sections: { ...siteContent.sections, ctaBannerTitle: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400">Description</label>
              <textarea
                value={siteContent.sections.ctaBannerDescription}
                rows={3}
                onChange={(e) => updateSiteContent({ sections: { ...siteContent.sections, ctaBannerDescription: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400">Button Label</label>
                <input
                  type="text"
                  value={siteContent.sections.ctaBannerButtonText}
                  onChange={(e) => updateSiteContent({ sections: { ...siteContent.sections, ctaBannerButtonText: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-100"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400">Button URL</label>
                <input
                  type="text"
                  value={siteContent.sections.ctaBannerButtonLink}
                  onChange={(e) => updateSiteContent({ sections: { ...siteContent.sections, ctaBannerButtonLink: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-100"
                />
              </div>
            </div>
          </div>
        )}

        {sectionId === 'stats' && (
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div className="text-xs font-extrabold text-teal-400 uppercase tracking-wider">
                Metrics & Milestones
              </div>
              <button
                onClick={() => addStat({ value: '99+', label: 'New Metric' })}
                className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 font-bold cursor-pointer"
              >
                <Plus size={12} />
                <span>Add Metric</span>
              </button>
            </div>

            <div className="space-y-2">
              {siteContent.stats.map((st) => (
                <div key={st.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-extrabold text-teal-400 text-xs">{st.value}</span>
                    <span className="text-xs text-slate-400 ml-2">{st.label}</span>
                  </div>
                  <button
                    onClick={() => deleteStat(st.id)}
                    className="text-slate-500 hover:text-red-400 p-1 rounded cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer: Delete Section Action */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-all cursor-pointer"
        >
          <Trash2 size={13} />
          <span>Delete Section</span>
        </button>

        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
        >
          Done
        </button>
      </div>
    </aside>
  );
}
