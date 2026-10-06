'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../providers/LanguageContext';
import { LANGUAGES } from '@/lib/i18n/languages';
import { Globe, ChevronDown, Check } from 'lucide-react';

export default function LanguageSwitcher() {
  const { currentLang, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full border border-white/20 text-xs md:text-sm font-medium transition-colors"
        aria-label="Select Language"
      >
        <Globe className="w-4 h-4 text-emerald-400" />
        <span>{selected.nativeName} ({selected.englishName})</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 py-1 text-slate-800 dark:text-slate-100">
          <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase border-b border-slate-100 dark:border-slate-800">
            Select Language (22 Languages)
          </div>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors ${
                currentLang === lang.code ? 'font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/50' : ''
              }`}
            >
              <div className="flex flex-col">
                <span className="font-medium text-slate-900 dark:text-white">{lang.nativeName}</span>
                <span className="text-[10px] text-slate-400">{lang.englishName}</span>
              </div>
              {currentLang === lang.code && <Check className="w-4 h-4 text-emerald-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
