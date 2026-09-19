'use client';

import React, { useState } from 'react';
import { 
  X, 
  Type, 
  Palette, 
  Move, 
  Maximize2, 
  Smartphone, 
  Code, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff, 
  Sliders, 
  Layers, 
  Sparkles,
  Link as LinkIcon,
  Image as ImageIcon
} from 'lucide-react';
import { CMSBlock, BlockStyles, CMSSection } from '@/types/cms';
import { COMPONENT_REGISTRY } from '@/lib/cms/registry';

interface PropertiesPanelProps {
  selectedBlock: CMSBlock | null;
  selectedSection: CMSSection | null;
  onUpdateBlock: (blockId: string, updates: Partial<CMSBlock>) => void;
  onUpdateSection: (sectionId: string, updates: Partial<CMSSection>) => void;
  onDeleteBlock?: (blockId: string) => void;
  onDeleteSection?: (sectionId: string) => void;
  onClose: () => void;
  onOpenMediaPicker?: (onSelectUrl: (url: string) => void) => void;
}

export default function PropertiesPanel({
  selectedBlock,
  selectedSection,
  onUpdateBlock,
  onUpdateSection,
  onDeleteBlock,
  onDeleteSection,
  onClose,
  onOpenMediaPicker
}: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'spacing' | 'responsive' | 'advanced'>('content');

  if (!selectedBlock && !selectedSection) return null;

  // Editing a Block
  if (selectedBlock) {
    const reg = COMPONENT_REGISTRY[selectedBlock.type];
    const styles = selectedBlock.styles || {};
    const content = selectedBlock.content || {};

    const handleContentChange = (key: string, value: unknown) => {
      onUpdateBlock(selectedBlock.id, {
        content: { ...content, [key]: value }
      });
    };

    const handleStyleChange = (key: keyof BlockStyles, value: unknown) => {
      onUpdateBlock(selectedBlock.id, {
        styles: { ...styles, [key]: value }
      });
    };

    const handleResponsiveChange = (device: 'mobile' | 'tablet', key: string, value: unknown) => {
      onUpdateBlock(selectedBlock.id, {
        styles: {
          ...styles,
          [device]: {
            ...(styles[device] || {}),
            [key]: value
          }
        }
      });
    };

    return (
      <aside className="w-80 sm:w-96 bg-slate-900 border-l border-slate-800 flex flex-col flex-shrink-0 z-30 select-none overflow-hidden text-slate-100 shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/15 text-teal-400 border border-teal-500/30">
              <Sliders size={16} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-400">
                Block Inspector
              </span>
              <h4 className="text-sm font-extrabold text-white">
                {reg?.displayName || selectedBlock.type}
              </h4>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/30 px-2 overflow-x-auto">
          {[
            { id: 'content', label: 'Content' },
            { id: 'style', label: 'Style' },
            { id: 'spacing', label: 'Spacing' },
            { id: 'responsive', label: 'Responsive' },
            { id: 'advanced', label: 'Advanced' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-teal-400 text-teal-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'content' && (
            <div className="space-y-4">
              {/* Text editing */}
              {content.text !== undefined && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Text Value
                  </label>
                  <textarea
                    rows={3}
                    value={String(content.text)}
                    onChange={(e) => handleContentChange('text', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              )}

              {/* Heading level */}
              {content.level !== undefined && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Heading Tag
                  </label>
                  <select
                    value={content.level}
                    onChange={(e) => handleContentChange('level', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                  >
                    <option value={1}>H1 - Main Title</option>
                    <option value={2}>H2 - Section Header</option>
                    <option value={3}>H3 - Subheading</option>
                    <option value={4}>H4 - Feature Title</option>
                  </select>
                </div>
              )}

              {/* Button text & URL */}
              {content.buttonText !== undefined && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={String(content.buttonText)}
                      onChange={(e) => handleContentChange('buttonText', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Destination Link
                    </label>
                    <input
                      type="text"
                      value={String(content.buttonLink || '')}
                      onChange={(e) => handleContentChange('buttonLink', e.target.value)}
                      placeholder="/services, /contact, or https://..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-100 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Image URL & Alt Text */}
              {content.url !== undefined && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Image Source
                      </label>
                      {onOpenMediaPicker && (
                        <button
                          onClick={() => onOpenMediaPicker((newUrl) => handleContentChange('url', newUrl))}
                          className="text-[10px] font-bold text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <ImageIcon size={11} />
                          <span>Choose Media</span>
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={String(content.url)}
                      onChange={(e) => handleContentChange('url', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-100 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Alt Text (SEO & Accessibility)
                    </label>
                    <input
                      type="text"
                      value={String(content.alt || '')}
                      onChange={(e) => handleContentChange('alt', e.target.value)}
                      placeholder="Descriptive text for search engines and screen readers"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-100"
                    />
                  </div>
                </div>
              )}

              {/* Card Title & Desc */}
              {content.title !== undefined && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Card Title
                    </label>
                    <input
                      type="text"
                      value={String(content.title)}
                      onChange={(e) => handleContentChange('title', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-100"
                    />
                  </div>
                  {content.desc !== undefined && (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Card Description
                      </label>
                      <textarea
                        rows={3}
                        value={String(content.desc)}
                        onChange={(e) => handleContentChange('desc', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-100"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Style */}
          {activeTab === 'style' && (
            <div className="space-y-4">
              {/* Font Size & Weight */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400">Font Size</label>
                  <input
                    type="text"
                    value={styles.fontSize || ''}
                    placeholder="1rem, 24px, 2.5rem"
                    onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-100"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400">Font Weight</label>
                  <select
                    value={styles.fontWeight || 'normal'}
                    onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-100"
                  >
                    <option value="normal">Normal (400)</option>
                    <option value="medium">Medium (500)</option>
                    <option value="semibold">SemiBold (600)</option>
                    <option value="bold">Bold (700)</option>
                    <option value="black">Black (900)</option>
                  </select>
                </div>
              </div>

              {/* Text Alignment */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400">Text Alignment</label>
                <div className="grid grid-cols-3 gap-2">
                  {['left', 'center', 'right'].map((align) => (
                    <button
                      key={align}
                      onClick={() => handleStyleChange('textAlign', align)}
                      className={`py-1.5 text-xs font-bold rounded-lg border capitalize cursor-pointer ${
                        styles.textAlign === align
                          ? 'bg-teal-500 text-white border-teal-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {align}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text & Background Colors */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400">Text Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={styles.textColor || '#ffffff'}
                      onChange={(e) => handleStyleChange('textColor', e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={styles.textColor || ''}
                      placeholder="#ffffff"
                      onChange={(e) => handleStyleChange('textColor', e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-100 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400">Background</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={styles.backgroundColor || '#0f172a'}
                      onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={styles.backgroundColor || ''}
                      placeholder="#0f172a"
                      onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-100 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Border Radius */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400">Border Radius</label>
                <input
                  type="text"
                  value={styles.borderRadius || ''}
                  placeholder="0.75rem, 1rem, 9999px"
                  onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-100 font-mono"
                />
              </div>
            </div>
          )}

          {/* Tab 3: Spacing (Margins & Padding) */}
          {activeTab === 'spacing' && (
            <div className="space-y-4">
              <div className="text-[11px] font-black uppercase tracking-wider text-teal-400">
                Outer Spacing (Margins)
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 font-mono">Margin Top</label>
                  <input
                    type="text"
                    value={styles.marginTop || ''}
                    placeholder="1rem"
                    onChange={(e) => handleStyleChange('marginTop', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-mono">Margin Bottom</label>
                  <input
                    type="text"
                    value={styles.marginBottom || ''}
                    placeholder="1rem"
                    onChange={(e) => handleStyleChange('marginBottom', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div className="text-[11px] font-black uppercase tracking-wider text-teal-400 pt-3 border-t border-slate-800">
                Inner Spacing (Padding)
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 font-mono">Padding Top</label>
                  <input
                    type="text"
                    value={styles.paddingTop || ''}
                    placeholder="1.5rem"
                    onChange={(e) => handleStyleChange('paddingTop', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-mono">Padding Bottom</label>
                  <input
                    type="text"
                    value={styles.paddingBottom || ''}
                    placeholder="1.5rem"
                    onChange={(e) => handleStyleChange('paddingBottom', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-mono">Padding Left</label>
                  <input
                    type="text"
                    value={styles.paddingLeft || ''}
                    placeholder="1rem"
                    onChange={(e) => handleStyleChange('paddingLeft', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-mono">Padding Right</label>
                  <input
                    type="text"
                    value={styles.paddingRight || ''}
                    placeholder="1rem"
                    onChange={(e) => handleStyleChange('paddingRight', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Responsive Overrides */}
          {activeTab === 'responsive' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Mobile Visibility</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!styles.mobile?.hide}
                      onChange={(e) => handleResponsiveChange('mobile', 'hide', !e.target.checked)}
                      className="rounded border-slate-800 text-teal-500 focus:ring-teal-500"
                    />
                    <span className="text-[11px] text-slate-400">Show on Mobile</span>
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">Mobile Font Size Override</label>
                  <input
                    type="text"
                    value={styles.mobile?.fontSize || ''}
                    placeholder="e.g. 1.25rem or 20px"
                    onChange={(e) => handleResponsiveChange('mobile', 'fontSize', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Tablet Visibility</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!styles.tablet?.hide}
                      onChange={(e) => handleResponsiveChange('tablet', 'hide', !e.target.checked)}
                      className="rounded border-slate-800 text-teal-500 focus:ring-teal-500"
                    />
                    <span className="text-[11px] text-slate-400">Show on Tablet</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Advanced (CSS Class & Anchor ID) */}
          {activeTab === 'advanced' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  HTML Anchor ID
                </label>
                <input
                  type="text"
                  value={styles.anchorId || ''}
                  placeholder="e.g. contact-form or features"
                  onChange={(e) => handleStyleChange('anchorId', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-100 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Custom CSS Class
                </label>
                <input
                  type="text"
                  value={styles.customClass || ''}
                  placeholder="e.g. glow-cyan shadow-xl"
                  onChange={(e) => handleStyleChange('customClass', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-100 font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer: Delete block */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          {onDeleteBlock && (
            <button
              onClick={() => onDeleteBlock(selectedBlock.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-all cursor-pointer"
            >
              <Trash2 size={13} />
              <span>Delete Block</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold transition-colors cursor-pointer ml-auto"
          >
            Done
          </button>
        </div>
      </aside>
    );
  }

  // Fallback if section selected
  return null;
}
