import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id, rows = 3, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-[13px] font-medium text-primary">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={`w-full bg-surface border border-border text-primary text-[14px] leading-[1.55] rounded-md p-3.5 placeholder:text-muted focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/15 transition-[border-color,box-shadow] duration-[180ms] ${
            error ? 'border-danger focus:border-danger focus:ring-danger/15' : ''
          } ${className}`}
          {...props}
        />
        {hint && !error && <span className="text-[12px] text-secondary leading-[1.4]">{hint}</span>}
        {error && <span className="text-[12px] text-danger font-medium leading-[1.4]">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
