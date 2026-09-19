'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  CMSPage, 
  CMSSection, 
  CMSBlock, 
  PageVersion, 
  CMSNavigation, 
  CMSFooter, 
  GlobalThemeSettings, 
  MediaAsset, 
  CMSAuditEntry 
} from '@/types/cms';
import { 
  CMSPayload, 
  DEFAULT_CMS_DATA, 
  DEFAULT_NAVIGATION, 
  DEFAULT_FOOTER 
} from '@/lib/cms/cmsService';
import { DEFAULT_THEME_SETTINGS, generateThemeCssVariables } from '@/lib/cms/theme';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  initial: string;
  color: string;
  avatarUrl?: string;
  bio?: string;
  specialties?: string[];
  discord?: string;
  twitter?: string;
  github?: string;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  imageUrl: string;
  bgGradient: string;
  buttonText: string;
  buttonLink: string;
  enabled: boolean;
}

export interface ReviewItem {
  id: string;
  author: string;
  role: string;
  company: string;
  avatarUrl?: string;
  rating: number; // 1-5
  content: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  icon?: string;
  color?: string;
}

export interface SectionStyle {
  bg?: 'mesh' | 'slate' | 'glass' | 'glow' | 'gradient' | 'custom';
  customBg?: string;
  customTextColor?: string;
  padding?: 'compact' | 'standard' | 'spacious';
  align?: 'left' | 'center' | 'right';
  border?: boolean;
}

export interface CustomSectionBlock {
  id: string;
  type: 'hero' | 'features' | 'cta' | 'faq' | 'text' | 'stats';
  title: string;
  subtitle?: string;
  content?: string;
  badge?: string;
  buttonText?: string;
  buttonLink?: string;
  items?: Array<{ id: string; title: string; desc: string; icon?: string }>;
}

export interface SiteContent {
  branding: {
    siteName: string;
    logoUrl?: string;
    logoSubtitle: string;
    announcementBarText: string;
    announcementBarLink: string;
    showAnnouncementBar: boolean;
    heroImageUrl?: string;
    aboutHeaderImageUrl?: string;
  };
  hero: {
    badgeText: string;
    titleLine1: string;
    titleHighlight: string;
    description: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    showHero: boolean;
    bannerImageUrl?: string;
  };
  stats: StatItem[];
  team: TeamMember[];
  promoBanners: PromoBanner[];
  reviews: ReviewItem[];
  sections: {
    showStoreGrid: boolean;
    showPortfolioShowcase: boolean;
    showServicesGrid: boolean;
    showTeamSection: boolean;
    showReviewsSection: boolean;
    showCtaBanner: boolean;
    ctaBannerTitle: string;
    ctaBannerDescription: string;
    ctaBannerButtonText: string;
    ctaBannerButtonLink: string;
    teamTitle?: string;
    reviewsTitle?: string;
    statsTitle?: string;
  };
  aboutPage: {
    headerTitle: string;
    headerSubtitle: string;
    storyTitle: string;
    storyContent: string;
    visionTitle: string;
    visionContent: string;
  };
  servicesPage: {
    headerTitle: string;
    headerSubtitle: string;
    items?: ServiceItem[];
  };
  contactPage: {
    email: string;
    phone: string;
    discordUrl: string;
    locationText: string;
    responseTimeText: string;
  };
  footer: {
    copyrightText: string;
    description: string;
    twitterUrl: string;
    githubUrl: string;
    discordUrl: string;
  };
  pageSectionOrder?: Record<string, string[]>;
  hiddenSections?: Record<string, string[]>;
  sectionStyles?: Record<string, SectionStyle>;
  customSections?: Record<string, CustomSectionBlock[]>;
}

