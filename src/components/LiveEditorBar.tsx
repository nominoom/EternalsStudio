'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '../context/AdminContext';
import { useSiteContent } from '../context/SiteContentContext';
import { Edit3, Save, X, RotateCcw, Check, Sparkles, AlertCircle, Shield } from 'lucide-react';

export default function LiveEditorBar() {
  const { hasAdminPrivileges } = useAdmin();
  const { 
    isEditMode, 
    toggleEditMode, 
    cancelEditMode, 
    saveSiteContent, 
    isSaving, 
    hasUnsavedChanges 
  } = useSiteContent();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!hasAdminPrivileges && !isEditMode) {
    return null;
  }

  const handleSave = async () => {
    const success = await saveSiteContent();
    if (success) {
      setToastMessage('✨ Site changes saved and published live!');
      setTimeout(() => setToastMessage(null), 4000);
    } else {
      setToastMessage('⚠️ Save failed. Check connection.');
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  return (
    <>
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-2xl bg-slate-900 border border-teal-500/40 text-white px-5 py-3.5 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="text-teal-400 h-5 w-5" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Floating Top Admin Live Editor Toolbar */}
      <div className="sticky top-0 z-[60] w-full bg-slate-900/95 border-b border-slate-800 text-slate-100 backdrop-blur-xl px-4 py-2.5 shadow-xl transition-all duration-300">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          
          {/* Left Status Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-black uppercase tracking-wider text-teal-400 text-[11px]">
              <Shield className="h-4 w-4" />
              <span>Admin Website Editor</span>
            </div>

            <div className="h-4 w-[1px] bg-slate-700 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                isEditMode 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                <span className={`h-2 w-2 rounded-full ${isEditMode ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                {isEditMode ? 'LIVE EDIT MODE: ACTIVE' : 'VIEW MODE'}
              </span>

              {hasUnsavedChanges && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                  <AlertCircle size={10} />
                  Unsaved Changes
                </span>
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Toggle Edit Mode Button */}
            <button
              onClick={toggleEditMode}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                isEditMode
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 text-white shadow-md shadow-teal-500/20'
              }`}
            >
              <Edit3 size={13} />
              <span>{isEditMode ? 'Exit Edit Mode' : '✏️ Enable Live Editor'}</span>
            </button>

            {/* Discard Changes */}
            {isEditMode && hasUnsavedChanges && (
              <button
                onClick={cancelEditMode}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-all cursor-pointer"
                title="Discard unsaved changes"
              >
                <RotateCcw size={12} />
                <span>Discard</span>
              </button>
            )}

            {/* Save & Confirm Changes */}
            {isEditMode && (
              <button
                onClick={handleSave}
                disabled={isSaving || !hasUnsavedChanges}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-extrabold text-xs transition-all shadow-md cursor-pointer ${
                  hasUnsavedChanges
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20 animate-pulse'
                    : 'bg-emerald-600/50 text-emerald-200 cursor-not-allowed opacity-80'
                }`}
              >
                <Save size={13} />
                <span>{isSaving ? 'Saving...' : '💾 Save & Confirm Changes'}</span>
              </button>
            )}

            <div className="h-4 w-[1px] bg-slate-700 hidden sm:block" />

            {/* Link to full Admin Dashboard */}
            <Link
              href="/admin"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700 transition-all"
            >
              <span>Admin Panel</span>
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
