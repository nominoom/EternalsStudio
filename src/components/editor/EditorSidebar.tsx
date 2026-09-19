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
  Check,
  Type,
  MousePointer,
  Image as ImageIcon,
  Square,
  Columns,
  Star,
  BarChart2,
  HelpCircle,
  FolderTree,
  Component
} from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { CMSPage, CMSBlock, BlockType } from '@/types/cms';
import { COMPONENT_REGISTRY } from '@/lib/cms/registry';
import LayersPanel from './LayersPanel';

interface EditorSidebarProps {
  activePage: string;
  onSelectPage: (pageId: string) => void;
  pages: { id: string; name: string; path: string; icon: string }[];
  currentSections: string[];
  selectedSectionId: string | null;
  selectedBlockId?: string | null;
  onSelectSection: (sectionId: string) => void;
  onSelectBlock?: (blockId: string) => void;
  onOpenAddSectionModal: () => void;
  onAddBlockToSection?: (blockType: BlockType) => void;
  currentPageData?: CMSPage | null;
  onAddNewPage?: () => void;
  onDuplicatePage?: (pageId: string) => void;
  onDeletePage?: (pageId: string) => void;
}

export const SECTION_METADATA: Record<string, { label: string; icon: string; desc: string }> = {
  announcement: { label: 'Announcement Bar', icon: '📢', desc: 'Top flash sale promo message' },
  hero: { label: 'Hero Header', icon: '⚡', desc: 'Main headline, badge, CTA buttons & showcase' },
  banners: { label: 'Promo Banners', icon: '🎨', desc: 'Featured motion graphics & asset promo cards' },
  stats: { label: 'Stats & Metrics', icon: '📊', desc: 'Key studio milestones and counter' },
  services: { label: 'Services Showcase', icon: '💻', desc: 'Interactive capabilities & solutions grid' },
  reviews: { label: 'Client Reviews', icon: '⭐', desc: 'Verified client reviews and testimonials' },
  cta: { label: 'Call To Action Banner', icon: '🚀', desc: 'Lead capture banner with project button' },
  header: { label: 'Page Header', icon: '✨', desc: 'Primary title and subtitle introducing page' },
  process: { label: 'Process Timeline', icon: '🔄', desc: '5-step workflow from discovery to launch' },
  industries: { label: 'Target Industries', icon: '🏢', desc: 'Esports, SaaS, corporate client focus' },
  projects: { label: 'Featured Projects', icon: '🏆', desc: 'Interactive project gallery showcase' },
  catalog: { label: 'Store Catalog Grid', icon: '🛍️', desc: '3D models, graphics packs & filters' },
  story: { label: 'Our Story & Mission', icon: '📖', desc: 'Studio origin and client commitment' },
  vision: { label: 'Core Vision', icon: '🎯', desc: 'Long term strategic vision statement' },
  team: { label: 'Team Roster Grid', icon: '👥', desc: 'Founders, 3D modelers & designers' },
  expertise: { label: 'Core Capabilities', icon: '💎', desc: 'Technical & design disciplines' },
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
  selectedBlockId = null,
  onSelectSection,
  onSelectBlock,
  onOpenAddSectionModal,
  onAddBlockToSection,
  currentPageData,
  onAddNewPage,
  onDuplicatePage,
  onDeletePage
}: EditorSidebarProps) {
  const {
    siteContent,
    moveSection,
    toggleSectionVisibility,
    deleteSection,
    duplicateSection,
    resetPageSections
  } = useSiteContent();

  const [activeTab, setActiveTab] = useState<'sections' | 'pages' | 'layers' | 'elements'>('sections');

  const hiddenSections = siteContent.hiddenSections?.[activePage] || [];

  const getSectionInfo = (secId: string) => {
    if (SECTION_METADATA[secId]) return SECTION_METADATA[secId];
    
    const custom = ((siteContent.customSections as any)?.[activePage] || []).find((c: any) => c.id === secId);
    if (custom) {
      return {
        label: custom.title || 'Custom Section',
        icon: '🧩',
        desc: custom.subtitle || 'User-added custom block'
      };
    }

    const cleanName = secId.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    return {
      label: cleanName,
      icon: '📦',
      desc: 'Page section block'
    };
  };

  return (
    <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 z-30 select-none overflow-hidden font-sans">
      {/* Top Header: Tab switchers between Sections, Pages, Layers, Elements */}
      <div className="p-3 border-b border-slate-800 flex-shrink-0 bg-slate-950/40 space-y-2.5">
        <div className="flex items-center justify-between">
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

        {/* 4-Tab Navigation Grid */}
        <div className="grid grid-cols-4 p-1 bg-slate-950 border border-slate-800 rounded-xl gap-0.5 text-slate-400">
          {[
            { id: 'sections', label: 'Sections', icon: Layers },
            { id: 'pages', label: 'Pages', icon: FileText },
            { id: 'layers', label: 'Layers', icon: FolderTree },
            { id: 'elements', label: 'Add', icon: Plus }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center justify-center py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-500 text-white shadow-sm'
                    : 'hover:text-white hover:bg-slate-850'
                }`}
                title={tab.label}
              >
                <Icon size={13} />
                <span className="mt-0.5">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: SECTIONS LIST */}
      {activeTab === 'sections' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Page:</span>
              <span className="font-extrabold text-teal-400 uppercase tracking-wide">
                {activePage}
              </span>
            </div>
            <button
              onClick={() => resetPageSections(activePage)}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-teal-400 transition-colors cursor-pointer"
              title="Reset order to default"
            >
              <RotateCcw size={11} />
              <span>Reset</span>
            </button>
          </div>

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
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="h-6 w-6 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-mono font-black text-slate-400">
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

                    <div 
                      className="flex items-center gap-1" 
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => moveSection(activePage, secId, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-teal-400 disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        <ChevronUp size={13} />
                      </button>
                      <button
                        onClick={() => moveSection(activePage, secId, 'down')}
                        disabled={index === currentSections.length - 1}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-teal-400 disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        <ChevronDown size={13} />
                      </button>
                      <button
                        onClick={() => toggleSectionVisibility(activePage, secId)}
                        className={`p-1 rounded hover:bg-slate-800 cursor-pointer ${
                          isHidden ? 'text-amber-400' : 'text-slate-400 hover:text-white'
                        }`}
                        title={isHidden ? 'Unhide' : 'Hide'}
                      >
                        {isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                      <button
                        onClick={() => deleteSection(activePage, secId)}
                        className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex-shrink-0">
            <button
              onClick={onOpenAddSectionModal}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-500/20 to-indigo-500/20 hover:from-teal-500/30 hover:to-indigo-500/30 border border-teal-500/40 text-teal-300 font-extrabold text-xs shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <Plus size={14} />
              <span>+ Add Section to Page</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: PAGES LIST */}
      {activeTab === 'pages' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Website Pages</span>
            {onAddNewPage && (
              <button
                onClick={onAddNewPage}
                className="text-[10px] font-bold text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus size={12} />
                <span>New Page</span>
              </button>
            )}
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
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
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

                <div className="flex items-center gap-1">
                  {onDuplicatePage && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicatePage(p.id);
                      }}
                      className="p-1 text-slate-500 hover:text-white rounded"
                      title="Duplicate page"
                    >
                      <Copy size={12} />
                    </button>
                  )}
                  <ChevronRight size={14} className="text-slate-500" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: DOCUMENT LAYERS VIEW */}
      {activeTab === 'layers' && (
        <LayersPanel
          page={currentPageData || null}
          selectedSectionId={selectedSectionId}
          selectedBlockId={selectedBlockId}
          onSelectSection={onSelectSection}
          onSelectBlock={onSelectBlock || (() => {})}
          onToggleSectionVisibility={(secId) => toggleSectionVisibility(activePage, secId)}
          onDeleteSection={(secId) => deleteSection(activePage, secId)}
          onDeleteBlock={() => {}}
        />
      )}

      {/* TAB 4: ADD ELEMENTS & COMPONENTS */}
      {activeTab === 'elements' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div className="px-2 text-[10px] uppercase font-black tracking-wider text-slate-400">
            Insert Element into Section
          </div>

          {['Content', 'Layout', 'Marketing', 'Forms'].map((cat) => {
            const blocks = Object.values(COMPONENT_REGISTRY).filter((c) => c.category === cat);
            return (
              <div key={cat} className="space-y-2">
                <span className="text-[11px] font-bold text-teal-400 px-2 block">{cat}</span>
                <div className="grid grid-cols-2 gap-2">
                  {blocks.map((b) => (
                    <button
                      key={b.type}
                      onClick={() => {
                        if (onAddBlockToSection) onAddBlockToSection(b.type);
                      }}
                      className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/40 text-left transition-all cursor-pointer flex flex-col gap-1"
                    >
                      <span className="text-xs font-bold text-white truncate">{b.displayName}</span>
                      <span className="text-[10px] text-slate-500 truncate">{b.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}
