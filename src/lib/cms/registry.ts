/**
 * Component Registry for CMS Blocks & Sections
 * Defines schemas, editable fields, styling options, and initial states.
 */

import { BlockType, CMSBlock, CMSSection } from '@/types/cms';

export interface ComponentFieldDefinition {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'color' | 'image' | 'boolean' | 'link';
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  defaultValue?: unknown;
}

export interface ComponentDefinition {
  type: BlockType;
  displayName: string;
  category: 'Layout' | 'Content' | 'Marketing' | 'Navigation' | 'Forms';
  icon: string;
  description: string;
  fields: ComponentFieldDefinition[];
  defaultContent: Record<string, unknown>;
  defaultStyles: Record<string, unknown>;
}

export const COMPONENT_REGISTRY: Record<BlockType, ComponentDefinition> = {
  heading: {
    type: 'heading',
    displayName: 'Headline',
    category: 'Content',
    icon: 'Type',
    description: 'Section headline with customizable level and gradient accents.',
    fields: [
      { name: 'text', label: 'Heading Text', type: 'text', defaultValue: 'New Headline' },
      {
        name: 'level',
        label: 'Heading Level',
        type: 'select',
        options: [
          { label: 'H1 (Hero)', value: '1' },
          { label: 'H2 (Section Title)', value: '2' },
          { label: 'H3 (Sub-section)', value: '3' },
          { label: 'H4 (Card Header)', value: '4' }
        ],
        defaultValue: '2'
      }
    ],
    defaultContent: { text: 'Crafting Visual Excellence', level: 2 },
    defaultStyles: { fontSize: '2.25rem', fontWeight: 'bold', textColor: '#ffffff' }
  },

  paragraph: {
    type: 'paragraph',
    displayName: 'Paragraph Text',
    category: 'Content',
    icon: 'AlignLeft',
    description: 'Body copy, descriptions, and subtitle text.',
    fields: [
      { name: 'text', label: 'Paragraph Content', type: 'textarea', defaultValue: 'Enter descriptive paragraph text here.' }
    ],
    defaultContent: { text: 'We transform visions into high-performance web applications, striking graphical assets, and immersive 3D models.' },
    defaultStyles: { fontSize: '1rem', textColor: '#94a3b8', lineHeight: '1.625' }
  },

  richText: {
    type: 'richText',
    displayName: 'Rich Text',
    category: 'Content',
    icon: 'FileText',
    description: 'Formatted HTML copy supporting bold, italic, links, and lists.',
    fields: [
      { name: 'html', label: 'HTML Body', type: 'textarea', defaultValue: '<p>Custom <strong>rich text</strong> description.</p>' }
    ],
    defaultContent: { html: '<p>Empowering digital creators and esports organizations worldwide with cutting-edge visual systems.</p>' },
    defaultStyles: { fontSize: '1rem', textColor: '#cbd5e1' }
  },

  button: {
    type: 'button',
    displayName: 'Action Button',
    category: 'Content',
    icon: 'MousePointer',
    description: 'Interactive call-to-action button linking to internal pages or external URLs.',
    fields: [
      { name: 'buttonText', label: 'Button Label', type: 'text', defaultValue: 'Click Here' },
      { name: 'buttonLink', label: 'Destination URL', type: 'link', defaultValue: '/contact' },
      {
        name: 'target',
        label: 'Open Mode',
        type: 'select',
        options: [
          { label: 'Same Window (_self)', value: '_self' },
          { label: 'New Tab (_blank)', value: '_blank' }
        ],
        defaultValue: '_self'
      }
    ],
    defaultContent: { buttonText: 'Start a Project', buttonLink: '/contact', target: '_self' },
    defaultStyles: {
      borderRadius: '0.75rem',
      paddingTop: '0.875rem',
      paddingBottom: '0.875rem',
      paddingLeft: '1.5rem',
      paddingRight: '1.5rem',
      fontWeight: 'bold',
      bgGradient: 'linear-gradient(to right, #2dd4bf, #6366f1)',
      textColor: '#ffffff'
    }
  },

  image: {
    type: 'image',
    displayName: 'Image',
    category: 'Content',
    icon: 'Image',
    description: 'Optimized responsive image with alt text and zoom.',
    fields: [
      { name: 'url', label: 'Image URL', type: 'image', defaultValue: '/eternals-logo.jpg' },
      { name: 'alt', label: 'Alt Text (Accessibility)', type: 'text', defaultValue: 'Eternals Studio Visual' },
      { name: 'caption', label: 'Caption', type: 'text' }
    ],
    defaultContent: { url: '/eternals-logo.jpg', alt: 'Eternals Studio', caption: '' },
    defaultStyles: { borderRadius: '1rem', width: '100%' }
  },

  video: {
    type: 'video',
    displayName: 'Video Player',
    category: 'Content',
    icon: 'Video',
    description: 'Embedded MP4 or WebM video showcase.',
    fields: [
      { name: 'videoUrl', label: 'Video Source URL', type: 'text', defaultValue: '' }
    ],
    defaultContent: { videoUrl: '' },
    defaultStyles: { borderRadius: '1rem', width: '100%' }
  },

  icon: {
    type: 'icon',
    displayName: 'Icon Badge',
    category: 'Content',
    icon: 'Sparkles',
    description: 'Vector icon glyph inside a stylized container.',
    fields: [
      { name: 'iconName', label: 'Icon Name', type: 'text', defaultValue: 'Sparkles' }
    ],
    defaultContent: { iconName: 'Sparkles' },
    defaultStyles: { textColor: '#14b8a6', width: '48px', height: '48px' }
  },

  card: {
    type: 'card',
    displayName: 'Feature Card',
    category: 'Layout',
    icon: 'Square',
    description: 'Contained card block with border, padding, and subtle neon shadow.',
    fields: [
      { name: 'title', label: 'Card Title', type: 'text', defaultValue: 'Card Title' },
      { name: 'desc', label: 'Card Description', type: 'textarea', defaultValue: 'Description of this feature.' }
    ],
    defaultContent: { title: 'High-Performance Engineering', desc: 'Sub-second load times and rock-solid Next.js architecture.' },
    defaultStyles: {
      backgroundColor: '#0f172a',
      borderRadius: '1rem',
      paddingTop: '1.5rem',
      paddingBottom: '1.5rem',
      paddingLeft: '1.5rem',
      paddingRight: '1.5rem',
      borderWidth: '1px',
      borderColor: '#1e293b'
    }
  },

  columns: {
    type: 'columns',
    displayName: 'Multi-Column Grid',
    category: 'Layout',
    icon: 'Columns',
    description: 'Flexible 2, 3, or 4 column layout container.',
    fields: [
      {
        name: 'columns',
        label: 'Desktop Columns',
        type: 'select',
        options: [
          { label: '2 Columns', value: '2' },
          { label: '3 Columns', value: '3' },
          { label: '4 Columns', value: '4' }
        ],
        defaultValue: '3'
      }
    ],
    defaultContent: { columns: 3 },
    defaultStyles: { gap: '1.5rem', display: 'grid' }
  },

  grid: {
    type: 'grid',
    displayName: 'Content Grid',
    category: 'Layout',
    icon: 'Grid',
    description: 'Adaptive responsive items grid.',
    fields: [],
    defaultContent: {},
    defaultStyles: { gap: '1.5rem', display: 'grid' }
  },

  spacer: {
    type: 'spacer',
    displayName: 'Vertical Spacer',
    category: 'Layout',
    icon: 'Maximize2',
    description: 'Empty space block to adjust vertical breathing room.',
    fields: [
      { name: 'height', label: 'Height (rem or px)', type: 'text', defaultValue: '3rem' }
    ],
    defaultContent: { height: '3rem' },
    defaultStyles: { height: '3rem' }
  },

  divider: {
    type: 'divider',
    displayName: 'Separator Line',
    category: 'Layout',
    icon: 'Minus',
    description: 'Subtle gradient border divider between sections.',
    fields: [],
    defaultContent: {},
    defaultStyles: { marginTop: '2rem', marginBottom: '2rem', borderColor: '#1e293b' }
  },

  badge: {
    type: 'badge',
    displayName: 'Badge Pill',
    category: 'Content',
    icon: 'Tag',
    description: 'Rounded status pill highlighting promotions or features.',
    fields: [
      { name: 'badgeText', label: 'Badge Text', type: 'text', defaultValue: 'Featured' }
    ],
    defaultContent: { badgeText: '⚡ Now Live' },
    defaultStyles: {
      backgroundColor: 'rgba(20, 184, 166, 0.1)',
      textColor: '#2dd4bf',
      borderRadius: '9999px',
      paddingLeft: '0.75rem',
      paddingRight: '0.75rem',
      paddingTop: '0.375rem',
      paddingBottom: '0.375rem'
    }
  },

  stat: {
    type: 'stat',
    displayName: 'Metric Stat Block',
    category: 'Marketing',
    icon: 'BarChart2',
    description: 'Numeric stat value with descriptive label.',
    fields: [
      { name: 'value', label: 'Metric Value', type: 'text', defaultValue: '100+' },
      { name: 'label', label: 'Metric Label', type: 'text', defaultValue: 'Delivered Projects' }
    ],
    defaultContent: { value: '13+', label: 'Completed Deliveries' },
    defaultStyles: { textAlign: 'center' }
  },

  review: {
    type: 'review',
    displayName: 'Client Review Card',
    category: 'Marketing',
    icon: 'Star',
    description: 'Client testimonial with author, role, quote, and 5-star rating.',
    fields: [
      { name: 'author', label: 'Client Name', type: 'text', defaultValue: 'Alex Vance' },
      { name: 'role', label: 'Role / Title', type: 'text', defaultValue: 'Team Captain' },
      { name: 'company', label: 'Organization', type: 'text', defaultValue: 'Apex Org' },
      { name: 'content', label: 'Review Text', type: 'textarea', defaultValue: 'Outstanding turnaround and stunning visual assets.' }
    ],
    defaultContent: { author: 'Marcus Vance', role: 'Team Captain', company: 'Apex Predator Clan', content: 'Eternals Studio completely redefined our competitive gaming identity.', rating: 5 },
    defaultStyles: { backgroundColor: '#0f172a', borderRadius: '1rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingTop: '1.5rem', paddingBottom: '1.5rem' }
  },

  teamMember: {
    type: 'teamMember',
    displayName: 'Team Member Card',
    category: 'Marketing',
    icon: 'Users',
    description: 'Member avatar, name, specialization, and social tags.',
    fields: [
      { name: 'name', label: 'Member Name', type: 'text', defaultValue: 'Fives' },
      { name: 'role', label: 'Role Title', type: 'text', defaultValue: 'Founder & Lead Developer' }
    ],
    defaultContent: { name: 'Fives', role: 'Founder & Lead Architect', initial: 'F', color: 'bg-teal-500' },
    defaultStyles: { backgroundColor: '#0f172a', borderRadius: '1rem' }
  },

  faq: {
    type: 'faq',
    displayName: 'FAQ Item',
    category: 'Content',
    icon: 'HelpCircle',
    description: 'Expandable question and answer block.',
    fields: [
      { name: 'title', label: 'Question', type: 'text', defaultValue: 'What is your turnaround time?' },
      { name: 'desc', label: 'Answer', type: 'textarea', defaultValue: 'Deliveries are typically ready in 3 to 7 business days.' }
    ],
    defaultContent: { title: 'What source files do you provide?', desc: 'Full Figma prototypes, Adobe vector assets, and clean production Next.js source code.' },
    defaultStyles: { borderRadius: '0.75rem', backgroundColor: '#0f172a' }
  },

  form: {
    type: 'form',
    displayName: 'Interactive Form',
    category: 'Forms',
    icon: 'Inbox',
    description: 'Client contact or project request submission form.',
    fields: [
      { name: 'title', label: 'Form Title', type: 'text', defaultValue: 'Start Your Inquiry' },
      { name: 'buttonText', label: 'Submit Button', type: 'text', defaultValue: 'Send Message' }
    ],
    defaultContent: { title: 'Contact Studio Team', buttonText: 'Send Message' },
    defaultStyles: { borderRadius: '1.5rem', backgroundColor: '#0f172a' }
  },

  quote: {
    type: 'quote',
    displayName: 'Pull Quote',
    category: 'Content',
    icon: 'Quote',
    description: 'Highlighted quotation with accent border.',
    fields: [
      { name: 'text', label: 'Quote', type: 'textarea', defaultValue: 'Where ideas become digital reality.' },
      { name: 'author', label: 'Citation', type: 'text', defaultValue: 'Eternals Studio' }
    ],
    defaultContent: { text: 'Where Ideas Become Reality.', author: 'Eternals Collective' },
    defaultStyles: { borderLeft: '4px solid #14b8a6', paddingLeft: '1.5rem', fontStyle: 'italic' }
  },

  custom: {
    type: 'custom',
    displayName: 'Custom Block',
    category: 'Content',
    icon: 'Box',
    description: 'Freeform block with title, subtitle, and action link.',
    fields: [
      { name: 'title', label: 'Title', type: 'text', defaultValue: 'Custom Block' },
      { name: 'desc', label: 'Content', type: 'textarea', defaultValue: 'Custom details...' }
    ],
    defaultContent: { title: 'Custom Feature', desc: 'Custom component block.' },
    defaultStyles: { borderRadius: '1rem', backgroundColor: '#0f172a' }
  },

  html: {
    type: 'html',
    displayName: 'Custom HTML/Embed',
    category: 'Content',
    icon: 'Code',
    description: 'Sanitized HTML snippet for embedding widgets or badges.',
    fields: [
      { name: 'html', label: 'HTML Content', type: 'textarea', defaultValue: '<div>Custom HTML</div>' }
    ],
    defaultContent: { html: '<div class="text-xs text-slate-400">Custom embed block</div>' },
    defaultStyles: {}
  }
};
