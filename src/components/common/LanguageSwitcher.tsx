import React from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { Language } from '../../i18n/types';
import { useToast } from '../../hooks/useToast';
import { resolveTranslation } from '../../i18n/helpers';

interface LanguageSwitcherProps {
  compact?: boolean;
  showIcon?: boolean;
  notifyOnSwitch?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  compact = false,
  showIcon = false,
  notifyOnSwitch = true,
}) => {
  const { language, setLanguage } = useTranslation();
  const { showToast } = useToast();

  const handleSelect = async (lang: Language) => {
    if (lang === language) return;
    await setLanguage(lang);
    if (notifyOnSwitch) {
      showToast(resolveTranslation(lang, 'toasts.languageChanged'));
    }
  };

  return (
    <div
      className="inline-flex items-center gap-2"
      role="group"
      aria-label="Language switcher"
    >
      {showIcon && <Globe className="w-4 h-4 text-secondary shrink-0" />}
      <div className="inline-flex items-center bg-surface-soft border border-border rounded-full p-0.5">
        {(['en', 'ru'] as Language[]).map((lang) => {
          const isActive = language === lang;
          return (
            <button
              key={lang}
              type="button"
              onClick={() => handleSelect(lang)}
              aria-pressed={isActive}
              className={`font-semibold rounded-full transition-[background-color,color] duration-[180ms] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700/40 ${
                compact ? 'text-[11px] uppercase px-2.5 py-0.5' : 'text-[12.5px] px-3 py-1'
              } ${
                isActive
                  ? 'bg-surface-green text-green-900 shadow-soft'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              {compact ? lang : lang === 'en' ? 'English' : 'Русский'}
            </button>
          );
        })}
      </div>
    </div>
  );
};
