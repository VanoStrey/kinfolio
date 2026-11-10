import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className = '', id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-secondary">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-secondary pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-surface border border-border text-primary text-sm rounded-md py-2 px-3 placeholder:text-muted focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all ${
              icon ? 'pl-9' : ''
            } ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''} ${className}`}
            {...props}
          />
        </div>
        {hint && !error && <span className="text-[11px] text-muted">{hint}</span>}
        {error && <span className="text-xs text-status-danger-text">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
