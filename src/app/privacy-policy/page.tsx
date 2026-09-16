'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Shield, ArrowLeft, Lock, Eye, FileText, Server } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';

export default function PrivacyPolicyPage() {
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
              <Shield size={14} />
              Legal & Data Protection
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              Privacy Policy
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Last updated: September 16, 2026. This policy explains how {siteContent.branding.siteName} collects, protects, and handles your data.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-10 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileText size={18} className="text-teal-500" />
                1. Information We Collect
              </h2>
              <p>
                When you collaborate with {siteContent.branding.siteName} or purchase creative assets from our Studio Store, we collect information necessary to provide design, 3D modeling, and web development services:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-slate-600 dark:text-slate-400">
                <li><strong>Account & Contact Data:</strong> Your name, business email address, and optional Discord handle provided through Clerk authentication.</li>
                <li><strong>Project Briefs & Creative Assets:</strong> Design specifications, branding references, vector logos, and feedback files you attach in the Client Portal.</li>
                <li><strong>Transaction Records:</strong> Billing identifiers and checkout confirmation IDs processed securely via Stripe. We never store raw credit card numbers on our servers.</li>
                <li><strong>Technical Usage Data:</strong> Anonymized telemetry such as browser type and session metrics to ensure platform stability.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Lock size={18} className="text-teal-500" />
                2. How We Use Your Information
              </h2>
              <p>We use the data we collect solely for business operations and client delivery:</p>
              <ul className="list-disc pl-6 space-y-1 text-slate-600 dark:text-slate-400">
                <li>Delivering commissioned artwork, web applications, 3D assets, and digital store downloads.</li>
                <li>Managing project milestones, invoices, and progress tracking in your private Client Portal.</li>
                <li>Sending essential transactional updates, project quote approvals, and direct customer support replies.</li>
                <li>Preventing unauthorized transactions, abuse, and platform security breaches.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Server size={18} className="text-teal-500" />
                3. Third-Party Service Providers
              </h2>
              <p>
                We do not sell, rent, or trade your personal data. We partner with industry-standard, SOC-2 compliant infrastructure providers to power our platform:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-slate-600 dark:text-slate-400">
                <li><strong>Clerk:</strong> Secure user authentication and session tokens.</li>
                <li><strong>Stripe:</strong> PCI-compliant payment processing and invoicing.</li>
                <li><strong>Supabase:</strong> Encrypted cloud database storage for project requests and orders.</li>
                <li><strong>Resend:</strong> Transactional email delivery for project confirmations and receipts.</li>
                <li><strong>Tawk.to:</strong> Real-time customer support chat messaging.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Eye size={18} className="text-teal-500" />
                4. Data Retention & Your Rights
              </h2>
              <p>
                We retain client deliverables and request records as long as your account remains active or as needed to provide recurring downloads. You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-slate-600 dark:text-slate-400">
                <li>Access and review all personal information associated with your profile.</li>
                <li>Request permanent deletion of your project briefs, attachments, or account.</li>
                <li>Export your project files and invoices at any time through the Client Portal.</li>
              </ul>
            </section>

            <section className="space-y-3 pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                5. Contacting Us
              </h2>
              <p>
                If you have questions regarding this Privacy Policy or wish to exercise your data rights, reach out directly to our team:
              </p>
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{siteContent.branding.siteName} Legal Team</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{siteContent.contactPage.email}</div>
                </div>
                <Link
                  href="/contact"
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold transition-colors text-center"
                >
                  Contact Support
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
