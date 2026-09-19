'use client';

import React from 'react';
import Link from 'next/link';
import { CMSBlock, ViewportDevice } from '@/types/cms';
import { sanitizeUrl, sanitizeHtml } from '@/lib/cms/sanitizer';
import { 
  ArrowRight, 
  Sparkles, 
  Star, 
  Terminal, 
  Palette, 
  Box, 
  Video, 
  Users, 
  CheckCircle2, 
  HelpCircle,
  ShoppingBag,
  Zap,
  ExternalLink
} from 'lucide-react';

interface CMSBlockRendererProps {
  block: CMSBlock;
  isEditMode?: boolean;
  isSelected?: boolean;
  currentViewport?: ViewportDevice;
  onSelect?: (blockId: string) => void;
  onUpdateContent?: (blockId: string, contentUpdates: Partial<CMSBlock['content']>) => void;
}

export default function CMSBlockRenderer({
  block,
  isEditMode = false,
  isSelected = false,
  currentViewport = 'desktop',
  onSelect,
  onUpdateContent
}: CMSBlockRendererProps) {
  // Check responsive visibility
  if (currentViewport === 'mobile' && block.styles.mobile?.hide) return null;
  if (currentViewport === 'tablet' && block.styles.tablet?.hide) return null;

  const handleClick = (e: React.MouseEvent) => {
    if (isEditMode && onSelect) {
      e.stopPropagation();
      onSelect(block.id);
    }
  };

  // Compile responsive and standard styles into an inline style object
  const getComputedStyle = (): React.CSSProperties => {
    const s = block.styles;
    const isMobile = currentViewport === 'mobile';
    const isTablet = currentViewport === 'tablet';

    return {
      fontFamily: s.fontFamily,
      fontSize: (isMobile && s.mobile?.fontSize) || (isTablet && s.tablet?.fontSize) || s.fontSize,
      fontWeight: s.fontWeight,
      lineHeight: (isMobile && s.mobile?.lineHeight) || s.lineHeight,
      letterSpacing: s.letterSpacing,
      textAlign: (isMobile && s.mobile?.textAlign) || s.textAlign,
      color: s.textColor,
      textTransform: s.textTransform,
      textDecoration: s.textDecoration,
      backgroundColor: s.backgroundColor,
      background: s.bgGradient || s.backgroundColor,
      marginTop: (isMobile && s.mobile?.marginTop) || s.marginTop,
      marginRight: s.marginRight,
      marginBottom: (isMobile && s.mobile?.marginBottom) || s.marginBottom,
      marginLeft: s.marginLeft,
      paddingTop: (isMobile && s.mobile?.paddingTop) || s.paddingTop,
      paddingRight: (isMobile && s.mobile?.paddingRight) || s.paddingRight,
      paddingBottom: (isMobile && s.mobile?.paddingBottom) || s.paddingBottom,
      paddingLeft: (isMobile && s.mobile?.paddingLeft) || s.paddingLeft,
      borderWidth: s.borderWidth,
      borderColor: s.borderColor,
      borderStyle: s.borderStyle,
      borderRadius: s.borderRadius,
      width: s.width,
      maxWidth: s.maxWidth,
      height: s.height,
      opacity: s.opacity
    };
  };

  const computedStyle = getComputedStyle();
  const selectionClass = isEditMode
    ? isSelected
      ? 'ring-2 ring-teal-400 ring-offset-2 ring-offset-slate-950 shadow-lg'
      : 'hover:outline-dashed hover:outline-1 hover:outline-teal-500/50 transition-all cursor-pointer'
    : '';

  switch (block.type) {
    case 'heading': {
      const level = block.content.level || 2;
      const HeadingTag = `h${level}` as keyof React.JSX.IntrinsicElements;
      return (
        <HeadingTag
          id={block.styles.anchorId}
          onClick={handleClick}
          style={computedStyle}
          className={`tracking-tight ${selectionClass} ${block.styles.customClass || ''}`}
        >
          {block.content.text || 'Heading text'}
        </HeadingTag>
      );
    }

    case 'paragraph':
      return (
        <p
          id={block.styles.anchorId}
          onClick={handleClick}
          style={computedStyle}
          className={`leading-relaxed ${selectionClass} ${block.styles.customClass || ''}`}
        >
          {block.content.text || 'Paragraph text'}
        </p>
      );

    case 'richText':
      return (
        <div
          id={block.styles.anchorId}
          onClick={handleClick}
          style={computedStyle}
          className={`prose prose-invert max-w-none ${selectionClass} ${block.styles.customClass || ''}`}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.content.html || '') }}
        />
      );

    case 'button': {
      const href = sanitizeUrl(block.content.buttonLink || '/contact');
      const isExternal = block.content.target === '_blank' || href.startsWith('http');
      return (
        <div onClick={handleClick} className={`inline-block ${selectionClass}`}>
          <Link
            href={href}
            target={block.content.target || '_self'}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            style={computedStyle}
            className={`inline-flex items-center gap-2 transition-all active:scale-95 shadow-md ${block.styles.customClass || ''}`}
          >
            <span>{block.content.buttonText || 'Click Here'}</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      );
    }

    case 'image': {
      const src = sanitizeUrl(block.content.url || '/eternals-logo.jpg');
      return (
        <div onClick={handleClick} className={`inline-block max-w-full ${selectionClass}`}>
          <img
            src={src}
            alt={block.content.alt || 'Website visual'}
            style={computedStyle}
            className={`object-cover ${block.styles.customClass || ''}`}
            loading="lazy"
          />
          {block.content.caption && (
            <span className="text-xs text-slate-400 mt-1.5 block text-center italic">
              {block.content.caption}
            </span>
          )}
        </div>
      );
    }

    case 'badge':
      return (
        <span
          onClick={handleClick}
          style={computedStyle}
          className={`inline-flex items-center gap-1.5 text-xs font-bold ${selectionClass} ${block.styles.customClass || ''}`}
        >
          <Sparkles size={13} />
          <span>{String(block.content.badgeText || 'Featured')}</span>
        </span>
      );

    case 'card':
      return (
        <div
          onClick={handleClick}
          style={computedStyle}
          className={`flex flex-col gap-3 shadow-xl transition-all hover:-translate-y-0.5 ${selectionClass} ${block.styles.customClass || ''}`}
        >
          <h4 className="text-lg font-black text-white">{String(block.content.title || 'Card Title')}</h4>
          <p className="text-xs leading-relaxed text-slate-400">{String(block.content.desc || 'Card description...')}</p>
          {block.children && block.children.length > 0 && (
            <div className="pt-2 space-y-2">
              {block.children.map((child) => (
                <CMSBlockRenderer
                  key={child.id}
                  block={child}
                  isEditMode={isEditMode}
                  isSelected={isSelected}
                  currentViewport={currentViewport}
                  onSelect={onSelect}
                  onUpdateContent={onUpdateContent}
                />
              ))}
            </div>
          )}
        </div>
      );

    case 'columns': {
      const cols = Number(block.content.columns) || 3;
      const colClass = cols === 2 ? 'grid-cols-1 md:grid-cols-2' : cols === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-3';
      return (
        <div
          onClick={handleClick}
          style={computedStyle}
          className={`grid ${colClass} ${selectionClass} ${block.styles.customClass || ''}`}
        >
          {block.children && block.children.map((child) => (
            <CMSBlockRenderer
              key={child.id}
              block={child}
              isEditMode={isEditMode}
              isSelected={isSelected}
              currentViewport={currentViewport}
              onSelect={onSelect}
              onUpdateContent={onUpdateContent}
            />
          ))}
        </div>
      );
    }

    case 'stat':
      return (
        <div onClick={handleClick} style={computedStyle} className={`p-5 rounded-2xl bg-slate-900/80 border border-slate-800 ${selectionClass}`}>
          <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">
            {String(block.content.value || '100+')}
          </div>
          <div className="text-xs font-bold text-slate-400 mt-1">
            {String(block.content.label || 'Metrics')}
          </div>
        </div>
      );

    case 'review':
      return (
        <div onClick={handleClick} style={computedStyle} className={`p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between gap-4 ${selectionClass}`}>
          <div className="space-y-2">
            <div className="flex gap-0.5 text-amber-400">
              {[...Array(Number(block.content.rating) || 5)].map((_, i) => (
                <Star key={i} size={14} className="fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              &quot;{String(block.content.content || 'Review text')}&quot;
            </p>
          </div>
          <div className="pt-3 border-t border-slate-800 flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
              {String(block.content.author || 'C').charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs text-white truncate">{String(block.content.author || 'Client')}</div>
              <div className="text-[10px] text-teal-400 truncate">{String(block.content.company || 'Company')}</div>
            </div>
          </div>
        </div>
      );

    case 'spacer':
      return (
        <div
          onClick={handleClick}
          style={{ height: String(block.content.height || '3rem') }}
          className={`w-full ${selectionClass}`}
        />
      );

    case 'divider':
      return (
        <hr
          onClick={handleClick}
          style={computedStyle}
          className={`border-t border-slate-800 my-6 ${selectionClass}`}
        />
      );

    default:
      return (
        <div onClick={handleClick} style={computedStyle} className={`p-4 rounded-xl bg-slate-900/60 border border-slate-800 ${selectionClass}`}>
          <div className="text-xs font-bold text-white">{String(block.content.title || block.label || 'Custom Block')}</div>
          {Boolean(block.content.desc) && <div className="text-xs text-slate-400 mt-1">{String(block.content.desc)}</div>}
        </div>
      );
  }
}
