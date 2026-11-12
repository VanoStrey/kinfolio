import React from 'react';
import { LucideIcon } from 'lucide-react';

interface NavigationItemProps {
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  badge?: number;
  onClick: () => void;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
  label,
  icon: Icon,
  isActive,
  badge,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      title={label}
      className={`w-full flex items-center justify-center lg:justify-between px-3 py-2.5 rounded-md text-[14px] transition-[background-color,color] duration-[180ms] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700/40 ${
        isActive
          ? 'bg-surface-green text-green-900 font-semibold'
          : 'text-secondary font-medium hover:text-primary hover:bg-surface-soft'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Icon
          className={`w-[18px] h-[18px] shrink-0 ${
            isActive ? 'text-green-700 stroke-[2.1]' : 'text-secondary stroke-[1.75]'
          }`}
        />
        <span className="hidden lg:inline truncate">{label}</span>
      </div>

      {badge !== undefined && (
        <span
          className={`hidden lg:inline-flex items-center justify-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            isActive
              ? 'bg-surface text-green-900'
              : 'bg-surface-soft text-secondary'
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
};