export const DEFAULT_PAGE_SECTIONS: Record<string, string[]> = {
  main: ['announcement', 'hero', 'banners', 'stats', 'services', 'reviews', 'cta'],
  services: ['header', 'process', 'industries', 'cta'],
  portfolio: ['header', 'projects', 'reviews', 'cta'],
  store: ['header', 'banners', 'catalog', 'cta'],
  about: ['header', 'story', 'vision', 'team', 'expertise', 'cta'],
  contact: ['header', 'info', 'form', 'discord']
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  pageSectionOrder: DEFAULT_PAGE_SECTIONS,
  hiddenSections: {},
  sectionStyles: {},
  customSections: {},
  branding: {
    siteName: 'Eternals Studio',
    logoUrl: '/eternals-logo.jpg',
    logoSubtitle: 'Digital Assets & Custom Design',
    announcementBarText: '🚀 Flash Sale! Use code ETERNAL25 for 25% off all 3D asset bundles.',
    announcementBarLink: '/store',
    showAnnouncementBar: true,
    heroImageUrl: '/eternals-logo.jpg',
    aboutHeaderImageUrl: '/eternals-logo.jpg'
  },
  hero: {
    badgeText: 'Now Powered by Next.js',
    titleLine1: 'Welcome to',
    titleHighlight: 'Eternals Studio',
    description: 'Where Ideas Become Reality. We transform visions into high-performance web applications, striking graphical assets, and immersive 3D models.',
    primaryCtaText: 'Start Your Project',
    primaryCtaLink: '/contact',
    secondaryCtaText: 'View Our Work',
    secondaryCtaLink: '/portfolio',
    showHero: true
  },
  stats: [
    { id: 'st-1', value: '13+', label: 'Projects Completed' },
    { id: 'st-2', value: '10+', label: 'Happy Clients' },
    { id: 'st-3', value: '6+', label: 'Team Experts' },
    { id: 'st-4', value: '24/7', label: 'Support Available' }
  ],
  team: [
    {
      id: 'tm-1',
      name: 'Fives',
      role: 'Founder & Lead Developer',
      initial: 'F',
      color: 'bg-teal-500',
      bio: 'Architecting ultra-fast web experiences, cloud infrastructure, and custom platform integrations for creators and esports organizations.',
      specialties: ['Next.js / React', 'Cloud Infrastructure', 'Stripe Architecture'],
      discord: 'fives#0001',
      twitter: 'https://twitter.com/eternals',
      github: 'https://github.com'
    },
    {
      id: 'tm-2',
      name: 'Pivotalonic',
      role: 'Co-Founder & UI/UX Designer',
      initial: 'P',
      color: 'bg-indigo-500',
      bio: 'Crafting pixel-perfect interface identities, Figma prototypes, and responsive visual systems.',
      specialties: ['UI/UX Design', 'Design Systems', 'Brand Strategy'],
      discord: 'pivotalonic#0001',
      twitter: 'https://twitter.com/eternals'
    },
    {
      id: 'tm-3',
      name: 'Khas',
      role: '3D Modeler & Motion Artist',
      initial: 'K',
      color: 'bg-pink-500',
      bio: 'Transforming complex conceptual ideas into cinematic 3D renders, spatial assets, and lighting models.',
      specialties: ['Cinema 4D', 'Blender', 'PBR Shaders'],
      discord: 'khas#0001',
      twitter: 'https://twitter.com/eternals'
    },
    {
      id: 'tm-4',
      name: 'In-Gloom Media',
      role: 'Lead Video Editor & Animator',
      initial: 'I',
      color: 'bg-amber-500',
      bio: 'Directing impactful trailers, broadcast graphics, kinetic typography, and esports tournament sequences.',
      specialties: ['After Effects', 'Premiere Pro', 'Motion Graphics'],
      discord: 'ingloom#0001',
      twitter: 'https://twitter.com/eternals'
    },
    {
      id: 'tm-5',
      name: 'Qzlf',
      role: 'Graphic Designer & Concept Illustrator',
      initial: 'Q',
      color: 'bg-emerald-500',
      bio: 'Creating signature vector emblems, tournament jerseys, stream packs, and team branding packages.',
      specialties: ['Vector Branding', 'Esports Logos', 'Merchandise'],
      discord: 'qzlf#0001',
      twitter: 'https://twitter.com/eternals'
    },
    {
      id: 'tm-6',
      name: 'Curtain',
      role: 'Community Manager & Support Lead',
      initial: 'C',
      color: 'bg-rose-500',
      bio: 'Ensuring seamless client communication, swift turnaround, milestone tracking, and dedicated project delivery.',
      specialties: ['Client Operations', 'Discord Support', 'Project Delivery'],
      discord: 'curtain#0001',
      twitter: 'https://twitter.com/eternals'
    }
  ],
  promoBanners: [
    {
      id: 'pb-1',
      title: 'Custom Brand & Vector Overlays',
      subtitle: 'Elevate your esports channel or corporate website with tailor-made motion graphics.',
      badge: 'Featured Showcase',
      imageUrl: '/eternals-logo.jpg',
      bgGradient: 'from-cyan-500/20 via-teal-500/20 to-indigo-500/20',
      buttonText: 'Explore Portfolio',
      buttonLink: '/portfolio',
      enabled: true
    }
  ],
  reviews: [
    {
      id: 'rev-1',
      author: "Marcus 'Apex' Vance",
      role: 'Founder & Team Captain',
      company: 'Apex Predator Clan',
      rating: 5,
      content: 'Eternals Studio completely redefined our competitive gaming identity. The custom mascot logo, 3D broadcast overlays, and animation sequences elevated our organization to partner tier within 3 months.'
    },
    {
      id: 'rev-2',
      author: 'Elena Rostova',
      role: 'Creative Director',
      company: 'Horizon Web Labs',
      rating: 5,
      content: 'The website templates and custom Next.js web application they delivered scored a 99+ on Google Lighthouse. Incredible code quality, seamless Stripe checkout, and ultra-responsive layout.'
    },
    {
      id: 'rev-3',
      author: 'David Kim',
      role: 'Executive Producer',
      company: 'Nexus Media Group',
      rating: 5,
      content: 'Hands down the most polished 3D asset models and LUT grading presets we have ever integrated. Clean topology, 4K PBR textures, and immediate source file delivery in the portal.'
    },
    {
      id: 'rev-4',
      author: 'Sarah Jenkins',
      role: 'Operations Lead',
      company: 'Vanguard Gaming Org',
      rating: 5,
      content: 'Unmatched turnaround time and transparency. Being able to toggle between personal and organization projects while tracking weekly milestones made working with Eternals Studio effortless.'
    }
  ],
  sections: {
    showStoreGrid: true,
    showPortfolioShowcase: true,
    showServicesGrid: true,
    showTeamSection: true,
    showReviewsSection: true,
    showCtaBanner: true,
    ctaBannerTitle: 'Ready to elevate your digital presence?',
    ctaBannerDescription: 'Collaborate with our team of elite designers and developers to bring your vision to life.',
    ctaBannerButtonText: 'Start a Project',
    ctaBannerButtonLink: '/contact',
    teamTitle: 'Meet the Creative Collective',
    reviewsTitle: 'Trusted by Creators & Organizations',
    statsTitle: 'Studio Milestones'
  },
  aboutPage: {
    headerTitle: 'Creating Visual Excellence',
    headerSubtitle: 'Where ideas meet professional performance. We build digital identities for organizations across business and gaming fields.',
    storyTitle: 'Our Mission',
    storyContent: 'We are dedicated to enhancing the success of individuals and organizations across various fields, including business and esports, through our exceptional graphical and web expertise. We understand that compelling visuals and fast applications are essential in capturing attention.\n\nWhether it\'s creating stunning logos, immersive esports graphics, or engaging web interfaces, our team is committed to delivering high-quality solutions that elevate brands, solve complex logistics, and drive sustainable growth.',
    visionTitle: 'Our Core Vision',
    visionContent: 'To empower organizations, studios, and individual creators with cutting-edge visual systems and reliable digital infrastructure that commands attention.'
  },
  servicesPage: {
    headerTitle: 'Our Services',
    headerSubtitle: 'Custom development and creative design solutions tailored to match your specific workflow.',
    items: [
      { id: 'svc-1', title: 'Web Development', desc: 'Custom React & Next.js applications, headless CMS, and fast web apps.', icon: 'Terminal', color: 'from-cyan-400 to-teal-500' },
      { id: 'svc-2', title: 'Graphic Design', desc: 'Stunning visual identities, esports graphics, team branding kits.', icon: 'Palette', color: 'from-purple-400 to-indigo-500' },
      { id: 'svc-3', title: '3D Modeling', desc: 'Detailed 3D product renders, spatial visualizations, character modeling.', icon: 'Box', color: 'from-pink-400 to-rose-500' },
      { id: 'svc-4', title: 'Motion Graphics', desc: 'Dynamic animation sequences, video trailers, streaming transitions.', icon: 'Video', color: 'from-amber-400 to-orange-500' }
    ]
  },
  contactPage: {
    email: 'Eternalsanctuarygg@gmail.com',
    phone: '(240) 523-3976',
    discordUrl: 'https://discord.gg/eternals',
    locationText: 'Remote First • Global Studio',
    responseTimeText: '24 ~ 48 Hours Guaranteed'
  },
  footer: {
    copyrightText: `© ${new Date().getFullYear()} Eternals Studio. All rights reserved.`,
    description: 'Professional graphic design, web development, and creative solutions for your business needs.',
    twitterUrl: 'https://twitter.com',
    githubUrl: 'https://github.com',
    discordUrl: 'https://discord.gg/eternals'
  }
};

