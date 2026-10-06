'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../providers/LanguageContext';
import { MapPin, Phone, Mail, Heart, Facebook, Twitter, Instagram, Linkedin, ExternalLink } from 'lucide-react';

import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const { t } = useLanguage();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#023613] text-white pt-16 pb-12 border-t-4 border-[#66a23f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Org Summary & Address */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-lg shadow-sm">
              <img
                src="https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/WhatsApp%20Image%202025-04-08%20at%2016.20.40_6acd279f.jpg"
                alt="Safe Hands NGO Logo"
                className="w-10 h-10 object-contain rounded"
              />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Safe Hands</h3>
              <p className="text-[11px] text-emerald-200">Human Resources Organization</p>
            </div>
          </div>
          <p className="text-xs text-emerald-100/80 leading-relaxed">
            Empowering vulnerable communities through education, skill development, healthcare, and environmental awareness for long-term self-reliance.
          </p>
          <div className="pt-2 text-xs space-y-2">
            <div className="flex items-start gap-2 text-emerald-200">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Address:</strong> 6/89, Periyar Nagar, Valavanthan Kottai, Trichy - 620015, Tamil Nadu, India.
              </span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="font-bold text-sm text-emerald-400 uppercase tracking-wider">{t.quickLinks}</h4>
          <ul className="space-y-2 text-xs text-emerald-100">
            <li><Link href="/about-us" className="hover:text-white transition-colors">{t.aboutUs}</Link></li>
            <li><Link href="/events" className="hover:text-white transition-colors">{t.events}</Link></li>
            <li><Link href="/volunteer" className="hover:text-white transition-colors">{t.volunteer}</Link></li>
            <li><Link href="/resources" className="hover:text-white transition-colors">{t.resources}</Link></li>
            <li><Link href="/donate" className="hover:text-white transition-colors">{t.donate}</Link></li>
            <li><Link href="/contact-us" className="hover:text-white transition-colors">{t.contactUs}</Link></li>
          </ul>
        </div>

        {/* Contact Info & Socials */}
        <div className="space-y-4">
          <h4 className="font-bold text-sm text-emerald-400 uppercase tracking-wider">{t.contactUs}</h4>
          <div className="space-y-3 text-xs text-emerald-100">
            <a href="tel:7358005444" className="flex items-center gap-2.5 hover:text-emerald-300 transition-colors">
              <div className="bg-emerald-900/60 p-2 rounded-lg text-emerald-400">
                <Phone className="w-4 h-4" />
              </div>
              <span>+91 7358005444</span>
            </a>
            <a href="mailto:safehandsindia2010@gmail.com" className="flex items-center gap-2.5 hover:text-emerald-300 transition-colors">
              <div className="bg-emerald-900/60 p-2 rounded-lg text-emerald-400">
                <Mail className="w-4 h-4" />
              </div>
              <span className="break-all">safehandsindia2010@gmail.com</span>
            </a>
          </div>

          <div className="pt-2">
            <p className="text-xs font-semibold text-emerald-300 mb-2">Connect With Us:</p>
            <div className="flex items-center gap-3">
              <a href="https://www.facebook.com/profile.php?id=61568720233041" target="_blank" rel="noreferrer" className="p-2 bg-emerald-900/80 hover:bg-emerald-800 rounded-full text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://x.com/SafeHandsNgo" target="_blank" rel="noreferrer" className="p-2 bg-emerald-900/80 hover:bg-emerald-800 rounded-full text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/safehands_ngo/" target="_blank" rel="noreferrer" className="p-2 bg-emerald-900/80 hover:bg-emerald-800 rounded-full text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/in/safe-hands-ngo-2481b7319/" target="_blank" rel="noreferrer" className="p-2 bg-emerald-900/80 hover:bg-emerald-800 rounded-full text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Fixed Google Map Embed Pinned to 6/89, Periyar Nagar, Valavanthan Kottai, Trichy - 620015 */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-emerald-400 uppercase tracking-wider">Location Map</h4>
          <div className="w-full h-44 rounded-xl overflow-hidden border border-emerald-800 shadow-md">
            <iframe
              title="Safe Hands NGO Location Map"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src="https://maps.google.com/maps?q=6%2F89%2C%20Periyar%20Nagar%2C%20Valavanthan%20Kottai%2C%20Trichy%20-%20620015&t=&z=15&ie=UTF8&iwloc=&output=embed"
            />
          </div>
          <a
            href="https://maps.google.com/maps?q=6%2F89%2C%20Periyar%20Nagar%2C%20Valavanthan%20Kottai%2C%20Trichy%20-%20620015"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] text-emerald-300 hover:underline"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Compliance */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-12 pt-6 border-t border-emerald-900/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-emerald-200/70">
        <p>{t.copyright}</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <span>•</span>
          <Link href="/data-deletion" className="hover:text-white transition-colors">Data Deletion</Link>
        </div>
      </div>
    </footer>
  );
}
