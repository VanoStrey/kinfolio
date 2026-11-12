import React from 'react';

export interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 bg-surface-soft/60 rounded-lg border border-border my-4">
      {icon && (
        <div className="w-12 h-12 rounded-full bg-surface-green text-green-900 flex items-center justify-center mb-4 border border-green-300/40">
          {icon}
        </div>
      )}
      <h3 className="text-[17px] font-semibold text-primary leading-[1.3]">{title}</h3>
      <p className="text-[14px] text-secondary max-w-md mt-2 mb-6 leading-[1.55]">
        {description}
      </p>
      {action && <div className="flex flex-wrap items-center justify-center gap-3">{action}</div>}
    </div>
  );
};