export interface SiteContentContextType {
  siteContent: SiteContent;
  updateSiteContent: (newContent: Partial<SiteContent> | ((prev: SiteContent) => SiteContent)) => void;
  saveSiteContent: () => Promise<boolean>;
  resetToDefault: () => void;
  isLoading: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  toggleEditMode: () => void;
  cancelEditMode: () => void;
  // Helper methods for Team & Stats & Banners
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  updateTeamMember: (id: string, member: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;
  addStat: (stat: Omit<StatItem, 'id'>) => void;
  updateStat: (id: string, stat: Partial<StatItem>) => void;
  deleteStat: (id: string) => void;
  addPromoBanner: (banner: Omit<PromoBanner, 'id'>) => void;
  updatePromoBanner: (id: string, updated: Partial<PromoBanner>) => void;
  deletePromoBanner: (id: string) => void;
  // Helper methods for Reviews & Services
  addReview: (review: Omit<ReviewItem, 'id'>) => void;
  updateReview: (id: string, review: Partial<ReviewItem>) => void;
  deleteReview: (id: string) => void;
  addServiceItem: (item: Omit<ServiceItem, 'id'>) => void;
  updateServiceItem: (id: string, item: Partial<ServiceItem>) => void;
  deleteServiceItem: (id: string) => void;
  // Section Reordering, Visibility, Styles, and Add/Delete
  moveSection: (pageId: string, sectionId: string, direction: 'up' | 'down') => void;
  toggleSectionVisibility: (pageId: string, sectionId: string) => void;
  deleteSection: (pageId: string, sectionId: string) => void;
  duplicateSection: (pageId: string, sectionId: string) => void;
  addSection: (pageId: string, block: CustomSectionBlock, insertIndex?: number) => void;
  updateSectionStyle: (pageId: string, sectionId: string, style: Partial<SectionStyle>) => void;
  resetPageSections: (pageId: string) => void;
  // Full CMS Store & Studio Builder Capabilities
  cmsStore: CMSPayload;
  activeDraft: CMSPage | null;
  setActiveDraft: (page: CMSPage | ((prev: CMSPage | null) => CMSPage | null)) => void;
  saveDraft: (pageId: string, pageData: CMSPage) => Promise<boolean>;
  publishPage: (pageId: string, pageData: CMSPage, commitNote?: string) => Promise<boolean>;
  restoreVersion: (pageId: string, versionId: string) => Promise<boolean>;
  updateNavigation: (nav: CMSNavigation) => Promise<boolean>;
  updateFooter: (footer: CMSFooter) => Promise<boolean>;
  updateTheme: (theme: GlobalThemeSettings) => Promise<boolean>;
  addMediaAsset: (asset: MediaAsset) => Promise<boolean>;
  deleteMediaAsset: (assetId: string) => Promise<boolean>;
  createNewPage: (title: string, slug: string) => CMSPage;
  duplicatePage: (pageId: string) => CMSPage;
  deletePage: (pageId: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'eternals_site_content_v1';
const CMS_STORAGE_KEY = 'eternals_cms_v1';

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [initialContent, setInitialContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Full CMS Store & Studio Builder State
  const [cmsStore, setCmsStore] = useState<CMSPayload>(DEFAULT_CMS_DATA);
  const [activeDraft, setActiveDraft] = useState<CMSPage | null>(null);

  // Undo / Redo History Stack (up to 30 snapshot states)
  const [undoStack, setUndoStack] = useState<{ siteContent?: SiteContent; activeDraft?: CMSPage | null }[]>([]);
  const [redoStack, setRedoStack] = useState<{ siteContent?: SiteContent; activeDraft?: CMSPage | null }[]>([]);

  // Apply theme tokens to CSS root variables dynamically
  const applyThemeTokens = (theme: GlobalThemeSettings) => {
    if (typeof document === 'undefined') return;
    try {
      let styleEl = document.getElementById('cms-theme-vars') as HTMLStyleElement | null;
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'cms-theme-vars';
        document.head.appendChild(styleEl);
      }
      styleEl.innerHTML = generateThemeCssVariables(theme);
    } catch (e) {
      console.warn('Could not inject theme CSS variables:', e);
    }
  };

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  const cancelEditMode = () => {
    setSiteContent(initialContent);
    setIsEditMode(false);
  };

  useEffect(() => {
    async function loadContent() {
      // 1. Load legacy site-content
      try {
        const res = await fetch('/api/admin/site-content');
        if (res.ok) {
          const data = await res.json();
          if (data.content && typeof data.content === 'object') {
            const merged = deepMerge(DEFAULT_SITE_CONTENT, data.content);
            setSiteContent(merged);
            setInitialContent(merged);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch site content from API, checking local storage:', err);
        try {
          const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            const merged = deepMerge(DEFAULT_SITE_CONTENT, parsed);
            setSiteContent(merged);
            setInitialContent(merged);
          }
        } catch (e) {
          console.warn('Error reading site content from local storage:', e);
        }
      }

      // 2. Load modern CMS Store
      try {
        const cmsRes = await fetch('/api/admin/cms');
        if (cmsRes.ok) {
          const cmsData = await cmsRes.json();
          if (cmsData.store) {
            const mergedCMS: CMSPayload = {
              pages: cmsData.store.pages || {},
              drafts: cmsData.store.drafts || {},
              versions: cmsData.store.versions || {},
              navigation: cmsData.store.navigation || DEFAULT_NAVIGATION,
              footer: cmsData.store.footer || DEFAULT_FOOTER,
              theme: cmsData.store.theme || DEFAULT_THEME_SETTINGS,
              media: cmsData.store.media || DEFAULT_CMS_DATA.media,
              auditLog: cmsData.store.auditLog || []
            };
            setCmsStore(mergedCMS);
            applyThemeTokens(mergedCMS.theme);
          }
        }
      } catch (cmsErr) {
        console.warn('Could not load CMS store from API, checking local storage:', cmsErr);
        try {
          const localCMS = localStorage.getItem(CMS_STORAGE_KEY);
          if (localCMS) {
            const parsed = JSON.parse(localCMS);
            setCmsStore(parsed);
            if (parsed.theme) applyThemeTokens(parsed.theme);
          }
        } catch (err) {
          // ignore
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadContent();
  }, []);

  const updateSiteContent = (
    newContent: Partial<SiteContent> | ((prev: SiteContent) => SiteContent)
  ) => {
    setSiteContent((prev) => {
      if (typeof newContent === 'function') {
        return newContent(prev);
      }
      return deepMerge(prev, newContent);
    });
  };

  const saveSiteContent = async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(siteContent));

      const res = await fetch('/api/admin/site-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: siteContent })
      });

      if (!res.ok) {
        console.error('API save returned non-200. Content saved to local browser cache only, remote database update failed.');
        setIsSaving(false);
        return false;
      }

      setInitialContent(siteContent);
      setIsSaving(false);
      return true;
    } catch (err) {
      console.error('Error saving site content:', err);
      setIsSaving(false);
      return false;
    }
  };

  const resetToDefault = () => {
    setSiteContent(DEFAULT_SITE_CONTENT);
  };

  // Helper CRUD methods for Team Members
  const addTeamMember = (member: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...member,
      id: `tm-${Date.now()}`
    };
    setSiteContent((prev) => ({
      ...prev,
      team: [...prev.team, newMember]
    }));
  };

  const updateTeamMember = (id: string, updated: Partial<TeamMember>) => {
    setSiteContent((prev) => ({
      ...prev,
      team: prev.team.map((m) => (m.id === id ? { ...m, ...updated } : m))
    }));
  };

  const deleteTeamMember = (id: string) => {
    setSiteContent((prev) => ({
      ...prev,
      team: prev.team.filter((m) => m.id !== id)
    }));
  };

  // Helper CRUD methods for Stats
  const addStat = (stat: Omit<StatItem, 'id'>) => {
    const newStat: StatItem = {
      ...stat,
      id: `st-${Date.now()}`
    };
    setSiteContent((prev) => ({
      ...prev,
      stats: [...prev.stats, newStat]
    }));
  };

  const updateStat = (id: string, updated: Partial<StatItem>) => {
    setSiteContent((prev) => ({
      ...prev,
      stats: prev.stats.map((s) => (s.id === id ? { ...s, ...updated } : s))
    }));
  };

  const deleteStat = (id: string) => {
    setSiteContent((prev) => ({
      ...prev,
      stats: prev.stats.filter((s) => s.id !== id)
    }));
  };

  // Helper CRUD methods for Promo Banners
  const addPromoBanner = (banner: Omit<PromoBanner, 'id'>) => {
    const newBanner: PromoBanner = {
      ...banner,
      id: `pb-${Date.now()}`
    };
    setSiteContent((prev) => ({
      ...prev,
      promoBanners: [...(prev.promoBanners || []), newBanner]
    }));
  };

  const updatePromoBanner = (id: string, updated: Partial<PromoBanner>) => {
    setSiteContent((prev) => ({
      ...prev,
      promoBanners: (prev.promoBanners || []).map((b) => (b.id === id ? { ...b, ...updated } : b))
    }));
  };

  const deletePromoBanner = (id: string) => {
    setSiteContent((prev) => ({
      ...prev,
      promoBanners: (prev.promoBanners || []).filter((b) => b.id !== id)
    }));
  };

  // Helper CRUD methods for Reviews
  const addReview = (review: Omit<ReviewItem, 'id'>) => {
    const newRev: ReviewItem = {
      ...review,
      id: `rev-${Date.now()}`
    };
    setSiteContent((prev) => ({
      ...prev,
      reviews: [...(prev.reviews || []), newRev]
    }));
  };

  const updateReview = (id: string, updated: Partial<ReviewItem>) => {
    setSiteContent((prev) => ({
      ...prev,
      reviews: (prev.reviews || []).map((r) => (r.id === id ? { ...r, ...updated } : r))
    }));
  };

  const deleteReview = (id: string) => {
    setSiteContent((prev) => ({
      ...prev,
      reviews: (prev.reviews || []).filter((r) => r.id !== id)
    }));
  };

  // Helper CRUD methods for Services
  const addServiceItem = (item: Omit<ServiceItem, 'id'>) => {
    const newSvc: ServiceItem = {
      ...item,
      id: `svc-${Date.now()}`
    };
    setSiteContent((prev) => ({
      ...prev,
      servicesPage: {
        ...prev.servicesPage,
        items: [...(prev.servicesPage.items || []), newSvc]
      }
    }));
  };

  const updateServiceItem = (id: string, updated: Partial<ServiceItem>) => {
    setSiteContent((prev) => ({
      ...prev,
      servicesPage: {
        ...prev.servicesPage,
        items: (prev.servicesPage.items || []).map((s) => (s.id === id ? { ...s, ...updated } : s))
      }
    }));
  };

  const deleteServiceItem = (id: string) => {
    setSiteContent((prev) => ({
      ...prev,
      servicesPage: {
        ...prev.servicesPage,
        items: (prev.servicesPage.items || []).filter((s) => s.id !== id)
      }
    }));
  };

  // Section Reordering, Visibility, Styling, and Add/Delete
  const moveSection = (pageId: string, sectionId: string, direction: 'up' | 'down') => {
    setSiteContent((prev) => {
      const currentOrder = [
        ...(prev.pageSectionOrder?.[pageId] || DEFAULT_PAGE_SECTIONS[pageId] || [])
      ];
      const index = currentOrder.indexOf(sectionId);
      if (index === -1) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= currentOrder.length) return prev;

      const temp = currentOrder[index];
      currentOrder[index] = currentOrder[targetIndex];
      currentOrder[targetIndex] = temp;

      return {
        ...prev,
        pageSectionOrder: {
          ...(prev.pageSectionOrder || {}),
          [pageId]: currentOrder
        }
      };
    });
  };

