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
  Edit2,
  Users,
  Star,
  ShoppingBag,
  Mail,
  Phone,
  Clock,
  Layers,
  Check
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
    updateStat,
    deleteStat,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    addPromoBanner,
    updatePromoBanner,
    deletePromoBanner,
    addReview,
    updateReview,
    deleteReview,
    addServiceItem,
    updateServiceItem,
    deleteServiceItem
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

  const servicesList = siteContent.servicesPage?.items || [];

  return (
    <aside className="w-80 sm:w-96 bg-slate-900 border-l border-slate-800 flex flex-col flex-shrink-0 z-30 select-none overflow-hidden text-slate-100 shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-500/15 text-teal-400 border border-teal-500/30 shadow-sm">
            <Sliders size={16} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-400">
              Section Controls
            </span>
            <div className="text-sm font-black text-white flex items-center gap-1.5">
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
        {/* Style & Background Appearance */}
        <div className="space-y-3">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Palette size={13} className="text-teal-400" />
            <span>Background & Theme</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'mesh', label: 'Dark Mesh', desc: 'Subtle ambient glow' },
              { id: 'glass', label: 'Frosted Glass', desc: 'Backdrop blur' },
              { id: 'slate', label: 'Solid Slate', desc: 'Minimal dark slate' },
              { id: 'glow', label: 'Neon Cyber', desc: 'Vibrant glow accent' },
              { id: 'gradient', label: 'Dark Gradient', desc: 'Sleek contrast' },
              { id: 'custom', label: 'Custom Color', desc: 'Color / Gradient' }
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => handleStyleChange('bg', b.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  currentStyles.bg === b.id
                    ? 'bg-teal-500/20 border-teal-500 text-white font-bold shadow-md shadow-teal-500/10'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-bold">{b.label}</div>
                <div className="text-[9px] opacity-70 mt-0.5">{b.desc}</div>
              </button>
            ))}
          </div>

          {/* Custom Background Color Picker */}
          {currentStyles.bg === 'custom' && (
            <div className="space-y-2 pt-2 border-t border-slate-800 animate-in fade-in">
              <label className="text-[10px] font-bold text-slate-400">Custom Background (Color or Gradient)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentStyles.customBg?.startsWith('#') ? currentStyles.customBg : '#0f172a'}
                  onChange={(e) => handleStyleChange('customBg', e.target.value)}
                  className="h-9 w-12 rounded-lg border border-slate-700 bg-slate-950 cursor-pointer"
                />
                <input
                  type="text"
                  placeholder="#0f172a or linear-gradient(...)"
                  value={currentStyles.customBg || ''}
                  onChange={(e) => handleStyleChange('customBg', e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-100 font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section Spacing */}
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

        {/* ========================================================= */}
        {/* STATS SECTION CONTROLS                                    */}
        {/* ========================================================= */}
        {sectionId === 'stats' && (
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>Metrics & Milestones</span>
              </div>
              <button
                onClick={() => addStat({ value: '99+', label: 'New Metric' })}
                className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 font-bold px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 cursor-pointer"
              >
                <Plus size={12} />
                <span>Add Metric</span>
              </button>
            </div>

            <div className="space-y-3">
              {siteContent.stats.map((st, i) => (
                <div key={st.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-teal-400 uppercase">Metric #{i + 1}</span>
                    <button
                      onClick={() => deleteStat(st.id)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded cursor-pointer"
                      title="Delete Metric"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500">Value (e.g. 13+)</label>
                      <input
                        type="text"
                        value={st.value}
                        onChange={(e) => updateStat(st.id, { value: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-teal-400 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500">Label</label>
                      <input
                        type="text"
                        value={st.label}
                        onChange={(e) => updateStat(st.id, { label: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200 font-medium"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TEAM SECTION CONTROLS                                     */}
        {/* ========================================================= */}
        {sectionId === 'team' && (
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users size={14} />
                <span>Team Collective</span>
              </div>
              <button
                onClick={() => addTeamMember({
                  name: 'New Member',
                  role: 'Designer / Developer',
                  initial: 'N',
                  color: 'bg-teal-500',
                  bio: 'Creative specialist delivering high-performance work.',
                  specialties: ['Design', 'Next.js']
                })}
                className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 font-bold px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 cursor-pointer"
              >
                <Plus size={12} />
                <span>Add Member</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400">Section Title</label>
              <input
                type="text"
                value={siteContent.sections?.teamTitle || 'Meet the Creative Collective'}
                onChange={(e) => updateSiteContent({ sections: { ...siteContent.sections, teamTitle: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
              />
            </div>

            <div className="space-y-3">
              {siteContent.team.map((m) => (
                <div key={m.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-6 w-6 rounded-lg ${m.color || 'bg-teal-500'} text-white font-bold text-xs flex items-center justify-center`}>
                        {m.initial}
                      </div>
                      <span className="font-extrabold text-xs text-white truncate max-w-[140px]">{m.name}</span>
                    </div>
                    <button
                      onClick={() => deleteTeamMember(m.id)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded cursor-pointer"
                      title="Remove Member"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={m.name}
                      onChange={(e) => updateTeamMember(m.id, { name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200 font-bold"
                    />
                    <input
                      type="text"
                      placeholder="Role / Title"
                      value={m.role}
                      onChange={(e) => updateTeamMember(m.id, { role: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-teal-400 font-medium"
                    />
                    <textarea
                      placeholder="Bio / Description"
                      rows={2}
                      value={m.bio || ''}
                      onChange={(e) => updateTeamMember(m.id, { bio: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-300"
                    />
                    <input
                      type="text"
                      placeholder="Avatar Image URL (optional)"
                      value={m.avatarUrl || ''}
                      onChange={(e) => updateTeamMember(m.id, { avatarUrl: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-[11px] text-slate-400 font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PROMO BANNERS CONTROLS                                    */}
        {/* ========================================================= */}
        {sectionId === 'banners' && (
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black text-teal-400 uppercase tracking-wider">
                Promo Banners
              </div>
              <button
                onClick={() => addPromoBanner({
                  title: 'New Featured Showcase',
                  subtitle: 'Highlight custom assets, packages, or limited time deals.',
                  badge: 'Special Feature',
                  imageUrl: '/eternals-logo.jpg',
                  bgGradient: 'from-teal-500/20 via-indigo-500/20 to-purple-500/20',
                  buttonText: 'View Details',
                  buttonLink: '/portfolio',
                  enabled: true
                })}
                className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 font-bold px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 cursor-pointer"
              >
                <Plus size={12} />
                <span>Add Banner</span>
              </button>
            </div>

            <div className="space-y-3">
              {(siteContent.promoBanners || []).map((b) => (
                <div key={b.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-white truncate max-w-[160px]">{b.title}</span>
                    <button
                      onClick={() => deletePromoBanner(b.id)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded cursor-pointer"
                      title="Delete Banner"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Banner Title"
                    value={b.title}
                    onChange={(e) => updatePromoBanner(b.id, { title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-100 font-bold"
                  />
                  <textarea
                    placeholder="Subtitle"
                    rows={2}
                    value={b.subtitle}
                    onChange={(e) => updatePromoBanner(b.id, { subtitle: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-300"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Button Text"
                      value={b.buttonText}
                      onChange={(e) => updatePromoBanner(b.id, { buttonText: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200"
                    />
                    <input
                      type="text"
                      placeholder="Button URL"
                      value={b.buttonLink}
                      onChange={(e) => updatePromoBanner(b.id, { buttonLink: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Banner Image URL"
                    value={b.imageUrl || ''}
                    onChange={(e) => updatePromoBanner(b.id, { imageUrl: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-[11px] text-slate-400 font-mono"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SERVICES SECTION CONTROLS                                 */}
        {/* ========================================================= */}
        {sectionId === 'services' && (
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black text-teal-400 uppercase tracking-wider">
                Services Section
              </div>
              <button
                onClick={() => addServiceItem({
                  title: 'New Service',
                  desc: 'Professional deliverable tailored to client specifications.',
                  icon: 'Terminal',
                  color: 'from-cyan-400 to-teal-500'
                })}
                className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 font-bold px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 cursor-pointer"
              >
                <Plus size={12} />
                <span>Add Service</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400">Header Title</label>
              <input
                type="text"
                value={siteContent.servicesPage.headerTitle || 'Our Services'}
                onChange={(e) => updateSiteContent({ servicesPage: { ...siteContent.servicesPage, headerTitle: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400">Header Subtitle</label>
              <textarea
                rows={2}
                value={siteContent.servicesPage.headerSubtitle || ''}
                onChange={(e) => updateSiteContent({ servicesPage: { ...siteContent.servicesPage, headerSubtitle: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300"
              />
            </div>

            <div className="space-y-3">
              {servicesList.map((svc) => (
                <div key={svc.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{svc.title}</span>
                    <button
                      onClick={() => deleteServiceItem(svc.id)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={svc.title}
                    onChange={(e) => updateServiceItem(svc.id, { title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200 font-bold"
                  />
                  <textarea
                    rows={2}
                    value={svc.desc}
                    onChange={(e) => updateServiceItem(svc.id, { desc: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-400"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* REVIEWS SECTION CONTROLS                                  */}
        {/* ========================================================= */}
        {sectionId === 'reviews' && (
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <Star size={14} className="text-amber-400" />
                <span>Client Reviews</span>
              </div>
              <button
                onClick={() => addReview({
                  author: 'Verified Client',
                  role: 'Founder',
                  company: 'Studio Partner',
                  rating: 5,
                  content: 'Outstanding delivery and turnaround time.'
                })}
                className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 font-bold px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 cursor-pointer"
              >
                <Plus size={12} />
                <span>Add Review</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400">Section Title</label>
              <input
                type="text"
                value={siteContent.sections?.reviewsTitle || 'Trusted by Creators & Organizations'}
                onChange={(e) => updateSiteContent({ sections: { ...siteContent.sections, reviewsTitle: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 font-bold"
              />
            </div>

            <div className="space-y-3">
              {(siteContent.reviews || []).map((rev) => (
                <div key={rev.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-white truncate max-w-[160px]">{rev.author}</span>
                    <button
                      onClick={() => deleteReview(rev.id)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded cursor-pointer"
                      title="Delete Review"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Review Quote"
                    value={rev.content}
                    onChange={(e) => updateReview(rev.id, { content: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-300 italic"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Author"
                      value={rev.author}
                      onChange={(e) => updateReview(rev.id, { author: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200 font-bold"
                    />
                    <input
                      type="text"
                      placeholder="Company / Org"
                      value={rev.company}
                      onChange={(e) => updateReview(rev.id, { company: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-teal-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* HERO SECTION CONTROLS                                     */}
        {/* ========================================================= */}
        {sectionId === 'hero' && (
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="text-xs font-black text-teal-400 uppercase tracking-wider">
              Hero Content Properties
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400">Badge Text</label>
              <input
                type="text"
                value={siteContent.hero.badgeText}
                onChange={(e) => updateSiteContent({ hero: { ...siteContent.hero, badgeText: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400">Primary Headline</label>
              <input
                type="text"
                value={siteContent.hero.titleLine1}
                onChange={(e) => updateSiteContent({ hero: { ...siteContent.hero, titleLine1: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400">Gradient Highlight Text</label>
              <input
                type="text"
                value={siteContent.hero.titleHighlight}
                onChange={(e) => updateSiteContent({ hero: { ...siteContent.hero, titleHighlight: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400">Description</label>
              <textarea
                value={siteContent.hero.description}
                rows={3}
                onChange={(e) => updateSiteContent({ hero: { ...siteContent.hero, description: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
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

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400">Showcase Image URL</label>
              <input
                type="text"
                value={siteContent.hero.bannerImageUrl || ''}
                onChange={(e) => updateSiteContent({ hero: { ...siteContent.hero, bannerImageUrl: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 font-mono"
              />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CALL TO ACTION BANNER CONTROLS                            */}
        {/* ========================================================= */}
        {sectionId === 'cta' && (
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="text-xs font-black text-teal-400 uppercase tracking-wider">
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

        {/* ========================================================= */}
        {/* STORY & MISSION CONTROLS                                  */}
        {/* ========================================================= */}
        {(sectionId === 'story' || sectionId === 'vision') && (
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="text-xs font-black text-teal-400 uppercase tracking-wider">
              About & Mission Content
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400">Mission Story Title</label>
              <input
                type="text"
                value={siteContent.aboutPage.storyTitle}
                onChange={(e) => updateSiteContent({ aboutPage: { ...siteContent.aboutPage, storyTitle: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400">Mission Story Content</label>
              <textarea
                rows={4}
                value={siteContent.aboutPage.storyContent}
                onChange={(e) => updateSiteContent({ aboutPage: { ...siteContent.aboutPage, storyContent: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400">Core Vision Title</label>
              <input
                type="text"
                value={siteContent.aboutPage.visionTitle}
                onChange={(e) => updateSiteContent({ aboutPage: { ...siteContent.aboutPage, visionTitle: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400">Core Vision Content</label>
              <textarea
                rows={3}
                value={siteContent.aboutPage.visionContent}
                onChange={(e) => updateSiteContent({ aboutPage: { ...siteContent.aboutPage, visionContent: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300"
              />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CONTACT / INFO CONTROLS                                   */}
        {/* ========================================================= */}
        {(sectionId === 'info' || sectionId === 'form' || sectionId === 'discord') && (
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="text-xs font-black text-teal-400 uppercase tracking-wider">
              Contact & Studio Coordinates
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400">Direct Email</label>
              <input
                type="text"
                value={siteContent.contactPage.email}
                onChange={(e) => updateSiteContent({ contactPage: { ...siteContent.contactPage, email: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400">Studio Phone</label>
              <input
                type="text"
                value={siteContent.contactPage.phone}
                onChange={(e) => updateSiteContent({ contactPage: { ...siteContent.contactPage, phone: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400">Response SLA Guarantee</label>
              <input
                type="text"
                value={siteContent.contactPage.responseTimeText}
                onChange={(e) => updateSiteContent({ contactPage: { ...siteContent.contactPage, responseTimeText: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400">Discord Community Link</label>
              <input
                type="text"
                value={siteContent.contactPage.discordUrl}
                onChange={(e) => updateSiteContent({ contactPage: { ...siteContent.contactPage, discordUrl: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
              />
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
