'use client';

import React, { useState } from 'react';
import { X, Menu, Plus, Trash2, ChevronUp, ChevronDown, Check, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { CMSNavigation, NavigationItem } from '@/types/cms';

interface NavigationEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: CMSNavigation;
  onSaveNavigation: (updated: CMSNavigation) => void;
}

export default function NavigationEditorModal({
  isOpen,
  onClose,
  navigation,
  onSaveNavigation
}: NavigationEditorModalProps) {
  const [items, setItems] = useState<NavigationItem[]>(navigation?.items || []);
  const [ctaText, setCtaText] = useState(navigation?.ctaButtonText || 'Start Project');
  const [ctaLink, setCtaLink] = useState(navigation?.ctaButtonLink || '/contact');
  const [showCta, setShowCta] = useState(navigation?.showCtaButton !== false);

  if (!isOpen) return null;

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setItems(newItems);
  };

  const handleUpdateItem = (index: number, updates: Partial<NavigationItem>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    setItems(newItems);
  };

  const handleAddItem = () => {
    const newItem: NavigationItem = {
      id: `nav-item-${Date.now()}`,
      label: 'New Link',
      href: '/services',
      target: '_self'
    };
    setItems([...items, newItem]);
  };

  const handleDeleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSaveNavigation({
      ...navigation,
      items,
      ctaButtonText: ctaText,
      ctaButtonLink: ctaLink,
      showCtaButton: showCta
    });
    onClose();
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
              <Menu size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Main Header Navigation Manager
              </h3>
              <p className="text-xs text-slate-400">
                Manage top navbar links, custom ordering, target links, and CTA action buttons.
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Navigation Links list */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-teal-400">
                Navbar Links Order
              </span>
              <button
                onClick={handleAddItem}
                className="flex items-center gap-1 text-xs font-bold text-teal-400 hover:text-teal-300 cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Navigation Link</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 w-full">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleUpdateItem(index, { label: e.target.value })}
                      placeholder="Link Label"
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={item.href}
                      onChange={(e) => handleUpdateItem(index, { href: e.target.value })}
                      placeholder="/route or https://..."
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                    />
                    <input
                      type="text"
                      value={item.badge || ''}
                      onChange={(e) => handleUpdateItem(index, { badge: e.target.value })}
                      placeholder="Badge (optional)"
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-teal-400"
                    />
                  </div>

                  <div className="flex items-center gap-1 self-end sm:self-auto">
                    <button
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-teal-400 disabled:opacity-20 cursor-pointer"
                      title="Move Up"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === items.length - 1}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-teal-400 disabled:opacity-20 cursor-pointer"
                      title="Move Down"
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(index)}
                      className="p-1 text-slate-400 hover:text-red-400 rounded cursor-pointer"
                      title="Delete link"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-teal-400">
                Navbar Call To Action Button
              </span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCta}
                  onChange={(e) => setShowCta(e.target.checked)}
                  className="rounded border-slate-800 text-teal-500 focus:ring-teal-500"
                />
                <span className="text-xs font-bold text-white">Enable CTA</span>
              </label>
            </div>

            {showCta && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Button Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Button URL</label>
                  <input
                    type="text"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-end gap-2 text-xs">
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
            <span>Apply Navigation</span>
          </button>
        </div>
      </div>
    </div>
  );
}