  const toggleSectionVisibility = (pageId: string, sectionId: string) => {
    setSiteContent((prev) => {
      const currentHidden = [...(prev.hiddenSections?.[pageId] || [])];
      const exists = currentHidden.includes(sectionId);
      const updatedHidden = exists
        ? currentHidden.filter((id) => id !== sectionId)
        : [...currentHidden, sectionId];

      return {
        ...prev,
        hiddenSections: {
          ...(prev.hiddenSections || {}),
          [pageId]: updatedHidden
        }
      };
    });
  };

  const deleteSection = (pageId: string, sectionId: string) => {
    setSiteContent((prev) => {
      const currentOrder = [
        ...(prev.pageSectionOrder?.[pageId] || DEFAULT_PAGE_SECTIONS[pageId] || [])
      ];
      const updatedOrder = currentOrder.filter((id) => id !== sectionId);

      const currentHidden = [...(prev.hiddenSections?.[pageId] || [])];
      if (!currentHidden.includes(sectionId)) {
        currentHidden.push(sectionId);
      }

      return {
        ...prev,
        pageSectionOrder: {
          ...(prev.pageSectionOrder || {}),
          [pageId]: updatedOrder
        },
        hiddenSections: {
          ...(prev.hiddenSections || {}),
          [pageId]: currentHidden
        }
      };
    });
  };

