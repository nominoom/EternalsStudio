'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ThemePreset {
  id: string;
  name: string;
  primaryColor: string;
  accentColor: string;
  secondaryColor: string;
  backgroundColor: string;
  cardBgColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: string;
  glassBlur: string;
  bgCanvasStyle: 'bubbles' | 'grid' | 'gradient' | 'dots' | 'solid';
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'eternals-dark',
    name: 'Eternals Dark (Signature)',
    primaryColor: '#3b82f6',
    accentColor: '#8b5cf6',
    secondaryColor: '#60a5fa',
    backgroundColor: '#030712',
    cardBgColor: '#0b1329',
    textColor: '#f9fafb',
    fontFamily: 'Inter',
    borderRadius: '0.75rem',
    glassBlur: '16px',
    bgCanvasStyle: 'bubbles'
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    primaryColor: '#00f0ff',
    accentColor: '#ff007f',
    secondaryColor: '#7928ca',
    backgroundColor: '#05050c',
    cardBgColor: '#0d0d1e',
    textColor: '#ffffff',
    fontFamily: 'Space Grotesk',
    borderRadius: '0.5rem',
    glassBlur: '20px',
    bgCanvasStyle: 'bubbles'
  },
  {
    id: 'emerald-slate',
    name: 'Emerald Slate',
    primaryColor: '#10b981',
    accentColor: '#06b6d4',
    secondaryColor: '#34d399',
    backgroundColor: '#020d0a',
    cardBgColor: '#081c16',
    textColor: '#f0fdf4',
    fontFamily: 'Outfit',
    borderRadius: '0.75rem',
    glassBlur: '16px',
    bgCanvasStyle: 'grid'
  },
  {
    id: 'gold-obsidian',
    name: 'Gold Obsidian (Luxury)',
    primaryColor: '#d4af37',
    accentColor: '#f59e0b',
    secondaryColor: '#fbbf24',
    backgroundColor: '#0a0907',
    cardBgColor: '#1a160e',
    textColor: '#fffbeb',
    fontFamily: 'Cinzel',
    borderRadius: '0.375rem',
    glassBlur: '12px',
    bgCanvasStyle: 'gradient'
  },
  {
    id: 'vaporwave-midnight',
    name: 'Vaporwave Midnight',
    primaryColor: '#a855f7',
    accentColor: '#f97316',
    secondaryColor: '#ec4899',
    backgroundColor: '#0f0716',
    cardBgColor: '#1e0e2e',
    textColor: '#faf5ff',
    fontFamily: 'Rajdhani',
    borderRadius: '1rem',
    glassBlur: '24px',
    bgCanvasStyle: 'bubbles'
  },
  {
    id: 'minimal-luxury',
    name: 'Minimal Luxury',
    primaryColor: '#e2e8f0',
    accentColor: '#64748b',
    secondaryColor: '#94a3b8',
    backgroundColor: '#090d16',
    cardBgColor: '#111827',
    textColor: '#f8fafc',
    fontFamily: 'Inter',
    borderRadius: '0.25rem',
    glassBlur: '8px',
    bgCanvasStyle: 'dots'
  }
];

