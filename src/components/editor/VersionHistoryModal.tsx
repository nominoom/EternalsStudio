'use client';

import React from 'react';
import { X, History, RotateCcw, CheckCircle2, User, Clock, AlertTriangle } from 'lucide-react';
import { PageVersion } from '@/types/cms';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageId: string;
  versions: PageVersion[];
  onRestoreVersion: (versionId: string) => void;
}

export default function VersionHistoryModal({
  isOpen,
  onClose,
  pageId,
  versions,
  onRestoreVersion
}: VersionHistoryModalProps) {
  if (!isOpen) return null;

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
              <History size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Revision & Version History
              </h3>
              <p className="text-xs text-slate-400">
                Inspect and restore previous published states for /{pageId === 'main' ? '' : pageId}.
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

        {/* List of Revisions */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {versions.length === 0 ? (
            <div className="py-16 text-center space-y-2 text-slate-500">
              <Clock className="mx-auto h-12 w-12 text-slate-700" />
              <p className="text-sm font-bold">No previous revisions recorded yet</p>
              <p className="text-xs text-slate-600">
                When you publish changes, a historical snapshot will be automatically saved here.
              </p>
            </div>
          ) : (
            versions.slice().reverse().map((ver, idx) => (
              <div
                key={ver.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-teal-500/40 transition-all flex items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-extrabold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                      v{ver.versionNumber}
                    </span>
                    {idx === 0 && (
                      <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Latest Published
                      </span>
                    )}
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(ver.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 truncate">
                    {ver.commitMessage || 'Snapshot published by administrator'}
                  </p>

                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <User size={10} />
                    <span>{ver.createdBy || 'Admin'}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const confirmRestore = window.confirm(
                      `Restore revision v${ver.versionNumber}? This will load the snapshot into your active draft.`
                    );
                    if (confirmRestore) {
                      onRestoreVersion(ver.id);
                      onClose();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-teal-500/20 text-slate-300 hover:text-teal-400 border border-slate-700 hover:border-teal-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <RotateCcw size={12} />
                  <span>Restore Snapshot</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
          <span>Restoring a version creates a new draft without erasing your history.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
