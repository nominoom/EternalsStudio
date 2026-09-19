'use client';

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Layout, 
  Terminal, 
  Star, 
  Users, 
  ShoppingBag, 
  Megaphone, 
  HelpCircle, 
  FileText, 
  BarChart3,
  Check,
  Plus
} from 'lucide-react';
import { CustomSectionBlock } from '../../context/SiteContentContext';

interface SectionPresetOption {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  defaultBlock: Omit<CustomSectionBlock, 'id'>;
}

const SECTION_PRESETS: SectionPresetOption[] = [
  {
    id: 'hero',
    name: 'Hero Showcase Header',
    category: 'Headers',
    description: 'High-impact hero header with badge, gradient title, description, and dual call-to-action buttons.',
    icon: <Sparkles size={20} />,
    color: 'from-cyan-500 to-teal-500',
    defaultBlock: {
      type: 'hero',
      title: 'Crafting Next-Gen Visual Excellence',
      subtitle: 'Premium digital designs, esports graphics, and high-performance web applications tailored to command attention.',
      badge: 'Featured Release',
      buttonText: 'Get Started Today',
      buttonLink: '/contact',
      content: 'Where creative visions meet elite execution.'
    }
  },
  {
    id: 'features',
    name: 'Services & Features Grid',
    category: 'Content',
    description: '4-column feature card showcase highlighting your creative and technical capabilities.',
    icon: <Terminal size={20} />,
    color: 'from-indigo-500 to-purple-500',
    defaultBlock: {
      type: 'features',
      title: 'Our Core Capabilities',
      subtitle: 'Engineered for speed, aesthetics, and unmatched reliability across platforms.',
      items: [
        { id: 'f-1', title: 'Web Development', desc: 'Next.js & React architectures with sub-second page loads.' },
        { id: 'f-2', title: 'Brand Identity', desc: 'Striking emblems, vector mascot kits, and team guides.' },
        { id: 'f-3', title: '3D Environments', desc: 'Photorealistic asset models, spatial renders, and shaders.' },
        { id: 'f-4', title: 'Motion Graphics', desc: 'Broadcast tournament sequences and kinetic streaming packages.' }
      ]
    }
  },
  {
    id: 'promo-banner',
    name: 'Promotional Showcase Banner',
    category: 'Marketing',
    description: 'Wide gradient banner for highlighting special promotions, new product launches, or seasonal deals.',
    icon: <Megaphone size={20} />,
    color: 'from-amber-500 to-rose-500',
    defaultBlock: {
      type: 'cta',
      title: 'Custom Brand & Vector Overlays',
      subtitle: 'Elevate your esports channel or corporate website with tailor-made motion graphics.',
      badge: 'Special Announcement',
      buttonText: 'Claim Your Bundle',
      buttonLink: '/store'
    }
  },
  {
    id: 'stats',
    name: 'Metrics & Stats Bar',
    category: 'Social Proof',
    description: 'Numerical milestones displaying completed projects, happy clients, and uptime.',
    icon: <BarChart3 size={20} />,
    color: 'from-emerald-500 to-teal-500',
    defaultBlock: {
      type: 'stats',
      title: 'By The Numbers',
      subtitle: 'Proven track record of delivering visual and technical excellence.',
      items: [
        { id: 's-1', title: '13+', desc: 'Projects Delivered' },
        { id: 's-2', title: '10+', desc: 'Partner Organizations' },
        { id: 's-3', title: '99.9%', desc: 'Satisfaction Rate' },
        { id: 's-4', title: '24/7', desc: 'Direct Studio Support' }
      ]
    }
  },
  {
    id: 'cta',
    name: 'Call To Action Banner',
    category: 'Marketing',
    description: 'Bold conversion section prompting visitors to start a project or request a custom quote.',
    icon: <Sparkles size={20} />,
    color: 'from-teal-500 to-indigo-600',
    defaultBlock: {
      type: 'cta',
      title: 'Ready to elevate your digital presence?',
      subtitle: 'Collaborate with our team of elite designers and developers to bring your vision to life.',
      buttonText: 'Start a Project Now',
      buttonLink: '/contact'
    }
  },
  {
    id: 'faq',
    name: 'FAQ Accordion Block',
    category: 'Content',
    description: 'Collapsible frequently asked questions to resolve client inquiries before purchasing.',
    icon: <HelpCircle size={20} />,
    color: 'from-violet-500 to-fuchsia-500',
    defaultBlock: {
      type: 'faq',
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know about our project turnaround, payment terms, and delivery files.',
      items: [
        { id: 'q-1', title: 'What is your standard turnaround time?', desc: 'Most visual projects and custom websites are completed within 3 to 10 business days depending on complexity.' },
        { id: 'q-2', title: 'Do you provide source files upon completion?', desc: 'Yes, full vector source files (Figma, AI, PSD, C4D) and production Next.js code are handed over upon project sign-off.' },
        { id: 'q-3', title: 'What payment methods do you support?', desc: 'We accept all major credit cards and debit cards via Stripe checkout, as well as official QuickBooks invoicing.' }
      ]
    }
  },
  {
    id: 'text',
    name: 'Rich Text & Story Block',
    category: 'Content',
    description: 'Clean typographic section perfect for mission statements, founder notes, or long-form copy.',
    icon: <FileText size={20} />,
    color: 'from-blue-500 to-cyan-500',
    defaultBlock: {
      type: 'text',
      title: 'Our Creative Philosophy',
      subtitle: 'Behind every pixel is a deliberate strategy to communicate authority, excitement, and purpose.',
      content: 'We founded Eternals Studio with a clear mission: empower creators, gaming teams, and innovative companies with visual identities and digital tools that look like they came from the future.'
    }
  }
];

