'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LANGUAGES, DEFAULT_LANGUAGE, LanguageOption } from '@/lib/i18n/languages';
import { getDictionary, TranslationDictionary } from '@/lib/i18n/dictionaries';

interface LanguageContextType {
  currentLang: string;
  langConfig: LanguageOption;
  t: TranslationDictionary;
  setLanguage: (code: string) => void;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLang, setCurrentLang] = useState<string>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const saved = localStorage.getItem('sh_lang');
    if (saved && LANGUAGES.some((l) => l.code === saved)) {
      setCurrentLang(saved);
    }
  }, []);

  const setLanguage = (code: string) => {
    if (LANGUAGES.some((l) => l.code === code)) {
      setCurrentLang(code);
      localStorage.setItem('sh_lang', code);
    }
  };

  const langConfig = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];
  const t = getDictionary(currentLang);
  const dir = langConfig.dir;

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLang;
  }, [dir, currentLang]);

  return (
    <LanguageContext.Provider value={{ currentLang, langConfig, t, setLanguage, dir }}>
      <div dir={dir}>{children}</div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
