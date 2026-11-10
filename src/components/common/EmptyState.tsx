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
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-surface/50 rounded-xl border border-dashed border-border-strong/60 my-6">
      {icon && (
        <div className="w-11 h-11 rounded-full bg-accent/30 text-primary flex items-center justify-center mb-3">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-primary">{title}</h3>
      <p className="text-xs text-secondary max-w-sm mt-1 mb-5 leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};
