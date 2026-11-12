import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  compact?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, compact = false, className = '', id, children, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-[13px] font-medium text-primary">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={`w-full appearance-none bg-surface border border-border text-primary rounded-md pr-9 focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/15 transition-[border-color,box-shadow] duration-[180ms] cursor-pointer disabled:bg-surface-soft disabled:text-secondary ${
              compact ? 'h-10 text-[13px] pl-3' : 'h-[44px] text-[14px] pl-3.5'
            } ${className}`}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="w-4 h-4 text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';