export interface SiteConfig {
  theme: {
    presetId: string;
    primaryColor: string;
    accentColor: string;
    secondaryColor: string;
    backgroundColor: string;
    cardBgColor: string;
    textColor: string;
    fontFamily: string;
    borderRadius: string;
    glassBlur: string;
    bgCanvasStyle: 'bubbles' | 'grid' | 'gradient' | 'dots' | 'solid';
  };
  branding: {
    siteName: string;
    logoSubtitle: string;
    announcementBarText: string;
    announcementBarLink: string;
    showAnnouncementBar: boolean;
  };
  hero: {
    badgeText: string;
    titleLine1: string;
    titleLine2Highlight: string;
    description: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    showHero: boolean;
  };
  homeSections: {
    showStoreGrid: boolean;
    showPortfolioShowcase: boolean;
    showServicesGrid: boolean;
    showTeamSection: boolean;
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
    stat1Number: string;
    stat1Label: string;
    stat2Number: string;
    stat2Label: string;
    stat3Number: string;
    stat3Label: string;
  };
  servicesPage: {
    headerTitle: string;
    headerSubtitle: string;
  };
  contactPage: {
    headerTitle: string;
    headerSubtitle: string;
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
  customCss: string;
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  theme: {
    presetId: 'eternals-dark',
    primaryColor: '#3b82f6',
    accentColor: '#8b5cf6',
    secondaryColor: '#60a5fa',
    backgroundColor: '#030712',
    cardBgColor: '#0b1329',
    textColor: '#f9fafb',
    fontFamily: 'Inter',
    borderRadius: '0.75rem',
    glassBlur: '16px',
    bgCanvasStyle: 'bubbles'
  },
  branding: {
    siteName: 'EternalsStudio',
    logoSubtitle: 'Digital Assets & Custom Design',
    announcementBarText: '🚀 Flash Sale! Use code ETERNAL25 for 25% off all 3D asset bundles.',
    announcementBarLink: '/store',
    showAnnouncementBar: true
  },
  hero: {
    badgeText: '✨ Premium Next-Gen Design & Development',
    titleLine1: 'Crafting High Impact',
    titleLine2Highlight: 'Digital Experiences',
    description: 'We build world-class web applications, 3D graphics, esports branding, and custom digital asset packages tailored for high performers.',
    primaryCtaText: 'Explore Store',
    primaryCtaLink: '/store',
    secondaryCtaText: 'Request Project',
    secondaryCtaLink: '/client',
    showHero: true
  },
  homeSections: {
    showStoreGrid: true,
    showPortfolioShowcase: true,
    showServicesGrid: true,
    showTeamSection: true,
    showCtaBanner: true,
    ctaBannerTitle: 'Ready to elevate your digital presence?',
    ctaBannerDescription: 'Collaborate with our team of elite designers and developers to bring your vision to life.',
    ctaBannerButtonText: 'Start a Project',
    ctaBannerButtonLink: '/client'
  },
  aboutPage: {
    headerTitle: 'About EternalsStudio',
    headerSubtitle: 'We are a collective of digital craftsmen building the future of web, 3D, and esports graphics.',
    storyTitle: 'Our Origin Story',
    storyContent: 'Founded by creators for creators, EternalsStudio emerged from a shared passion for pixel-perfect design and modern high-performance web applications. We bridge the gap between imagination and production-ready digital products.',
    visionTitle: 'Our Core Vision',
    visionContent: 'To empower organizations, studios, and individual creators with cutting-edge visual systems and reliable digital infrastructure that commands attention.',
    stat1Number: '500+',
    stat1Label: 'Projects Delivered',
    stat2Number: '99.8%',
    stat2Label: 'Client Satisfaction',
    stat3Number: '24/7',
    stat3Label: 'Support Commitment'
  },
  servicesPage: {
    headerTitle: 'Our Specialized Services',
    headerSubtitle: 'End-to-end design, development, and branding packages custom-tailored for your organization.'
  },
  contactPage: {
    headerTitle: 'Get in Touch',
    headerSubtitle: 'Have a question or custom project request? Our team is standing by.',
    email: 'contact@eternals.gg',
    phone: '+1 (800) 555-ETRN',
    discordUrl: 'https://discord.gg/eternals',
    locationText: 'Remote First • Global Studio',
    responseTimeText: 'Average response time: under 2 hours'
  },
  footer: {
    copyrightText: `© ${new Date().getFullYear()} EternalsStudio. All rights reserved.`,
    description: 'Empowering creators and brands with world-class digital assets, custom design systems, and web applications.',
    twitterUrl: 'https://twitter.com',
    githubUrl: 'https://github.com',
    discordUrl: 'https://discord.gg/eternals'
  },
  customCss: '/* Custom CSS rules injected live by Admin */\n.custom-accent-glow {\n  box-shadow: 0 0 25px rgba(59, 130, 246, 0.4);\n}'
};

interface SiteConfigContextType {
  siteConfig: SiteConfig;
  updateSiteConfig: (newConfig: Partial<SiteConfig> | ((prev: SiteConfig) => SiteConfig)) => void;
  applyPreset: (presetId: string) => void;
  saveSiteConfig: () => Promise<boolean>;
  resetToDefault: () => void;
  isLoading: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'eternals_site_config_v1';

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [initialConfig, setInitialConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load configuration on mount (first check API/Supabase, fallback to localStorage then defaults)
  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/api/admin/site-config');
        if (res.ok) {
          const data = await res.json();
          if (data.config && typeof data.config === 'object') {
            const merged = deepMerge(DEFAULT_SITE_CONFIG, data.config);
            setSiteConfig(merged);
            setInitialConfig(merged);
            applyCSSVariables(merged);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Failed to fetch site config from server, checking local storage:', err);
      }

      // Local storage fallback
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          const merged = deepMerge(DEFAULT_SITE_CONFIG, parsed);
          setSiteConfig(merged);
          setInitialConfig(merged);
          applyCSSVariables(merged);
        } else {
          applyCSSVariables(DEFAULT_SITE_CONFIG);
        }
      } catch (e) {
        console.warn('Error reading site config from local storage:', e);
        applyCSSVariables(DEFAULT_SITE_CONFIG);
      } finally {
        setIsLoading(false);
      }
    }

