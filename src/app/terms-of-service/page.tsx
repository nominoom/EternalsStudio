'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FileCheck, ArrowLeft, ShieldAlert, Sparkles, Scale, DollarSign } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';

export default function TermsOfServicePage() {
  const { siteContent } = useSiteContent();

  return (
    <>
      <Navbar />

      <main className="flex-1 relative overflow-hidden bg-transparent text-slate-900 dark:text-slate-50 py-16 px-6 sm:px-8">
        <div className="mx-auto max-w-4xl relative z-10">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-teal-500 mb-8 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>

          {/* Header */}
          <div className="flex flex-col gap-4 mb-12 pb-8 border-b border-slate-200/60 dark:border-slate-800/60">
            <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider">
              <FileCheck size={14} />
              Studio Agreement
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              Terms of Service
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Last updated: September 16, 2026. Please read these terms carefully before commissioning custom graphics, purchasing store products, or using {siteContent.branding.siteName}.
            </p>
          </div>

          {/* Terms Content */}
          <div className="space-y-10 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Scale size={18} className="text-teal-500" />
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing this website, creating a Client Portal account, purchasing digital deliverables, or submitting a project commission to {siteContent.branding.siteName} (&quot;the Studio&quot;), you agree to be bound by these Terms of Service and all applicable laws and regulations.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sparkles size={18} className="text-teal-500" />
                2. Digital Products & 1-of-1 Exclusive Licenses
              </h2>
              <ul className="list-disc pl-6 space-y-1 text-slate-600 dark:text-slate-400">
                <li><strong>Standard Store Assets:</strong> Digital templates, overlays, and 3D models purchased in our Studio Store are granted under a non-exclusive, perpetual license for your personal or organization use. Reselling raw template files is strictly prohibited.</li>
                <li><strong>1-of-1 Exclusive Packages:</strong> Items marked as &quot;1-of-1 Exclusive&quot; are retired immediately upon successful purchase and will never be resold. Full commercial and exclusive rights to the final design are transferred to the sole purchaser.</li>
                <li><strong>Digital Deliverables:</strong> Download links for store orders are delivered automatically to your Client Portal upon payment confirmation.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <DollarSign size={18} className="text-teal-500" />
                3. Custom Commissions & Invoicing
              </h2>
              <p>
                Custom creative projects undergo review by our studio leads. We issue custom milestone quotes through Stripe:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-slate-600 dark:text-slate-400">
                <li>Production begins only after the initial invoice is paid and verified through our checkout gateway.</li>
                <li>Each custom project includes the revision rounds specified in the project proposal (standard: 2 rounds of creative revisions).</li>
                <li>Additional scope modifications requested outside the approved brief are quoted separately.</li>
                <li>Team splits and artist cuts are calculated and disbursed on a weekly Friday payout schedule.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileCheck size={18} className="text-teal-500" />
                4. Intellectual Property & Portfolio Rights
              </h2>
              <p>
                Upon complete receipt of payment, all exclusive rights to the commissioned final deliverables (e.g. logos, brand guides, custom codebases) transfer to the client.
              </p>
              <p>
                {siteContent.branding.siteName} reserves the right to showcase non-confidential deliverables in our official portfolio, case studies, and social media showcase unless an explicit Non-Disclosure Agreement (NDA) is executed prior to production.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ShieldAlert size={18} className="text-teal-500" />
                5. Refunds & Cancellation Policy
              </h2>
              <ul className="list-disc pl-6 space-y-1 text-slate-600 dark:text-slate-400">
                <li><strong>Digital Store Purchases:</strong> Due to the immediate delivery of digital files, store purchases are generally non-refundable once downloaded. If a file is corrupted or technically defective, our team will provide a replacement immediately.</li>
                <li><strong>Custom Project Cancellations:</strong> If a project is cancelled prior to design work commencing, a full refund less processing fees will be provided. Once creative production or 3D rendering has begun, prorated compensation for hours elapsed will apply.</li>
              </ul>
            </section>

            <section className="space-y-3 pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                6. Contact Information
              </h2>
              <p>
                For questions regarding contracts, custom licensing, or corporate NDAs, contact us directly:
              </p>
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{siteContent.branding.siteName} Operations</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{siteContent.contactPage.email}</div>
                </div>
                <Link
                  href="/contact"
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold transition-colors text-center"
                >
                  Contact Us
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
