'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import { ShoppingCart, Moon, Sun, ArrowRight, Menu, X, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isSignedIn } = useUser();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart, toggleCart } = useCart();
  const { hasAdminPrivileges, toggleAdminSidebar } = useAdmin();

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle theme utility
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Store', path: '/store' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/40 bg-white/75 backdrop-blur-md dark:border-slate-800/40 dark:bg-slate-950/75 transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight text-slate-900 dark:text-slate-50">
          <span className="text-teal-500 text-2xl font-bold">◆</span>
          <span>Eternals Studio</span>
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className={`text-sm font-semibold transition-all duration-200 hover:text-teal-500 ${
                      isActive
                        ? 'text-teal-500 dark:text-teal-400'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Admin Sidebar Toggle */}
          {hasAdminPrivileges && (
            <button
              onClick={toggleAdminSidebar}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-500/20 bg-teal-500/5 text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 hover:border-teal-500/30 transition-all duration-200 cursor-pointer"
              aria-label="Admin settings"
              title="Open Admin Console"
            >
              <Shield size={18} />
            </button>
          )}

          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-200 cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Cart Button */}
          <button
            onClick={toggleCart}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-200 relative cursor-pointer"
            aria-label="Cart"
          >
            <ShoppingCart size={18} />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-[10px] font-black text-white shadow-sm shadow-teal-500/30">
                {cart.length}
              </span>
            )}
          </button>

          {/* Clerk Auth Integrations */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isSignedIn ? (
              <>
                {/* Check if user role matches admin to present admin link */}
                {user?.publicMetadata?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="hidden sm:inline-block text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline px-2 py-1"
                  >
                    Admin Panel
                  </Link>
                )}
                <UserButton />
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="hidden sm:block text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-teal-500 dark:hover:text-teal-400 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-400 to-indigo-500 hover:from-teal-500 hover:to-indigo-600 text-white font-bold text-sm px-3 py-2 sm:px-4 sm:py-2.5 shadow-md shadow-teal-500/10 hover:shadow-teal-500/20 active:scale-95 transition-all duration-200"
                >
                  <span className="hidden xs:inline">Get Started</span>
                  <span className="xs:hidden">Contact</span>
                  <ArrowRight size={14} className="hidden xs:inline" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-200 md:hidden cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-slate-200/40 bg-white/95 dark:border-slate-800/40 dark:bg-slate-950/95 backdrop-blur-md transition-all duration-300">
          <ul className="flex flex-col gap-4 p-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block text-base font-bold transition-all duration-200 hover:text-teal-500 ${
                      isActive
                        ? 'text-teal-500 dark:text-teal-400'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
            <hr className="border-slate-200/60 dark:border-slate-800/60 my-2" />
            {isSignedIn ? (
              <>
                {user?.publicMetadata?.role === 'admin' && (
                  <li>
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-base font-bold text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      Admin Panel
                    </Link>
                  </li>
                )}
              </>
            ) : (
              <li>
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-bold text-slate-700 dark:text-slate-300 hover:text-teal-500 dark:hover:text-teal-400"
                >
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
