export interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription?: string;
  price: number;
  category: 'templates' | 'graphics' | 'assets' | 'presets';
  image_url?: string;
  showcase_images?: string[];
  demo_video_url?: string;
  download_file_url?: string;
  is_exclusive?: boolean;
  is_sold?: boolean;
  features?: string[];
  file_formats?: string[];
  file_size?: string;
  license?: string;
  created_at?: string;
}

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Website Template Pack',
    description: 'Modern, responsive website templates built with React, Next.js, and Tailwind CSS.',
    fullDescription: 'Elevate your web presence with our flagship Website Template Pack. Engineered specifically for high-growth tech companies, digital creative agencies, and gaming organizations. Every template is production-ready, highly accessible, fully responsive across mobile and 4K displays, and built according to strict SEO best practices.',
    price: 49.99,
    category: 'templates',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    showcase_images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    ],
    demo_video_url: 'https://www.youtube.com/embed/ScMzIvxBSi4',
    download_file_url: 'https://eternals.studio/downloads/eternals-website-templates-v2.zip',
    features: [
      '3 Complete Multi-Page Themes (Agency, SaaS, Esports)',
      'Dark & Light Mode Included with Tailwind CSS v4',
      'Integrated Clerk Auth & Stripe Checkout Component Hooks',
      'TypeScript Strict Mode Compliant',
      'Lighthouse 98+ Performance Score'
    ],
    file_formats: ['Next.js 16', 'React 19', 'Tailwind CSS', 'TypeScript'],
    file_size: '42.8 MB (ZIP)',
    license: 'Commercial & Personal Use'
  },
  {
    id: '2',
    name: 'Logo Design Bundle',
    description: '50+ premium vector brand and esports logo assets with layered vector files.',
    fullDescription: 'A comprehensive kit containing over 50 versatile logo concepts, monograms, emblems, and mascot vectors tailored for competitive gaming organizations, streaming communities, and creative studios. Delivered in layered Adobe Illustrator and SVG formats for lossless scalability.',
    price: 29.99,
    category: 'graphics',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    showcase_images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80'
    ],
    download_file_url: 'https://eternals.studio/downloads/eternals-logo-bundle-50.zip',
    features: [
      '50+ Unique Vector Logos & Mascots',
      '100% Scalable Vector Shapes',
      'RGB & CMYK Print-Ready Profiles',
      'Free Commercial Typography Pairing Guide'
    ],
    file_formats: ['AI', 'EPS', 'SVG', 'PNG (Transparent)'],
    file_size: '185 MB',
    license: 'Commercial Royalty-Free'
  },
  {
    id: '3',
    name: '3D Model Collection',
    description: 'High-quality 3D assets for digital renders, spatial scenes, and stream overlays.',
    fullDescription: 'Precision 3D geometries and materials designed for cinema-grade renders, website canvas backgrounds, and broadcast graphics. Includes low-poly and high-poly variants with 4K PBR texture maps (diffuse, roughness, normal, displacement).',
    price: 79.99,
    category: 'assets',
    image_url: 'https://images.unsplash.com/photo-1633493106115-f269a9b9a97e?auto=format&fit=crop&w=1200&q=80',
    showcase_images: [
      'https://images.unsplash.com/photo-1633493106115-f269a9b9a97e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
    ],
    demo_video_url: 'https://www.youtube.com/embed/ScMzIvxBSi4',
    download_file_url: 'https://eternals.studio/downloads/eternals-3d-collection.zip',
    features: [
      '15 Curated 3D Models (Futuristic & Geometric)',
      '4K PBR Metallic/Roughness Texture Maps',
      'Optimized UV Unwrapping',
      'Compatible with Blender, Cinema 4D, Maya, and Three.js'
    ],
    file_formats: ['OBJ', 'FBX', 'GLTF/GLB', 'BLEND'],
    file_size: '640 MB',
    license: 'Commercial Unlimited'
  },
  {
    id: '4',
    name: 'Color Grading Presets',
    description: 'Professional LUT presets for film, YouTube videos, and stream camera editors.',
    fullDescription: 'Turn flat log footage into high-contrast cinematic masterpieces with our calibrated LUT collection. Developed by studio colorists to preserve skin tones while delivering rich teal/orange and cyber neon aesthetics.',
    price: 19.99,
    category: 'presets',
    image_url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80',
    showcase_images: [
      'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80'
    ],
    download_file_url: 'https://eternals.studio/downloads/eternals-cinematic-luts.zip',
    features: [
      '24 Custom 3D CUBE LUTs',
      'Optimized for Rec.709, S-Log3, C-Log, and D-Log',
      'Premiere Pro, DaVinci Resolve, and Final Cut Pro Compatibility',
      'Before/After Reference Guide'
    ],
    file_formats: ['.CUBE', '.3DL'],
    file_size: '14.2 MB',
    license: 'Personal & Commercial Use'
  },
  {
    id: '5',
    name: 'Social Media Templates',
    description: 'Instagram grid layouts, YouTube headers, and Twitter broadcast banners.',
    fullDescription: 'Consistency is king on social platforms. This kit equips your brand with modular Photoshop & Figma templates for YouTube thumbnails, Twitter banners, Instagram carousel posts, and Twitch panels.',
    price: 24.99,
    category: 'templates',
    image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80',
    showcase_images: [
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80'
    ],
    download_file_url: 'https://eternals.studio/downloads/eternals-social-templates.zip',
    features: [
      '30+ Ready-to-edit templates',
      'Figma Components & Auto-Layout Support',
      'Organized Smart Objects in PSD',
      'Social Platform Spec Cheat Sheet'
    ],
    file_formats: ['FIG (Figma)', 'PSD (Photoshop)'],
    file_size: '95 MB',
    license: 'Commercial Unlimited'
  },
  {
    id: '6',
    name: 'Icon Pack Collection',
    description: '1000+ custom vector icons designed for UI designers and web apps.',
    fullDescription: 'Pixel-perfect vector icon system built on a 24x24 grid. Includes outline, duotone, and solid variations with uniform stroke weights for seamless UI integrations.',
    price: 24.99,
    category: 'graphics',
    image_url: 'https://images.unsplash.com/photo-1618788372246-79faff0c3742?auto=format&fit=crop&w=1200&q=80',
    showcase_images: [
      'https://images.unsplash.com/photo-1618788372246-79faff0c3742?auto=format&fit=crop&w=1200&q=80'
    ],
    download_file_url: 'https://eternals.studio/downloads/eternals-icons-1000.zip',
    features: [
      '1,000+ Unique Icon Geometries',
      'Outline, Filled, & Duotone Variants',
      'Direct React Component & SVG Export',
      'Lucide & Feather Icon Compatibility'
    ],
    file_formats: ['SVG', 'React Icons (TSX)', 'FIG'],
    file_size: '12 MB',
    license: 'MIT / Commercial Permissive'
  },
  {
    id: '7',
    name: 'Valkyrie Esports Monogram (1-of-1 Exclusive)',
    description: 'Exclusive 1-of-1 mascot brand package. Once purchased, transferred exclusively and removed from store.',
    fullDescription: 'A completely unique, hand-crafted esports mascot logo and brand guidelines package. Designed by the lead Eternals Studio brand architects. Includes full intellectual property transfer, trademark ownership documentation, social kit, jerseys vectors, and source files. Once purchased by a client or organization, no one else can purchase this package.',
    price: 199.99,
    category: 'graphics',
    image_url: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80',
    showcase_images: [
      'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
    ],
    download_file_url: 'https://eternals.studio/downloads/eternals-valkyrie-exclusive-package.zip',
    is_exclusive: true,
    is_sold: false,
    features: [
      'Exclusive 1-of-1 Full Ownership (Permanent Store Removal)',
      'Vector Mascot Artwork + Monogram Variants',
      'Full Copyright & Commercial Trademark Transfer Agreement',
      'Sublimation-Ready Jersey Vectors',
      'Animated Twitch / Discord Server Icon Variants'
    ],
    file_formats: ['AI (Master)', 'EPS', 'SVG', 'PNG', 'PDF Contract'],
    file_size: '340 MB',
    license: 'Exclusive 1-of-1 Full IP Transfer'
  }
];

// Helper to check if an exclusive product is sold out
export function isProductSoldOut(productId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const soldIds = JSON.parse(localStorage.getItem('soldProductIds') || '[]');
    return soldIds.includes(productId);
  } catch {
    return false;
  }
}

// Helper to mark a product as sold
export function markProductAsSold(productId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const soldIds = JSON.parse(localStorage.getItem('soldProductIds') || '[]');
    if (!soldIds.includes(productId)) {
      localStorage.setItem('soldProductIds', JSON.stringify([...soldIds, productId]));
    }
  } catch (e) {
    console.error('Failed to mark product as sold:', e);
  }
}
