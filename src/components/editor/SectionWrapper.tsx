'use client';

import React from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Copy, 
  Sliders, 
  Plus, 
  EyeOff,
  GripVertical
} from 'lucide-react';
import { SECTION_METADATA } from './EditorSidebar';
import { useSiteContent } from '../../context/SiteContentContext';

interface SectionWrapperProps {
  sectionId: string;
  pageId: string;
  index: number;
  totalSections: number;
  isSelected: boolean;
  isPreviewMode: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onOpenAddSectionAfter: () => void;
  children: React.ReactNode;
}

export default function SectionWrapper({
  sectionId,
  pageId,
  index,
  totalSections,
  isSelected,
  isPreviewMode,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onOpenAddSectionAfter,
  children
}: SectionWrapperProps) {
  const { siteContent } = useSiteContent();
  const currentStyle = siteContent.sectionStyles?.[sectionId];

  const getBgClass = () => {
    if (currentStyle?.customBg) return '';
    switch (currentStyle?.bg) {
      case 'glass':
        return 'bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-xl';
      case 'slate':
        return 'bg-slate-900 border border-slate-800 shadow-md';
      case 'glow':
        return 'bg-gradient-to-b from-teal-950/20 via-slate-950 to-indigo-950/20 border border-teal-500/20 shadow-2xl shadow-teal-500/5';
      case 'gradient':
        return 'bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800/80';
      case 'mesh':
      default:
        return 'bg-slate-950/40 border border-slate-900';
    }
  };

  const getPaddingClass = () => {
    switch (currentStyle?.padding) {
      case 'compact':
        return 'py-4 md:py-6';
      case 'spacious':
        return 'py-16 md:py-24';
      case 'standard':
      default:
        return 'py-8 md:py-12';
    }
  };

  const dynamicStyle = {
    background: currentStyle?.customBg || undefined,
    color: currentStyle?.customTextColor || undefined,
    textAlign: currentStyle?.align || undefined
  };

  if (isPreviewMode) {
    return (
      <div 
        id={`preview-sec-${sectionId}`} 
        className={`${getBgClass()} ${getPaddingClass()} transition-all duration-300 rounded-3xl`}
        style={dynamicStyle}
      >
        {children}
      </div>
    );
  }

  const meta = SECTION_METADATA[sectionId] || {
    label: sectionId.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    icon: '📦'
  };

  return (
    <div className="relative group/sec-wrap my-4 transition-all duration-200">
      {/* Section Container with Selection Border and Background */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        style={dynamicStyle}
        className={`relative rounded-3xl transition-all duration-200 ${getBgClass()} ${getPaddingClass()} ${
          isSelected
            ? 'ring-2 ring-teal-400 shadow-2xl shadow-teal-500/10'
            : 'hover:ring-1 hover:ring-teal-500/40'
        }`}
      >
        {/* Floating Quick Actions Bar on Hover / Selection */}
        <div
          className={`absolute -top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none transition-all duration-150 ${
            isSelected
              ? 'opacity-100'
              : 'opacity-0 group-hover/sec-wrap:opacity-100'
          }`}
        >
          {/* Section Badge */}
          <div className="pointer-events-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-teal-500/50 text-teal-400 text-[11px] font-extrabold shadow-xl backdrop-blur-md">
            <span>{meta.icon}</span>
            <span className="uppercase tracking-wider">{meta.label}</span>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-xl bg-slate-900/95 border border-slate-700 text-slate-300 shadow-2xl backdrop-blur-md">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              disabled={index === 0}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-teal-400 disabled:opacity-30 cursor-pointer transition-colors"
              title="Move Section Up"
            >
              <ChevronUp size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              disabled={index === totalSections - 1}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-teal-400 disabled:opacity-30 cursor-pointer transition-colors"
              title="Move Section Down"
            >
              <ChevronDown size={14} />
            </button>
            <div className="h-4 w-px bg-slate-800" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className={`p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer ${
                isSelected ? 'text-teal-400 bg-teal-500/10' : 'text-slate-300 hover:text-white'
              }`}
              title="Edit Section Settings"
            >
              <Sliders size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Duplicate Section"
            >
              <Copy size={13} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              title="Delete Section"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Section Child Content */}
        <div className="pt-2">{children}</div>
      </div>

      {/* Visual "+ Add Section Here" separator between sections */}
      <div className="h-6 flex items-center justify-center relative opacity-0 group-hover/sec-wrap:opacity-100 transition-opacity">
        <div className="absolute inset-x-8 h-px bg-teal-500/20" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenAddSectionAfter();
          }}
          className="relative z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-teal-500/40 text-teal-400 text-[10px] font-extrabold shadow-lg hover:bg-teal-500 hover:text-white transition-all cursor-pointer"
          title="Insert a new section block here"
        >
          <Plus size={12} />
          <span>Add Section Here</span>
        </button>
      </div>
    </div>
  );
}
