'use client';

import React from 'react';
import { 
  Layers, 
  ChevronRight, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  Trash2, 
  Move, 
  Type, 
  Image as ImageIcon, 
  Square, 
  Columns, 
  Sparkles,
  MousePointer
} from 'lucide-react';
import { CMSPage, CMSSection, CMSBlock } from '@/types/cms';

interface LayersPanelProps {
  page: CMSPage | null;
  selectedSectionId: string | null;
  selectedBlockId: string | null;
  onSelectSection: (sectionId: string) => void;
  onSelectBlock: (blockId: string) => void;
  onToggleSectionVisibility: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onDeleteBlock: (blockId: string) => void;
}

export default function LayersPanel({
  page,
  selectedSectionId,
  selectedBlockId,
  onSelectSection,
  onSelectBlock,
  onToggleSectionVisibility,
  onDeleteSection,
  onDeleteBlock
}: LayersPanelProps) {
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    hero: true,
    features: true
  });

  if (!page) {
    return (
      <div className="p-4 text-center text-xs text-slate-500">
        No active page loaded in layers view.
      </div>
    );
  }

  const toggleSectionExpand = (secId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSections((prev) => ({ ...prev, [secId]: !prev[secId] }));
  };

  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'heading':
        return <Type size={12} className="text-teal-400" />;
      case 'paragraph':
      case 'richText':
        return <span className="text-[10px] font-mono text-slate-400">¶</span>;
      case 'button':
        return <MousePointer size={12} className="text-indigo-400" />;
      case 'image':
        return <ImageIcon size={12} className="text-amber-400" />;
      case 'card':
        return <Square size={12} className="text-pink-400" />;
      case 'columns':
        return <Columns size={12} className="text-cyan-400" />;
      default:
        return <Sparkles size={12} className="text-slate-400" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-1 font-sans select-none text-slate-200">
      <div className="px-2 py-1.5 text-[10px] uppercase font-black tracking-wider text-slate-500 flex items-center justify-between">
        <span>Page Document Tree</span>
        <span className="text-teal-400 font-mono">/{page.slug || page.id}</span>
      </div>

      {page.sections && page.sections.map((sec, secIndex) => {
        const isSectionSelected = selectedSectionId === sec.id;
        const isExpanded = expandedSections[sec.id] ?? true;

        return (
          <div key={sec.id} className="space-y-0.5">
            {/* Section Layer Row */}
            <div
              onClick={() => onSelectSection(sec.id)}
              className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer group ${
                isSectionSelected
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                  : 'hover:bg-slate-850 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={(e) => toggleSectionExpand(sec.id, e)}
                  className="text-slate-500 hover:text-slate-300 p-0.5 rounded cursor-pointer"
                >
                  {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                </button>
                <Layers size={13} className={isSectionSelected ? 'text-teal-400' : 'text-slate-400'} />
                <span className="truncate">{sec.name || `Section ${secIndex + 1}`}</span>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSectionVisibility(sec.id);
                  }}
                  className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
                  title={sec.isHidden ? 'Unhide' : 'Hide'}
                >
                  {sec.isHidden ? <EyeOff size={12} className="text-amber-400" /> : <Eye size={12} />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSection(sec.id);
                  }}
                  className="p-1 text-slate-400 hover:text-red-400 rounded cursor-pointer"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            {/* Nested Blocks Tree inside Section */}
            {isExpanded && sec.blocks && sec.blocks.length > 0 && (
              <div className="ml-5 pl-2 border-l border-slate-800 space-y-0.5 py-0.5">
                {sec.blocks.map((block) => {
                  const isBlockSelected = selectedBlockId === block.id;

                  return (
                    <div
                      key={block.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBlock(block.id);
                      }}
                      className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-all cursor-pointer group ${
                        isBlockSelected
                          ? 'bg-indigo-500/25 text-indigo-200 border border-indigo-500/40 font-bold'
                          : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {getBlockIcon(block.type)}
                        <span className="truncate text-[11px]">
                          {block.content?.text
                            ? String(block.content.text).slice(0, 24)
                            : block.content?.buttonText
                            ? String(block.content.buttonText)
                            : block.content?.title
                            ? String(block.content.title)
                            : block.type}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteBlock(block.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 rounded cursor-pointer"
                        title="Delete element"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
