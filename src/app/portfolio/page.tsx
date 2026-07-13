'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ArrowRight, Trash2 } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { supabase } from '../../lib/supabase';

interface Project {
  id?: string;
  title: string;
  category: 'branding' | 'esports' | 'sports' | '3d' | 'illustration' | 'design';
  subtitle: string;
  desc: string;
  tags: string[];
  badges: string[];
  svg?: React.ReactNode;
  image_url?: string;
  is_custom?: boolean;
}

const STATIC_PROJECTS: Project[] = [
  {
    title: 'Hyper Wallpaper',
    category: 'illustration',
    subtitle: 'Illustrator | Vector Art',
    desc: 'A custom design for competitive players with elements from Apex & Valorant.',
    tags: ['Wallpaper', 'Desktop', 'Vector Art'],
    badges: ['Featured', 'Client'],
    svg: (
      <svg width="100%" height="100%" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="grad-hyper" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a263f" />
            <stop offset="100%" stopColor="#0b0f19" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad-hyper)" />
        <path d="M100 35c-20 0-30 15-30 30 0 10 5 15 5 20 0 5-5 5-5 10s10 5 15 0 10-5 15-5 10 5 15 5 15 0 15-5-5-5-5-10 5-10 5-20c0-15-10-30-30-30zm-10 25c-3 0-5-2-5-5s2-5 5-5 5 2 5 5-2 5-5 5zm20 0c-3 0-5-2-5-5s2-5 5-5 5 2 5 5-2 5-5 5z" fill="#ffffff" opacity="0.9" />
        <text x="100" y="108" fontFamily="sans-serif" fontWeight="900" fontSize="12" fill="#ffffff" letterSpacing="4" textAnchor="middle" opacity="0.9">HYPER</text>
      </svg>
    )
  },
  {
    title: 'Midas Networks',
    category: 'branding',
    subtitle: 'Logo Design',
    desc: 'A multi-gaming clan/esports team based in Europe, North America, and other regions.',
    tags: ['Gaming', 'Network', 'Brand Logo'],
    badges: ['Client', 'Brand'],
    svg: (
      <svg width="100%" height="100%" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="grad-midas" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2c1a0f" />
            <stop offset="100%" stopColor="#140b06" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad-midas)" />
        <path d="M100 35 L120 50 L115 80 L100 90 L85 80 L80 50 Z" fill="none" stroke="#ff9f43" strokeWidth="3" />
        <path d="M90 55 L100 47 L110 55 L105 70 L95 70 Z" fill="#ff9f43" opacity="0.8" />
        <text x="100" y="108" fontFamily="sans-serif" fontWeight="900" fontSize="12" fill="#ff9f43" letterSpacing="4" textAnchor="middle">MIDAS</text>
      </svg>
    )
  },
  {
    title: 'Eternals Studio',
    category: 'branding',
    subtitle: 'Logo Design',
    desc: 'A logo/VFX/Coding team created for developers.',
    tags: ['Coding', 'Branding', 'Creative'],
    badges: ['Featured', 'Brand'],
    svg: (
      <svg width="100%" height="100%" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="grad-eternals" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0f2b30" />
            <stop offset="100%" stopColor="#061214" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad-eternals)" />
        <path d="M100 32 L125 57 L100 82 L75 57 Z" fill="none" stroke="#40e0d0" strokeWidth="3" />
        <circle cx="100" cy="57" r="10" fill="#8a7fd6" opacity="0.8" />
        <text x="100" y="108" fontFamily="sans-serif" fontWeight="800" fontSize="10" fill="#ffffff" letterSpacing="3" textAnchor="middle">ETERNALS STUDIO</text>
      </svg>
    )
  },
  {
    title: 'Eternals VFX',
    category: 'esports',
    subtitle: 'Banner/Thumbnail Design',
    desc: 'Visual assets made for esports matches and streaming content.',
    tags: ['VFX', 'Esports', 'Visuals'],
    badges: ['Featured'],
    svg: (
      <svg width="100%" height="100%" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-vfx" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4a154b" />
            <stop offset="100%" stopColor="#110412" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad-vfx)" />
        <circle cx="100" cy="50" r="18" fill="none" stroke="#e01e5a" strokeWidth="3" />
        <path d="M90 40 L115 50 L90 60 Z" fill="#e01e5a" />
        <text x="100" y="108" fontFamily="sans-serif" fontWeight="800" fontSize="10" fill="#ffffff" letterSpacing="3" textAnchor="middle">ETERNALS VFX</text>
      </svg>
    )
  },
  {
    title: 'Midas Football Logo',
    category: 'sports',
    subtitle: 'Football Identity',
    desc: 'An soccer club logo/rebrand design created to celebrate their 15 year anniversary.',
    tags: ['Football', 'Logo Design', 'Sports Icon'],
    badges: ['Client'],
    svg: (
      <svg width="100%" height="100%" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="grad-sports" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#111c2e" />
            <stop offset="100%" stopColor="#05080e" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad-sports)" />
        <circle cx="100" cy="50" r="22" fill="none" stroke="#f1c40f" strokeWidth="3" />
        <path d="M100 28 L100 72 M78 50 L122 50" stroke="#f1c40f" strokeWidth="2" />
        <text x="100" y="108" fontFamily="sans-serif" fontWeight="900" fontSize="11" fill="#f1c40f" letterSpacing="3" textAnchor="middle">MIDAS ATHLETICS</text>
      </svg>
    )
  },
  {
    title: 'Nave Esports mascot',
    category: 'esports',
    subtitle: 'Mascot Design',
    desc: 'A premium character logo layout featuring futuristic elements, customized for streaming.',
    tags: ['Mascot', 'Esports Logo', 'Illustration'],
    badges: ['Client', 'Brand'],
    svg: (
      <svg width="100%" height="100%" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="grad-mascot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2c112e" />
            <stop offset="100%" stopColor="#110512" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad-mascot)" />
        <path d="M100 30 L130 75 L115 80 L100 70 L85 80 L70 75 Z" fill="none" stroke="#9b59b6" strokeWidth="3.5" />
        <path d="M92 48 L100 40 L108 48 M100 40 L100 60" stroke="#9b59b6" strokeWidth="2.5" />
        <text x="100" y="108" fontFamily="sans-serif" fontWeight="900" fontSize="11" fill="#ffffff" letterSpacing="3" textAnchor="middle">NAVE MASCOT</text>
      </svg>
    )
  },
  {
    title: 'Nave Dev Page',
    category: 'design',
    subtitle: 'Social Media',
    desc: 'A variety streamer turned game developer.',
    tags: ['Streamer', 'Game Dev', 'Layouts'],
    badges: ['Featured'],
    svg: (
      <svg width="100%" height="100%" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="grad-nave" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0e2b2a" />
            <stop offset="100%" stopColor="#040e0e" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad-nave)" />
        <path d="M80 50 A 15 15 0 0 1 120 50 A 15 15 0 0 1 80 50" fill="none" stroke="#1abc9c" strokeWidth="3" />
        <text x="100" y="58" fontFamily="sans-serif" fontWeight="900" fontSize="18" fill="#ffffff" textAnchor="middle">NAVE</text>
        <text x="100" y="108" fontFamily="sans-serif" fontWeight="900" fontSize="11" fill="#1abc9c" letterSpacing="3" textAnchor="middle">STREAMER</text>
      </svg>
    )
  },
  {
    title: 'YouTube Thumbnails',
    category: 'design',
    subtitle: 'Thumbnail Design',
    desc: 'Visuals created to help align and draw audiences to particular video content.',
    tags: ['Design', 'YouTube', 'Thumbnails'],
    badges: ['Featured'],
    svg: (
      <svg width="100%" height="100%" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-thumb" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff4655" />
            <stop offset="100%" stopColor="#111723" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad-thumb)" />
        <text x="30" y="50" fontFamily="sans-serif" fontWeight="900" fontSize="16" fill="#ffffff" transform="skewX(-10)">VALORANT</text>
        <text x="30" y="75" fontFamily="sans-serif" fontWeight="900" fontSize="20" fill="#ffffff" transform="skewX(-10)">TEAM TAPE</text>
        <path d="M150 30 L180 80 L140 100 Z" fill="#ffffff" opacity="0.15" />
        <text x="100" y="108" fontFamily="sans-serif" fontWeight="900" fontSize="10" fill="#ffffff" letterSpacing="3" textAnchor="middle" opacity="0.6">THUMBNAIL DESIGN</text>
      </svg>
    )
  },
  {
    title: '3D Work Collection',
    category: '3d',
    subtitle: '3D Modeling',
    desc: 'This is our selection of completed 3D work.',
    tags: ['3D', 'Rendering', 'Showcase'],
    badges: ['Client'],
    svg: (
      <svg width="100%" height="100%" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="grad-3d" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#24103f" />
            <stop offset="100%" stopColor="#0a0414" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad-3d)" />
        <path d="M60 70 C60 40 100 40 100 60 C100 80 140 80 140 50 C140 20 100 20 100 40 C100 60 60 60 60 70 Z" fill="none" stroke="#9b59b6" strokeWidth="4" />
        <path d="M60 70 C60 40 100 40 100 60" fill="none" stroke="#00f2fe" strokeWidth="2" />
        <text x="100" y="108" fontFamily="sans-serif" fontWeight="800" fontSize="10" fill="#ffffff" letterSpacing="3" textAnchor="middle">3D SHOWCASE</text>
      </svg>
    )
  },
  {
    title: 'Clone Wars',
    category: 'illustration',
    subtitle: 'Film Production',
    desc: 'A CGI animation film that specialized in Star Wars. The Clone Wars ending and animations.',
    tags: ['Animation', 'Star Wars', 'CGI Film'],
    badges: ['Featured', 'Client'],
    svg: (
      <svg width="100%" height="100%" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="grad-clone" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2c3e50" />
            <stop offset="100%" stopColor="#0f171e" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad-clone)" />
        <path d="M100 30 C85 30 75 40 75 60 L75 85 L85 85 L90 75 L110 75 L115 85 L125 85 L125 60 C125 40 115 30 100 30 Z M90 50 L110 50 L110 55 L90 55 Z" fill="none" stroke="#bdc3c7" strokeWidth="3" />
        <path d="M100 55 L100 70" stroke="#ff4655" strokeWidth="2" />
        <text x="100" y="108" fontFamily="sans-serif" fontWeight="900" fontSize="11" fill="#bdc3c7" letterSpacing="3" textAnchor="middle">CLONE WARS</text>
      </svg>
    )
  },
  {
    title: 'Esports Banners',
    category: 'design',
    subtitle: 'Social Media',
    desc: 'Banners created for all platforms to promote brand identities.',
    tags: ['Banners', 'Esports', 'Branding'],
    badges: ['Client'],
    svg: (
      <svg width="100%" height="100%" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-banner" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8a7fd6" />
            <stop offset="100%" stopColor="#40e0d0" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="#111116" />
        <rect x="10" y="30" width="180" height="50" fill="url(#grad-banner)" rx="4" opacity="0.85" />
        <circle cx="40" cy="55" r="15" fill="#111" opacity="0.5" />
        <text x="100" y="60" fontFamily="sans-serif" fontWeight="900" fontSize="12" fill="#ffffff" letterSpacing="2" textAnchor="middle">ESPORTS BANNER</text>
        <text x="100" y="108" fontFamily="sans-serif" fontWeight="900" fontSize="11" fill="#40e0d0" letterSpacing="3" textAnchor="middle">BANNER DESIGN</text>
      </svg>
    )
  }
];

