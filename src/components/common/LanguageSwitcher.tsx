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
      className="inline-flex items-center gap-1.5"
      role="group"
      aria-label="Language switcher"
    >
      {showIcon && <Globe className="w-3.5 h-3.5 text-secondary shrink-0" />}
      <div className="inline-flex items-center bg-canvas border border-border rounded-md p-0.5">
        {(['en', 'ru'] as Language[]).map((lang) => {
          const isActive = language === lang;
          return (
            <button
              key={lang}
              type="button"
              onClick={() => handleSelect(lang)}
              aria-pressed={isActive}
              className={`uppercase font-medium rounded transition-colors ${
                compact ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2.5 py-1'
              } ${
                isActive
                  ? 'bg-surface text-primary font-semibold shadow-subtle border border-border-subtle'
                  : 'text-secondary hover:text-primary border border-transparent'
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
