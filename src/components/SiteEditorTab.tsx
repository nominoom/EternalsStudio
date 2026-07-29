'use client';

import React, { useState } from 'react';
import { useSiteConfig, THEME_PRESETS } from '../context/SiteConfigContext';
import { 
  Palette, 
  Layout, 
  FileText, 
  Code, 
  Eye, 
  Smartphone, 
  Monitor, 
  RotateCcw, 
  Save, 
  Check, 
  Sparkles, 
  Layers, 
  Type, 
  Sliders, 
  Globe, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  SlidersHorizontal,
  Megaphone,
  ShoppingBag,
  Briefcase,
  Users,
  MessageSquare
} from 'lucide-react';

export default function SiteEditorTab() {
  const { 
    siteConfig, 
    updateSiteConfig, 
    applyPreset, 
    saveSiteConfig, 
    resetToDefault, 
    isSaving, 
    hasUnsavedChanges 
  } = useSiteConfig();

  const [activeSection, setActiveSection] = useState<'themes' | 'branding' | 'hero' | 'sections' | 'about' | 'services' | 'contact' | 'footer' | 'css'>('themes');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSave = async () => {
    const success = await saveSiteConfig();
    if (success) {
      setToastMessage('Site design and content successfully published live!');
    } else {
      setToastMessage('Published locally! (Database sync skipped or offline mode)');
    }
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Site Redesign & Visual Builder
              {hasUnsavedChanges && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Unsaved Changes
                </span>
              )}
            </h2>
            <p className="text-xs text-gray-400">
              Customize theme colors, fonts, section layouts, copy text, and custom CSS across the entire studio.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={resetToDefault}
            className="px-3.5 py-2 text-xs font-medium text-gray-400 hover:text-white bg-gray-800/80 hover:bg-gray-800 rounded-xl border border-gray-700/80 transition-all flex items-center gap-1.5"
            title="Reset to default brand theme"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 active:scale-[0.98] rounded-xl shadow-lg shadow-blue-500/25 border border-blue-400/30 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Publishing Changes...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Publish Live Redesign
              </>
            )}
          </button>
        </div>
      </div>

      {/* Toast Alert Notification */}
      {showSaveToast && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm flex items-center justify-between animate-fadeIn shadow-lg">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setShowSaveToast(false)} className="text-emerald-400 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-gray-800">
        {[
          { id: 'themes', label: 'Theme & Styling', icon: Palette },
          { id: 'branding', label: 'Branding & Announcement', icon: Megaphone },
          { id: 'hero', label: 'Home Hero Section', icon: Layout },
          { id: 'sections', label: 'Home Page Sections', icon: Layers },
          { id: 'about', label: 'About Page', icon: FileText },
          { id: 'services', label: 'Services Page', icon: Briefcase },
          { id: 'contact', label: 'Contact Info', icon: MessageSquare },
          { id: 'footer', label: 'Footer Links', icon: Globe },
          { id: 'css', label: 'Custom CSS Inject', icon: Code },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500/40 shadow-sm shadow-blue-500/10'
                  : 'bg-gray-900/40 text-gray-400 border-transparent hover:text-gray-200 hover:bg-gray-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Controls Editor on Left, Live Interactive Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* TAB 1: THEMES & STYLING */}
          {activeSection === 'themes' && (
            <div className="p-6 bg-gray-900/90 border border-gray-800 rounded-2xl space-y-6 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Palette className="w-5 h-5 text-blue-400" />
                  Preset Theme Palettes
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Select a professionally curated theme or tweak individual colors below.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {THEME_PRESETS.map((preset) => {
                  const isSelected = siteConfig.theme.presetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => applyPreset(preset.id)}
                      className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${
                        isSelected
                          ? 'bg-blue-950/40 border-blue-500/80 shadow-lg shadow-blue-500/20'
                          : 'bg-gray-950/60 border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white">{preset.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="w-6 h-6 rounded-md border border-white/20 shadow-sm" style={{ backgroundColor: preset.primaryColor }} title="Primary" />
                        <div className="w-6 h-6 rounded-md border border-white/20 shadow-sm" style={{ backgroundColor: preset.accentColor }} title="Accent" />
                        <div className="w-6 h-6 rounded-md border border-white/20 shadow-sm" style={{ backgroundColor: preset.secondaryColor }} title="Secondary" />
                        <div className="w-6 h-6 rounded-md border border-white/20 shadow-sm" style={{ backgroundColor: preset.backgroundColor }} title="Background" />
                        <div className="w-6 h-6 rounded-md border border-white/20 shadow-sm" style={{ backgroundColor: preset.cardBgColor }} title="Card Bg" />
                      </div>
                    </button>
                  );
                })}
              </div>

              <hr className="border-gray-800" />

              {/* Custom Color Pickers */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  Custom Color Scheme
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-1.5">Primary Brand Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={siteConfig.theme.primaryColor}
                        onChange={(e) => updateSiteConfig({ theme: { ...siteConfig.theme, primaryColor: e.target.value } })}
                        className="w-9 h-9 rounded-lg border border-gray-700 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={siteConfig.theme.primaryColor}
                        onChange={(e) => updateSiteConfig({ theme: { ...siteConfig.theme, primaryColor: e.target.value } })}
                        className="flex-1 px-3 py-2 text-xs bg-gray-950 border border-gray-800 rounded-lg text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-1.5">Accent Glow Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={siteConfig.theme.accentColor}
                        onChange={(e) => updateSiteConfig({ theme: { ...siteConfig.theme, accentColor: e.target.value } })}
                        className="w-9 h-9 rounded-lg border border-gray-700 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={siteConfig.theme.accentColor}
                        onChange={(e) => updateSiteConfig({ theme: { ...siteConfig.theme, accentColor: e.target.value } })}
                        className="flex-1 px-3 py-2 text-xs bg-gray-950 border border-gray-800 rounded-lg text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-1.5">Background Base Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={siteConfig.theme.backgroundColor}
                        onChange={(e) => updateSiteConfig({ theme: { ...siteConfig.theme, backgroundColor: e.target.value } })}
                        className="w-9 h-9 rounded-lg border border-gray-700 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={siteConfig.theme.backgroundColor}
                        onChange={(e) => updateSiteConfig({ theme: { ...siteConfig.theme, backgroundColor: e.target.value } })}
                        className="flex-1 px-3 py-2 text-xs bg-gray-950 border border-gray-800 rounded-lg text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-1.5">Card Container Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={siteConfig.theme.cardBgColor}
                        onChange={(e) => updateSiteConfig({ theme: { ...siteConfig.theme, cardBgColor: e.target.value } })}
                        className="w-9 h-9 rounded-lg border border-gray-700 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={siteConfig.theme.cardBgColor}
                        onChange={(e) => updateSiteConfig({ theme: { ...siteConfig.theme, cardBgColor: e.target.value } })}
                        className="flex-1 px-3 py-2 text-xs bg-gray-950 border border-gray-800 rounded-lg text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-gray-800" />

              {/* Typography & Background Canvas Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1.5">Typography Font Family</label>
                  <select
                    value={siteConfig.theme.fontFamily}
                    onChange={(e) => updateSiteConfig({ theme: { ...siteConfig.theme, fontFamily: e.target.value } })}
                    className="w-full px-3 py-2.5 text-xs bg-gray-950 border border-gray-800 rounded-lg text-white"
                  >
                    <option value="Inter">Inter (Clean Modern UI)</option>
                    <option value="Space Grotesk">Space Grotesk (Tech & Cyberpunk)</option>
                    <option value="Outfit">Outfit (High Luxury & Sleek)</option>
                    <option value="Rajdhani">Rajdhani (Esports & Gaming)</option>
                    <option value="Cinzel">Cinzel (Cinematic Classic)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1.5">Background Canvas Style</label>
                  <select
                    value={siteConfig.theme.bgCanvasStyle}
                    onChange={(e) => updateSiteConfig({ theme: { ...siteConfig.theme, bgCanvasStyle: e.target.value as any } })}
                    className="w-full px-3 py-2.5 text-xs bg-gray-950 border border-gray-800 rounded-lg text-white"
                  >
                    <option value="bubbles">Interactive Floating Bubbles</option>
                    <option value="grid">Cyber Matrix Grid</option>
                    <option value="gradient">Deep Ambient Gradient</option>
                    <option value="dots">Modern Dot Matrix</option>
                    <option value="solid">Dark Minimalist Solid</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1.5">UI Component Border Radius</label>
                  <select
                    value={siteConfig.theme.borderRadius}
                    onChange={(e) => updateSiteConfig({ theme: { ...siteConfig.theme, borderRadius: e.target.value } })}
                    className="w-full px-3 py-2.5 text-xs bg-gray-950 border border-gray-800 rounded-lg text-white"
                  >
                    <option value="0.25rem">Sharp (4px)</option>
                    <option value="0.5rem">Standard Modern (8px)</option>
                    <option value="0.75rem">Rounded Glass (12px)</option>
                    <option value="1.25rem">Ultra Curved (20px)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1.5">Glassmorphic Blur Intensity</label>
                  <select
                    value={siteConfig.theme.glassBlur}
                    onChange={(e) => updateSiteConfig({ theme: { ...siteConfig.theme, glassBlur: e.target.value } })}
                    className="w-full px-3 py-2.5 text-xs bg-gray-950 border border-gray-800 rounded-lg text-white"
                  >
                    <option value="8px">Light Blur (8px)</option>
                    <option value="16px">Medium Glass (16px)</option>
                    <option value="24px">Heavy Frost (24px)</option>
                    <option value="0px">No Blur (Flat)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BRANDING & ANNOUNCEMENT BAR */}
          {activeSection === 'branding' && (
            <div className="p-6 bg-gray-900/90 border border-gray-800 rounded-2xl space-y-5 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-indigo-400" />
                  Branding & Top Notification Bar
                </h3>
                <p className="text-xs text-gray-400 mt-1">Configure global site titles, navbar text, and banner announcements.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1.5">Studio Brand Name</label>
                  <input
                    type="text"
                    value={siteConfig.branding.siteName}
                    onChange={(e) => updateSiteConfig({ branding: { ...siteConfig.branding, siteName: e.target.value } })}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-950 border border-gray-800 rounded-xl text-white focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1.5">Logo Subtitle Tagline</label>
                  <input
                    type="text"
                    value={siteConfig.branding.logoSubtitle}
                    onChange={(e) => updateSiteConfig({ branding: { ...siteConfig.branding, logoSubtitle: e.target.value } })}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-950 border border-gray-800 rounded-xl text-white focus:border-blue-500"
                  />
                </div>

                <hr className="border-gray-800" />

                <div className="flex items-center justify-between p-3.5 bg-gray-950/60 border border-gray-800 rounded-xl">
                  <div>
                    <span className="text-xs font-medium text-white block">Enable Top Announcement Bar</span>
                    <span className="text-[11px] text-gray-400">Display persistent announcement bar across top of site</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={siteConfig.branding.showAnnouncementBar}
                    onChange={(e) => updateSiteConfig({ branding: { ...siteConfig.branding, showAnnouncementBar: e.target.checked } })}
                    className="w-5 h-5 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                {siteConfig.branding.showAnnouncementBar && (
                  <>
                    <div>
                      <label className="text-xs font-medium text-gray-400 block mb-1.5">Announcement Bar Text</label>
                      <input
                        type="text"
                        value={siteConfig.branding.announcementBarText}
                        onChange={(e) => updateSiteConfig({ branding: { ...siteConfig.branding, announcementBarText: e.target.value } })}
                        className="w-full px-3.5 py-2.5 text-xs bg-gray-950 border border-gray-800 rounded-xl text-white focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-400 block mb-1.5">Announcement Target Link</label>
                      <input
                        type="text"
                        value={siteConfig.branding.announcementBarLink}
                        onChange={(e) => updateSiteConfig({ branding: { ...siteConfig.branding, announcementBarLink: e.target.value } })}
                        className="w-full px-3.5 py-2.5 text-xs bg-gray-950 border border-gray-800 rounded-xl text-white focus:border-blue-500 font-mono"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: HOME HERO SECTION */}
          {activeSection === 'hero' && (
            <div className="p-6 bg-gray-900/90 border border-gray-800 rounded-2xl space-y-5 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layout className="w-5 h-5 text-purple-400" />
                  Home Hero Banner Content
                </h3>
                <p className="text-xs text-gray-400 mt-1">Edit main hero headlines, badges, descriptions, and CTA action buttons.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 bg-gray-950/60 border border-gray-800 rounded-xl">
                  <div>
                    <span className="text-xs font-medium text-white block">Show Hero Section</span>
                    <span className="text-[11px] text-gray-400">Toggle main hero banner on homepage</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={siteConfig.hero.showHero}
                    onChange={(e) => updateSiteConfig({ hero: { ...siteConfig.hero, showHero: e.target.checked } })}
                    className="w-5 h-5 rounded border-gray-700 bg-gray-900 text-blue-600 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1.5">Top Badge Pill Text</label>
                  <input
                    type="text"
                    value={siteConfig.hero.badgeText}
                    onChange={(e) => updateSiteConfig({ hero: { ...siteConfig.hero, badgeText: e.target.value } })}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-950 border border-gray-800 rounded-xl text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-1.5">Headline Line 1</label>
                    <input
                      type="text"
                      value={siteConfig.hero.titleLine1}
                      onChange={(e) => updateSiteConfig({ hero: { ...siteConfig.hero, titleLine1: e.target.value } })}
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-950 border border-gray-800 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-1.5">Headline Highlighted Text</label>
                    <input
                      type="text"
                      value={siteConfig.hero.titleLine2Highlight}
                      onChange={(e) => updateSiteConfig({ hero: { ...siteConfig.hero, titleLine2Highlight: e.target.value } })}
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-950 border border-gray-800 rounded-xl text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1.5">Hero Body Description</label>
                  <textarea
                    rows={3}
                    value={siteConfig.hero.description}
                    onChange={(e) => updateSiteConfig({ hero: { ...siteConfig.hero, description: e.target.value } })}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-950 border border-gray-800 rounded-xl text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-1.5">Primary Button Text</label>
                    <input
                      type="text"
                      value={siteConfig.hero.primaryCtaText}
                      onChange={(e) => updateSiteConfig({ hero: { ...siteConfig.hero, primaryCtaText: e.target.value } })}
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-950 border border-gray-800 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-1.5">Secondary Button Text</label>
                    <input
                      type="text"
                      value={siteConfig.hero.secondaryCtaText}
                      onChange={(e) => updateSiteConfig({ hero: { ...siteConfig.hero, secondaryCtaText: e.target.value } })}
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-950 border border-gray-800 rounded-xl text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SECTIONS & VISIBILITY */}
          {activeSection === 'sections' && (
            <div className="p-6 bg-gray-900/90 border border-gray-800 rounded-2xl space-y-5 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-400" />
                  Homepage Sections & Visibility
                </h3>
                <p className="text-xs text-gray-400 mt-1">Enable, disable, or re-order sections rendered on the homepage.</p>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'showStoreGrid', label: 'Digital Store Asset Grid', desc: 'Displays interactive product collection cards', icon: ShoppingBag },
                  { key: 'showPortfolioShowcase', label: 'Portfolio Showcase Gallery', desc: 'Displays featured esports & 3D projects', icon: Briefcase },
                  { key: 'showServicesGrid', label: 'Studio Services Overview', desc: 'Highlights custom design & development packages', icon: SlidersHorizontal },
                  { key: 'showTeamSection', label: 'Team Members Grid', desc: 'Displays studio founders and specialists', icon: Users },
                  { key: 'showCtaBanner', label: 'Call-to-Action Banner', desc: 'Renders full-width conversion banner at page bottom', icon: Megaphone },
                ].map((item) => {
                  const Icon = item.icon;
                  const isChecked = (siteConfig.homeSections as any)[item.key];
                  return (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-950/60 border border-gray-800 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-white block">{item.label}</span>
                          <span className="text-[11px] text-gray-400">{item.desc}</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => updateSiteConfig({
                          homeSections: { ...siteConfig.homeSections, [item.key]: e.target.checked }
                        })}
                        className="w-5 h-5 rounded border-gray-700 bg-gray-900 text-blue-600 cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: ABOUT PAGE CMS */}
          {activeSection === 'about' && (
            <div className="p-6 bg-gray-900/90 border border-gray-800 rounded-2xl space-y-5 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  About Us Page Content
                </h3>
                <p className="text-xs text-gray-400 mt-1">Edit mission, origin story, vision statement, and metrics.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1.5">Header Title</label>
                  <input
                    type="text"
                    value={siteConfig.aboutPage.headerTitle}
                    onChange={(e) => updateSiteConfig({ aboutPage: { ...siteConfig.aboutPage, headerTitle: e.target.value } })}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-950 border border-gray-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1.5">Header Tagline Subtitle</label>
                  <input
                    type="text"
                    value={siteConfig.aboutPage.headerSubtitle}
                    onChange={(e) => updateSiteConfig({ aboutPage: { ...siteConfig.aboutPage, headerSubtitle: e.target.value } })}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-950 border border-gray-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1.5">Origin Story Text</label>
                  <textarea
                    rows={4}
                    value={siteConfig.aboutPage.storyContent}
                    onChange={(e) => updateSiteConfig({ aboutPage: { ...siteConfig.aboutPage, storyContent: e.target.value } })}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-950 border border-gray-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1.5">Vision Statement Text</label>
                  <textarea
                    rows={3}
                    value={siteConfig.aboutPage.visionContent}
                    onChange={(e) => updateSiteConfig({ aboutPage: { ...siteConfig.aboutPage, visionContent: e.target.value } })}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-950 border border-gray-800 rounded-xl text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-gray-400 block mb-1">Stat 1 Value</label>
                    <input
                      type="text"
                      value={siteConfig.aboutPage.stat1Number}
                      onChange={(e) => updateSiteConfig({ aboutPage: { ...siteConfig.aboutPage, stat1Number: e.target.value } })}
                      className="w-full px-3 py-2 text-xs bg-gray-950 border border-gray-800 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-400 block mb-1">Stat 2 Value</label>
                    <input
                      type="text"
                      value={siteConfig.aboutPage.stat2Number}
                      onChange={(e) => updateSiteConfig({ aboutPage: { ...siteConfig.aboutPage, stat2Number: e.target.value } })}
                      className="w-full px-3 py-2 text-xs bg-gray-950 border border-gray-800 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-400 block mb-1">Stat 3 Value</label>
                    <input
                      type="text"
                      value={siteConfig.aboutPage.stat3Number}
                      onChange={(e) => updateSiteConfig({ aboutPage: { ...siteConfig.aboutPage, stat3Number: e.target.value } })}
                      className="w-full px-3 py-2 text-xs bg-gray-950 border border-gray-800 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SERVICES CMS */}
          {activeSection === 'services' && (
            <div className="p-6 bg-gray-900/90 border border-gray-800 rounded-2xl space-y-5 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                  Services Page Header & Tagline
                </h3>
                <p className="text-xs text-gray-400 mt-1">Configure service headers and client landing page headlines.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1.5">Services Header Title</label>
                  <input
                    type="text"
                    value={siteConfig.servicesPage.headerTitle}
                    onChange={(e) => updateSiteConfig({ servicesPage: { ...siteConfig.servicesPage, headerTitle: e.target.value } })}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-950 border border-gray-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1.5">Services Tagline Subtitle</label>
                  <textarea
                    rows={3}
                    value={siteConfig.servicesPage.headerSubtitle}
                    onChange={(e) => updateSiteConfig({ servicesPage: { ...siteConfig.servicesPage, headerSubtitle: e.target.value } })}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-950 border border-gray-800 rounded-xl text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: CONTACT CMS */}
          {activeSection === 'contact' && (
            <div className="p-6 bg-gray-900/90 border border-gray-800 rounded-2xl space-y-5 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-pink-400" />
                  Contact Info & Channels
                </h3>
                <p className="text-xs text-gray-400 mt-1">Update phone number, support email, Discord server link, and SLA guarantees.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-1.5">Support Email</label>
                    <input
                      type="email"
                      value={siteConfig.contactPage.email}
                      onChange={(e) => updateSiteConfig({ contactPage: { ...siteConfig.contactPage, email: e.target.value } })}
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-950 border border-gray-800 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-1.5">Support Phone</label>
                    <input
                      type="text"
                      value={siteConfig.contactPage.phone}
                      onChange={(e) => updateSiteConfig({ contactPage: { ...siteConfig.contactPage, phone: e.target.value } })}
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-950 border border-gray-800 rounded-xl text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1.5">Discord Community URL</label>
                  <input
                    type="text"
                    value={siteConfig.contactPage.discordUrl}
                    onChange={(e) => updateSiteConfig({ contactPage: { ...siteConfig.contactPage, discordUrl: e.target.value } })}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-950 border border-gray-800 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1.5">Studio SLA Response Time Banner</label>
                  <input
                    type="text"
                    value={siteConfig.contactPage.responseTimeText}
                    onChange={(e) => updateSiteConfig({ contactPage: { ...siteConfig.contactPage, responseTimeText: e.target.value } })}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-950 border border-gray-800 rounded-xl text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: FOOTER */}
          {activeSection === 'footer' && (
            <div className="p-6 bg-gray-900/90 border border-gray-800 rounded-2xl space-y-5 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-teal-400" />
                  Footer Brand & Social Links
                </h3>
                <p className="text-xs text-gray-400 mt-1">Edit copyright text, studio bio summary, and social links.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1.5">Copyright Statement</label>
                  <input
                    type="text"
                    value={siteConfig.footer.copyrightText}
                    onChange={(e) => updateSiteConfig({ footer: { ...siteConfig.footer, copyrightText: e.target.value } })}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-950 border border-gray-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1.5">Footer Bio Summary</label>
                  <textarea
                    rows={2}
                    value={siteConfig.footer.description}
                    onChange={(e) => updateSiteConfig({ footer: { ...siteConfig.footer, description: e.target.value } })}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-950 border border-gray-800 rounded-xl text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-gray-400 block mb-1">Twitter / X URL</label>
                    <input
                      type="text"
                      value={siteConfig.footer.twitterUrl}
                      onChange={(e) => updateSiteConfig({ footer: { ...siteConfig.footer, twitterUrl: e.target.value } })}
                      className="w-full px-3 py-2 text-xs bg-gray-950 border border-gray-800 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-400 block mb-1">GitHub URL</label>
                    <input
                      type="text"
                      value={siteConfig.footer.githubUrl}
                      onChange={(e) => updateSiteConfig({ footer: { ...siteConfig.footer, githubUrl: e.target.value } })}
                      className="w-full px-3 py-2 text-xs bg-gray-950 border border-gray-800 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-400 block mb-1">Discord Invite URL</label>
                    <input
                      type="text"
                      value={siteConfig.footer.discordUrl}
                      onChange={(e) => updateSiteConfig({ footer: { ...siteConfig.footer, discordUrl: e.target.value } })}
                      className="w-full px-3 py-2 text-xs bg-gray-950 border border-gray-800 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: CUSTOM CSS */}
          {activeSection === 'css' && (
            <div className="p-6 bg-gray-900/90 border border-gray-800 rounded-2xl space-y-5 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-green-400" />
                  Custom Live CSS Injector
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Inject raw CSS rules directly into the site head. Changes apply live to all site visitors.
                </p>
              </div>

              <div>
                <textarea
                  rows={12}
                  value={siteConfig.customCss}
                  onChange={(e) => updateSiteConfig({ customCss: e.target.value })}
                  placeholder="/* Enter custom CSS rules here */"
                  className="w-full p-4 text-xs font-mono bg-gray-950 border border-gray-800 rounded-xl text-green-400 focus:border-green-500 leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>

        {/* Live Interactive Preview Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between p-3.5 bg-gray-900 border border-gray-800 rounded-2xl">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-white">Live Realtime Preview</span>
            </div>

            <div className="flex items-center gap-1 bg-gray-950 p-1 rounded-xl border border-gray-800">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`px-2.5 py-1 text-xs rounded-lg flex items-center gap-1.5 transition-all ${
                  previewDevice === 'desktop' ? 'bg-blue-600 text-white font-semibold' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                Desktop
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`px-2.5 py-1 text-xs rounded-lg flex items-center gap-1.5 transition-all ${
                  previewDevice === 'mobile' ? 'bg-blue-600 text-white font-semibold' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Mobile
              </button>
            </div>
          </div>

          {/* Interactive Preview Canvas Frame */}
          <div
            className={`mx-auto transition-all duration-300 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl ${
              previewDevice === 'mobile' ? 'max-w-[340px] h-[580px]' : 'w-full h-[580px]'
            }`}
            style={{
              backgroundColor: siteConfig.theme.backgroundColor,
              color: siteConfig.theme.textColor,
              fontFamily: siteConfig.theme.fontFamily
            }}
          >
            {/* Top Mock Browser Frame Header */}
            <div className="px-4 py-2.5 bg-gray-950/90 border-b border-gray-800/80 flex items-center justify-between text-[11px] text-gray-400 select-none">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="px-3 py-0.5 rounded-md bg-gray-900 border border-gray-800 text-gray-300 font-mono text-[10px]">
                https://eternals.studio
              </div>
              <div className="text-gray-500">Preview Mode</div>
            </div>

            {/* Inner Live Page Preview Scroll Container */}
            <div className="h-[calc(100%-37px)] overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-800">
              {/* Top Banner Preview */}
              {siteConfig.branding.showAnnouncementBar && (
                <div 
                  className="p-2 text-center text-[10px] font-medium rounded-lg shadow-sm flex items-center justify-center gap-1"
                  style={{
                    backgroundColor: siteConfig.theme.primaryColor,
                    color: '#ffffff'
                  }}
                >
                  <span>{siteConfig.branding.announcementBarText}</span>
                </div>
              )}

              {/* Navbar Preview */}
              <div 
                className="flex items-center justify-between p-3 rounded-xl border"
                style={{
                  backgroundColor: siteConfig.theme.cardBgColor,
                  borderColor: 'rgba(255,255,255,0.1)'
                }}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: siteConfig.theme.primaryColor }}
                  >
                    E
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-none">{siteConfig.branding.siteName}</div>
                    <div className="text-[9px] text-gray-400">{siteConfig.branding.logoSubtitle}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-gray-300">
                  <span>Store</span>
                  <span>Portfolio</span>
                  <span className="px-2 py-0.5 rounded text-white font-medium" style={{ backgroundColor: siteConfig.theme.primaryColor }}>
                    Client
                  </span>
                </div>
              </div>

              {/* Hero Section Preview */}
              {siteConfig.hero.showHero && (
                <div className="py-6 text-center space-y-3">
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-[10px] font-medium border"
                    style={{
                      borderColor: siteConfig.theme.primaryColor,
                      color: siteConfig.theme.primaryColor,
                      backgroundColor: `${siteConfig.theme.primaryColor}15`
                    }}
                  >
                    {siteConfig.hero.badgeText}
                  </span>

                  <h3 className="text-xl font-extrabold leading-tight">
                    {siteConfig.hero.titleLine1}{' '}
                    <span style={{ color: siteConfig.theme.primaryColor }}>
                      {siteConfig.hero.titleLine2Highlight}
                    </span>
                  </h3>

                  <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
                    {siteConfig.hero.description}
                  </p>

                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button 
                      className="px-3.5 py-1.5 text-xs font-semibold text-white shadow-md transition-all"
                      style={{
                        backgroundColor: siteConfig.theme.primaryColor,
                        borderRadius: siteConfig.theme.borderRadius
                      }}
                    >
                      {siteConfig.hero.primaryCtaText}
                    </button>
                    <button 
                      className="px-3.5 py-1.5 text-xs font-medium border border-gray-700 text-gray-300"
                      style={{ borderRadius: siteConfig.theme.borderRadius }}
                    >
                      {siteConfig.hero.secondaryCtaText}
                    </button>
                  </div>
                </div>
              )}

              {/* Active Home Sections Preview */}
              {siteConfig.homeSections.showStoreGrid && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold text-gray-300 flex items-center justify-between">
                    <span>Digital Assets Grid</span>
                    <span className="text-[10px]" style={{ color: siteConfig.theme.primaryColor }}>Browse Store &rarr;</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2].map((i) => (
                      <div 
                        key={i} 
                        className="p-2.5 rounded-xl border space-y-1.5"
                        style={{
                          backgroundColor: siteConfig.theme.cardBgColor,
                          borderColor: 'rgba(255,255,255,0.08)'
                        }}
                      >
                        <div className="h-14 bg-gray-900/80 rounded-lg flex items-center justify-center text-[10px] text-gray-500">
                          Asset Pack {i}
                        </div>
                        <div className="text-[10px] font-semibold">3D Render Overlay #{i}</div>
                        <div className="text-[9px] font-bold" style={{ color: siteConfig.theme.primaryColor }}>$49.99</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Banner Preview */}
              {siteConfig.homeSections.showCtaBanner && (
                <div 
                  className="p-4 rounded-xl text-center space-y-2 border shadow-lg"
                  style={{
                    backgroundColor: siteConfig.theme.cardBgColor,
                    borderColor: siteConfig.theme.primaryColor
                  }}
                >
                  <div className="text-xs font-bold">{siteConfig.homeSections.ctaBannerTitle}</div>
                  <div className="text-[10px] text-gray-400">{siteConfig.homeSections.ctaBannerDescription}</div>
                  <button 
                    className="px-3 py-1 text-[10px] font-semibold text-white rounded-lg"
                    style={{ backgroundColor: siteConfig.theme.primaryColor }}
                  >
                    {siteConfig.homeSections.ctaBannerButtonText}
                  </button>
                </div>
              )}

              {/* Footer Preview */}
              <div className="pt-4 border-t border-gray-800 text-center text-[10px] text-gray-400 space-y-1">
                <div>{siteConfig.footer.copyrightText}</div>
                <div className="text-[9px] text-gray-500">{siteConfig.footer.description}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