    loadConfig();
  }, []);

  // Update CSS variables on root when siteConfig updates
  useEffect(() => {
    applyCSSVariables(siteConfig);
  }, [siteConfig]);

  const applyCSSVariables = (config: SiteConfig) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    root.style.setProperty('--color-primary', config.theme.primaryColor);
    root.style.setProperty('--color-accent', config.theme.accentColor);
    root.style.setProperty('--color-secondary', config.theme.secondaryColor);
    root.style.setProperty('--bg-primary', config.theme.backgroundColor);
    root.style.setProperty('--bg-card', config.theme.cardBgColor);
    root.style.setProperty('--text-primary', config.theme.textColor);
    root.style.setProperty('--border-radius-custom', config.theme.borderRadius);
    root.style.setProperty('--glass-blur-custom', config.theme.glassBlur);

    // Apply custom font family to body
    if (config.theme.fontFamily) {
      root.style.setProperty('--font-custom-family', config.theme.fontFamily);
    }

    // Dynamic Custom CSS element update
    let styleTag = document.getElementById('custom-admin-site-css');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'custom-admin-site-css';
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = config.customCss || '';
  };

  const updateSiteConfig = (
    newConfig: Partial<SiteConfig> | ((prev: SiteConfig) => SiteConfig)
  ) => {
    setSiteConfig((prev) => {
      let updated: SiteConfig;
      if (typeof newConfig === 'function') {
        updated = newConfig(prev);
      } else {
        updated = deepMerge(prev, newConfig);
      }
      return updated;
    });
  };

  const applyPreset = (presetId: string) => {
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setSiteConfig((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        presetId: preset.id,
        primaryColor: preset.primaryColor,
        accentColor: preset.accentColor,
        secondaryColor: preset.secondaryColor,
        backgroundColor: preset.backgroundColor,
        cardBgColor: preset.cardBgColor,
        textColor: preset.textColor,
        fontFamily: preset.fontFamily,
        borderRadius: preset.borderRadius,
        glassBlur: preset.glassBlur,
        bgCanvasStyle: preset.bgCanvasStyle
      }
    }));
  };

  const saveSiteConfig = async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      // Save locally
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(siteConfig));

      // Save to Supabase API
      const res = await fetch('/api/admin/site-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: siteConfig })
      });

      if (!res.ok) {
        console.warn('API save returned non-200, but local storage updated successfully.');
      }

      setInitialConfig(siteConfig);
      setIsSaving(false);
      return true;
    } catch (err) {
      console.error('Error saving site config:', err);
      setIsSaving(false);
      return false;
    }
  };

  const resetToDefault = () => {
    setSiteConfig(DEFAULT_SITE_CONFIG);
  };

  const hasUnsavedChanges = JSON.stringify(siteConfig) !== JSON.stringify(initialConfig);

  return (
    <SiteConfigContext.Provider
      value={{
        siteConfig,
        updateSiteConfig,
        applyPreset,
        saveSiteConfig,
        resetToDefault,
        isLoading,
        isSaving,
        hasUnsavedChanges
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const context = useContext(SiteConfigContext);
  if (context === undefined) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
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
