'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ArrowRight, Laptop, Shield, MessageSquare, Award, Zap, Smile, Globe, ShoppingBag } from 'lucide-react';

export default function Services() {
  const processSteps = [
    { num: '01', name: 'Discovery', desc: 'Understanding your vision, business goals, and defining specific project scope requirements.' },
    { num: '02', name: 'Strategy', desc: 'Detailing information architectures, choosing technical stacks, and sketching layouts.' },
    { num: '03', name: 'Design', desc: 'Crafting premium brand aesthetics, high-fidelity UI/UX mockups, and glowing vector layouts.' },
    { num: '04', name: 'Build', desc: 'Writing clean, optimized, semantic source code and conducting rigorous unit-level testing.' },
    { num: '05', name: 'Launch', desc: 'Deploying pages to CDN-backed static hosts, performing SEO configurations, and hand-off.' },
  ];

  const industries = [
    { name: 'Esports Organizations', desc: 'Team rosters, overlays, jerseys, and gaming brand identities.', icon: <Zap size={20} /> },
    { name: 'SaaS Platforms', desc: 'Conversion-focused landing interfaces and responsive admin layout suites.', icon: <Laptop size={20} /> },
    { name: 'E-Commerce Brands', desc: 'Custom storefront builds integrated with Stripe checkout flows.', icon: <ShoppingBag size={20} /> },
    { name: 'Content Creators', desc: 'Monograms, custom Twitch overlays, and promotional visual elements.', icon: <Globe size={20} /> },
    { name: 'Corporate Clients', desc: 'Professional brand guides, marketing cards, and slides deck templates.', icon: <Award size={20} /> },
    { name: 'Local Businesses', desc: 'Accessible custom websites displaying maps, reviews, and support details.', icon: <Smile size={20} /> },
  ];

  return (
    <>
      <Navbar />

      <main className="flex-1 relative overflow-hidden bg-transparent text-slate-900 dark:text-slate-50 py-16 px-6 sm:px-8">
        
        {/* Header */}
        <section className="mx-auto max-w-7xl relative z-10 text-center flex flex-col items-center gap-4 py-8 mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Our <span className="bg-gradient-to-r from-teal-400 to-indigo-500 bg-clip-text text-transparent">Services</span>
          </h1>
          <p className="text-lg font-medium text-slate-500 dark:text-slate-400 max-w-xl">
            Custom development and creative design solutions tailored to match your specific workflow.
          </p>
        </section>

        {/* Process Timeline */}
        <section className="mx-auto max-w-7xl relative z-10 mb-24 flex flex-col gap-12">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">Our Process</h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              How we take your ideas from raw concepts to high-performance production builds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {processSteps.map((step, i) => (
              <div
                key={i}
                className="bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md rounded-2xl p-6 flex flex-col gap-4 relative shadow-sm"
              >
                <span className="text-3xl font-black bg-gradient-to-r from-teal-400 to-indigo-500 bg-clip-text text-transparent">
                  {step.num}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{step.name}</h3>
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Industries Grid */}
        <section className="mx-auto max-w-7xl relative z-10 mb-24 flex flex-col gap-12">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">Industries We Serve</h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              We design and code custom environments for clients across diverse industries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((ind, i) => (
              <div
                key={i}
                className="group bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800/50 hover:border-teal-500/40 backdrop-blur-md rounded-2xl p-6 flex flex-col gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                  {ind.icon}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">
                    {ind.name}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {ind.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Card */}
        <section className="mx-auto max-w-7xl relative z-10">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600/90 to-teal-500/90 p-12 sm:p-20 text-white text-center shadow-xl shadow-teal-500/10">
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
            <div className="relative z-10 flex flex-col items-center gap-6">
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Ready to Start Your Project?</h2>
              <p className="text-sm sm:text-lg text-teal-50/90 max-w-xl font-medium leading-relaxed">
                Contact our development team today to obtain a pricing estimate, layout draft, or project timeline.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-slate-100 text-indigo-700 font-bold px-6 py-3.5 shadow-lg transition-transform duration-200 active:scale-95"
              >
                <span>Get Started Now</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
