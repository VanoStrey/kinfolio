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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border px-4 py-2 flex items-center justify-around pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id || (item.id === 'people' && activeView === 'person-detail');

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg relative min-w-[56px] transition-colors ${
              isActive ? 'text-primary font-semibold' : 'text-secondary hover:text-primary'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.6]'}`} />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-2 text-[9px] min-w-3.5 h-3.5 px-0.5 rounded-full bg-accent text-accent-dark flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