export default function Portfolio() {
  const { isAdminMode, triggerCatalogRefresh } = useAdmin();
  const [filter, setFilter] = useState<string>('all');
  const [dbProjects, setDbProjects] = useState<Project[]>([]);
  const [localProjects, setLocalProjects] = useState<Project[]>([]);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const categories = [
    { value: 'all', label: 'All Projects' },
    { value: 'branding', label: 'Branding' },
    { value: 'esports', label: 'Esports' },
    { value: 'sports', label: 'Sports' },
    { value: '3d', label: '3D Model' },
    { value: 'illustration', label: 'Illustration' },
    { value: 'design', label: 'Design' },
  ];

  // Dynamic Portfolio Loading Hook
  useEffect(() => {
    async function loadPortfolio() {
      try {
        const { data, error } = await supabase
          .from('portfolio')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setDbProjects(data.map((item: any) => ({
            id: item.id,
            title: item.title,
            category: item.category,
            subtitle: item.subtitle,
            desc: item.description,
            tags: item.tags || [],
            badges: item.badges || ['Client'],
            image_url: item.image_url,
            is_custom: true
          })));
        }
      } catch (e) {
        console.warn('Supabase portfolio loading bypassed:', e);
      }
    }

    // Load local storage custom projects
    const locals = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('localCustomPortfolio') || '[]')
      : [];
    setLocalProjects(locals.map((p: any) => ({ ...p, is_custom: true })));

    loadPortfolio();
  }, [refreshKey]);

  // Handle Delete Portfolio Item
  const handleDelete = async (project: Project) => {
    if (!project.id) return;
    if (!confirm(`Are you sure you want to delete "${project.title}" from the portfolio?`)) return;

    if (String(project.id).startsWith('local-')) {
      // Local delete
      const updated = localProjects.filter(p => p.id !== project.id);
      localStorage.setItem('localCustomPortfolio', JSON.stringify(updated));
      setLocalProjects(updated);
      alert('Portfolio project deleted locally!');
    } else {
      // Server delete
      try {
        const response = await fetch(`/api/admin/portfolio?id=${project.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Portfolio project deleted successfully!');
          setRefreshKey(prev => prev + 1);
          triggerCatalogRefresh(); // refresh contexts
        } else {
          const data = await response.json();
          alert(data.error || 'Failed to delete portfolio project');
        }
      } catch (err: any) {
        alert('Error: ' + err.message);
      }
    }
  };

  // Merge dynamic items first, then static items
  const allProjects = [...dbProjects, ...localProjects, ...STATIC_PROJECTS];

  const filteredProjects = filter === 'all'
    ? allProjects
    : allProjects.filter(p => p.category === filter);

  return (
    <>
      <Navbar />

      <main className="flex-1 relative overflow-hidden bg-transparent text-slate-900 dark:text-slate-50 py-16 px-6 sm:px-8">
        
        {/* Header */}
        <section className="mx-auto max-w-7xl relative z-10 text-center flex flex-col items-center gap-4 py-8 mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Our <span className="bg-gradient-to-r from-teal-400 to-indigo-500 bg-clip-text text-transparent">Portfolio</span>
          </h1>
          <p className="text-lg font-medium text-slate-500 dark:text-slate-400 max-w-xl">
            Explore our creative work and visual design success stories.
          </p>
        </section>

        {/* Filter Categories */}
        <section className="mx-auto max-w-7xl relative z-10 mb-12 flex flex-col sm:flex-row items-center justify-center gap-4 border-b border-slate-200/40 dark:border-slate-800/40 pb-8">
          <span className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Filter by:</span>
          <div className="flex flex-wrap gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                  filter === cat.value
                    ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Projects Grid */}
        <section className="mx-auto max-w-7xl relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredProjects.map((proj, i) => (
            <div
              key={proj.id || i}
              className="group relative bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-teal-500/30"
            >
              {/* Image / SVG Container */}
              <div className="relative aspect-[5/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-955">
                {proj.image_url ? (
                  <img
                    src={proj.image_url}
                    alt={proj.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  proj.svg
                )}
                
                {/* Badges overlay */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {proj.badges.map((badge, j) => (
                    <span
                      key={j}
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md text-white shadow-sm ${
                        badge === 'Featured' ? 'bg-indigo-500' : 'bg-teal-500'
                      }`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Admin Delete Action */}
                {isAdminMode && proj.is_custom && (
                  <button
                    onClick={() => handleDelete(proj)}
                    className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-md transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                    title="Delete portfolio project"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              {/* Description Info */}
              <div className="p-6 flex flex-col gap-3">
                <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
                  {proj.subtitle}
                </span>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">
                  {proj.title}
                </h3>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 min-h-[36px]">
                  {proj.desc}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {proj.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 text-slate-455 dark:text-slate-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Bottom CTA */}
        <section className="mx-auto max-w-7xl relative z-10">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-teal-400/90 to-indigo-600/90 p-12 sm:p-20 text-white text-center shadow-xl shadow-teal-500/10">
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
            <div className="relative z-10 flex flex-col items-center gap-6">
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Ready to Start Your Project?</h2>
              <p className="text-sm sm:text-lg text-teal-50/90 max-w-xl font-medium leading-relaxed">
                Let's discuss how we can help bring your vision to life. Get in touch for a free consultation and quote.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-slate-100 text-teal-700 font-bold px-6 py-3.5 shadow-lg transition-transform duration-200 active:scale-95"
                >
                  <span>Start Your Project</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
