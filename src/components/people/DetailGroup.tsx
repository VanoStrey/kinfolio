import React from 'react';

interface DetailGroupProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export const DetailGroup: React.FC<DetailGroupProps> = ({ title, action, children }) => {
  return (
    <section className="bg-surface border border-border rounded-lg p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-border">
        <h3 className="text-[12px] font-semibold text-secondary uppercase tracking-[0.06em]">
          {title}
        </h3>
        {action && <div>{action}</div>}
      </div>
      <div className="divide-y divide-border">{children}</div>
    </section>
  );
};

interface DetailItemProps {
  label: string;
  value?: string;
  emptyText?: string;
}

export const DetailItem: React.FC<DetailItemProps> = ({
  label,
  value,
  emptyText = '—',
}) => {
  return (
    <div className="py-3.5 first:pt-4 last:pb-1 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
      <span className="text-[13px] font-medium text-secondary shrink-0">{label}</span>
      <span className={`text-[15px] leading-[1.45] ${value ? 'font-semibold text-primary' : 'text-muted'}`}>
        {value || emptyText}
      </span>
    </div>
  );
};
