'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSiteConfig } from '../context/SiteConfigContext';
import { ArrowRight, Terminal, Palette, Box, Video, Sparkles } from 'lucide-react';

export default function Home() {
  const { siteConfig } = useSiteConfig();

  const stats = [
    { value: siteConfig.aboutPage.stat1Number || '500+', label: siteConfig.aboutPage.stat1Label || 'Projects Completed' },
    { value: siteConfig.aboutPage.stat2Number || '99.8%', label: siteConfig.aboutPage.stat2Label || 'Client Satisfaction' },
    { value: siteConfig.aboutPage.stat3Number || '24/7', label: siteConfig.aboutPage.stat3Label || 'Support Available' },
    { value: '10+', label: 'Team Experts' },
  ];

  const services = [
    {
      title: 'Web Development',
      description: 'Custom React & Next.js applications, headless CMS backends, and high-performance websites.',
      icon: <Terminal size={24} />,
      color: 'from-cyan-400 to-teal-500',
    },
    {
      title: 'Graphic Design',
      description: 'Stunning visual identities, esports graphics, team branding kits, and gaming overlays.',
      icon: <Palette size={24} />,
      color: 'from-purple-400 to-indigo-500',
    },
    {
      title: '3D Modeling',
      description: 'Detailed 3D product renders, spatial visualizations, character modeling, and asset builds.',
      icon: <Box size={24} />,
      color: 'from-pink-400 to-rose-500',
    },
    {
      title: 'Motion Graphics',
      description: 'Dynamic animation sequences, video trailers, streaming transitions, and promotional reels.',
      icon: <Video size={24} />,
      color: 'from-amber-400 to-orange-500',
    },
  ];

  return (
    <>
      <Navbar />

      <main className="flex-1 relative overflow-hidden bg-transparent text-slate-900 dark:text-slate-50 py-16 px-6 sm:px-8">
        {/* Background Neon Blobs */}
        <div className="absolute top-[-100px] left-[-100px] w-96 h-96 rounded-full bg-teal-400/20 dark:bg-teal-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 rounded-full bg-indigo-400/20 dark:bg-indigo-500/10 blur-[100px] pointer-events-none" />

        {/* Hero Section */}
        {siteConfig.hero.showHero && (
          <section className="mx-auto max-w-7xl relative z-10 text-center flex flex-col items-center gap-6 py-12 md:py-24">
            <span 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
              style={{
                borderColor: siteConfig.theme.primaryColor,
                color: siteConfig.theme.primaryColor,
                backgroundColor: `${siteConfig.theme.primaryColor}15`
              }}
            >
              <Sparkles size={14} />
              {siteConfig.hero.badgeText}
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl text-slate-900 dark:text-slate-50">
              {siteConfig.hero.titleLine1} <br />
              <span 
                className="bg-gradient-to-r via-purple-500 bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, ${siteConfig.theme.primaryColor}, ${siteConfig.theme.accentColor})`
                }}
              >
                {siteConfig.hero.titleLine2Highlight}
              </span>
            </h1>
            <p className="text-lg sm:text-xl font-medium text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              {siteConfig.hero.description}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <Link
                href={siteConfig.hero.primaryCtaLink || '/store'}
                className="flex items-center gap-2 font-bold px-6 py-3.5 text-white shadow-lg transition-all duration-200 active:scale-95 hover:opacity-90"
                style={{
                  backgroundColor: siteConfig.theme.primaryColor,
                  borderRadius: siteConfig.theme.borderRadius
                }}
              >
                <span>{siteConfig.hero.primaryCtaText}</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href={siteConfig.hero.secondaryCtaLink || '/client'}
                className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 font-bold px-6 py-3.5 transition-all duration-200 text-slate-700 dark:text-slate-350"
                style={{ borderRadius: siteConfig.theme.borderRadius }}
              >
                {siteConfig.hero.secondaryCtaText}
              </Link>
            </div>
          </section>
        )}

        {/* Stats Section */}
        <section className="mx-auto max-w-7xl relative z-10 py-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md rounded-2xl p-6 text-center shadow-sm"
            >
              <h3 
                className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, ${siteConfig.theme.primaryColor}, ${siteConfig.theme.accentColor})`
                }}
              >
                {stat.value}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        {/* Services Section */}
        {siteConfig.homeSections.showServicesGrid && (
          <section className="mx-auto max-w-7xl relative z-10 py-16 flex flex-col gap-12">
            <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
                {siteConfig.servicesPage.headerTitle || 'Our Services'}
              </h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                {siteConfig.servicesPage.headerSubtitle || 'From concept to launch, we offer comprehensive creative services.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((svc, i) => (
                <div
                  key={i}
                  className="group bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800/50 hover:border-teal-500/50 backdrop-blur-md rounded-2xl p-6 flex flex-col gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${svc.color} text-white shadow-md shadow-slate-500/5`}>
                    {svc.icon}
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {svc.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA Banner Section */}
        {siteConfig.homeSections.showCtaBanner && (
          <section className="mx-auto max-w-7xl relative z-10 py-12">
            <div 
              className="p-8 sm:p-12 rounded-3xl border text-center space-y-4 shadow-2xl relative overflow-hidden"
              style={{
                backgroundColor: siteConfig.theme.cardBgColor,
                borderColor: siteConfig.theme.primaryColor
              }}
            >
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                {siteConfig.homeSections.ctaBannerTitle}
              </h2>
              <p className="text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
                {siteConfig.homeSections.ctaBannerDescription}
              </p>
              <div className="pt-2">
                <Link
                  href={siteConfig.homeSections.ctaBannerButtonLink || '/client'}
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-extrabold text-white rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
                  style={{ backgroundColor: siteConfig.theme.primaryColor }}
                >
                  <span>{siteConfig.homeSections.ctaBannerButtonText}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
