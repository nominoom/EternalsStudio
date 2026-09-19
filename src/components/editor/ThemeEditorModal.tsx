'use client';

import React, { useState } from 'react';
import { X, Palette, Type, Square, Layout, RotateCcw, Check, Sparkles } from 'lucide-react';
import { GlobalThemeSettings } from '@/types/cms';
import { DEFAULT_THEME_SETTINGS } from '@/lib/cms/theme';

interface ThemeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: GlobalThemeSettings;
  onSaveTheme: (updatedTheme: GlobalThemeSettings) => void;
}

export default function ThemeEditorModal({
  isOpen,
  onClose,
  theme,
  onSaveTheme
}: ThemeEditorModalProps) {
  const [formData, setFormData] = useState<GlobalThemeSettings>(theme);

  if (!isOpen) return null;

  const handleColorChange = (key: keyof GlobalThemeSettings['colors'], val: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: { ...prev.colors, [key]: val }
    }));
  };

  const handleSave = () => {
    onSaveTheme(formData);
    onClose();
  };

  const handleReset = () => {
    setFormData(DEFAULT_THEME_SETTINGS);
  };

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
              <Palette size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Global Theme & Design System
              </h3>
              <p className="text-xs text-slate-400">
                Configure brand colors, typography tokens, and button styling across the entire website.
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

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Colors Section */}
          <div className="space-y-3">
            <div className="text-xs font-black uppercase tracking-wider text-teal-400 flex items-center gap-2">
              <Palette size={14} />
              <span>Brand & Theme Color Palette</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { key: 'primary', label: 'Primary Brand Color' },
                { key: 'secondary', label: 'Secondary Accent' },
                { key: 'accent', label: 'Highlight Glow' },
                { key: 'background', label: 'Page Background' },
                { key: 'surface', label: 'Card Surface' },
                { key: 'border', label: 'Divider & Border' }
              ].map(({ key, label }) => (
                <div key={key} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block truncate">{label}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.colors[key as keyof GlobalThemeSettings['colors']]}
                      onChange={(e) => handleColorChange(key as keyof GlobalThemeSettings['colors'], e.target.value)}
                      className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                    />
                    <input
                      type="text"
                      value={formData.colors[key as keyof GlobalThemeSettings['colors']]}
                      onChange={(e) => handleColorChange(key as keyof GlobalThemeSettings['colors'], e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-xs font-mono text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Button & Corner Radii */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="text-xs font-black uppercase tracking-wider text-teal-400 flex items-center gap-2">
              <Square size={14} />
              <span>Button Geometry & Spacing</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Button Corner Radius</label>
                <select
                  value={formData.buttons.borderRadius}
                  onChange={(e) => setFormData({ ...formData, buttons: { ...formData.buttons, borderRadius: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="0.25rem">Sharp (4px)</option>
                  <option value="0.5rem">Subtle Rounded (8px)</option>
                  <option value="0.75rem">Modern Rounded (12px)</option>
                  <option value="1rem">Soft Curved (16px)</option>
                  <option value="9999px">Full Pill (Pill shape)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Default Section Vertical Padding</label>
                <select
                  value={formData.layout.defaultSectionPadding}
                  onChange={(e) => setFormData({ ...formData, layout: { ...formData.layout, defaultSectionPadding: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="2.5rem">Compact (40px)</option>
                  <option value="4rem">Standard Studio (64px)</option>
                  <option value="6rem">Spacious Cinematic (96px)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="text-xs font-black uppercase tracking-wider text-teal-400 flex items-center gap-2">
              <Type size={14} />
              <span>Base Typography</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Heading Font</label>
                <input
                  type="text"
                  value={formData.typography.headingFont}
                  onChange={(e) => setFormData({ ...formData, typography: { ...formData.typography, headingFont: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Base Font Size</label>
                <input
                  type="text"
                  value={formData.typography.baseFontSize}
                  onChange={(e) => setFormData({ ...formData, typography: { ...formData.typography, baseFontSize: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white font-bold cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset to Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-extrabold shadow-md shadow-teal-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>Apply Theme Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
