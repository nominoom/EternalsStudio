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
  ExternalLink
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
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onOpenLive: () => void;
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
  isSaving,
  hasUnsavedChanges,
  onOpenLive
}: EditorTopBarProps) {
  const [isPageDropdownOpen, setIsPageDropdownOpen] = React.useState(false);
  const activePageObj = pages.find((p) => p.id === activePage) || pages[0];

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between z-40 text-slate-100 flex-shrink-0 shadow-lg select-none">
      {/* Left: Branding + Back + Page Selector */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          href="/admin"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          title="Back to Admin Dashboard"
        >
          <ArrowLeft size={16} />
          <span className="hidden md:inline">Dashboard</span>
        </Link>

        <div className="h-5 w-px bg-slate-800 hidden sm:block" />

        {/* Page Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsPageDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 bg-slate-800 hover:bg-slate-750 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-700 hover:border-teal-500/50 transition-all cursor-pointer group shadow-sm"
          >
            <span className="text-base leading-none">{activePageObj.icon}</span>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase tracking-wider text-teal-400 font-black">Active Page</span>
              <span className="text-slate-100 font-extrabold">{activePageObj.name}</span>
            </div>
            <ChevronDown size={14} className="text-slate-400 group-hover:text-teal-400 ml-1 transition-transform" />
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
      </div>

      {/* Center: Device Viewport Switcher & Zoom */}
      <div className="hidden lg:flex items-center gap-4">
        {/* Device Switcher */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 shadow-inner">
          <button
            onClick={() => onSelectViewport('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewport === 'desktop'
                ? 'bg-slate-800 text-teal-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop View (100%)"
          >
            <Monitor size={14} />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => onSelectViewport('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewport === 'tablet'
                ? 'bg-slate-800 text-teal-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet View (768px)"
          >
            <Tablet size={14} />
            <span>Tablet</span>
          </button>
          <button
            onClick={() => onSelectViewport('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewport === 'mobile'
                ? 'bg-slate-800 text-teal-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile View (390px)"
          >
            <Smartphone size={14} />
            <span>Mobile</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center bg-slate-950/80 px-2 py-1 rounded-xl border border-slate-800 gap-1 text-xs font-mono text-slate-400">
          <button
            onClick={() => onZoomChange(-10)}
            disabled={zoom <= 60}
            className="hover:text-white p-1 rounded hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut size={13} />
          </button>
          <span className="w-10 text-center font-bold">{zoom}%</span>
          <button
            onClick={() => onZoomChange(10)}
            disabled={zoom >= 130}
            className="hover:text-white p-1 rounded hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn size={13} />
          </button>
        </div>
      </div>

      {/* Right: Mode Toggle + Live Link + Save Button */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Edit / Preview Mode Switch */}
        <button
          onClick={onTogglePreview}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            isPreviewMode
              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/30'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
          }`}
          title={isPreviewMode ? 'Switch to Visual Edit Mode' : 'Switch to Clean Preview Mode'}
        >
          {isPreviewMode ? <Edit3 size={14} className="text-indigo-400" /> : <Eye size={14} className="text-teal-400" />}
          <span className="hidden sm:inline">{isPreviewMode ? 'Edit Mode' : 'Preview'}</span>
        </button>

        {/* Open Live Page External */}
        <button
          onClick={onOpenLive}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
          title="Open page in new browser tab"
        >
          <ExternalLink size={13} />
          <span className="hidden xl:inline">Live Page</span>
        </button>

        {/* Unsaved Changes Indicator */}
        <div className="hidden md:flex items-center gap-1.5 text-[11px] font-bold">
          {hasUnsavedChanges ? (
            <span className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Unsaved
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Saved
            </span>
          )}
        </div>

        {/* Save & Publish Button */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-teal-400 to-indigo-500 hover:from-teal-500 hover:to-indigo-600 shadow-md shadow-teal-500/20 hover:shadow-teal-500/40 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={15} />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
