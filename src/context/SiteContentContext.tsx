'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
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
    ctaBannerButtonLink: '/contact'
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
    headerSubtitle: 'Custom development and creative design solutions tailored to match your specific workflow.'
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
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'eternals_site_content_v1';

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [initialContent, setInitialContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  const cancelEditMode = () => {
    setSiteContent(initialContent);
    setIsEditMode(false);
  };

  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch('/api/admin/site-content');
        if (res.ok) {
          const data = await res.json();
          if (data.content && typeof data.content === 'object') {
            const merged = deepMerge(DEFAULT_SITE_CONTENT, data.content);
            setSiteContent(merged);
            setInitialContent(merged);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Failed to fetch site content from API, checking local storage:', err);
      }

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
        deletePromoBanner
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
