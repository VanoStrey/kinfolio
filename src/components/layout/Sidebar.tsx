import React from 'react';
import { Users, Gift, Search, Settings, ShieldCheck } from 'lucide-react';
import { ActiveView } from '../../types/navigation';
import { useTranslation } from '../../i18n/LanguageContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { NavigationItem } from './NavigationItem';

interface SidebarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  peopleCount: number;
  giftsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  peopleCount,
  giftsCount,
}) => {
  const { t, language, setLanguage } = useTranslation();

  const navItems = [
    {
      id: 'people' as ActiveView,
      label: t('nav.people'),
      icon: Users,
      badge: peopleCount,
    },
    {
      id: 'gifts' as ActiveView,
      label: t('nav.gifts'),
      icon: Gift,
      badge: giftsCount,
    },
    {
      id: 'search' as ActiveView,
      label: t('nav.search'),
      icon: Search,
    },
    {
      id: 'settings' as ActiveView,
      label: t('nav.settings'),
      icon: Settings,
    },
  ];

  return (
    <aside className="sticky top-0 h-screen md:w-[76px] lg:w-[240px] bg-surface border-r border-border flex flex-col justify-between shrink-0 select-none transition-[width] duration-[180ms]">
      {/* Brand Header */}
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-center lg:justify-start gap-3">
          <div className="w-9 h-9 rounded-md bg-surface-green border border-green-300/60 flex items-center justify-center text-green-900 font-semibold text-[15px] shrink-0">
            L
          </div>
          <div className="hidden lg:block min-w-0">
            <span className="text-[15px] font-semibold tracking-[-0.01em] text-primary block truncate">
              {t('app.name')}
            </span>
            <p className="text-[12px] text-secondary leading-[1.35] truncate">
              {t('app.slogan')}
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="mt-8 flex flex-col gap-1.5" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive =
              activeView === item.id ||
              (item.id === 'people' && activeView === 'person-detail');

            return (
              <NavigationItem
                key={item.id}
                label={item.label}
                icon={item.icon}
                isActive={isActive}
                badge={item.badge}
                onClick={() => onNavigate(item.id)}
              />
            );
          })}
        </nav>
      </div>

      {/* Footer / Language & Storage Status */}
      <div className="p-3 lg:p-5 border-t border-border space-y-3">
        {/* Full switcher on desktop, single toggle button on compact tablet rail */}
        <div className="hidden lg:flex items-center justify-between gap-2">
          <span className="text-[12px] text-secondary font-medium">
            {t('settings.languageLabel')}
          </span>
          <LanguageSwitcher compact />
        </div>
        <div className="flex lg:hidden justify-center">
          <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}
            title={t('settings.languageLabel')}
            className="w-10 h-8 rounded-full bg-surface-soft border border-border text-[11px] font-semibold uppercase text-green-900 hover:bg-surface-green transition-colors"
          >
            {language}
          </button>
        </div>

        <div className="hidden lg:block pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-green-900 font-medium text-[12px]">
            <ShieldCheck className="w-4 h-4 text-green-700 shrink-0" />
            <span>{t('app.storageStatus')}</span>
          </div>
          <p className="text-[11px] text-muted mt-1 leading-[1.35]">
            {t('app.slogan')}.
          </p>
        </div>
      </div>
    </aside>
  );
};
