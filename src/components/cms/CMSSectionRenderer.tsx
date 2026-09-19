'use client';

import React from 'react';
import { CMSSection, ViewportDevice } from '@/types/cms';
import CMSBlockRenderer from './CMSBlockRenderer';

interface CMSSectionRendererProps {
  section: CMSSection;
  isEditMode?: boolean;
  selectedBlockId?: string | null;
  currentViewport?: ViewportDevice;
  onSelectBlock?: (blockId: string) => void;
  onUpdateBlockContent?: (blockId: string, contentUpdates: Record<string, unknown>) => void;
}

export default function CMSSectionRenderer({
  section,
  isEditMode = false,
  selectedBlockId = null,
  currentViewport = 'desktop',
  onSelectBlock,
  onUpdateBlockContent
}: CMSSectionRendererProps) {
  if (section.isHidden) return null;

  // Responsive device visibility
  if (currentViewport === 'mobile' && section.styles.mobile?.hide) return null;
  if (currentViewport === 'tablet' && section.styles.tablet?.hide) return null;

  // Background style computation
  const getBgStyle = () => {
    const s = section.styles;
    switch (s.backgroundType) {
      case 'mesh':
        return 'bg-slate-950 relative overflow-hidden';
      case 'slate':
        return 'bg-slate-900/90';
      case 'glass':
        return 'bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 shadow-2xl';
      case 'glow':
        return 'bg-gradient-to-b from-teal-950/20 via-slate-950 to-slate-950 border-t border-teal-500/20';
      case 'gradient':
        return 'bg-gradient-to-r from-teal-500/10 via-indigo-500/10 to-purple-500/10';
      default:
        return 'bg-transparent';
    }
  };

  // Vertical padding computation
  const getPaddingClass = () => {
    const s = section.styles;
    const isMobile = currentViewport === 'mobile';
    if (isMobile && s.mobile?.paddingTop) return '';

    switch (s.paddingVertical) {
      case 'compact':
        return 'py-8';
      case 'spacious':
        return 'py-24 md:py-32';
      case 'none':
        return 'py-0';
      case 'standard':
      default:
        return 'py-14 md:py-20';
    }
  };

  // Max width container computation
  const getMaxWidthClass = () => {
    switch (section.styles.maxWidth) {
      case 'sm':
        return 'max-w-3xl';
      case 'md':
        return 'max-w-4xl';
      case 'lg':
        return 'max-w-5xl';
      case '2xl':
      case 'full':
        return 'max-w-full';
      case 'xl':
      default:
        return 'max-w-7xl';
    }
  };

  const inlineStyles: React.CSSProperties = {
    backgroundColor: section.styles.backgroundColor,
    backgroundImage: section.styles.bgImageUrl ? `url(${section.styles.bgImageUrl})` : undefined,
    paddingTop: section.styles.paddingTop,
    paddingBottom: section.styles.paddingBottom
  };

  return (
    <section
      id={section.styles.anchorId || `sec-${section.id}`}
      style={inlineStyles}
      className={`w-full ${getBgStyle()} ${getPaddingClass()} px-6 sm:px-8 transition-colors ${section.styles.customClass || ''}`}
    >
      <div className={`mx-auto ${getMaxWidthClass()} relative z-10 flex flex-col gap-8`}>
        {/* Render all Blocks inside this section in order */}
        {section.blocks && section.blocks.map((block) => (
          <CMSBlockRenderer
            key={block.id}
            block={block}
            isEditMode={isEditMode}
            isSelected={selectedBlockId === block.id}
            currentViewport={currentViewport}
            onSelect={onSelectBlock}
            onUpdateContent={onUpdateBlockContent}
          />
        ))}
      </div>
    </section>
  );
}
