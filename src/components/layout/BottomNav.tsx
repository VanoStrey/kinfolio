import React from 'react';
import { Users, Gift, Search, Settings } from 'lucide-react';
import { ActiveView } from '../../types/navigation';
import { useTranslation } from '../../i18n/LanguageContext';

interface BottomNavProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  peopleCount: number;
  giftsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
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
      label: t('nav.giftsShort'),
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
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border px-2 pt-1.5 pb-safe flex items-center justify-around"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          activeView === item.id ||
          (item.id === 'people' && activeView === 'person-detail');

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-md min-w-[64px] min-h-[44px] transition-[background-color,color] duration-[180ms] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700/40 ${
              isActive
                ? 'bg-surface-green/80 text-green-900 font-semibold'
                : 'text-secondary font-medium hover:text-primary'
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-[19px] h-[19px] ${
                  isActive ? 'text-green-700 stroke-[2.1]' : 'stroke-[1.75]'
                }`}
              />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2.5 text-[10px] min-w-[16px] h-[16px] px-1 rounded-full bg-green-700 text-inverse flex items-center justify-center font-semibold">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-0.5 leading-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
