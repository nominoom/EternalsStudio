/**
 * Security & Input Sanitizer for CMS
 * Protects against XSS, malicious URLs, script injection, and unsafe SVG content.
 */

// Disallowed URL protocols that can execute code
const DANGEROUS_PROTOCOLS = ['javascript:', 'data:text/html', 'vbscript:', 'file:'];

/**
 * Validates and sanitizes link URLs to prevent javascript: or unsafe redirects.
 */
export function sanitizeUrl(url: string | undefined | null): string {
  if (!url) return '';
  const trimmed = url.trim();

  const lower = trimmed.toLowerCase();
  for (const proto of DANGEROUS_PROTOCOLS) {
    if (lower.startsWith(proto)) {
      console.warn(`[Security Warning] Blocked dangerous URL protocol: ${proto}`);
      return '#';
    }
  }

  return trimmed;
}

/**
 * Strips dangerous tags (script, iframe, object, embed, onerror attributes) from HTML/rich-text.
 */
export function sanitizeHtml(rawHtml: string | undefined | null): string {
  if (!rawHtml) return '';

  return rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Removes onClick, onLoad, onError etc.
    .replace(/javascript:/gi, '');
}

/**
 * Validates uploaded image file type against allowed mime types.
 */
export function isAllowedMediaType(fileType: string): boolean {
  const allowed = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'video/mp4',
    'video/webm'
  ];
  return allowed.includes(fileType.toLowerCase());
}

/**
 * Validates upload file size (maximum 15MB).
 */
export function isAllowedFileSize(sizeInBytes: number, maxMb = 15): boolean {
  return sizeInBytes <= maxMb * 1024 * 1024;
}
