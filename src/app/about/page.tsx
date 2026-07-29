'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EditableText from '../../components/EditableText';
import EditableImage from '../../components/EditableImage';
import { useSiteContent } from '../../context/SiteContentContext';
import { Target, Eye, Gem, Users, Award, ShieldAlert } from 'lucide-react';

export default function About() {
  const { siteContent, updateSiteContent, updateTeamMember } = useSiteContent();

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
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-teal-400/90 to-indigo-600/90 p-12 sm:p-20 text-white text-center shadow-xl shadow-teal-500/10">
            {siteContent.branding.aboutHeaderImageUrl && (
              <img
                src={siteContent.branding.aboutHeaderImageUrl}
                alt="About Header Banner"
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 pointer-events-none"
              />
            )}
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl mb-2">
                ◆
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                <EditableText
                  value={siteContent.aboutPage.headerTitle}
                  label="About Header Title"
                  onChange={(val) => updateSiteContent({ aboutPage: { ...siteContent.aboutPage, headerTitle: val } })}
                />
              </h1>
              <p className="text-sm sm:text-lg text-teal-50/90 max-w-xl font-medium leading-relaxed">
                <EditableText
                  value={siteContent.aboutPage.headerSubtitle}
                  label="About Header Subtitle"
                  multiline
                  onChange={(val) => updateSiteContent({ aboutPage: { ...siteContent.aboutPage, headerSubtitle: val } })}
                />
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mx-auto max-w-7xl relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              <EditableText
                value={siteContent.aboutPage.storyTitle || 'Our Mission'}
                label="Mission Section Title"
                onChange={(val) => updateSiteContent({ aboutPage: { ...siteContent.aboutPage, storyTitle: val } })}
              />
            </h2>
            <div className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              <EditableText
                value={siteContent.aboutPage.storyContent}
                label="Mission Story Content"
                multiline
                onChange={(val) => updateSiteContent({ aboutPage: { ...siteContent.aboutPage, storyContent: val } })}
              />
            </div>
            {siteContent.aboutPage.visionContent && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                  <EditableText
                    value={siteContent.aboutPage.visionTitle || 'Our Core Vision'}
                    label="Core Vision Title"
                    onChange={(val) => updateSiteContent({ aboutPage: { ...siteContent.aboutPage, visionTitle: val } })}
                  />
                </h3>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  <EditableText
                    value={siteContent.aboutPage.visionContent}
                    label="Core Vision Description"
                    multiline
                    onChange={(val) => updateSiteContent({ aboutPage: { ...siteContent.aboutPage, visionContent: val } })}
                  />
                </p>
              </div>
            )}
          </div>
          <div className="h-64 sm:h-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center p-8 shadow-sm">
            {/* Mission Illustration (Vector monograms logo text) */}
            <div className="text-center flex flex-col gap-4 font-black">
              <span className="text-5xl sm:text-7xl bg-gradient-to-r from-teal-400 to-indigo-500 bg-clip-text text-transparent tracking-widest font-extrabold uppercase">
                <EditableText
                  value={siteContent.branding.siteName}
                  label="Studio Brand Name"
                  onChange={(val) => updateSiteContent({ branding: { ...siteContent.branding, siteName: val } })}
                />
              </span>
              <span className="text-sm uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 font-bold">
                <EditableText
                  value={siteContent.branding.logoSubtitle}
                  label="Studio Logo Subtitle"
                  onChange={(val) => updateSiteContent({ branding: { ...siteContent.branding, logoSubtitle: val } })}
                />
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
        {siteContent.sections.showTeamSection && (
          <section className="mx-auto max-w-7xl relative z-10">
            <div className="text-center max-w-2xl mx-auto flex flex-col gap-3 mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">Meet Our Team</h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                The creative designers, software engineers, and digital artists driving the success of {siteContent.branding.siteName}.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {siteContent.team.map((member) => (
                <div
                  key={member.id}
                  className="group bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800/50 hover:border-teal-500/40 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center text-center gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <EditableImage
                    src={member.avatarUrl || ''}
                    alt={member.name}
                    label={`${member.name} Avatar / Logo`}
                    placeholderText="Click to upload team avatar photo or logo"
                    onChange={(url) => updateTeamMember(member.id, { avatarUrl: url })}
                    className="h-20 w-20 rounded-full object-cover shadow-md transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">
                      <EditableText
                        value={member.name}
                        label="Team Member Name"
                        onChange={(val) => updateTeamMember(member.id, { name: val })}
                      />
                    </h3>
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      <EditableText
                        value={member.role}
                        label="Team Member Role"
                        onChange={(val) => updateTeamMember(member.id, { role: val })}
                      />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
