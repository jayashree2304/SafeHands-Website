'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import { useLanguage } from '../providers/LanguageContext';
import { Heart, User, Menu, X, ChevronDown, Phone, Mail } from 'lucide-react';

import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [userSession, setUserSession] = useState<{ id: string; identifier: string } | null>(null);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Fetch user status on mount and when pathname changes
    fetch('/api/auth/user/status')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user) {
          setUserSession(data.user);
        } else {
          setUserSession(null);
        }
      })
      .catch(() => setUserSession(null));
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 w-full shadow-md transition-all duration-300">
      {/* Top Bar with Social Links & Contact */}
      <div className="bg-[#023613] text-white text-xs py-1.5 px-4 sm:px-8 border-b border-emerald-900/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-emerald-100">
            <a href="tel:7358005444" className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+91 7358005444</span>
            </a>
            <span className="hidden sm:inline text-emerald-700">|</span>
            <a href="mailto:safehandsindia2010@gmail.com" className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">safehandsindia2010@gmail.com</span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <a href="https://www.facebook.com/profile.php?id=61568720233041" target="_blank" rel="noreferrer" className="hover:text-emerald-300">Facebook</a>
              <a href="https://x.com/SafeHandsNgo" target="_blank" rel="noreferrer" className="hover:text-emerald-300">X</a>
              <a href="https://www.instagram.com/safehands_ngo/" target="_blank" rel="noreferrer" className="hover:text-emerald-300">Instagram</a>
              <a href="https://www.linkedin.com/in/safe-hands-ngo-2481b7319/" target="_blank" rel="noreferrer" className="hover:text-emerald-300">LinkedIn</a>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className={`w-full bg-[#66a23f] text-white transition-colors duration-200 ${isScrolled ? 'bg-opacity-95 backdrop-blur-md shadow-lg' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
          {/* Logo & Org Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-white p-1.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform">
              <img
                src="https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/WhatsApp%20Image%202025-04-08%20at%2016.20.40_6acd279f.jpg"
                alt="Safe Hands NGO Logo"
                className="w-10 h-10 object-contain rounded"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base md:text-lg tracking-tight text-white leading-tight">
                Safe Hands
              </span>
              <span className="text-[10px] text-emerald-100 uppercase tracking-wider font-medium hidden sm:block">
                Human Resources Organization
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 font-medium text-sm">
            <Link href="/" className="hover:text-emerald-200 transition-colors">{t.home}</Link>

            {/* About Dropdown */}
            <div className="relative group">
              <button
                type="button"
                onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                className="flex items-center gap-1 hover:text-emerald-200 transition-colors py-2"
              >
                <span>{t.aboutUs}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-100 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 py-2 z-50">
                <Link href="/about-us#mission_vision" className="block px-4 py-2 text-xs hover:bg-emerald-50 hover:text-emerald-700">{t.missionVision}</Link>
                <Link href="/about-us#focus_area" className="block px-4 py-2 text-xs hover:bg-emerald-50 hover:text-emerald-700">{t.focusArea}</Link>
                <Link href="/about-us#our_team" className="block px-4 py-2 text-xs hover:bg-emerald-50 hover:text-emerald-700">{t.ourTeam}</Link>
              </div>
            </div>

            <Link href="/events" className="hover:text-emerald-200 transition-colors">{t.events}</Link>
            <Link href="/volunteer" className="hover:text-emerald-200 transition-colors">{t.volunteer}</Link>
            <Link href="/resources" className="hover:text-emerald-200 transition-colors">{t.resources}</Link>
            <Link href="/contact-us" className="hover:text-emerald-200 transition-colors">{t.contactUs}</Link>
          </div>

          {/* Action Buttons: User Auth & Donate */}
          <div className="hidden lg:flex items-center gap-3">
            {userSession ? (
              <Link
                href="/user/profile"
                className="flex items-center gap-1.5 bg-emerald-950/40 hover:bg-emerald-950/60 text-white px-3.5 py-2 rounded-full text-xs font-semibold transition-colors border border-emerald-400/30"
              >
                <User className="w-3.5 h-3.5 text-emerald-300" />
                <span>{t.profile}</span>
              </Link>
            ) : (
              <Link
                href="/user/login"
                className="flex items-center gap-1.5 bg-emerald-900 hover:bg-emerald-950 text-white px-3.5 py-2 rounded-full text-xs font-semibold transition-colors shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t.login}</span>
              </Link>
            )}

            <Link
              href="/donate"
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <Heart className="w-4 h-4 fill-current text-red-700" />
              <span>{t.donate}</span>
            </Link>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-emerald-800 text-white hover:bg-emerald-900"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#023613] text-white px-6 py-6 border-t border-emerald-800 space-y-4 animate-fade-in">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium border-b border-emerald-900">{t.home}</Link>
            <Link href="/about-us" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium border-b border-emerald-900">{t.aboutUs}</Link>
            <Link href="/events" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium border-b border-emerald-900">{t.events}</Link>
            <Link href="/volunteer" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium border-b border-emerald-900">{t.volunteer}</Link>
            <Link href="/resources" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium border-b border-emerald-900">{t.resources}</Link>
            <Link href="/contact-us" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium border-b border-emerald-900">{t.contactUs}</Link>

            <div className="pt-2 flex flex-col gap-3">
              <Link
                href={userSession ? '/user/profile' : '/user/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-emerald-800 hover:bg-emerald-900 py-2.5 rounded-lg text-xs font-semibold"
              >
                {userSession ? t.profile : t.login}
              </Link>
              <Link
                href="/donate"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-amber-500 hover:bg-amber-600 text-slate-950 py-2.5 rounded-lg text-xs font-bold"
              >
                {t.donate}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
