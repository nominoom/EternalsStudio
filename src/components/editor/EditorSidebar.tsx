'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Layers, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  Trash2, 
  Copy, 
  Plus, 
  RotateCcw, 
  Sparkles, 
  Home, 
  ShoppingBag, 
  Briefcase, 
  Users, 
  Mail, 
  Sliders,
  Check
} from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';

interface EditorSidebarProps {
  activePage: string;
  onSelectPage: (pageId: string) => void;
  pages: { id: string; name: string; path: string; icon: string }[];
  currentSections: string[];
  selectedSectionId: string | null;
  onSelectSection: (sectionId: string) => void;
  onOpenAddSectionModal: () => void;
}

// Section display name & icons mapping
export const SECTION_METADATA: Record<string, { label: string; icon: string; desc: string }> = {
  // Main
  announcement: { label: 'Announcement Bar', icon: '📢', desc: 'Top flash sale promo message' },
  hero: { label: 'Hero Header', icon: '⚡', desc: 'Main headline, badge, CTA buttons & showcase' },
  banners: { label: 'Promo Banners', icon: '🎨', desc: 'Featured motion graphics & asset promo cards' },
  stats: { label: 'Stats & Metrics', icon: '📊', desc: 'Key studio milestones and counter' },
  services: { label: 'Services Showcase', icon: '💻', desc: 'Interactive capabilities & solutions grid' },
  reviews: { label: 'Client Reviews', icon: '⭐', desc: 'Verified client reviews and testimonials' },
  cta: { label: 'Call To Action Banner', icon: '🚀', desc: 'Lead capture banner with project button' },

  // Services
  header: { label: 'Page Header', icon: '✨', desc: 'Primary title and subtitle introducing page' },
  process: { label: 'Process Timeline', icon: '🔄', desc: '5-step workflow from discovery to launch' },
  industries: { label: 'Target Industries', icon: '🏢', desc: 'Esports, SaaS, corporate client focus' },

  // Portfolio
  projects: { label: 'Featured Projects', icon: '🏆', desc: 'Interactive project gallery showcase' },

  // Store
  catalog: { label: 'Store Catalog Grid', icon: '🛍️', desc: '3D models, graphics packs & filters' },

  // About
  story: { label: 'Our Story & Mission', icon: '📖', desc: 'Studio origin and client commitment' },
  vision: { label: 'Core Vision', icon: '🎯', desc: 'Long term strategic vision statement' },
  team: { label: 'Team Roster Grid', icon: '👥', desc: 'Founders, 3D modelers & designers' },
  expertise: { label: 'Core Capabilities', icon: '💎', desc: 'Technical & design disciplines' },

  // Contact
  info: { label: 'Direct Studio Info', icon: '📍', desc: 'Email, phone, location and response SLA' },
  form: { label: 'Project Inquiry Form', icon: '✉️', desc: 'Interactive quote & message submission' },
  discord: { label: 'Discord Community', icon: '💬', desc: 'Live chat & customer support banner' }
};

