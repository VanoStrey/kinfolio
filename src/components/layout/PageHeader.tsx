import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border">
      <div className="space-y-1">
        <h1 className="text-[30px] sm:text-[32px] font-semibold tracking-[-0.02em] leading-[1.2] text-primary">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[14px] sm:text-[15px] text-secondary leading-[1.5]">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="shrink-0 flex items-center gap-2.5">{action}</div>}
    </div>
  );
};
