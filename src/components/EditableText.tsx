'use client';

import React, { useState } from 'react';
import { useSiteContent } from '../context/SiteContentContext';
import { Edit3, Check, X } from 'lucide-react';

interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  label?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

export default function EditableText({
  value,
  onChange,
  className = '',
  multiline = false,
  placeholder = 'Click to edit text...',
  label,
  as: Component = 'span'
}: EditableTextProps) {
  const { isEditMode } = useSiteContent();
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  // If edit mode is OFF, render plain element
  if (!isEditMode) {
    return <Component className={className}>{value}</Component>;
  }

  const handleOpenEdit = () => {
    setTempValue(value);
    setIsEditing(true);
  };

  const handleSave = () => {
    onChange(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <span className="relative group/editable inline-block max-w-full">
      {/* Visual outline in Edit Mode */}
      <Component
        onClick={handleOpenEdit}
        className={`${className} cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-teal-400/80 hover:bg-teal-500/10 rounded px-1 transition-all group-relative`}
        title={`Click to edit: ${label || value}`}
      >
        {value || <span className="italic opacity-50">{placeholder}</span>}
      </Component>

      {/* Hover Edit Pencil Indicator */}
      <button
        onClick={handleOpenEdit}
        className="opacity-0 group-hover/editable:opacity-100 transition-opacity absolute -top-3 -right-3 z-30 h-6 w-6 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-lg hover:scale-110 cursor-pointer"
        aria-label="Edit text"
      >
        <Edit3 size={11} />
      </button>

      {/* Popover Inline Modal Editor */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div 
            className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl flex flex-col gap-4 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Edit3 className="text-teal-500 h-4 w-4" />
                <span>Edit {label || 'Website Text'}</span>
              </h4>
              <button 
                onClick={handleCancel}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Content Value</label>
              {multiline ? (
                <textarea
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  autoFocus
                />
              ) : (
                <input
                  type="text"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  autoFocus
                />
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-teal-500 hover:bg-teal-600 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
              >
                <Check size={14} />
                <span>Apply Edit</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </span>
  );
}
