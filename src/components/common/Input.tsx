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
          <label htmlFor={inputId} className="text-[13px] font-medium text-primary">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-secondary pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full h-[44px] bg-surface border border-border text-primary text-[14px] rounded-md px-3.5 placeholder:text-muted focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/15 transition-[border-color,box-shadow] duration-[180ms] ${
              icon ? 'pl-10' : ''
            } ${error ? 'border-danger focus:border-danger focus:ring-danger/15' : ''} ${className}`}
            {...props}
          />
        </div>
        {hint && !error && <span className="text-[12px] text-secondary leading-[1.4]">{hint}</span>}
        {error && <span className="text-[12px] text-danger font-medium leading-[1.4]">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
