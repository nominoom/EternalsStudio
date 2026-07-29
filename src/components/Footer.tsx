'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, Clock, ArrowUpRight } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

export default function Footer() {
  const { siteConfig } = useSiteConfig();

  return (
    <footer className="w-full border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-12 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Column 1: Brand Info */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 font-extrabold text-lg text-slate-900 dark:text-slate-50">
            <span className="font-bold" style={{ color: siteConfig.theme.primaryColor }}>◆</span>
            <span>{siteConfig.branding.siteName}</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {siteConfig.footer.description || siteConfig.branding.logoSubtitle}
          </p>
          <div className="flex gap-4 mt-2">
            {siteConfig.footer.twitterUrl && (
              <a href={siteConfig.footer.twitterUrl} target="_blank" rel="noreferrer" className="hover:text-teal-500 text-sm font-semibold transition-colors duration-200">
                Twitter
              </a>
            )}
            {siteConfig.footer.discordUrl && (
              <a href={siteConfig.footer.discordUrl} target="_blank" rel="noreferrer" className="hover:text-teal-500 text-sm font-semibold transition-colors duration-200">
                Discord
              </a>
            )}
            {siteConfig.footer.githubUrl && (
              <a href={siteConfig.footer.githubUrl} target="_blank" rel="noreferrer" className="hover:text-teal-500 text-sm font-semibold transition-colors duration-200">
                GitHub
              </a>
            )}
          </div>
        </div>

        {/* Column 2: Services */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider">Services</h3>
          <ul className="flex flex-col gap-2.5 text-sm font-medium">
            <li><Link href="/services" className="hover:text-teal-500 transition-all">Graphic Design</Link></li>
            <li><Link href="/services" className="hover:text-teal-500 transition-all">Web Development</Link></li>
            <li><Link href="/services" className="hover:text-teal-500 transition-all">Motion Graphics</Link></li>
            <li><Link href="/services" className="hover:text-teal-500 transition-all">Branding Services</Link></li>
            <li><Link href="/services" className="hover:text-teal-500 transition-all">3D Modeling Assets</Link></li>
          </ul>
        </div>

        {/* Column 3: Company */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider">Company</h3>
          <ul className="flex flex-col gap-2.5 text-sm font-medium">
            <li><Link href="/about" className="hover:text-teal-500 transition-all">About Us</Link></li>
            <li><Link href="/portfolio" className="hover:text-teal-500 transition-all">Our Portfolio</Link></li>
            <li><Link href="/store" className="hover:text-teal-500 transition-all">Shop Store</Link></li>
            <li><Link href="/contact" className="hover:text-teal-500 transition-all">Contact Us</Link></li>
            <li><Link href="/about" className="hover:text-teal-500 transition-all">Meet The Team</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact details */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider">Contact</h3>
          <ul className="flex flex-col gap-3.5 text-sm font-medium">
            <li className="flex items-center gap-2.5">
              <Mail size={16} style={{ color: siteConfig.theme.primaryColor }} />
              <a href={`mailto:${siteConfig.contactPage.email}`} className="hover:text-teal-500 transition-colors">
                {siteConfig.contactPage.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} style={{ color: siteConfig.theme.primaryColor }} />
              <a href={`tel:${siteConfig.contactPage.phone}`} className="hover:text-teal-500 transition-colors">
                {siteConfig.contactPage.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock size={16} style={{ color: siteConfig.theme.primaryColor }} />
              <span>{siteConfig.contactPage.responseTimeText || '24/7 Support Available'}</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="mx-auto max-w-7xl px-6 sm:px-8 mt-12 pt-6 border-t border-slate-200/40 dark:border-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
        <p>{siteConfig.footer.copyrightText}</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-teal-500 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-teal-500 transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