export default function EditorSidebar({
  activePage,
  onSelectPage,
  pages,
  currentSections,
  selectedSectionId,
  onSelectSection,
  onOpenAddSectionModal
}: EditorSidebarProps) {
  const {
    siteContent,
    moveSection,
    toggleSectionVisibility,
    deleteSection,
    duplicateSection,
    resetPageSections
  } = useSiteContent();

  const [activeTab, setActiveTab] = useState<'sections' | 'pages'>('sections');

  const hiddenSections = siteContent.hiddenSections?.[activePage] || [];

  const getSectionInfo = (secId: string) => {
    if (SECTION_METADATA[secId]) return SECTION_METADATA[secId];
    
    // Check if it's a custom block
    const custom = ((siteContent.customSections as any)?.[activePage] || []).find((c: any) => c.id === secId);
    if (custom) {
      return {
        label: custom.title || 'Custom Section',
        icon: '🧩',
        desc: custom.subtitle || 'User-added custom block'
      };
    }

    // Default fallback
    const cleanName = secId.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    return {
      label: cleanName,
      icon: '📦',
      desc: 'Page section block'
    };
  };

  return (
    <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 z-30 select-none overflow-hidden">
      {/* Top Header: Tab switchers between Sections & Pages */}
      <div className="p-4 border-b border-slate-800 flex-shrink-0 bg-slate-950/40">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-teal-400 animate-ping" />
            <span className="text-xs uppercase tracking-widest font-black text-slate-300">
              Site Architect
            </span>
          </div>
          <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full font-bold">
            {currentSections.length} sections
          </span>
        </div>

        {/* Tab Buttons matching user's sketch */}
        <div className="grid grid-cols-2 p-1 bg-slate-900 border border-slate-800 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab('sections')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'sections'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers size={13} />
            <span>Sections</span>
          </button>
          <button
            onClick={() => setActiveTab('pages')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pages'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText size={13} />
            <span>Pages</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SECTIONS LIST & REORDERING (MAIN FLOW) */}
      {activeTab === 'sections' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Active Page Header bar */}
          <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Page:</span>
              <span className="font-extrabold text-teal-400 uppercase tracking-wide">
                {activePage}
              </span>
            </div>
            <button
              onClick={() => resetPageSections(activePage)}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-teal-400 transition-colors cursor-pointer"
              title="Reset sections order to default layout"
            >
              <RotateCcw size={11} />
              <span>Reset</span>
            </button>
          </div>

          {/* Section Items Tree */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {currentSections.map((secId, index) => {
              const isHidden = hiddenSections.includes(secId);
              const isSelected = selectedSectionId === secId;
              const info = getSectionInfo(secId);

              return (
                <div
                  key={secId}
                  onClick={() => onSelectSection(secId)}
                  className={`group relative rounded-2xl p-3 border transition-all duration-200 cursor-pointer flex flex-col gap-2 ${
                    isSelected
                      ? 'bg-teal-500/15 border-teal-500/60 shadow-lg shadow-teal-500/5'
                      : isHidden
                        ? 'bg-slate-950/40 border-slate-800/40 opacity-50'
                        : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    {/* Left: Drag index + Icon + Title */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="h-6 w-6 rounded-lg bg-slate-800 group-hover:bg-slate-750 flex items-center justify-center text-[10px] font-mono font-black text-slate-400">
                        {index + 1}
                      </span>
                      <span className="text-base leading-none">{info.icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-slate-100 truncate">
                          {info.label}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {info.desc}
                        </div>
                      </div>
                    </div>

                    {/* Right: Quick action toolbar */}
                    <div 
                      className="flex items-center gap-1" 
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Move Up */}
                      <button
                        onClick={() => moveSection(activePage, secId, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-teal-400 disabled:opacity-20 cursor-pointer"
                        title="Move Section Up"
                      >
                        <ChevronUp size={13} />
                      </button>

                      {/* Move Down */}
                      <button
                        onClick={() => moveSection(activePage, secId, 'down')}
                        disabled={index === currentSections.length - 1}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-teal-400 disabled:opacity-20 cursor-pointer"
                        title="Move Section Down"
                      >
                        <ChevronDown size={13} />
                      </button>

                      {/* Visibility Toggle */}
                      <button
                        onClick={() => toggleSectionVisibility(activePage, secId)}
                        className={`p-1 rounded hover:bg-slate-800 cursor-pointer ${
                          isHidden ? 'text-amber-400' : 'text-slate-400 hover:text-white'
                        }`}
                        title={isHidden ? 'Hidden (Click to Show)' : 'Visible (Click to Hide)'}
                      >
                        {isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => deleteSection(activePage, secId)}
                        className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 cursor-pointer transition-colors"
                        title="Delete Section"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Active selected indicator */}
                  {isSelected && (
                    <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-teal-500/20 text-teal-400 font-bold">
                      <span className="flex items-center gap-1">
                        <Sliders size={11} />
                        Active in Inspector
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateSection(activePage, secId);
                        }}
                        className="hover:underline flex items-center gap-1 text-slate-300 hover:text-white"
                      >
                        <Copy size={10} />
                        Duplicate
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add Section Button at bottom of sections list */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex-shrink-0">
            <button
              onClick={onOpenAddSectionModal}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500/20 to-indigo-500/20 hover:from-teal-500/30 hover:to-indigo-500/30 border border-teal-500/40 text-teal-300 font-extrabold text-xs shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <Plus size={15} />
              <span>+ Add Section to Page</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: PAGES SELECTOR MATCHING USER'S SKETCH */}
      {activeTab === 'pages' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="px-2 py-1.5 text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
            Website Pages
          </div>
          {pages.map((p) => {
            const isCurrent = activePage === p.id;
            return (
              <div
                key={p.id}
                onClick={() => {
                  onSelectPage(p.id);
                  setActiveTab('sections');
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-teal-500/20 border-teal-500/60 shadow-lg shadow-teal-500/10'
                    : 'bg-slate-950/50 hover:bg-slate-800/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{p.icon}</span>
                  <div>
                    <div className="text-xs font-extrabold text-slate-100 flex items-center gap-2">
                      <span>{p.name}</span>
                      {isCurrent && (
                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-400">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {p.path}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <ChevronRight size={14} className="text-slate-500 group-hover:text-teal-400" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}
