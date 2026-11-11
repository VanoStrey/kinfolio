import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, InterpolationParams } from './types';
import { TranslationKey, resolveTranslation, getLocale } from './helpers';
import { settingsRepository } from '../db/repositories/settingsRepository';

interface LanguageContextValue {
  language: Language;
  locale: string;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: TranslationKey, params?: InterpolationParams) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    let mounted = true;
    settingsRepository.get<Language>('language', 'en').then((savedLang) => {
      if (mounted && (savedLang === 'en' || savedLang === 'ru')) {
        setLanguageState(savedLang);
        document.documentElement.lang = savedLang;
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const setLanguage = useCallback(async (newLang: Language) => {
    setLanguageState(newLang);
    document.documentElement.lang = newLang;
    try {
      await settingsRepository.set('language', newLang);
    } catch (err) {
      console.warn('[i18n] Failed to persist language setting:', err);
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: InterpolationParams) => {
      return resolveTranslation(language, key, params);
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        locale: getLocale(language),
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return ctx;
}
