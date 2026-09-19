'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Eye, 
  Edit3, 
  Save, 
  Loader2, 
  ArrowLeft, 
  Check, 
  ChevronDown,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  Undo2,
  Redo2,
  Palette,
  Search,
  Menu,
  Image as ImageIcon,
  History,
  Send
} from 'lucide-react';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

interface EditorTopBarProps {
  activePage: string;
  onSelectPage: (page: string) => void;
  pages: { id: string; name: string; path: string; icon: string }[];
  viewport: ViewportMode;
  onSelectViewport: (vp: ViewportMode) => void;
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  zoom: number;
  onZoomChange: (delta: number) => void;
  onSave: () => void;
  onPublishLive?: () => void;
  isSaving: boolean;
  isPublishing?: boolean;
  hasUnsavedChanges: boolean;
  onOpenLive: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onOpenThemeModal?: () => void;
  onOpenSEOModal?: () => void;
  onOpenNavigationModal?: () => void;
  onOpenMediaModal?: () => void;
  onOpenHistoryModal?: () => void;
}

export default function EditorTopBar({
  activePage,
  onSelectPage,
  pages,
  viewport,
  onSelectViewport,
  isPreviewMode,
  onTogglePreview,
  zoom,
  onZoomChange,
  onSave,
  onPublishLive,
  isSaving,
  isPublishing = false,
  hasUnsavedChanges,
  onOpenLive,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onOpenThemeModal,
  onOpenSEOModal,
  onOpenNavigationModal,
  onOpenMediaModal,
  onOpenHistoryModal
}: EditorTopBarProps) {
  const [isPageDropdownOpen, setIsPageDropdownOpen] = React.useState(false);
  const activePageObj = pages.find((p) => p.id === activePage) || pages[0];

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-3 sm:px-5 flex items-center justify-between z-40 text-slate-100 flex-shrink-0 shadow-lg select-none">
      {/* Left: Branding + Back + Page Selector + Undo/Redo */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/admin"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          title="Back to Admin Dashboard"
        >
          <ArrowLeft size={16} />
          <span className="hidden xl:inline">Dashboard</span>
        </Link>

        <div className="h-5 w-px bg-slate-800 hidden sm:block" />

        {/* Page Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsPageDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-750 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-700 hover:border-teal-500/50 transition-all cursor-pointer group shadow-sm"
          >
            <span className="text-base leading-none">{activePageObj.icon}</span>
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase tracking-wider text-teal-400 font-black leading-tight">Page</span>
              <span className="text-slate-100 font-extrabold truncate max-w-[100px] sm:max-w-none">{activePageObj.name}</span>
            </div>
            <ChevronDown size={14} className="text-slate-400 group-hover:text-teal-400 transition-transform" />
          </button>

          {isPageDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsPageDropdownOpen(false)} 
              />
              <div className="absolute left-0 mt-2 w-64 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 backdrop-blur-xl animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 text-[10px] uppercase tracking-wider font-extrabold text-slate-400 border-b border-slate-800">
                  Select Page to Edit
                </div>
                {pages.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectPage(p.id);
                      setIsPageDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      activePage === p.id
                        ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                        : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{p.icon}</span>
                      <div>
                        <div className="text-xs font-extrabold">{p.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{p.path}</div>
                      </div>
                    </div>
                    {activePage === p.id && <Check size={14} className="text-teal-400" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Undo / Redo */}
        <div className="hidden sm:flex items-center gap-0.5 bg-slate-950 p-0.5 rounded-xl border border-slate-800">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={14} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 size={14} />
          </button>
        </div>
      </div>

      {/* Center: Device Viewport Switcher & Global Modals */}
      <div className="hidden lg:flex items-center gap-3">
        {/* Device Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
          <button
            onClick={() => onSelectViewport('desktop')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewport === 'desktop'
                ? 'bg-slate-800 text-teal-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop (100%)"
          >
            <Monitor size={14} />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => onSelectViewport('tablet')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewport === 'tablet'
                ? 'bg-slate-800 text-teal-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet (768px)"
          >
            <Tablet size={14} />
            <span>Tablet</span>
          </button>
          <button
            onClick={() => onSelectViewport('mobile')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewport === 'mobile'
                ? 'bg-slate-800 text-teal-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile (390px)"
          >
            <Smartphone size={14} />
            <span>Mobile</span>
          </button>
        </div>

        {/* Global Settings Tools: Theme, SEO, Navigation, Media, History */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs text-slate-300">
          {onOpenThemeModal && (
            <button
              onClick={onOpenThemeModal}
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-teal-400 transition-colors cursor-pointer"
              title="Theme & Design System"
            >
              <Palette size={14} />
            </button>
          )}
          {onOpenSEOModal && (
            <button
              onClick={onOpenSEOModal}
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-teal-400 transition-colors cursor-pointer"
              title="Page SEO & Social Meta"
            >
              <Search size={14} />
            </button>
          )}
          {onOpenNavigationModal && (
            <button
              onClick={onOpenNavigationModal}
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-teal-400 transition-colors cursor-pointer"
              title="Navigation Links"
            >
              <Menu size={14} />
            </button>
          )}
          {onOpenMediaModal && (
            <button
              onClick={onOpenMediaModal}
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-teal-400 transition-colors cursor-pointer"
              title="Media Asset Library"
            >
              <ImageIcon size={14} />
            </button>
          )}
          {onOpenHistoryModal && (
            <button
              onClick={onOpenHistoryModal}
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-teal-400 transition-colors cursor-pointer"
              title="Revision History"
            >
              <History size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Right: Mode Toggle + Live Link + Draft & Publish Buttons */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Preview / Edit Toggle */}
        <button
          onClick={onTogglePreview}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            isPreviewMode
              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
          }`}
          title={isPreviewMode ? 'Return to Visual Edit Mode' : 'Clean Visitor Preview Mode'}
        >
          {isPreviewMode ? <Edit3 size={13} className="text-indigo-400" /> : <Eye size={13} className="text-teal-400" />}
          <span className="hidden md:inline">{isPreviewMode ? 'Edit Mode' : 'Preview'}</span>
        </button>

        {/* Status Indicator */}
        <div className="hidden md:flex items-center text-[10px] font-bold">
          {hasUnsavedChanges ? (
            <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
              Unsaved Draft
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Published
            </span>
          )}
        </div>

        {/* Save Draft Button */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-all cursor-pointer disabled:opacity-50"
          title="Save Draft (does not affect live website)"
        >
          {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
          <span className="hidden sm:inline">Save Draft</span>
        </button>

        {/* Publish Live Button */}
        {onPublishLive && (
          <button
            onClick={onPublishLive}
            disabled={isPublishing}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-teal-400 to-indigo-500 hover:from-teal-500 hover:to-indigo-600 shadow-md shadow-teal-500/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            title="Publish changes live to website"
          >
            {isPublishing ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Send size={13} />
                <span>Publish Live</span>
              </>
            )}
          </button>
        )}
      </div>
    </header>
  );
}