  const duplicateSection = (pageId: string, sectionId: string) => {
    setSiteContent((prev) => {
      const currentOrder = [
        ...(prev.pageSectionOrder?.[pageId] || DEFAULT_PAGE_SECTIONS[pageId] || [])
      ];
      const index = currentOrder.indexOf(sectionId);
      const newId = `${sectionId}-copy-${Date.now()}`;

      // Duplicate any custom section block if it exists
      const pageCustom = [...((prev.customSections as any)?.[pageId] || [])];
      const matchedCustom = pageCustom.find((c: any) => c.id === sectionId);
      let updatedCustom = prev.customSections || {};
      if (matchedCustom) {
        updatedCustom = {
          ...updatedCustom,
          [pageId]: [...pageCustom, { ...matchedCustom, id: newId, title: `${matchedCustom.title} (Copy)` }]
        };
      }

      const updatedOrder = [...currentOrder];
      if (index !== -1) {
        updatedOrder.splice(index + 1, 0, newId);
      } else {
        updatedOrder.push(newId);
      }

      return {
        ...prev,
        customSections: updatedCustom,
        pageSectionOrder: {
          ...(prev.pageSectionOrder || {}),
          [pageId]: updatedOrder
        }
      };
    });
  };

  const addSection = (pageId: string, block: CustomSectionBlock, insertIndex?: number) => {
    setSiteContent((prev) => {
      const currentOrder = [
        ...(prev.pageSectionOrder?.[pageId] || DEFAULT_PAGE_SECTIONS[pageId] || [])
      ];
      const updatedOrder = [...currentOrder];
      if (typeof insertIndex === 'number' && insertIndex >= 0 && insertIndex <= updatedOrder.length) {
        updatedOrder.splice(insertIndex, 0, block.id);
      } else {
        updatedOrder.push(block.id);
      }

      const pageCustom = [...((prev.customSections as any)?.[pageId] || [])];

      return {
        ...prev,
        customSections: {
          ...(prev.customSections || {}),
          [pageId]: [...pageCustom, block]
        },
        pageSectionOrder: {
          ...(prev.pageSectionOrder || {}),
          [pageId]: updatedOrder
        }
      };
    });
  };

