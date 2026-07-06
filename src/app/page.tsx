'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, Terminal, Palette, Box, Video } from 'lucide-react';

export default function Home() {
  const stats = [
    { value: '13+', label: 'Projects Completed' },
    { value: '10+', label: 'Happy Clients' },
    { value: '6+', label: 'Team Experts' },
    { value: '24/7', label: 'Support Available' },
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

      <main className="flex-1 relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 py-16 px-6 sm:px-8">
        {/* Background Neon Blobs */}
        <div className="absolute top-[-100px] left-[-100px] w-96 h-96 rounded-full bg-teal-400/20 dark:bg-teal-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 rounded-full bg-indigo-400/20 dark:bg-indigo-500/10 blur-[100px] pointer-events-none" />

        {/* Hero Section */}
        <section className="mx-auto max-w-7xl relative z-10 text-center flex flex-col items-center gap-6 py-12 md:py-24">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-teal-500/10 dark:bg-teal-400/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
            Now Powered by Next.js
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl text-slate-900 dark:text-slate-50">
            Welcome to <br />
            <span className="bg-gradient-to-r from-teal-400 via-emerald-500 to-indigo-500 bg-clip-text text-transparent">
              Eternals Studio
            </span>
          </h1>
          <p className="text-lg sm:text-xl font-medium text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Where Ideas Become Reality. We transform visions into high-performance web applications, striking graphical assets, and immersive 3D models.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-indigo-500 hover:from-teal-500 hover:to-indigo-600 text-white font-bold px-6 py-3.5 shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 transition-all duration-200 active:scale-95"
            >
              <span>Start Your Project</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/portfolio"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 font-bold px-6 py-3.5 transition-all duration-200 text-slate-700 dark:text-slate-350"
            >
              View Our Work
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mx-auto max-w-7xl relative z-10 py-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md rounded-2xl p-6 text-center shadow-sm"
            >
              <h3 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-teal-400 to-indigo-500 bg-clip-text text-transparent">
                {stat.value}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        {/* Services Section */}
        <section className="mx-auto max-w-7xl relative z-10 py-16 flex flex-col gap-12">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">Our Services</h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              From concept to launch, we offer comprehensive creative services to bring your brand, design, or project to life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc, i) => (
              <div
                key={i}
                className="group bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800/50 hover:border-teal-500/50 backdrop-blur-md rounded-2xl p-6 flex flex-col gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/5"
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
      </main>

      <Footer />
    </>
  );
}
