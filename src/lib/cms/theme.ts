import { GlobalThemeSettings } from '@/types/cms';

export const DEFAULT_THEME_SETTINGS: GlobalThemeSettings = {
  colors: {
    primary: '#14b8a6', // Teal
    secondary: '#6366f1', // Indigo
    accent: '#10b981', // Emerald
    background: '#090d16', // Deep dark slate
    surface: '#0f172a', // Slate 900
    text: '#f8fafc', // Slate 50
    textMuted: '#94a3b8', // Slate 400
    border: '#1e293b', // Slate 800
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  typography: {
    headingFont: 'var(--font-heading, "Inter", sans-serif)',
    bodyFont: 'var(--font-body, "Inter", sans-serif)',
    baseFontSize: '16px',
    scaleRatio: 1.25
  },
  buttons: {
    borderRadius: '0.75rem',
    paddingX: '1.5rem',
    paddingY: '0.875rem',
    primaryGradient: 'linear-gradient(to right, #2dd4bf, #6366f1)'
  },
  layout: {
    maxContentWidth: '80rem', // max-w-7xl
    defaultSectionPadding: '4rem' // py-16
  }
};

/**
 * Converts ThemeSettings to inline CSS variable declarations
 */
export function generateThemeCssVariables(theme: GlobalThemeSettings): string {
  return `
    :root {
      --color-primary: ${theme.colors.primary};
      --color-secondary: ${theme.colors.secondary};
      --color-accent: ${theme.colors.accent};
      --color-bg: ${theme.colors.background};
      --color-surface: ${theme.colors.surface};
      --color-text: ${theme.colors.text};
      --color-text-muted: ${theme.colors.textMuted};
      --color-border: ${theme.colors.border};
      --font-heading: ${theme.typography.headingFont};
      --font-body: ${theme.typography.bodyFont};
      --btn-radius: ${theme.buttons.borderRadius};
      --btn-padding-x: ${theme.buttons.paddingX};
      --btn-padding-y: ${theme.buttons.paddingY};
      --content-max-width: ${theme.layout.maxContentWidth};
      --section-padding: ${theme.layout.defaultSectionPadding};
    }
  `.replace(/\s+/g, ' ').trim();
}
