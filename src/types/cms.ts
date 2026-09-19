/**
 * Core CMS Type Definitions for Eternals Studio Visual Website Builder
 * Compatible with modern CMS platforms (Webflow, Squarespace, Hostinger, Wix)
 */

export type ViewportDevice = 'desktop' | 'tablet' | 'mobile';

export type PublishStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export interface ResponsiveStyle {
  fontSize?: string;
  lineHeight?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  marginTop?: string;
  marginBottom?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  columns?: number;
  gap?: string;
  hide?: boolean;
}

export interface BlockStyles {
  // Typography
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textColor?: string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration?: 'none' | 'underline' | 'line-through';

  // Colors & Backgrounds
  backgroundColor?: string;
  bgGradient?: string;
  backgroundImage?: string;
  bgSize?: 'cover' | 'contain' | 'auto';
  bgPosition?: 'center' | 'top' | 'bottom';
  opacity?: number;

  // Spacing (Margins & Padding)
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;

  // Borders & Corner Radius
  borderWidth?: string;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  borderRadius?: string;
  boxShadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'glow-teal' | 'glow-indigo';

  // Layout & Sizing
  width?: string;
  maxWidth?: string;
  height?: string;
  display?: 'block' | 'inline-block' | 'flex' | 'grid';
  flexDirection?: 'row' | 'column';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  gap?: string;

  // Responsive device overrides
  mobile?: ResponsiveStyle;
  tablet?: ResponsiveStyle;

  // Advanced
  customClass?: string;
  anchorId?: string;
}

export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'richText'
  | 'button'
  | 'image'
  | 'video'
  | 'icon'
  | 'card'
  | 'columns'
  | 'grid'
  | 'spacer'
  | 'divider'
  | 'badge'
  | 'stat'
  | 'review'
  | 'teamMember'
  | 'faq'
  | 'form'
  | 'quote'
  | 'custom'
  | 'html';

export interface CMSBlock {
  id: string;
  type: BlockType;
  label?: string;
  content: {
    text?: string;
    level?: 1 | 2 | 3 | 4 | 5 | 6; // for headings
    html?: string;
    url?: string;
    alt?: string;
    caption?: string;
    buttonText?: string;
    buttonLink?: string;
    target?: '_self' | '_blank';
    iconName?: string;
    badgeText?: string;
    value?: string;
    author?: string;
    role?: string;
    company?: string;
    rating?: number;
    initial?: string;
    color?: string;
    videoUrl?: string;
    formFields?: FormFieldConfig[];
    items?: Array<{ id: string; title: string; desc: string; icon?: string; link?: string }>;
    [key: string]: unknown;
  };
  styles: BlockStyles;
  children?: CMSBlock[];
}

export interface SectionStyles {
  backgroundType?: 'mesh' | 'slate' | 'glass' | 'glow' | 'gradient' | 'custom';
  backgroundColor?: string;
  bgGradient?: string;
  bgImageUrl?: string;
  paddingVertical?: 'none' | 'compact' | 'standard' | 'spacious' | 'custom';
  paddingTop?: string;
  paddingBottom?: string;
  textAlign?: 'left' | 'center' | 'right';
  borderTop?: boolean;
  borderBottom?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  customClass?: string;
  anchorId?: string;
  mobile?: {
    paddingTop?: string;
    paddingBottom?: string;
    hide?: boolean;
  };
  tablet?: {
    paddingTop?: string;
    paddingBottom?: string;
    hide?: boolean;
  };
}

export interface CMSSection {
  id: string;
  name: string;
  type:
    | 'hero'
    | 'features'
    | 'services'
    | 'stats'
    | 'testimonials'
    | 'gallery'
    | 'banners'
    | 'cta'
    | 'team'
    | 'faq'
    | 'contact'
    | 'custom'
    | 'columns';
  order: number;
  isHidden?: boolean;
  isGlobal?: boolean;
  globalId?: string;
  styles: SectionStyles;
  blocks: CMSBlock[];
}

export interface CMSPageSEO {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  keywords?: string[];
}

export interface CMSPage {
  id: string;
  slug: string;
  title: string;
  status: PublishStatus;
  template?: 'default' | 'landing' | 'fullwidth' | 'custom';
  seo: CMSPageSEO;
  sections: CMSSection[];
  version: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  publishedBy?: string;
}

export interface PageVersion {
  id: string;
  pageId: string;
  versionNumber: number;
  pageTitle: string;
  snapshot: CMSPage;
  createdAt: string;
  createdBy: string;
  commitMessage?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  target?: '_self' | '_blank';
  isExternal?: boolean;
  children?: NavigationItem[];
  badge?: string;
}

export interface CMSNavigation {
  id: string;
  location: 'main' | 'footer' | 'secondary';
  items: NavigationItem[];
  ctaButtonText?: string;
  ctaButtonLink?: string;
  showCtaButton?: boolean;
}

export interface FooterColumn {
  id: string;
  title: string;
  links: Array<{ id: string; label: string; href: string; target?: '_self' | '_blank' }>;
}

export interface CMSFooter {
  siteName: string;
  logoUrl?: string;
  description: string;
  copyrightText: string;
  columns: FooterColumn[];
  socialLinks: {
    twitter?: string;
    github?: string;
    discord?: string;
    youtube?: string;
    instagram?: string;
  };
}

export interface GlobalThemeSettings {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseFontSize: string;
    scaleRatio: number;
  };
  buttons: {
    borderRadius: string;
    paddingX: string;
    paddingY: string;
    primaryGradient: string;
  };
  layout: {
    maxContentWidth: string;
    defaultSectionPadding: string;
  };
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  alt: string;
  title?: string;
  dimensions?: { width: number; height: number };
  uploadedAt: string;
  uploadedBy?: string;
}

export interface FormFieldConfig {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'number';
  placeholder?: string;
  required?: boolean;
  options?: string[]; // for select/radio
  helpText?: string;
}

export interface CMSForm {
  id: string;
  name: string;
  title: string;
  description?: string;
  submitButtonText: string;
  successMessage: string;
  fields: FormFieldConfig[];
  recipients?: string[];
}

export interface CMSAuditEntry {
  id: string;
  adminEmail: string;
  action: string;
  targetType: 'page' | 'section' | 'block' | 'theme' | 'navigation' | 'media' | 'settings';
  targetId: string;
  timestamp: string;
  details?: Record<string, unknown>;
}
