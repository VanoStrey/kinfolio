import React from 'react';
import { ActiveView } from '../../types/navigation';
import { useTranslation } from '../../i18n/LanguageContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

interface HeaderProps {
  activeView: ActiveView;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  title,
}) => {
  const { t } = useTranslation();

  const getHeaderTitle = () => {
    if (title) return title;
    switch (activeView) {
      case 'people':
        return t('nav.people');
      case 'person-detail':
        return t('nav.profile');
      case 'gifts':
        return t('nav.gifts');
      case 'search':
        return t('nav.search');
      case 'settings':
        return t('nav.settings');
      default:
        return t('app.name');
    }
  };

  return (
    <header className="md:hidden sticky top-0 z-30 bg-surface/95 backdrop-blur-md border-b border-border px-4 h-14 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-7 h-7 rounded-sm bg-surface-green border border-green-300/60 flex items-center justify-center text-green-900 font-semibold text-[13px] shrink-0">
          L
        </div>
        <span className="text-[15px] font-semibold text-primary truncate">
          {getHeaderTitle()}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <LanguageSwitcher compact />
      </div>
    </header>
  );
};
