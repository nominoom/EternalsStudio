'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { Target, Eye, Gem, Users, Award, ShieldAlert } from 'lucide-react';

export default function About() {
  const { siteConfig } = useSiteConfig();

  const team = [
    { name: 'Fives', role: 'Founder & Lead Developer', initial: 'F', color: 'bg-teal-500' },
    { name: 'Pivotalonic', role: 'Co-Founder & UI/UX Designer', initial: 'P', color: 'bg-indigo-500' },
    { name: 'Khas', role: '3D Modeler & Motion Artist', initial: 'K', color: 'bg-pink-500' },
    { name: 'In-Gloom Media', role: 'Lead Video Editor & Animator', initial: 'I', color: 'bg-amber-500' },
    { name: 'Qzlf', role: 'Graphic Designer & Concept Illustrator', initial: 'Q', color: 'bg-emerald-500' },
    { name: 'Curtain', role: 'Community Manager & Support Lead', initial: 'C', color: 'bg-rose-500' },
  ];

  const expertise = [
    { name: 'Custom React Development', desc: 'Performance-optimized, interactive frontend apps.' },
    { name: 'UI/UX Visual Prototyping', desc: 'Stunning premium Figma prototypes.' },
    { name: 'Esports & Gaming Graphics', desc: 'Team monograms, overlays, and stream assets.' },
    { name: 'Cinema 4D Rendering', desc: 'Detailed 3D models and lighting environments.' },
    { name: 'Stripe Payment Integrations', desc: 'Secure checkout and dynamic pricing tiers.' },
    { name: 'Brand Strategy & Logistics', desc: 'Visual identity vectors and marketing guidelines.' },
  ];

  return (
    <>
      <Navbar />

      <main className="flex-1 relative overflow-hidden bg-transparent text-slate-900 dark:text-slate-50 py-16 px-6 sm:px-8">
        
        {/* Banner Section */}
        <section className="mx-auto max-w-7xl relative z-10 mb-16">
          <div 
            className="relative rounded-3xl overflow-hidden p-12 sm:p-20 text-white text-center shadow-xl shadow-teal-500/10 transition-all"
            style={{
              backgroundImage: `linear-gradient(to bottom right, ${siteConfig.theme.primaryColor}, ${siteConfig.theme.accentColor})`
            }}
          >
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl mb-2">
                ◆
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                {siteConfig.aboutPage.headerTitle}
              </h1>
              <p className="text-sm sm:text-lg text-white/90 max-w-xl font-medium leading-relaxed">
                {siteConfig.aboutPage.headerSubtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Story Section */}
        <section className="mx-auto max-w-7xl relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              {siteConfig.aboutPage.storyTitle || 'Our Mission'}
            </h2>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 whitespace-pre-line">
              {siteConfig.aboutPage.storyContent}
            </p>
            {siteConfig.aboutPage.visionContent && (
              <div className="pt-2 border-t border-gray-800/40">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {siteConfig.aboutPage.visionTitle || 'Our Core Vision'}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {siteConfig.aboutPage.visionContent}
                </p>
              </div>
            )}
          </div>
          <div className="h-64 sm:h-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center p-8 shadow-sm">
            {/* Mission Illustration */}
            <div className="text-center flex flex-col gap-4 font-black">
              <span 
                className="text-5xl sm:text-7xl bg-clip-text text-transparent tracking-widest font-extrabold uppercase"
                style={{
                  backgroundImage: `linear-gradient(to right, ${siteConfig.theme.primaryColor}, ${siteConfig.theme.accentColor})`
                }}
              >
                {siteConfig.branding.siteName}
              </span>
              <span className="text-sm uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 font-bold">
                {siteConfig.branding.logoSubtitle}
              </span>
            </div>
          </div>
        </section>

        {/* Expertise Grid */}
        <section className="mx-auto max-w-7xl relative z-10 mb-24">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-3 mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">Our Expertise</h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              A comprehensive toolkit of creative and technical abilities to ensure visual and code excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expertise.map((exp, i) => (
              <div
                key={i}
                className="bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md rounded-2xl p-6 flex flex-col gap-2.5 shadow-sm"
              >
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                  <span className="text-teal-500 text-lg">✔</span>
                  <h3>{exp.name}</h3>
                </div>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {exp.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Grid */}
        <section className="mx-auto max-w-7xl relative z-10">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-3 mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">Meet Our Team</h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              The creative designers, software engineers, and digital artists driving the success of Eternals Studio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <div
                key={i}
                className="group bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800/50 hover:border-teal-500/40 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center text-center gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`h-20 w-20 rounded-full ${member.color} text-white font-extrabold text-3xl flex items-center justify-center shadow-md shadow-slate-500/10 transition-transform duration-300 group-hover:scale-110`}>
                  {member.initial}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">
                    {member.name}
                  </h3>
                  <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    {member.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
