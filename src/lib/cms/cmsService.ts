import { supabaseAdmin } from '@/lib/supabase';
import { logEvent } from '@/lib/logger';
import { 
  CMSPage, 
  PageVersion, 
  CMSNavigation, 
  CMSFooter, 
  GlobalThemeSettings, 
  MediaAsset,
  CMSAuditEntry 
} from '@/types/cms';
import { DEFAULT_THEME_SETTINGS } from './theme';

export interface CMSPayload {
  pages: Record<string, CMSPage>;
  drafts: Record<string, CMSPage>;
  versions: Record<string, PageVersion[]>;
  navigation: Record<string, CMSNavigation>;
  footer: CMSFooter;
  theme: GlobalThemeSettings;
  media: MediaAsset[];
  auditLog: CMSAuditEntry[];
}

export const DEFAULT_NAVIGATION: Record<string, CMSNavigation> = {
  main: {
    id: 'nav-main',
    location: 'main',
    items: [
      { id: 'n-1', label: 'Services', href: '/services' },
      { id: 'n-2', label: 'Portfolio', href: '/portfolio' },
      { id: 'n-3', label: 'Store', href: '/store', badge: 'Hot' },
      { id: 'n-4', label: 'About', href: '/about' },
      { id: 'n-5', label: 'Contact', href: '/contact' }
    ],
    showCtaButton: true,
    ctaButtonText: 'Start Project',
    ctaButtonLink: '/contact'
  },
  footer: {
    id: 'nav-footer',
    location: 'footer',
    items: [
      { id: 'nf-1', label: 'Privacy Policy', href: '/privacy-policy' },
      { id: 'nf-2', label: 'Terms of Service', href: '/terms-of-service' },
      { id: 'nf-3', label: 'Client Portal', href: '/client' }
    ]
  }
};

export const DEFAULT_FOOTER: CMSFooter = {
  siteName: 'Eternals Studio',
  logoUrl: '/eternals-logo.jpg',
  description: 'Where Ideas Become Reality. We build high-performance web applications, striking graphical assets, and immersive 3D models.',
  copyrightText: `© ${new Date().getFullYear()} Eternals Studio. All rights reserved.`,
  columns: [
    {
      id: 'fc-1',
      title: 'Navigation',
      links: [
        { id: 'fcl-1', label: 'Home', href: '/' },
        { id: 'fcl-2', label: 'Services', href: '/services' },
        { id: 'fcl-3', label: 'Portfolio', href: '/portfolio' },
        { id: 'fcl-4', label: 'Store', href: '/store' }
      ]
    },
    {
      id: 'fc-2',
      title: 'Company',
      links: [
        { id: 'fcl-5', label: 'About Us', href: '/about' },
        { id: 'fcl-6', label: 'Team Portal', href: '/team' },
        { id: 'fcl-7', label: 'Partners', href: '/partners' },
        { id: 'fcl-8', label: 'Contact', href: '/contact' }
      ]
    },
    {
      id: 'fc-3',
      title: 'Legal',
      links: [
        { id: 'fcl-9', label: 'Terms of Service', href: '/terms-of-service' },
        { id: 'fcl-10', label: 'Privacy Policy', href: '/privacy-policy' }
      ]
    }
  ],
  socialLinks: {
    twitter: 'https://twitter.com/eternals',
    github: 'https://github.com',
    discord: 'https://discord.gg/eternals'
  }
};

export const DEFAULT_CMS_DATA: CMSPayload = {
  pages: {},
  drafts: {},
  versions: {},
  navigation: DEFAULT_NAVIGATION,
  footer: DEFAULT_FOOTER,
  theme: DEFAULT_THEME_SETTINGS,
  media: [
    {
      id: 'm-logo',
      name: 'eternals-logo.jpg',
      url: '/eternals-logo.jpg',
      size: 14370,
      type: 'image/jpeg',
      alt: 'Eternals Studio Official Logo',
      uploadedAt: new Date().toISOString()
    }
  ],
  auditLog: []
};

/**
 * Loads entire CMS store from Supabase site_content table
 */
export async function getCMSStore(): Promise<CMSPayload> {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_content')
      .select('content')
      .eq('id', 1)
      .maybeSingle();

    if (error || !data?.content) {
      console.warn('[CMS Service] DB content not found, returning default schema:', error?.message);
      return DEFAULT_CMS_DATA;
    }

    const cms = data.content?.cms || {};
    return {
      pages: cms.pages || {},
      drafts: cms.drafts || {},
      versions: cms.versions || {},
      navigation: cms.navigation || DEFAULT_NAVIGATION,
      footer: cms.footer || DEFAULT_FOOTER,
      theme: cms.theme || DEFAULT_THEME_SETTINGS,
      media: cms.media || DEFAULT_CMS_DATA.media,
      auditLog: cms.auditLog || []
    };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('[CMS Service] Error fetching CMS store:', errMsg);
    return DEFAULT_CMS_DATA;
  }
}

/**
 * Saves CMS payload back to Supabase
 */
export async function saveCMSStore(
  payload: Partial<CMSPayload>,
  adminEmail: string,
  actionSummary: string
): Promise<boolean> {
  try {
    const current = await getCMSStore();

    // Append audit log entry
    const newAudit: CMSAuditEntry = {
      id: `audit-${Date.now()}`,
      adminEmail,
      action: actionSummary,
      targetType: 'page',
      targetId: 'site',
      timestamp: new Date().toISOString()
    };

    const mergedCMS: CMSPayload = {
      ...current,
      ...payload,
      auditLog: [newAudit, ...(current.auditLog || []).slice(0, 99)] // Keep last 100
    };

    // Upsert into Supabase
    const { data: existing } = await supabaseAdmin
      .from('site_content')
      .select('content')
      .eq('id', 1)
      .maybeSingle();

    const currentRaw = existing?.content || {};

    const { error } = await supabaseAdmin
      .from('site_content')
      .upsert({
        id: 1,
        content: {
          ...currentRaw,
          cms: mergedCMS
        },
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('[CMS Service] Failed to save CMS store to Supabase:', error);
      return false;
    }

    // Log to system events table
    await logEvent(
      'evt_cms_updated',
      'database',
      'success',
      `CMS updated by ${adminEmail}: ${actionSummary}`,
      { actor: adminEmail, action: actionSummary }
    );

    return true;
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('[CMS Service] Error saving CMS store:', errMsg);
    return false;
  }
}