  const updateSectionStyle = (pageId: string, sectionId: string, style: Partial<SectionStyle>) => {
    setSiteContent((prev) => ({
      ...prev,
      sectionStyles: {
        ...(prev.sectionStyles || {}),
        [sectionId]: {
          ...((prev.sectionStyles || {})[sectionId] || {}),
          ...style
        }
      }
    }));
  };

  const resetPageSections = (pageId: string) => {
    setSiteContent((prev) => ({
      ...prev,
      pageSectionOrder: {
        ...(prev.pageSectionOrder || {}),
        [pageId]: DEFAULT_PAGE_SECTIONS[pageId] || []
      },
      hiddenSections: {
        ...(prev.hiddenSections || {}),
        [pageId]: []
      }
    }));
  };

  // Full CMS Methods
  const saveDraft = async (pageId: string, pageData: CMSPage): Promise<boolean> => {
    try {
      const updatedDrafts = { ...cmsStore.drafts, [pageId]: pageData };
      const updatedStore = { ...cmsStore, drafts: updatedDrafts };
      setCmsStore(updatedStore);
      if (typeof window !== 'undefined') {
        localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(updatedStore));
      }

      const res = await fetch('/api/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_draft',
          payload: { page: pageData }
        })
      });
      return res.ok;
    } catch (err) {
      console.error('Error saving draft:', err);
      return false;
    }
  };

  const publishPage = async (pageId: string, pageData: CMSPage, commitNote?: string): Promise<boolean> => {
    try {
      const publishedPage: CMSPage = {
        ...pageData,
        status: 'published',
        version: (pageData.version || 1) + 1,
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString()
      };

      const newVersion: PageVersion = {
        id: `ver-${pageId}-${Date.now()}`,
        pageId,
        versionNumber: publishedPage.version,
        pageTitle: publishedPage.title,
        snapshot: publishedPage,
        createdAt: new Date().toISOString(),
        createdBy: 'Admin',
        commitMessage: commitNote || 'Published page live'
      };

      const updatedVersions = [...(cmsStore.versions[pageId] || []), newVersion];
      const updatedStore: CMSPayload = {
        ...cmsStore,
        pages: { ...cmsStore.pages, [pageId]: publishedPage },
        drafts: { ...cmsStore.drafts, [pageId]: publishedPage },
        versions: { ...cmsStore.versions, [pageId]: updatedVersions }
      };

      setCmsStore(updatedStore);
      setActiveDraft(publishedPage);
      if (typeof window !== 'undefined') {
        localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(updatedStore));
      }

      const res = await fetch('/api/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'publish_page',
          payload: { page: pageData, commitMessage: commitNote }
        })
      });

      return res.ok;
    } catch (err) {
      console.error('Error publishing page:', err);
      return false;
    }
  };

  const restoreVersion = async (pageId: string, versionId: string): Promise<boolean> => {
    try {
      const versions = cmsStore.versions[pageId] || [];
      const targetVersion = versions.find((v) => v.id === versionId);
      if (!targetVersion) return false;

      const restored: CMSPage = {
        ...targetVersion.snapshot,
        status: 'draft',
        updatedAt: new Date().toISOString()
      };

      const updatedDrafts = { ...cmsStore.drafts, [pageId]: restored };
      const updatedStore = { ...cmsStore, drafts: updatedDrafts };
      setCmsStore(updatedStore);
      if (activeDraft?.id === pageId) {
        setActiveDraft(restored);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(updatedStore));
      }

      const res = await fetch('/api/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'restore_version',
          payload: { pageId, versionId }
        })
      });
      return res.ok;
    } catch (err) {
      console.error('Error restoring version:', err);
      return false;
    }
  };

  const updateNavigation = async (nav: CMSNavigation): Promise<boolean> => {
    try {
      const loc = nav.location || 'main';
      const updatedNav = { ...cmsStore.navigation, [loc]: nav };
      const updatedStore = { ...cmsStore, navigation: updatedNav };
      setCmsStore(updatedStore);
      if (typeof window !== 'undefined') {
        localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(updatedStore));
      }

      const res = await fetch('/api/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_navigation',
          payload: { navigation: updatedNav }
        })
      });
      return res.ok;
    } catch (err) {
      console.error('Error updating navigation:', err);
      return false;
    }
  };

  const updateFooter = async (footer: CMSFooter): Promise<boolean> => {
    try {
      const updatedStore = { ...cmsStore, footer };
      setCmsStore(updatedStore);
      if (typeof window !== 'undefined') {
        localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(updatedStore));
      }

      const res = await fetch('/api/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_footer',
          payload: { footer }
        })
      });
      return res.ok;
    } catch (err) {
      console.error('Error updating footer:', err);
      return false;
    }
  };

  const updateTheme = async (theme: GlobalThemeSettings): Promise<boolean> => {
    try {
      const updatedStore = { ...cmsStore, theme };
      setCmsStore(updatedStore);
      applyThemeTokens(theme);
      if (typeof window !== 'undefined') {
        localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(updatedStore));
      }

      const res = await fetch('/api/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_theme',
          payload: { theme }
        })
      });
      return res.ok;
    } catch (err) {
      console.error('Error updating theme:', err);
      return false;
    }
  };

  const addMediaAsset = async (asset: MediaAsset): Promise<boolean> => {
    try {
      const updatedMedia = [asset, ...cmsStore.media];
      const updatedStore = { ...cmsStore, media: updatedMedia };
      setCmsStore(updatedStore);
      if (typeof window !== 'undefined') {
        localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(updatedStore));
      }

      const res = await fetch('/api/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_media',
          payload: { asset }
        })
      });
      return res.ok;
    } catch (err) {
      console.error('Error adding media asset:', err);
      return false;
    }
  };

  const deleteMediaAsset = async (assetId: string): Promise<boolean> => {
    try {
      const updatedMedia = cmsStore.media.filter((m) => m.id !== assetId);
      const updatedStore = { ...cmsStore, media: updatedMedia };
      setCmsStore(updatedStore);
      if (typeof window !== 'undefined') {
        localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(updatedStore));
      }

      const res = await fetch('/api/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_media',
          payload: { assetId }
        })
      });
      return res.ok;
    } catch (err) {
      console.error('Error deleting media asset:', err);
      return false;
    }
  };

  const createNewPage = (title: string, slug: string): CMSPage => {
    const cleanSlug = slug.startsWith('/') ? slug : `/${slug}`;
    const pageId = cleanSlug.replace(/^\//, '') || 'new-page';
    const newPage: CMSPage = {
      id: pageId,
      title,
      slug: cleanSlug,
      status: 'draft',
      template: 'custom',
      sections: [],
      seo: {
        title: `${title} | Eternals Studio`,
        description: `Explore ${title} at Eternals Studio.`
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    };
    const updatedStore = {
      ...cmsStore,
      drafts: { ...cmsStore.drafts, [pageId]: newPage }
    };
    setCmsStore(updatedStore);
    if (typeof window !== 'undefined') {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(updatedStore));
    }
    return newPage;
  };

  const duplicatePage = (pageId: string): CMSPage => {
    const source = cmsStore.drafts[pageId] || cmsStore.pages[pageId] || {
      id: pageId,
      title: pageId,
      slug: `/${pageId}`,
      status: 'draft' as const,
      template: 'custom' as const,
      sections: []
    };
    const newId = `${pageId}-copy-${Date.now()}`;
    const duplicated: CMSPage = {
      ...source,
      id: newId,
      title: `${source.title} (Copy)`,
      slug: `${source.slug}-copy`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    };
    const updatedStore = {
      ...cmsStore,
      drafts: { ...cmsStore.drafts, [newId]: duplicated }
    };
    setCmsStore(updatedStore);
    if (typeof window !== 'undefined') {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(updatedStore));
    }
    return duplicated;
  };

  const deletePage = (pageId: string) => {
    const updatedPages = { ...cmsStore.pages };
    delete updatedPages[pageId];
    const updatedDrafts = { ...cmsStore.drafts };
    delete updatedDrafts[pageId];
    const updatedStore = { ...cmsStore, pages: updatedPages, drafts: updatedDrafts };
    setCmsStore(updatedStore);
    if (typeof window !== 'undefined') {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(updatedStore));
    }
  };

  // Undo / Redo
  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  const undo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, { siteContent, activeDraft }]);

    if (previous.siteContent) setSiteContent(previous.siteContent);
    if (previous.activeDraft !== undefined) setActiveDraft(previous.activeDraft);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, { siteContent, activeDraft }]);

    if (next.siteContent) setSiteContent(next.siteContent);
    if (next.activeDraft !== undefined) setActiveDraft(next.activeDraft);
  };

  // Global Keyboard shortcuts: Ctrl+Z and Ctrl+Shift+Z / Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) ||
        ((e.metaKey || e.ctrlKey) && e.key === 'y')
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoStack, redoStack, siteContent, activeDraft]);

  const hasUnsavedChanges = JSON.stringify(siteContent) !== JSON.stringify(initialContent);

  return (
    <SiteContentContext.Provider
      value={{
        siteContent,
        updateSiteContent,
        saveSiteContent,
        resetToDefault,
        isLoading,
        isSaving,
        hasUnsavedChanges,
        isEditMode,
        setIsEditMode,
        toggleEditMode,
        cancelEditMode,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        addStat,
        updateStat,
        deleteStat,
        addPromoBanner,
        updatePromoBanner,
        deletePromoBanner,
        moveSection,
        toggleSectionVisibility,
        deleteSection,
        duplicateSection,
        addSection,
        updateSectionStyle,
        resetPageSections,
        addReview,
        updateReview,
        deleteReview,
        addServiceItem,
        updateServiceItem,
        deleteServiceItem,
        // Full CMS Store & Studio Builder Capabilities
        cmsStore,
        activeDraft,
        setActiveDraft,
        saveDraft,
        publishPage,
        restoreVersion,
        updateNavigation,
        updateFooter,
        updateTheme,
        addMediaAsset,
        deleteMediaAsset,
        createNewPage,
        duplicatePage,
        deletePage,
        canUndo,
        canRedo,
        undo,
        redo
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (context === undefined) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
}

function deepMerge<T extends Record<string, any>>(target: T, source: Record<string, any>): T {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else (output as any)[key] = deepMerge(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}
