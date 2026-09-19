'use client';

import React from 'react';
import { 
  Save, 
  Trash2, 
  RotateCcw, 
  Check, 
  Loader2, 
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';

interface EditorBottomBarProps {
  activePage: string;
  selectedSectionId: string | null;
  onDeleteSelectedSection: () => void;
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onOpenLive: () => void;
}

export default function EditorBottomBar({
  activePage,
  selectedSectionId,
  onDeleteSelectedSection,
  onSave,
  onReset,
  isSaving,
  hasUnsavedChanges,
  onOpenLive
}: EditorBottomBarProps) {
  return (
    <footer className="h-16 bg-slate-900 border-t border-slate-800 px-4 sm:px-6 flex items-center justify-between z-40 text-slate-100 flex-shrink-0 shadow-2xl select-none">
      {/* Left side: Current editing status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full bg-teal-400" />
          <span className="text-slate-400">Target:</span>
          <span className="font-extrabold text-white uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            /{activePage === 'main' ? '' : activePage}
          </span>
        </div>

        {selectedSectionId && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20 font-bold">
            <Layers size={12} />
            <span>Active: {selectedSectionId}</span>
          </div>
        )}
      </div>

      {/* Center: Live Site Link & Reset */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          title="Reset changes on this page"
        >
          <RotateCcw size={13} />
          <span className="hidden sm:inline">Discard</span>
        </button>

        <button
          onClick={onOpenLive}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Open live website in new tab"
        >
          <ExternalLink size={13} />
          <span className="hidden md:inline">Open Live Page</span>
        </button>
      </div>

      {/* Right Side: [save/del] Controls matching user's sketch */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Delete Section Button [del] */}
        <button
          onClick={onDeleteSelectedSection}
          disabled={!selectedSectionId}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
            selectedSectionId
              ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20 shadow-sm'
              : 'bg-slate-800/40 text-slate-600 border-slate-800 cursor-not-allowed opacity-50'
          }`}
          title={selectedSectionId ? `Delete section [${selectedSectionId}]` : 'Select a section to delete'}
        >
          <Trash2 size={14} />
          <span>Delete</span>
        </button>

        {/* Save Live Button [save] */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 sm:px-6 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-teal-400 via-emerald-500 to-indigo-500 hover:from-teal-500 hover:to-indigo-600 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/35 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          title="Save all changes live to database"
        >
          {isSaving ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>Publishing...</span>
            </>
          ) : (
            <>
              <Save size={15} />
              <span>Save & Publish</span>
            </>
          )}
        </button>
      </div>
    </footer>
  );
}
