import React from 'react';
import { Plus } from 'lucide-react';
import { ActiveView } from '../../types/navigation';
import { Button } from '../common/Button';
import { useTranslation } from '../../i18n/LanguageContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

interface HeaderProps {
  activeView: ActiveView;
  onQuickAdd?: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onQuickAdd,
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
    <header className="md:hidden sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-6 h-6 rounded bg-accent flex items-center justify-center text-primary font-serif font-bold text-xs shrink-0">
          L
        </div>
        <h1 className="text-sm font-semibold text-primary truncate">{getHeaderTitle()}</h1>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <LanguageSwitcher compact />
        {onQuickAdd && (activeView === 'people' || activeView === 'gifts') && (
          <Button
            size="sm"
            variant="primary"
            onClick={onQuickAdd}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            {t('nav.add')}
          </Button>
        )}
      </div>
    </header>
  );
};
