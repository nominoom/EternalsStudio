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
              <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center p-2 mb-2 overflow-hidden shadow-md">
                <img
                  src={siteContent.branding.logoUrl || "/eternals-logo.jpg"}
                  alt="Eternals Emblem"
                  className="w-full h-full object-cover rounded-xl"
                />
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
          <div className="h-auto min-h-[22rem] sm:min-h-[24rem] rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-white via-slate-50 to-teal-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-teal-950/20 flex flex-col items-center justify-center p-8 shadow-sm relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Eternals Studio Official Emblem & Vector Brand Mark */}
            <div className="relative flex flex-col items-center justify-center gap-5 text-center z-10">
              <div className="relative flex items-center justify-center">
                <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/30 to-indigo-500/30 rounded-full blur-xl animate-pulse" />
                <div className="relative h-28 w-28 sm:h-36 sm:w-36 rounded-3xl overflow-hidden border-2 border-teal-500/40 shadow-2xl shadow-teal-500/20 group">
                  <img
                    src={siteContent.branding.logoUrl || "/eternals-logo.jpg"}
                    alt="Eternals Studio Official Emblem"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              <div className="text-center flex flex-col gap-2 font-black">
                <span className="text-3xl sm:text-5xl bg-gradient-to-r from-teal-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-widest font-extrabold uppercase">
                  <EditableText
                    value={siteContent.branding.siteName}
                    label="Studio Brand Name"
                    onChange={(val) => updateSiteContent({ branding: { ...siteContent.branding, siteName: val } })}
                  />
                </span>
                <span className="text-xs uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500 font-bold">
                  <EditableText
                    value={siteContent.branding.logoSubtitle}
                    label="Studio Logo Subtitle"
                    onChange={(val) => updateSiteContent({ branding: { ...siteContent.branding, logoSubtitle: val } })}
                  />
                </span>
              </div>
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
                className="bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md rounded-2xl p-6 flex flex-col gap-2.5 shadow-sm hover:border-teal-500/40 transition-colors"
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
              <div className="inline-flex items-center gap-2 self-center px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-semibold tracking-wide uppercase">
                <Users size={14} />
                The Core Collective
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">Meet Our Team</h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                The creative designers, software engineers, and digital artists driving the success of {siteContent.branding.siteName}.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {siteContent.team.map((member) => (
                <div
                  key={member.id}
                  className="group bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 hover:border-teal-500/50 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between gap-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-500/5"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="relative">
                        {member.avatarUrl ? (
                          <EditableImage
                            src={member.avatarUrl}
                            alt={member.name}
                            label={`${member.name} Avatar`}
                            placeholderText="Click to change avatar"
                            onChange={(url) => updateTeamMember(member.id, { avatarUrl: url })}
                            className="h-16 w-16 rounded-2xl object-cover shadow-md border-2 border-teal-500/40 transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className={`h-16 w-16 rounded-2xl ${member.color || 'bg-teal-500'} text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-teal-500/20 transition-transform duration-300 group-hover:scale-105`}>
                            {member.initial || member.name.charAt(0)}
                          </div>
                        )}
                        <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-xs" title="Active in Studio" />
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                          Active
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">
                        <EditableText
                          value={member.name}
                          label="Team Member Name"
                          onChange={(val) => updateTeamMember(member.id, { name: val })}
                        />
                      </h3>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <EditableText
                          value={member.role}
                          label="Team Member Role"
                          onChange={(val) => updateTeamMember(member.id, { role: val })}
                        />
                      </span>
                    </div>

                    {member.bio && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {member.bio}
                      </p>
                    )}

                    {member.specialties && member.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {member.specialties.map((spec, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono text-[11px] text-teal-600 dark:text-teal-400">
                      {member.discord ? `@${member.discord}` : 'Eternals Core'}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      Weekly Payout Partner
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
