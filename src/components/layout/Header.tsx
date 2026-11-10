import React from 'react';
import { Plus } from 'lucide-react';
import { ActiveView } from '../../types/navigation';
import { Button } from '../common/Button';

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
  const getHeaderTitle = () => {
    if (title) return title;
    switch (activeView) {
      case 'people':
        return 'People';
      case 'person-detail':
        return 'Profile';
      case 'gifts':
        return 'Gift Ideas';
      case 'search':
        return 'Search';
      case 'settings':
        return 'Settings';
      default:
        return 'Little Details';
    }
  };

  return (
    <header className="md:hidden sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-accent flex items-center justify-center text-primary font-serif font-bold text-xs">
          L
        </div>
        <h1 className="text-sm font-semibold text-primary">{getHeaderTitle()}</h1>
      </div>

      {onQuickAdd && (activeView === 'people' || activeView === 'gifts') && (
        <Button
          size="sm"
          variant="primary"
          onClick={onQuickAdd}
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          Add
        </Button>
      )}
    </header>
  );
};