interface SectionLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSection: (block: CustomSectionBlock) => void;
  targetPageId: string;
}

export default function SectionLibraryModal({
  isOpen,
  onClose,
  onAddSection,
  targetPageId
}: SectionLibraryModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Headers', 'Content', 'Marketing', 'Social Proof'];

  const filteredPresets = selectedCategory === 'All'
    ? SECTION_PRESETS
    : SECTION_PRESETS.filter((p) => p.category === selectedCategory);

  const handleSelectPreset = (preset: SectionPresetOption) => {
    const newBlock: CustomSectionBlock = {
      ...preset.defaultBlock,
      id: `sec-${preset.id}-${Date.now()}`
    };
    onAddSection(newBlock);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
      <div 
        className="w-full max-w-4xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between flex-shrink-0 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Layout size={20} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <span>Add Section to</span>
                <span className="text-teal-400 uppercase tracking-wider text-xs px-2 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/20">
                  {targetPageId}
                </span>
              </h3>
              <p className="text-xs text-slate-400">Choose a pre-styled block component to insert into your page layout.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-6 py-3 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto flex-shrink-0 bg-slate-950/40">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Preset Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPresets.map((preset) => (
            <div
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className="group p-5 rounded-2xl bg-slate-950/50 hover:bg-slate-800/60 border border-slate-800 hover:border-teal-500/50 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 shadow-sm hover:shadow-xl hover:shadow-teal-500/5"
            >
              <div className="flex items-start gap-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${preset.color} text-white shadow-md flex-shrink-0 group-hover:scale-105 transition-transform`}>
                  {preset.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-extrabold text-sm text-slate-100 group-hover:text-teal-400 transition-colors">
                      {preset.name}
                    </h4>
                    <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                      {preset.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {preset.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium text-[11px] text-slate-500">Click to insert on canvas</span>
                <span className="inline-flex items-center gap-1 font-bold text-teal-400 group-hover:translate-x-0.5 transition-transform">
                  <Plus size={14} />
                  <span>Insert Section</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between text-xs text-slate-400">
          <span>Sections can be moved up/down, styled, or deleted at any time on the canvas.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
