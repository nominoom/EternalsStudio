'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { 
  Sparkles, 
  Gift, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Coins, 
  Zap, 
  Percent, 
  Send,
  Trophy,
  ExternalLink
} from 'lucide-react';

export default function PartnersPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    discord: '',
    organization: '',
    tier: 'silver',
    platformUrl: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  const tiers = [
    {
      name: 'Bronze Affiliate',
      badge: 'Creator Tier',
      commission: '10% Commission',
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-500',
      description: 'Ideal for streamers, tournament hosts, and digital creators looking to monetize their network.',
      perks: [
        '10% cash payout on all referred projects',
        '5% exclusive discount code for your audience',
        'Special @Partner role in Eternals Discord',
        'Real-time referral tracking dashboard',
        'Weekly Friday payouts via Stripe / PayPal'
      ],
      cta: 'Apply for Bronze'
    },
    {
      name: 'Silver Partner',
      badge: 'Most Popular',
      commission: '15% Commission',
      color: 'from-teal-500/20 to-indigo-500/20 border-teal-500/40 text-teal-400',
      popular: true,
      description: 'Designed for esports clans, gaming guilds, and digital agencies seeking consistent creative support.',
      perks: [
        '15% revenue share on all client projects',
        '10% audience discount promo code',
        'Dedicated studio Discord / Slack collaboration channel',
        'Featured logo in Eternals Studio Partners showcase',
        'Expedited queue for team jersey & overlay assets',
        'Weekly Friday payouts'
      ],
      cta: 'Join Silver Tier'
    },
    {
      name: 'Gold / Enterprise VIP',
      badge: 'Venture & Agency',
      commission: '20% Commission',
      color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
      description: 'For venture-backed esports teams, marketing agencies, and high-volume corporate clients.',
      perks: [
        '20% recurring commission on every closed deal',
        'White-label deliverables option for your agency',
        'Guaranteed 48-hour rush turnarounds',
        'Direct 1-on-1 access to Lead Developers & 3D Artists',
        'Free annual brand identity refresh package',
        'Weekly payouts & transparent invoice logs'
      ],
      cta: 'Partner at VIP Tier'
    }
  ];

  const loyaltyPerks = [
    {
      icon: <Coins size={24} className="text-teal-400" />,
      title: 'Studio Points on Every Order',
      desc: 'Earn 1 Loyalty Point for every $1 spent on store items or custom commissions. Redeem points for free asset packs and discounts.'
    },
    {
      icon: <Zap size={24} className="text-amber-400" />,
      title: 'Weekly Friday Payouts',
      desc: 'No waiting 30 or 60 days. All affiliate cuts and team splits are disbursed weekly straight to your verified account.'
    },
    {
      icon: <Trophy size={24} className="text-indigo-400" />,
      title: 'VIP Asset Drops',
      desc: 'Partners receive free seasonal overlay packs, 3D model rigs, and sound design libraries before they hit the public store.'
    },
    {
      icon: <ShieldCheck size={24} className="text-purple-400" />,
      title: 'Dedicated Account Manager',
      desc: 'Direct line to our Discord leadership for swift custom quotes, revisions, and priority scheduling.'
    }
  ];

  return (
    <>
      <Navbar />

      <main className="flex-1 relative overflow-hidden bg-transparent text-slate-900 dark:text-slate-50 py-16 px-6 sm:px-8">
        {/* Glow Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-teal-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

        {/* Hero Section */}
        <section className="mx-auto max-w-5xl relative z-10 text-center flex flex-col items-center gap-5 py-12 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            Eternals Studio Ecosystem
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Partnership & <span className="bg-gradient-to-r from-teal-400 to-indigo-500 bg-clip-text text-transparent">Loyalty Program</span>
          </h1>

          <p className="text-base sm:text-xl font-medium text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Collaborate with Eternals Studio, refer gaming clans and brands, and unlock weekly revenue share payouts with exclusive studio perks.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <a
              href="#apply-form"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2"
            >
              Apply as a Partner
              <ArrowRight size={16} />
            </a>
            <Link
              href="/store"
              className="px-6 py-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-teal-500 text-slate-700 dark:text-slate-200 font-bold text-sm transition-all"
            >
              Explore Studio Store
            </Link>
          </div>
        </section>

        {/* Partner Tiers Grid */}
        <section className="mx-auto max-w-7xl relative z-10 mb-20">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-2 mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              Partnership Tiers & Revenue Share
            </h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Select the tier that matches your community size and creative volume.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {tiers.map((tier, i) => (
              <div
                key={i}
                className={`relative rounded-3xl p-8 flex flex-col justify-between backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 ${
                  tier.popular
                    ? 'bg-gradient-to-b from-teal-950/40 via-slate-900/80 to-slate-900/90 border-2 border-teal-500/60 shadow-2xl shadow-teal-500/10'
                    : 'bg-white/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 shadow-md'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-teal-400 to-indigo-500 text-slate-950 font-extrabold text-xs tracking-wider uppercase shadow-md">
                    Recommended Tier
                  </div>
                )}

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {tier.badge}
                      </span>
                      <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 mt-1">
                        {tier.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <div className="text-3xl font-black bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">
                      {tier.commission}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Paid out weekly on every completed client payment
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {tier.description}
                  </p>

                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Included Privileges:
                    </span>
                    <ul className="space-y-2.5">
                      {tier.perks.map((perk, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                          <CheckCircle2 size={16} className="text-teal-500 flex-shrink-0 mt-0.5" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-800/80">
                  <a
                    href="#apply-form"
                    onClick={() => setFormData(prev => ({ ...prev, tier: tier.name.toLowerCase().includes('bronze') ? 'bronze' : tier.name.toLowerCase().includes('silver') ? 'silver' : 'gold' }))}
                    className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      tier.popular
                        ? 'bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white shadow-lg shadow-teal-500/20'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {tier.cta}
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Loyalty Program Highlights */}
        <section className="mx-auto max-w-7xl relative z-10 mb-20">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-8 sm:p-12 text-white shadow-2xl">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Gift size={14} />
                Client Loyalty Rewards
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Every Dollar Invested Works for You
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                We believe in long-term relationships. Whether you commission bespoke code or purchase store templates, you accumulate recurring value.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loyaltyPerks.map((perk, i) => (
                <div
                  key={i}
                  className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-6 flex flex-col gap-3 backdrop-blur-md hover:border-teal-500/40 transition-colors"
                >
                  <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center">
                    {perk.icon}
                  </div>
                  <h3 className="font-bold text-sm text-slate-100">
                    {perk.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-400">
                    {perk.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section id="apply-form" className="mx-auto max-w-3xl relative z-10 scroll-mt-24">
          <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
                Apply for Partnership
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                Fill out the application below. Our management team reviews all submissions within 24–48 hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-center flex flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-teal-500/20 text-teal-500 flex items-center justify-center text-3xl font-bold">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Application Received!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md leading-relaxed">
                  Thank you for applying to the Eternals Studio Partner Program. Our team will contact you via Discord ({formData.discord || 'provided handle'}) and email ({formData.email}) with your partner code and dashboard onboarding.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  Submit another application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Your Name / Handle *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Marcus 'Apex'"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-50 text-sm focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contact@yourclan.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-50 text-sm focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Discord Handle *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.discord}
                      onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                      placeholder="username#0000 or @username"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-50 text-sm focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Clan / Organization / Brand
                    </label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="Apex Esports LLC"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-50 text-sm focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Desired Partner Tier
                    </label>
                    <select
                      value={formData.tier}
                      onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-50 text-sm focus:outline-none focus:border-teal-500"
                    >
                      <option value="bronze">Bronze Affiliate (10% Cut)</option>
                      <option value="silver">Silver Partner (15% Cut)</option>
                      <option value="gold">Gold / VIP Enterprise (20% Cut)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Channel or Portfolio URL
                    </label>
                    <input
                      type="url"
                      value={formData.platformUrl}
                      onChange={(e) => setFormData({ ...formData, platformUrl: e.target.value })}
                      placeholder="https://twitch.tv/yourchannel"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-50 text-sm focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    How do you plan to partner with Eternals Studio?
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Tell us about your audience, upcoming tournament rosters, or agency client volume..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-50 text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting Application...' : 'Send Partnership Application'}
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
