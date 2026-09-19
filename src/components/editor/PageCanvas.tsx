'use client';

import React from 'react';
import Link from 'next/link';
import { useSiteContent, DEFAULT_PAGE_SECTIONS, CustomSectionBlock } from '../../context/SiteContentContext';
import SectionWrapper from './SectionWrapper';
import EditableText from '../EditableText';
import EditableImage from '../EditableImage';
import { 
  ArrowRight, 
  Terminal, 
  Palette, 
  Box, 
  Video, 
  Sparkles, 
  Star, 
  Zap, 
  Laptop, 
  ShoppingBag, 
  Award, 
  Smile, 
  Globe, 
  Mail, 
  Phone, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  Layers,
  Plus,
  Trash2
} from 'lucide-react';
import { ViewportMode } from './EditorTopBar';

interface PageCanvasProps {
  activePage: string;
  viewport: ViewportMode;
  zoom: number;
  isPreviewMode: boolean;
  selectedSectionId: string | null;
  onSelectSection: (sectionId: string) => void;
  onOpenAddSectionAfter: (index: number) => void;
}

export default function PageCanvas({
  activePage,
  viewport,
  zoom,
  isPreviewMode,
  selectedSectionId,
  onSelectSection,
  onOpenAddSectionAfter
}: PageCanvasProps) {
  const {
    siteContent,
    updateSiteContent,
    updateStat,
    addStat,
    deleteStat,
    updateTeamMember,
    addTeamMember,
    deleteTeamMember,
    updatePromoBanner,
    addPromoBanner,
    deletePromoBanner,
    updateReview,
    addReview,
    deleteReview,
    updateServiceItem,
    addServiceItem,
    deleteServiceItem,
    moveSection,
    deleteSection,
    duplicateSection
  } = useSiteContent();

  const sectionOrder = siteContent.pageSectionOrder?.[activePage] || DEFAULT_PAGE_SECTIONS[activePage] || [];
  const hiddenSections = siteContent.hiddenSections?.[activePage] || [];
  const activeSections = sectionOrder.filter((id) => !hiddenSections.includes(id));
  const customBlocks: CustomSectionBlock[] = (siteContent.customSections as any)?.[activePage] || [];

  // Services presets fallback
  const servicesList = siteContent.servicesPage?.items && siteContent.servicesPage.items.length > 0
    ? siteContent.servicesPage.items
    : [
        { id: 'svc-1', title: 'Web Development', desc: 'Custom React & Next.js applications, headless CMS, and fast web apps.', icon: 'Terminal', color: 'from-cyan-400 to-teal-500' },
        { id: 'svc-2', title: 'Graphic Design', desc: 'Stunning visual identities, esports graphics, team branding kits.', icon: 'Palette', color: 'from-purple-400 to-indigo-500' },
        { id: 'svc-3', title: '3D Modeling', desc: 'Detailed 3D product renders, spatial visualizations, character modeling.', icon: 'Box', color: 'from-pink-400 to-rose-500' },
        { id: 'svc-4', title: 'Motion Graphics', desc: 'Dynamic animation sequences, video trailers, streaming transitions.', icon: 'Video', color: 'from-amber-400 to-orange-500' },
      ];

  const getServiceIcon = (name?: string) => {
    switch (name) {
      case 'Palette': return <Palette size={22} />;
      case 'Box': return <Box size={22} />;
      case 'Video': return <Video size={22} />;
      case 'Terminal':
      default: return <Terminal size={22} />;
    }
  };

  // Process timeline presets
  const processSteps = [
    { num: '01', name: 'Discovery', desc: 'Understanding your vision, business goals, and defining specific requirements.' },
    { num: '02', name: 'Strategy', desc: 'Detailing information architectures, choosing technical stacks, and sketching layouts.' },
    { num: '03', name: 'Design', desc: 'Crafting premium brand aesthetics, high-fidelity UI/UX mockups, and glowing layouts.' },
    { num: '04', name: 'Build', desc: 'Writing clean, optimized, semantic source code and conducting rigorous unit testing.' },
    { num: '05', name: 'Launch', desc: 'Deploying pages to CDN-backed static hosts, performing SEO configurations, and hand-off.' },
  ];

  // Industries presets
  const industries = [
    { name: 'Esports Organizations', desc: 'Team rosters, overlays, jerseys, and gaming brand identities.', icon: <Zap size={20} /> },
    { name: 'SaaS Platforms', desc: 'Conversion-focused landing interfaces and responsive admin layout suites.', icon: <Laptop size={20} /> },
    { name: 'E-Commerce Brands', desc: 'Custom storefront builds integrated with Stripe checkout flows.', icon: <ShoppingBag size={20} /> },
    { name: 'Content Creators', desc: 'Monograms, custom Twitch overlays, and promotional visual elements.', icon: <Globe size={20} /> },
  ];

  // Mock projects for portfolio
  const portfolioProjects = [
    { title: 'Apex Predator Overlays', category: 'Esports', desc: 'Complete stream graphics overhaul matching Apex Legends predator tier.', tags: ['Stream Assets', 'After Effects'] },
    { title: 'Hyper Wallpaper', category: 'Illustration', desc: 'A custom vector art wallpaper for competitive gaming players.', tags: ['Vector Art', 'Desktop'] },
    { title: 'Midas Networks', category: 'Branding', desc: 'Corporate identity and custom logo kit for esports telecom provider.', tags: ['Branding', 'Vector'] },
  ];

  // Mock products for store
  const storeProducts = [
    { title: '3D Cyber Armor Model Pack', price: '$49.99', category: '3D Assets', desc: '4K PBR textured sci-fi armor assets for Blender and Unreal Engine.' },
    { title: 'Esports Stream Overlay Bundle', price: '$29.99', category: 'Graphics', desc: 'Full Twitch and YouTube broadcast pack with animated transitions.' },
    { title: 'Next.js Dark Studio Template', price: '$69.99', category: 'Web App', desc: 'Production-ready Tailwind and Next.js portfolio website codebase.' },
  ];

  // Section render dispatcher
  const renderSectionContent = (secId: string) => {
    // Check if it's a user-added custom block
    const customBlock = customBlocks.find((c) => c.id === secId);
    if (customBlock) {
      return renderCustomBlock(customBlock);
    }

    switch (secId) {
      // MAIN PAGE SECTIONS
      case 'announcement':
        return (
          <div className="bg-gradient-to-r from-teal-500/20 via-indigo-500/20 to-teal-500/20 border-b border-teal-500/30 px-4 py-2 text-center text-xs font-bold text-teal-300">
            <EditableText
              value={siteContent.branding.announcementBarText}
              label="Announcement Bar Message"
              editable={!isPreviewMode}
              onChange={(val) => updateSiteContent({ branding: { ...siteContent.branding, announcementBarText: val } })}
            />
          </div>
        );

      case 'hero':
        return (
          <section className="mx-auto max-w-6xl text-center flex flex-col items-center gap-6 py-12 md:py-20 px-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <EditableText
                value={siteContent.hero.badgeText}
                label="Hero Badge Text"
                editable={!isPreviewMode}
                onChange={(val) => updateSiteContent({ hero: { ...siteContent.hero, badgeText: val } })}
              />
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl text-white">
              <EditableText
                value={siteContent.hero.titleLine1}
                label="Hero Title Line 1"
                editable={!isPreviewMode}
                onChange={(val) => updateSiteContent({ hero: { ...siteContent.hero, titleLine1: val } })}
              /> <br />
              <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-indigo-500 bg-clip-text text-transparent">
                <EditableText
                  value={siteContent.hero.titleHighlight}
                  label="Hero Highlighted Text"
                  editable={!isPreviewMode}
                  onChange={(val) => updateSiteContent({ hero: { ...siteContent.hero, titleHighlight: val } })}
                />
              </span>
            </h1>
            <p className="text-base sm:text-lg font-medium text-slate-400 max-w-2xl leading-relaxed">
              <EditableText
                value={siteContent.hero.description}
                label="Hero Subtitle Description"
                multiline
                editable={!isPreviewMode}
                onChange={(val) => updateSiteContent({ hero: { ...siteContent.hero, description: val } })}
              />
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
              <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-indigo-500 text-white font-bold px-6 py-3.5 shadow-lg shadow-teal-500/20">
                <EditableText
                  value={siteContent.hero.primaryCtaText}
                  label="Primary CTA Button"
                  editable={!isPreviewMode}
                  onChange={(val) => updateSiteContent({ hero: { ...siteContent.hero, primaryCtaText: val } })}
                />
                <ArrowRight size={16} />
              </div>
              <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 font-bold px-6 py-3.5 text-slate-300">
                <EditableText
                  value={siteContent.hero.secondaryCtaText}
                  label="Secondary CTA Button"
                  editable={!isPreviewMode}
                  onChange={(val) => updateSiteContent({ hero: { ...siteContent.hero, secondaryCtaText: val } })}
                />
              </div>
            </div>
            {/* Feature Showcase Banner */}
            <div className="w-full max-w-4xl mt-6">
              <EditableImage
                src={siteContent.hero.bannerImageUrl || '/eternals-logo.jpg'}
                alt="Hero Showcase Banner"
                label="Hero Showcase Banner"
                editable={!isPreviewMode}
                placeholderText="Click to set a Hero Showcase Banner Image"
                onChange={(url) => updateSiteContent({ hero: { ...siteContent.hero, bannerImageUrl: url } })}
                className="w-full max-h-80 object-cover rounded-3xl border border-slate-800 shadow-2xl"
              />
            </div>
          </section>
        );

      case 'banners':
        return (
          <section className="mx-auto max-w-6xl py-8 px-6 space-y-6">
            {(siteContent.promoBanners || []).map((banner) => (
              <div
                key={banner.id}
                className="group/banner relative p-8 rounded-3xl bg-gradient-to-r from-teal-500/15 via-indigo-500/15 to-purple-500/15 border border-teal-500/25 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 text-left"
              >
                {!isPreviewMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete promo banner "${banner.title}"?`)) {
                        deletePromoBanner(banner.id);
                      }
                    }}
                    className="absolute top-4 right-4 opacity-0 group-hover/banner:opacity-100 p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer shadow-md"
                    title="Delete Promo Banner"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                <div className="space-y-3 max-w-xl">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-teal-500/20 text-teal-400 border border-teal-500/30">
                    <Sparkles size={12} />
                    <EditableText
                      value={banner.badge || 'Featured Showcase'}
                      label="Banner Badge"
                      editable={!isPreviewMode}
                      onChange={(val) => updatePromoBanner(banner.id, { badge: val })}
                    />
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    <EditableText
                      value={banner.title}
                      label="Banner Title"
                      editable={!isPreviewMode}
                      onChange={(val) => updatePromoBanner(banner.id, { title: val })}
                    />
                  </h3>
                  <p className="text-sm font-medium text-slate-400 leading-relaxed">
                    <EditableText
                      value={banner.subtitle}
                      label="Banner Subtitle"
                      multiline
                      editable={!isPreviewMode}
                      onChange={(val) => updatePromoBanner(banner.id, { subtitle: val })}
                    />
                  </p>
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-teal-400 to-indigo-500 rounded-xl shadow-md">
                    <EditableText
                      value={banner.buttonText || 'Explore Portfolio'}
                      label="Banner Button Text"
                      editable={!isPreviewMode}
                      onChange={(val) => updatePromoBanner(banner.id, { buttonText: val })}
                    />
                    <ArrowRight size={13} />
                  </div>
                </div>
                <div className="w-full md:w-72 h-44 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex-shrink-0">
                  <EditableImage
                    src={banner.imageUrl || '/eternals-logo.jpg'}
                    alt={banner.title}
                    label="Promo Banner Image"
                    editable={!isPreviewMode}
                    onChange={(url) => updatePromoBanner(banner.id, { imageUrl: url })}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}

            {!isPreviewMode && (
              <button
                onClick={() => addPromoBanner({
                  title: 'New Featured Promo Bundle',
                  subtitle: 'Highlight your custom digital assets or motion graphics.',
                  badge: 'Special Feature',
                  imageUrl: '/eternals-logo.jpg',
                  bgGradient: 'from-teal-500/20 via-indigo-500/20 to-purple-500/20',
                  buttonText: 'View Details',
                  buttonLink: '/portfolio',
                  enabled: true
                })}
                className="w-full py-4 border-2 border-dashed border-slate-800 hover:border-teal-500/50 hover:bg-teal-500/5 rounded-3xl flex items-center justify-center gap-2 text-slate-400 hover:text-teal-400 font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Promo Banner</span>
              </button>
            )}
          </section>
        );

      case 'stats':
        return (
          <section className="mx-auto max-w-6xl py-12 px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {(siteContent.stats || []).map((stat) => (
                <div
                  key={stat.id}
                  className="group/stat relative bg-slate-900/80 border border-slate-800/80 hover:border-teal-500/40 backdrop-blur-md rounded-2xl p-6 text-center shadow-lg transition-all"
                >
                  {!isPreviewMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete metric "${stat.label}"?`)) {
                          deleteStat(stat.id);
                        }
                      }}
                      className="absolute top-2 right-2 opacity-0 group-hover/stat:opacity-100 p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer"
                      title="Delete this metric"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                  <h3 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">
                    <EditableText
                      value={stat.value}
                      label="Metric Number"
                      editable={!isPreviewMode}
                      onChange={(val) => updateStat(stat.id, { value: val })}
                    />
                  </h3>
                  <p className="text-xs font-bold text-slate-400 mt-2">
                    <EditableText
                      value={stat.label}
                      label="Metric Label"
                      editable={!isPreviewMode}
                      onChange={(val) => updateStat(stat.id, { label: val })}
                    />
                  </p>
                </div>
              ))}

              {!isPreviewMode && (
                <button
                  onClick={() => addStat({ value: '100+', label: 'New Metric' })}
                  className="border-2 border-dashed border-slate-800 hover:border-teal-500/50 hover:bg-teal-500/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-teal-400 transition-all cursor-pointer group/add"
                >
                  <Plus size={22} className="group-hover/add:scale-110 transition-transform" />
                  <span className="text-xs font-bold">Add Metric</span>
                </button>
              )}
            </div>
          </section>
        );

      case 'services':
        return (
          <section className="mx-auto max-w-6xl py-12 px-6 flex flex-col gap-10">
            <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
              <h2 className="text-3xl font-black text-white tracking-tight">
                <EditableText
                  value={siteContent.servicesPage.headerTitle || 'Our Services'}
                  label="Services Section Title"
                  editable={!isPreviewMode}
                  onChange={(val) => updateSiteContent({ servicesPage: { ...siteContent.servicesPage, headerTitle: val } })}
                />
              </h2>
              <p className="text-sm font-medium text-slate-400">
                <EditableText
                  value={siteContent.servicesPage.headerSubtitle || 'From concept to launch, we offer comprehensive creative solutions.'}
                  label="Services Section Subtitle"
                  multiline
                  editable={!isPreviewMode}
                  onChange={(val) => updateSiteContent({ servicesPage: { ...siteContent.servicesPage, headerSubtitle: val } })}
                />
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {servicesList.map((svc) => (
                <div
                  key={svc.id}
                  className="group/svc relative bg-slate-900/80 border border-slate-800/80 hover:border-teal-500/40 rounded-2xl p-6 flex flex-col gap-4 text-left shadow-lg transition-all"
                >
                  {!isPreviewMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete service "${svc.title}"?`)) {
                          deleteServiceItem(svc.id);
                        }
                      }}
                      className="absolute top-3 right-3 opacity-0 group-hover/svc:opacity-100 p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer"
                      title="Delete Service"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${svc.color || 'from-cyan-400 to-teal-500'} text-white shadow-md`}>
                    {getServiceIcon(svc.icon)}
                  </div>
                  <h3 className="font-extrabold text-base text-white">
                    <EditableText
                      value={svc.title}
                      label="Service Title"
                      editable={!isPreviewMode}
                      onChange={(val) => updateServiceItem(svc.id, { title: val })}
                    />
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-400">
                    <EditableText
                      value={svc.desc}
                      label="Service Description"
                      multiline
                      editable={!isPreviewMode}
                      onChange={(val) => updateServiceItem(svc.id, { desc: val })}
                    />
                  </p>
                </div>
              ))}

              {!isPreviewMode && (
                <button
                  onClick={() => addServiceItem({
                    title: 'New Service',
                    desc: 'Custom creative deliverable tailored to client specifications.',
                    icon: 'Terminal',
                    color: 'from-cyan-400 to-teal-500'
                  })}
                  className="border-2 border-dashed border-slate-800 hover:border-teal-500/50 hover:bg-teal-500/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-teal-400 transition-all cursor-pointer group/add"
                >
                  <Plus size={22} className="group-hover/add:scale-110 transition-transform" />
                  <span className="text-xs font-bold">Add Service</span>
                </button>
              )}
            </div>
          </section>
        );

      case 'reviews':
        return (
          <section className="mx-auto max-w-6xl py-12 px-6 flex flex-col gap-8">
            <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
              <span className="self-center px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
                ⭐ Verified Reviews
              </span>
              <h2 className="text-3xl font-black text-white">
                <EditableText
                  value={siteContent.sections?.reviewsTitle || 'Trusted by Creators & Organizations'}
                  label="Reviews Section Title"
                  editable={!isPreviewMode}
                  onChange={(val) => updateSiteContent({ sections: { ...siteContent.sections, reviewsTitle: val } })}
                />
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(siteContent.reviews || []).map((rev) => (
                <div key={rev.id} className="group/rev relative bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 rounded-2xl p-5 flex flex-col justify-between gap-4 text-left shadow-lg transition-all">
                  {!isPreviewMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete review from "${rev.author}"?`)) {
                          deleteReview(rev.id);
                        }
                      }}
                      className="absolute top-3 right-3 opacity-0 group-hover/rev:opacity-100 p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer"
                      title="Delete Review"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                  <div className="space-y-2">
                    <div className="flex gap-0.5 text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} size={14} className="fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-300 italic leading-relaxed">
                      &quot;<EditableText
                        value={rev.content}
                        label="Review Content"
                        multiline
                        editable={!isPreviewMode}
                        onChange={(val) => updateReview(rev.id, { content: val })}
                      />&quot;
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                      {rev.author.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs text-white truncate">
                        <EditableText
                          value={rev.author}
                          label="Author Name"
                          editable={!isPreviewMode}
                          onChange={(val) => updateReview(rev.id, { author: val })}
                        />
                      </div>
                      <div className="text-[10px] text-teal-400 truncate">
                        <EditableText
                          value={rev.company}
                          label="Company / Handle"
                          editable={!isPreviewMode}
                          onChange={(val) => updateReview(rev.id, { company: val })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {!isPreviewMode && (
                <button
                  onClick={() => addReview({
                    author: 'Happy Creator',
                    role: 'Creative Director',
                    company: 'Studio X',
                    rating: 5,
                    content: 'Incredible turnaround time and elite quality.'
                  })}
                  className="border-2 border-dashed border-slate-800 hover:border-teal-500/50 hover:bg-teal-500/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-teal-400 transition-all cursor-pointer group/add"
                >
                  <Plus size={22} className="group-hover/add:scale-110 transition-transform" />
                  <span className="text-xs font-bold">Add Review</span>
                </button>
              )}
            </div>
          </section>
        );

      case 'cta':
        return (
          <section className="mx-auto max-w-6xl py-10 px-6">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-teal-500/20 via-indigo-500/20 to-purple-500/20 border border-teal-500/30 text-center space-y-4 shadow-xl">
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                <EditableText
                  value={siteContent.sections.ctaBannerTitle}
                  label="CTA Headline"
                  editable={!isPreviewMode}
                  onChange={(val) => updateSiteContent({ sections: { ...siteContent.sections, ctaBannerTitle: val } })}
                />
              </h2>
              <p className="text-sm font-medium text-slate-400 max-w-xl mx-auto leading-relaxed">
                <EditableText
                  value={siteContent.sections.ctaBannerDescription}
                  label="CTA Description"
                  multiline
                  editable={!isPreviewMode}
                  onChange={(val) => updateSiteContent({ sections: { ...siteContent.sections, ctaBannerDescription: val } })}
                />
              </p>
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-extrabold text-white bg-gradient-to-r from-teal-400 to-indigo-500 rounded-xl shadow-lg shadow-teal-500/20">
                  <EditableText
                    value={siteContent.sections.ctaBannerButtonText}
                    label="CTA Button Text"
                    editable={!isPreviewMode}
                    onChange={(val) => updateSiteContent({ sections: { ...siteContent.sections, ctaBannerButtonText: val } })}
                  />
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </section>
        );

      // SERVICES SPECIFIC
      case 'header':
        return (
          <section className="mx-auto max-w-5xl py-12 px-6 text-center space-y-3">
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              <EditableText
                value={
                  activePage === 'about'
                    ? siteContent.aboutPage.headerTitle
                    : activePage === 'services'
                      ? siteContent.servicesPage.headerTitle
                      : activePage === 'contact'
                        ? 'Get In Touch'
                        : `${activePage.charAt(0).toUpperCase() + activePage.slice(1)} Showcase`
                }
                label="Page Header Title"
                editable={!isPreviewMode}
                onChange={(val) => {
                  if (activePage === 'about') updateSiteContent({ aboutPage: { ...siteContent.aboutPage, headerTitle: val } });
                  else if (activePage === 'services') updateSiteContent({ servicesPage: { ...siteContent.servicesPage, headerTitle: val } });
                }}
              />
            </h1>
            <p className="text-base text-slate-400 max-w-xl mx-auto">
              <EditableText
                value={
                  activePage === 'about'
                    ? siteContent.aboutPage.headerSubtitle
                    : activePage === 'services'
                      ? siteContent.servicesPage.headerSubtitle
                      : 'High-performance creative and digital deliverables for clients worldwide.'
                }
                label="Page Header Subtitle"
                multiline
                editable={!isPreviewMode}
                onChange={(val) => {
                  if (activePage === 'about') updateSiteContent({ aboutPage: { ...siteContent.aboutPage, headerSubtitle: val } });
                  else if (activePage === 'services') updateSiteContent({ servicesPage: { ...siteContent.servicesPage, headerSubtitle: val } });
                }}
              />
            </p>
          </section>
        );

      case 'process':
        return (
          <section className="mx-auto max-w-6xl py-10 px-6 flex flex-col gap-8">
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-2xl font-black text-white">Our 5-Step Process</h2>
              <p className="text-xs text-slate-400 mt-1">From raw concepts to production deployment.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {processSteps.map((s, i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-2.5 text-left">
                  <span className="text-xl font-black text-teal-400 font-mono">{s.num}</span>
                  <h4 className="font-extrabold text-sm text-white">
                    <EditableText
                      value={s.name}
                      label={`Step ${s.num} Title`}
                      editable={!isPreviewMode}
                      onChange={(val) => { s.name = val; }}
                    />
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    <EditableText
                      value={s.desc}
                      label={`Step ${s.num} Description`}
                      multiline
                      editable={!isPreviewMode}
                      onChange={(val) => { s.desc = val; }}
                    />
                  </p>
                </div>
              ))}
            </div>
          </section>
        );

      case 'industries':
        return (
          <section className="mx-auto max-w-6xl py-10 px-6 flex flex-col gap-6">
            <h2 className="text-2xl font-black text-white text-center">Industries We Specialize In</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {industries.map((ind, i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-2 text-left">
                  <div className="h-9 w-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                    {ind.icon}
                  </div>
                  <h4 className="font-extrabold text-sm text-white">
                    <EditableText
                      value={ind.name}
                      label="Industry Name"
                      editable={!isPreviewMode}
                      onChange={(val) => { ind.name = val; }}
                    />
                  </h4>
                  <p className="text-xs text-slate-400">
                    <EditableText
                      value={ind.desc}
                      label="Industry Description"
                      multiline
                      editable={!isPreviewMode}
                      onChange={(val) => { ind.desc = val; }}
                    />
                  </p>
                </div>
              ))}
            </div>
          </section>
        );

      // PORTFOLIO SPECIFIC
      case 'projects':
        return (
          <section className="mx-auto max-w-6xl py-10 px-6 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {portfolioProjects.map((proj, i) => (
                <div key={i} className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col text-left">
                  <div className="h-44 bg-gradient-to-tr from-slate-800 to-slate-950 flex items-center justify-center p-4">
                    <Sparkles size={32} className="text-teal-400" />
                  </div>
                  <div className="p-5 flex flex-col gap-2">
                    <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                      <EditableText
                        value={proj.category}
                        label="Project Category"
                        editable={!isPreviewMode}
                        onChange={(val) => { proj.category = val; }}
                      />
                    </span>
                    <h3 className="font-extrabold text-lg text-white">
                      <EditableText
                        value={proj.title}
                        label="Project Title"
                        editable={!isPreviewMode}
                        onChange={(val) => { proj.title = val; }}
                      />
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      <EditableText
                        value={proj.desc}
                        label="Project Description"
                        multiline
                        editable={!isPreviewMode}
                        onChange={(val) => { proj.desc = val; }}
                      />
                    </p>
                    <div className="flex gap-1.5 pt-2 flex-wrap">
                      {proj.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] font-medium bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      // STORE SPECIFIC
      case 'catalog':
        return (
          <section className="mx-auto max-w-6xl py-10 px-6 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {storeProducts.map((prod, i) => (
                <div key={i} className="rounded-3xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between gap-4 text-left shadow-xl">
                  <div className="h-40 rounded-2xl bg-gradient-to-tr from-teal-500/10 to-indigo-500/10 border border-teal-500/20 flex items-center justify-center">
                    <ShoppingBag size={36} className="text-teal-400" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400">{prod.category}</span>
                      <span className="text-sm font-black text-teal-400 font-mono">{prod.price}</span>
                    </div>
                    <h3 className="font-extrabold text-base text-white">
                      <EditableText
                        value={prod.title}
                        label="Product Name"
                        editable={!isPreviewMode}
                        onChange={(val) => { prod.title = val; }}
                      />
                    </h3>
                    <p className="text-xs text-slate-400">
                      <EditableText
                        value={prod.desc}
                        label="Product Description"
                        multiline
                        editable={!isPreviewMode}
                        onChange={(val) => { prod.desc = val; }}
                      />
                    </p>
                  </div>
                  <div className="w-full py-2.5 rounded-xl bg-teal-500 text-white font-bold text-xs text-center shadow-md">
                    Instant Download
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      // ABOUT SPECIFIC
      case 'story':
        return (
          <section className="mx-auto max-w-4xl py-12 px-6 text-left space-y-4">
            <h2 className="text-3xl font-black text-white">
              <EditableText
                value={siteContent.aboutPage.storyTitle || 'Our Mission'}
                label="Mission Section Title"
                editable={!isPreviewMode}
                onChange={(val) => updateSiteContent({ aboutPage: { ...siteContent.aboutPage, storyTitle: val } })}
              />
            </h2>
            <div className="text-sm text-slate-300 leading-relaxed space-y-3 font-medium">
              <EditableText
                value={siteContent.aboutPage.storyContent}
                label="Mission Story Content"
                multiline
                editable={!isPreviewMode}
                onChange={(val) => updateSiteContent({ aboutPage: { ...siteContent.aboutPage, storyContent: val } })}
              />
            </div>
          </section>
        );

      case 'vision':
        return (
          <section className="mx-auto max-w-4xl py-10 px-6 text-left space-y-3 bg-slate-900/60 p-8 rounded-3xl border border-slate-800">
            <h3 className="text-2xl font-black text-teal-400">
              <EditableText
                value={siteContent.aboutPage.visionTitle || 'Our Core Vision'}
                label="Core Vision Title"
                editable={!isPreviewMode}
                onChange={(val) => updateSiteContent({ aboutPage: { ...siteContent.aboutPage, visionTitle: val } })}
              />
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              <EditableText
                value={siteContent.aboutPage.visionContent}
                label="Core Vision Description"
                multiline
                editable={!isPreviewMode}
                onChange={(val) => updateSiteContent({ aboutPage: { ...siteContent.aboutPage, visionContent: val } })}
              />
            </p>
          </section>
        );

      case 'team':
        return (
          <section className="mx-auto max-w-6xl py-12 px-6 flex flex-col gap-8">
            <h2 className="text-3xl font-black text-white text-center">
              <EditableText
                value={siteContent.sections?.teamTitle || 'Meet the Creative Collective'}
                label="Team Section Heading"
                editable={!isPreviewMode}
                onChange={(val) => updateSiteContent({ sections: { ...siteContent.sections, teamTitle: val } })}
              />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(siteContent.team || []).map((m) => (
                <div key={m.id} className="group/member relative p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 flex flex-col gap-4 text-left shadow-xl transition-all">
                  {!isPreviewMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Remove ${m.name} from team?`)) {
                          deleteTeamMember(m.id);
                        }
                      }}
                      className="absolute top-4 right-4 opacity-0 group-hover/member:opacity-100 p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer"
                      title="Remove team member"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                  <div className="flex items-center gap-3">
                    {m.avatarUrl ? (
                      <div className="h-14 w-14 rounded-2xl overflow-hidden shadow-md flex-shrink-0 border border-slate-700">
                        <EditableImage
                          src={m.avatarUrl}
                          alt={m.name}
                          label={`${m.name} Avatar`}
                          editable={!isPreviewMode}
                          onChange={(url) => updateTeamMember(m.id, { avatarUrl: url })}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div 
                        onClick={() => {
                          const newInitial = window.prompt('Enter avatar initial letter:', m.initial) || m.initial;
                          const newColor = window.prompt('Enter Tailwind color class (e.g. bg-teal-500, bg-indigo-500, bg-pink-500):', m.color) || m.color;
                          updateTeamMember(m.id, { initial: newInitial, color: newColor });
                        }}
                        className={`h-14 w-14 rounded-2xl ${m.color || 'bg-teal-500'} text-white font-black text-xl flex items-center justify-center shadow-lg flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity`}
                        title="Click to change initial or color badge"
                      >
                        {m.initial}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-black text-base text-white">
                        <EditableText
                          value={m.name}
                          label="Team Member Name"
                          editable={!isPreviewMode}
                          onChange={(val) => updateTeamMember(m.id, { name: val })}
                        />
                      </h4>
                      <p className="text-xs text-teal-400 font-bold mt-0.5">
                        <EditableText
                          value={m.role}
                          label="Role Title"
                          editable={!isPreviewMode}
                          onChange={(val) => updateTeamMember(m.id, { role: val })}
                        />
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <EditableText
                      value={m.bio || ''}
                      label="Member Bio / Description"
                      multiline
                      editable={!isPreviewMode}
                      onChange={(val) => updateTeamMember(m.id, { bio: val })}
                    />
                  </p>
                  <div className="flex gap-1.5 flex-wrap pt-2">
                    {(m.specialties || []).map((sp, idx) => (
                      <span key={idx} className="text-[10px] font-bold bg-slate-800/80 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/50">
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {!isPreviewMode && (
                <button
                  onClick={() => addTeamMember({
                    name: 'New Specialist',
                    role: 'Lead Designer',
                    initial: 'N',
                    color: 'bg-teal-500',
                    bio: 'Crafting pixel-perfect interface identities and responsive visual systems.',
                    specialties: ['Design', 'Next.js']
                  })}
                  className="border-2 border-dashed border-slate-800 hover:border-teal-500/50 hover:bg-teal-500/5 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 text-slate-500 hover:text-teal-400 transition-all cursor-pointer min-h-[220px] group/add"
                >
                  <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover/add:text-teal-400 group-hover/add:border-teal-500/40 transition-all shadow-md">
                    <Plus size={24} />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-wider">Add Team Member</span>
                </button>
              )}
            </div>
          </section>
        );

      case 'expertise':
        return (
          <section className="mx-auto max-w-6xl py-10 px-6 flex flex-col gap-6">
            <h2 className="text-2xl font-black text-white text-center">Core Disciplines</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Custom React & Next.js', desc: 'Performance-optimized, interactive applications.' },
                { name: 'UI/UX Visual Prototyping', desc: 'Stunning premium Figma prototypes.' },
                { name: 'Esports Graphics', desc: 'Team monograms, overlays, and stream assets.' },
              ].map((exp, i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-left">
                  <h4 className="font-extrabold text-sm text-teal-400">
                    <EditableText
                      value={exp.name}
                      label="Discipline Name"
                      editable={!isPreviewMode}
                      onChange={(val) => { exp.name = val; }}
                    />
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    <EditableText
                      value={exp.desc}
                      label="Discipline Description"
                      multiline
                      editable={!isPreviewMode}
                      onChange={(val) => { exp.desc = val; }}
                    />
                  </p>
                </div>
              ))}
            </div>
          </section>
        );

      // CONTACT SPECIFIC
      case 'info':
        return (
          <section className="mx-auto max-w-5xl py-10 px-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
              <Mail className="mx-auto text-teal-400 h-6 w-6 mb-2" />
              <div className="text-xs font-bold text-slate-400">Direct Email</div>
              <div className="font-black text-white text-sm">
                <EditableText
                  value={siteContent.contactPage.email}
                  label="Contact Email"
                  editable={!isPreviewMode}
                  onChange={(val) => updateSiteContent({ contactPage: { ...siteContent.contactPage, email: val } })}
                />
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
              <Phone className="mx-auto text-teal-400 h-6 w-6 mb-2" />
              <div className="text-xs font-bold text-slate-400">Studio Phone</div>
              <div className="font-black text-white text-sm">
                <EditableText
                  value={siteContent.contactPage.phone}
                  label="Contact Phone"
                  editable={!isPreviewMode}
                  onChange={(val) => updateSiteContent({ contactPage: { ...siteContent.contactPage, phone: val } })}
                />
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
              <Clock className="mx-auto text-teal-400 h-6 w-6 mb-2" />
              <div className="text-xs font-bold text-slate-400">Response Guarantee</div>
              <div className="font-black text-white text-sm">
                <EditableText
                  value={siteContent.contactPage.responseTimeText}
                  label="Response SLA Guarantee"
                  editable={!isPreviewMode}
                  onChange={(val) => updateSiteContent({ contactPage: { ...siteContent.contactPage, responseTimeText: val } })}
                />
              </div>
            </div>
          </section>
        );

      case 'form':
        return (
          <section className="mx-auto max-w-3xl py-10 px-6">
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-left shadow-2xl">
              <h3 className="text-xl font-black text-white">Interactive Inquiry Form</h3>
              <p className="text-xs text-slate-400">Clients use this form to book services or request custom quotes.</p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="h-10 rounded-xl bg-slate-950 border border-slate-800 px-3 flex items-center text-xs text-slate-500">First Name</div>
                <div className="h-10 rounded-xl bg-slate-950 border border-slate-800 px-3 flex items-center text-xs text-slate-500">Last Name</div>
              </div>
              <div className="h-10 rounded-xl bg-slate-950 border border-slate-800 px-3 flex items-center text-xs text-slate-500">Work Email Address</div>
              <div className="h-24 rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-500">Tell us about your project vision...</div>
              <div className="py-3 px-6 rounded-xl bg-gradient-to-r from-teal-400 to-indigo-500 text-white font-extrabold text-xs text-center">
                Send Project Inquiry
              </div>
            </div>
          </section>
        );

      case 'discord':
        return (
          <section className="mx-auto max-w-4xl py-8 px-6">
            <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-slate-900 border border-indigo-500/30 flex items-center justify-between gap-6 text-left">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-black text-indigo-400">Community Hub</span>
                <h3 className="text-xl font-black text-white">
                  <EditableText
                    value="Join the Eternals Discord"
                    label="Discord Banner Title"
                    editable={!isPreviewMode}
                    onChange={(val) => {}}
                  />
                </h3>
                <p className="text-xs text-slate-300">
                  <EditableText
                    value="Live chat with designers, project status updates, and esports assets."
                    label="Discord Description"
                    multiline
                    editable={!isPreviewMode}
                    onChange={(val) => {}}
                  />
                </p>
              </div>
              <div className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md whitespace-nowrap">
                Join Server
              </div>
            </div>
          </section>
        );

      default:
        return (
          <div className="p-10 rounded-2xl bg-slate-900/50 border border-dashed border-slate-800 text-center text-slate-500 text-xs">
            Section [{secId}] content block
          </div>
        );
    }
  };

  // Render user-added custom section
  const renderCustomBlock = (block: CustomSectionBlock) => {
    return (
      <section className="mx-auto max-w-5xl py-12 px-6 text-center space-y-4">
        {block.badge && (
          <span className="inline-block px-3 py-1 rounded-full bg-teal-500/15 text-teal-400 text-xs font-bold border border-teal-500/30">
            <EditableText
              value={block.badge}
              label="Custom Block Badge"
              editable={!isPreviewMode}
              onChange={(val) => { block.badge = val; updateSiteContent((prev) => ({ ...prev })); }}
            />
          </span>
        )}
        <h2 className="text-3xl font-black text-white tracking-tight">
          <EditableText
            value={block.title}
            label="Custom Block Title"
            editable={!isPreviewMode}
            onChange={(val) => { block.title = val; updateSiteContent((prev) => ({ ...prev })); }}
          />
        </h2>
        {block.subtitle && (
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            <EditableText
              value={block.subtitle}
              label="Custom Block Subtitle"
              multiline
              editable={!isPreviewMode}
              onChange={(val) => { block.subtitle = val; updateSiteContent((prev) => ({ ...prev })); }}
            />
          </p>
        )}
        {block.content && (
          <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
            <EditableText
              value={block.content}
              label="Custom Block Content"
              multiline
              editable={!isPreviewMode}
              onChange={(val) => { block.content = val; updateSiteContent((prev) => ({ ...prev })); }}
            />
          </p>
        )}

        {block.items && block.items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-left">
            {block.items.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <h4 className="font-extrabold text-sm text-teal-400">
                  <EditableText
                    value={item.title}
                    label="Item Title"
                    editable={!isPreviewMode}
                    onChange={(val) => { item.title = val; updateSiteContent((prev) => ({ ...prev })); }}
                  />
                </h4>
                <p className="text-xs text-slate-400">
                  <EditableText
                    value={item.desc}
                    label="Item Description"
                    multiline
                    editable={!isPreviewMode}
                    onChange={(val) => { item.desc = val; updateSiteContent((prev) => ({ ...prev })); }}
                  />
                </p>
              </div>
            ))}
          </div>
        )}

        {block.buttonText && (
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-indigo-500 text-white text-xs font-bold shadow-lg">
              <EditableText
                value={block.buttonText}
                label="Button Text"
                editable={!isPreviewMode}
                onChange={(val) => { block.buttonText = val; updateSiteContent((prev) => ({ ...prev })); }}
              />
              <ArrowRight size={14} />
            </div>
          </div>
        )}
      </section>
    );
  };

  // Viewport Container Styles
  const getViewportContainerClass = () => {
    if (viewport === 'mobile') {
      return 'max-w-[390px] mx-auto border-8 border-slate-850 rounded-[48px] shadow-2xl bg-slate-950 my-6 overflow-hidden min-h-[780px]';
    }
    if (viewport === 'tablet') {
      return 'max-w-[768px] mx-auto border-4 border-slate-800 rounded-3xl shadow-2xl bg-slate-950 my-6 overflow-hidden min-h-[850px]';
    }
    return 'w-full max-w-full bg-slate-950 min-h-full';
  };

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto relative p-4 sm:p-8 flex flex-col items-center">
      {/* Background Neon Glow Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      {/* Frame Container honoring Viewport & Zoom */}
      <div
        className={`transition-all duration-300 relative text-slate-100 ${getViewportContainerClass()}`}
        style={{
          transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
          transformOrigin: 'top center'
        }}
      >
        {activeSections.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <Layers className="mx-auto text-slate-700 h-16 w-16" />
            <h3 className="text-xl font-bold text-slate-400">This page has no active sections</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Use the "+ Add Section" button in the sidebar or catalog to insert blocks onto this page.
            </p>
          </div>
        ) : (
          activeSections.map((secId, index) => (
            <SectionWrapper
              key={secId}
              sectionId={secId}
              pageId={activePage}
              index={index}
              totalSections={activeSections.length}
              isSelected={selectedSectionId === secId}
              isPreviewMode={isPreviewMode}
              onSelect={() => onSelectSection(secId)}
              onMoveUp={() => moveSection(activePage, secId, 'up')}
              onMoveDown={() => moveSection(activePage, secId, 'down')}
              onDuplicate={() => duplicateSection(activePage, secId)}
              onDelete={() => deleteSection(activePage, secId)}
              onOpenAddSectionAfter={() => onOpenAddSectionAfter(index + 1)}
            >
              {renderSectionContent(secId)}
            </SectionWrapper>
          ))
        )}
      </div>
    </div>
  );
}
