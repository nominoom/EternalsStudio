'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSiteContent, TeamMember, StatItem, PromoBanner } from '../context/SiteContentContext';
import EditableImage from './EditableImage';
import {
  Users,
  BarChart3,
  FileText,
  Layers,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Edit3,
  Check,
  Loader2,
  CheckCircle2,
  Megaphone,
  Layout,
  Globe,
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
  ShoppingBag,
  Briefcase,
  Image as ImageIcon
} from 'lucide-react';

export default function SiteBuilderTab() {
  const {
    siteContent,
    updateSiteContent,
    saveSiteContent,
    resetToDefault,
    isSaving,
    hasUnsavedChanges,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    addStat,
    updateStat,
    deleteStat,
    addPromoBanner,
    updatePromoBanner,
    deletePromoBanner
  } = useSiteContent();

  const [activeSubTab, setActiveSubTab] = useState<'team' | 'stats' | 'banners' | 'copy' | 'sections' | 'contact'>('team');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Banner Add/Edit State
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<PromoBanner | null>(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    badge: 'Featured',
    imageUrl: '',
    bgGradient: 'from-cyan-500/20 via-teal-500/20 to-indigo-500/20',
    buttonText: 'Learn More',
    buttonLink: '/contact',
    enabled: true
  });

  // Team Member Add/Edit Modal State
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [teamForm, setTeamForm] = useState({ name: '', role: '', initial: '', color: 'bg-teal-500', avatarUrl: '' });

  // Stat Add/Edit State
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<StatItem | null>(null);
  const [statForm, setStatForm] = useState({ value: '', label: '' });

  const colorOptions = [
    { label: 'Teal', class: 'bg-teal-500' },
    { label: 'Indigo', class: 'bg-indigo-500' },
    { label: 'Pink', class: 'bg-pink-500' },
    { label: 'Amber', class: 'bg-amber-500' },
    { label: 'Emerald', class: 'bg-emerald-500' },
    { label: 'Rose', class: 'bg-rose-500' },
    { label: 'Purple', class: 'bg-purple-500' },
    { label: 'Cyan', class: 'bg-cyan-500' },
  ];

  const handleSave = async () => {
    const ok = await saveSiteContent();
    if (ok) {
      setToastMessage('Website content and data successfully saved live!');
    } else {
      setToastMessage('Saved locally in browser memory!');
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  // Open Team Modal for Add or Edit
  const openTeamModal = (member?: TeamMember) => {
    if (member) {
      setEditingTeamMember(member);
      setTeamForm({ name: member.name, role: member.role, initial: member.initial, color: member.color, avatarUrl: member.avatarUrl || '' });
    } else {
      setEditingTeamMember(null);
      setTeamForm({ name: '', role: '', initial: '', color: 'bg-teal-500', avatarUrl: '' });
    }
    setIsTeamModalOpen(true);
  };

  const handleSaveTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.name || !teamForm.role) return;
    const initial = teamForm.initial || teamForm.name.charAt(0).toUpperCase();

    if (editingTeamMember) {
      updateTeamMember(editingTeamMember.id, { ...teamForm, initial });
    } else {
      addTeamMember({ ...teamForm, initial });
    }
    setIsTeamModalOpen(false);
  };

  // Open Stat Modal for Add or Edit
  const openStatModal = (stat?: StatItem) => {
    if (stat) {
      setEditingStat(stat);
      setStatForm({ value: stat.value, label: stat.label });
    } else {
      setEditingStat(null);
      setStatForm({ value: '', label: '' });
    }
    setIsStatModalOpen(true);
  };

  const handleSaveStat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statForm.value || !statForm.label) return;

    if (editingStat) {
      updateStat(editingStat.id, statForm);
    } else {
      addStat(statForm);
    }
    setIsStatModalOpen(false);
  };

  // Open Banner Modal for Add or Edit
  const openBannerModal = (banner?: PromoBanner) => {
    if (banner) {
      setEditingBanner(banner);
      setBannerForm({
        title: banner.title,
        subtitle: banner.subtitle,
        badge: banner.badge || 'Featured',
        imageUrl: banner.imageUrl || '',
        bgGradient: banner.bgGradient || 'from-cyan-500/20 via-teal-500/20 to-indigo-500/20',
        buttonText: banner.buttonText || 'Learn More',
        buttonLink: banner.buttonLink || '/contact',
        enabled: banner.enabled !== false
      });
    } else {
      setEditingBanner(null);
      setBannerForm({
        title: '',
        subtitle: '',
        badge: 'Featured',
        imageUrl: '',
        bgGradient: 'from-cyan-500/20 via-teal-500/20 to-indigo-500/20',
        buttonText: 'Learn More',
        buttonLink: '/contact',
        enabled: true
      });
    }
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.title) return;

    if (editingBanner) {
      updatePromoBanner(editingBanner.id, bannerForm);
    } else {
      addPromoBanner(bannerForm);
    }
    setIsBannerModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Visual Site Content & Data Manager
              {hasUnsavedChanges && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Unsaved Changes
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">
              Manage website text copy, team members, statistics, section toggles, and contact info without touching code.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={resetToDefault}
            className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-xl shadow-lg shadow-teal-500/20 border border-teal-400/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Publish Site Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {showToast && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setShowToast(false)} className="text-xs text-emerald-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* Sub-Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'team', label: '👥 Team Members', icon: Users },
          { id: 'stats', label: '📊 Stats & Data', icon: BarChart3 },
          { id: 'banners', label: '🖼️ Banners & Images', icon: ImageIcon },
          { id: 'copy', label: '📝 Headlines & Text Copy', icon: FileText },
          { id: 'sections', label: '👁️ Page Section Toggles', icon: Layers },
          { id: 'contact', label: '📞 Contact & Social Channels', icon: MessageSquare },
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${isActive
                  ? 'bg-teal-500/15 text-teal-400 border-teal-500/40 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT AREAS */}

      {/* 1. TEAM MEMBERS MANAGER */}
      {activeSubTab === 'team' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-400" />
                Team Members Roster
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Add, edit, or remove founders and specialists rendered on the About Us page.
              </p>
            </div>

            <button
              onClick={() => openTeamModal()}
              className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Team Member
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {siteContent.team.map((member) => (
              <div
                key={member.id}
                className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between group hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  {member.avatarUrl ? (
                    <img src={member.avatarUrl} alt={member.name} className="w-10 h-10 rounded-xl object-cover border border-slate-800 shadow-md" />
                  ) : (
                    <div className={`w-10 h-10 rounded-xl ${member.color} text-white font-bold text-base flex items-center justify-center shadow-md`}>
                      {member.initial}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">{member.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{member.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openTeamModal(member)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Edit Member"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTeamMember(member.id)}
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Delete Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. STATS & METRICS MANAGER */}
      {activeSubTab === 'stats' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                Statistics & Metric Counters
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Edit numbers and labels displayed across the Home and About pages.
              </p>
            </div>

            <button
              onClick={() => openStatModal()}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Metric Stat
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {siteContent.stats.map((stat) => (
              <div key={stat.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-teal-400">{stat.value}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openStatModal(stat)}
                      className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteStat(stat.id)}
                      className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. BANNERS & MEDIA MANAGER */}
      {activeSubTab === 'banners' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-cyan-400" />
                Banners & Media Manager
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Upload and manage promo banners, hero background graphics, and showcase cards across the website.
              </p>
            </div>

            <button
              onClick={() => openBannerModal()}
              className="px-4 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Promo Banner</span>
            </button>
          </div>

          {/* Quick Header & Hero Image Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="space-y-2">
              <label className="text-xs font-bold text-teal-400 uppercase tracking-wider block">Home Hero Feature Banner Image</label>
              <EditableImage
                src={siteContent.hero.bannerImageUrl || ''}
                alt="Hero Feature Banner"
                label="Hero Banner Image"
                placeholderText="Upload or set a feature image for the homepage Hero"
                onChange={(url) => updateSiteContent({ hero: { ...siteContent.hero, bannerImageUrl: url } })}
                className="w-full h-40 object-cover rounded-xl border border-slate-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">About Page Header Image</label>
              <EditableImage
                src={siteContent.branding.aboutHeaderImageUrl || ''}
                alt="About Header Banner"
                label="About Header Image"
                placeholderText="Upload or set a header background image for About Us"
                onChange={(url) => updateSiteContent({ branding: { ...siteContent.branding, aboutHeaderImageUrl: url } })}
                className="w-full h-40 object-cover rounded-xl border border-slate-800"
              />
            </div>
          </div>

          {/* Promo Banners Roster */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Promotional Banners & Showcase Cards</h4>

            {(!siteContent.promoBanners || siteContent.promoBanners.length === 0) ? (
              <p className="text-xs text-slate-500 italic py-4">No promo banners added yet. Click "Add Custom Promo Banner" above.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {siteContent.promoBanners.map((banner) => (
                  <div
                    key={banner.id}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col gap-3 group hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${banner.enabled !== false ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                        <span className="text-xs font-bold text-teal-400">{banner.badge || 'Promo'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openBannerModal(banner)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deletePromoBanner(banner.id)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {banner.imageUrl && (
                      <div className="h-28 w-full rounded-lg overflow-hidden bg-slate-900 border border-slate-800">
                        <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-bold text-white">{banner.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{banner.subtitle}</p>
                    </div>

                    {banner.buttonText && (
                      <div className="text-[11px] text-teal-400 font-semibold">
                        CTA Button: "{banner.buttonText}" &rarr; {banner.buttonLink}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. MAIN PAGE HEADLINES & STORY CONTENT */}
      {activeSubTab === 'copy' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              Main Page Headlines & Story Content
            </h3>
            <p className="text-xs text-slate-400 mt-1">Easily update hero titles, subheadings, and story paragraphs.</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">Home Hero Banner Text</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Top Badge Pill Text</label>
                <input
                  type="text"
                  value={siteContent.hero.badgeText}
                  onChange={(e) => updateSiteContent({ hero: { ...siteContent.hero, badgeText: e.target.value } })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Headline Prefix Line</label>
                <input
                  type="text"
                  value={siteContent.hero.titleLine1}
                  onChange={(e) => updateSiteContent({ hero: { ...siteContent.hero, titleLine1: e.target.value } })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Highlighted Headline Text</label>
                <input
                  type="text"
                  value={siteContent.hero.titleHighlight}
                  onChange={(e) => updateSiteContent({ hero: { ...siteContent.hero, titleHighlight: e.target.value } })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Primary Button Label</label>
                <input
                  type="text"
                  value={siteContent.hero.primaryCtaText}
                  onChange={(e) => updateSiteContent({ hero: { ...siteContent.hero, primaryCtaText: e.target.value } })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Hero Subheading Description</label>
              <textarea
                rows={3}
                value={siteContent.hero.description}
                onChange={(e) => updateSiteContent({ hero: { ...siteContent.hero, description: e.target.value } })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-teal-500"
              />
            </div>

            <hr className="border-slate-800" />

            <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">About Us Story Narrative</h4>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Mission Story Content</label>
              <textarea
                rows={5}
                value={siteContent.aboutPage.storyContent}
                onChange={(e) => updateSiteContent({ aboutPage: { ...siteContent.aboutPage, storyContent: e.target.value } })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-teal-500 leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. SECTION VISIBILITY TOGGLES */}
      {activeSubTab === 'sections' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6 shadow-xl">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              Page Section Controls & Visibility
            </h3>
            <p className="text-xs text-slate-400 mt-1">Easily turn sections on or off with simple toggle switches.</p>
          </div>

          <div className="space-y-3">
            {[
              { key: 'showHero', label: 'Home Hero Banner Section', desc: 'Main top header banner on landing page', icon: Layout, obj: 'hero' },
              { key: 'showStoreGrid', label: 'Digital Assets Store Grid', desc: 'Grid of templates and digital products', icon: ShoppingBag, obj: 'sections' },
              { key: 'showPortfolioShowcase', label: 'Portfolio Projects Gallery', desc: 'Featured branding & 3D projects', icon: Briefcase, obj: 'sections' },
              { key: 'showServicesGrid', label: 'Services Overview Cards', desc: 'Service offerings on home and services page', icon: Layout, obj: 'sections' },
              { key: 'showTeamSection', label: 'Team Roster Grid', desc: 'Team member cards on About Us page', icon: Users, obj: 'sections' },
              { key: 'showCtaBanner', label: 'Call-to-Action Bottom Banner', desc: 'Conversion banner at bottom of homepage', icon: Megaphone, obj: 'sections' },
              { key: 'showAnnouncementBar', label: 'Top Notification Bar', desc: 'Announcement bar across top of Navbar', icon: Megaphone, obj: 'branding' },
            ].map((item) => {
              const Icon = item.icon;
              const isChecked = item.obj === 'hero'
                ? siteContent.hero.showHero
                : item.obj === 'branding'
                  ? siteContent.branding.showAnnouncementBar
                  : (siteContent.sections as any)[item.key];

              const toggleVal = () => {
                if (item.obj === 'hero') {
                  updateSiteContent({ hero: { ...siteContent.hero, showHero: !isChecked } });
                } else if (item.obj === 'branding') {
                  updateSiteContent({ branding: { ...siteContent.branding, showAnnouncementBar: !isChecked } });
                } else {
                  updateSiteContent({ sections: { ...siteContent.sections, [item.key]: !isChecked } });
                }
              };

              return (
                <div key={item.key} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{item.label}</span>
                      <span className="text-[11px] text-slate-400">{item.desc}</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={toggleVal}
                    className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. CONTACT & SOCIAL CHANNELS */}
      {activeSubTab === 'contact' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6 shadow-xl">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-pink-400" />
              Contact Information & Footer Links
            </h3>
            <p className="text-xs text-slate-400 mt-1">Update phone numbers, support emails, social links, and SLA details.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Support Email</label>
              <input
                type="email"
                value={siteContent.contactPage.email}
                onChange={(e) => updateSiteContent({ contactPage: { ...siteContent.contactPage, email: e.target.value } })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Direct Phone Number</label>
              <input
                type="text"
                value={siteContent.contactPage.phone}
                onChange={(e) => updateSiteContent({ contactPage: { ...siteContent.contactPage, phone: e.target.value } })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Discord Community Link</label>
              <input
                type="text"
                value={siteContent.contactPage.discordUrl}
                onChange={(e) => updateSiteContent({ contactPage: { ...siteContent.contactPage, discordUrl: e.target.value } })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Response Time SLA Guarantee</label>
              <input
                type="text"
                value={siteContent.contactPage.responseTimeText}
                onChange={(e) => updateSiteContent({ contactPage: { ...siteContent.contactPage, responseTimeText: e.target.value } })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* TEAM MEMBER MODAL */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              {editingTeamMember ? 'Edit Team Member' : 'Add New Team Member'}
            </h3>

            <form onSubmit={handleSaveTeamMember} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Member Name</label>
                <input
                  type="text"
                  required
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Role / Specialization</label>
                <input
                  type="text"
                  required
                  value={teamForm.role}
                  onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                  placeholder="e.g. Lead 3D Animator"
                  className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Avatar Accent Color</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {colorOptions.map((c) => (
                    <button
                      key={c.class}
                      type="button"
                      onClick={() => setTeamForm({ ...teamForm, color: c.class })}
                      className={`w-7 h-7 rounded-lg ${c.class} transition-all cursor-pointer ${teamForm.color === c.class ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                        }`}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Avatar Photo / Logo Image (Optional)</label>
                <EditableImage
                  src={teamForm.avatarUrl}
                  alt={teamForm.name || 'Member Avatar'}
                  label="Team Member Avatar Logo"
                  placeholderText="Upload or set a photo/logo URL for this team member"
                  onChange={(url) => setTeamForm({ ...teamForm, avatarUrl: url })}
                  className="w-20 h-20 rounded-full object-cover border-2 border-teal-500/50 shadow-md"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-xl shadow-md cursor-pointer"
                >
                  {editingTeamMember ? 'Save Changes' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STAT METRIC MODAL */}
      {isStatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              {editingStat ? 'Edit Metric Stat' : 'Add New Metric Stat'}
            </h3>

            <form onSubmit={handleSaveStat} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Stat Value (e.g. 500+ or 99.8%)</label>
                <input
                  type="text"
                  required
                  value={statForm.value}
                  onChange={(e) => setStatForm({ ...statForm, value: e.target.value })}
                  placeholder="500+"
                  className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Metric Label</label>
                <input
                  type="text"
                  required
                  value={statForm.label}
                  onChange={(e) => setStatForm({ ...statForm, label: e.target.value })}
                  placeholder="Projects Completed"
                  className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsStatModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md cursor-pointer"
                >
                  {editingStat ? 'Save Changes' : 'Add Metric'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM PROMO BANNER MODAL */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              {editingBanner ? 'Edit Promo Banner' : 'Add Custom Promo Banner'}
            </h3>

            <form onSubmit={handleSaveBanner} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Banner Title Headline</label>
                <input
                  type="text"
                  required
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  placeholder="Flash Sale or Custom Design Showcase"
                  className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Subtitle Description</label>
                <textarea
                  rows={2}
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  placeholder="Brief promo or announcement details..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={bannerForm.badge}
                    onChange={(e) => setBannerForm({ ...bannerForm, badge: e.target.value })}
                    placeholder="Featured Showcase"
                    className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Button Link</label>
                  <input
                    type="text"
                    value={bannerForm.buttonLink}
                    onChange={(e) => setBannerForm({ ...bannerForm, buttonLink: e.target.value })}
                    placeholder="/contact or /store"
                    className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Banner Image</label>
                <EditableImage
                  src={bannerForm.imageUrl}
                  alt={bannerForm.title}
                  label="Promo Banner Image"
                  placeholderText="Upload or set a web URL for the promo banner"
                  onChange={(url) => setBannerForm({ ...bannerForm, imageUrl: url })}
                  className="w-full h-32 object-cover rounded-xl border border-slate-800"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bannerForm.enabled}
                    onChange={(e) => setBannerForm({ ...bannerForm, enabled: e.target.checked })}
                    className="rounded border-slate-800 text-teal-500 focus:ring-teal-500"
                  />
                  <span>Show Promo Banner Live</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBannerModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-md cursor-pointer"
                  >
                    {editingBanner ? 'Save Changes' : 'Add Banner'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
