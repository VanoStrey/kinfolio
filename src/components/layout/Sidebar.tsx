import React from 'react';
import { Users, Gift, Search, Settings, ShieldCheck } from 'lucide-react';
import { ActiveView } from '../../types/navigation';
import { useTranslation } from '../../i18n/LanguageContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

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
  const { t } = useTranslation();

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
    <aside className="w-64 h-screen bg-surface border-r border-border flex flex-col justify-between shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center text-primary font-serif font-bold text-sm shadow-subtle">
            L
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-primary">
              {t('app.name')}
            </h1>
            <p className="text-[11px] text-secondary tracking-normal">
              {t('app.slogan')}
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="mt-8 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id || (item.id === 'people' && activeView === 'person-detail');

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-canvas text-primary font-semibold border border-border-subtle'
                    : 'text-secondary hover:text-primary hover:bg-canvas/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-secondary'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-surface text-primary border border-border-subtle' : 'text-muted'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Language & Storage Status */}
      <div className="p-5 border-t border-border-subtle space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-secondary font-medium">
            {t('settings.languageLabel')}
          </span>
          <LanguageSwitcher compact />
        </div>

        <div className="pt-2 border-t border-border-subtle">
          <div className="flex items-center gap-2 text-primary font-medium text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
            <span>{t('app.storageStatus')}</span>
          </div>
          <p className="text-[10px] text-muted mt-0.5">
            {t('app.storageSubtext')}
          </p>
        </div>
      </div>
    </aside>
  );
};
