'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, Clock } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

export default function Footer() {
  const { siteContent, cmsStore } = useSiteContent();

  const footerData = cmsStore?.footer || {
    siteName: siteContent.branding.siteName,
    logoUrl: siteContent.branding.logoUrl || '/eternals-logo.jpg',
    description: siteContent.footer.description || siteContent.branding.logoSubtitle,
    copyrightText: siteContent.footer.copyrightText,
    columns: [
      {
        id: 'fc-1',
        title: 'Services',
        links: [
          { id: 'fcl-1', label: 'Graphic Design', href: '/services' },
          { id: 'fcl-2', label: 'Web Development', href: '/services' },
          { id: 'fcl-3', label: 'Motion Graphics', href: '/services' },
          { id: 'fcl-4', label: 'Branding Services', href: '/services' },
          { id: 'fcl-5', label: '3D Modeling Assets', href: '/services' }
        ]
      },
      {
        id: 'fc-2',
        title: 'Company',
        links: [
          { id: 'fcl-6', label: 'About Us', href: '/about' },
          { id: 'fcl-7', label: 'Our Portfolio', href: '/portfolio' },
          { id: 'fcl-8', label: 'Shop Store', href: '/store' },
          { id: 'fcl-9', label: 'Partnership & Loyalty', href: '/partners' },
          { id: 'fcl-10', label: 'Contact Us', href: '/contact' },
          { id: 'fcl-11', label: 'Meet The Team', href: '/about' }
        ]
      }
    ],
    socialLinks: {
      twitter: siteContent.footer.twitterUrl,
      github: siteContent.footer.githubUrl,
      discord: siteContent.footer.discordUrl
    }
  };

  return (
    <footer className="w-full border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-12 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Column 1: Brand Info */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5 font-extrabold text-lg text-slate-900 dark:text-slate-50">
            <div className="h-8 w-8 rounded-lg overflow-hidden ring-1 ring-teal-500/30 shadow-xs flex-shrink-0">
              <img
                src={footerData.logoUrl || siteContent.branding.logoUrl || "/eternals-logo.jpg"}
                alt="Eternals Studio Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span>{footerData.siteName || siteContent.branding.siteName}</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {footerData.description || siteContent.branding.logoSubtitle}
          </p>
          <div className="flex gap-4 mt-2">
            {footerData.socialLinks?.twitter && (
              <a href={footerData.socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-teal-500 text-sm font-semibold transition-colors duration-200">
                Twitter
              </a>
            )}
            {footerData.socialLinks?.discord && (
              <a href={footerData.socialLinks.discord} target="_blank" rel="noreferrer" className="hover:text-teal-500 text-sm font-semibold transition-colors duration-200">
                Discord
              </a>
            )}
            {footerData.socialLinks?.github && (
              <a href={footerData.socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-teal-500 text-sm font-semibold transition-colors duration-200">
                GitHub
              </a>
            )}
          </div>
        </div>

        {/* Columns 2 & 3: Dynamic CMS Link Columns */}
        {footerData.columns?.slice(0, 2).map((col) => (
          <div key={col.id} className="flex flex-col gap-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider">{col.title}</h3>
            <ul className="flex flex-col gap-2.5 text-sm font-medium">
              {col.links?.map((link) => (
                <li key={link.id}>
                  <Link href={link.href} className="hover:text-teal-500 transition-all">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Column 4: Contact details */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider">Contact</h3>
          <ul className="flex flex-col gap-3.5 text-sm font-medium">
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="text-teal-500" />
              <a href={`mailto:${siteContent.contactPage.email}`} className="hover:text-teal-500 transition-colors">
                {siteContent.contactPage.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="text-teal-500" />
              <a href={`tel:${siteContent.contactPage.phone}`} className="hover:text-teal-500 transition-colors">
                {siteContent.contactPage.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock size={16} className="text-teal-500" />
              <span>{siteContent.contactPage.responseTimeText || '24/7 Support Available'}</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="mx-auto max-w-7xl px-6 sm:px-8 mt-12 pt-6 border-t border-slate-200/40 dark:border-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
        <p>{footerData.copyrightText || siteContent.footer.copyrightText}</p>
        <div className="flex gap-6">
          <Link href="/privacy-policy" className="hover:text-teal-500 transition-colors">Privacy Policy</Link>
          <Link href="/terms-of-service" className="hover:text-teal-500 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
