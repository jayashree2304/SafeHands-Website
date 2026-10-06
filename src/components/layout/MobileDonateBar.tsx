'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, UserPlus } from 'lucide-react';
import { useLanguage } from '../providers/LanguageContext';

import { usePathname } from 'next/navigation';

export default function MobileDonateBar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-3 px-4 flex items-center justify-between gap-3 shadow-2xl">
      <Link
        href="/volunteer"
        className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
      >
        <UserPlus className="w-4 h-4 text-emerald-400" />
        <span>{t.volunteer}</span>
      </Link>
      
      <Link
        href="/donate"
        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 py-2.5 rounded-xl text-xs font-extrabold shadow-lg transition-all"
      >
        <Heart className="w-4 h-4 fill-current text-red-700" />
        <span>{t.donate}</span>
      </Link>
    </div>
  );
}
