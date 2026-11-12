import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  clearLabel?: string;
  size?: 'md' | 'lg';
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onClear,
  clearLabel = 'Clear',
  size = 'md',
  className = '',
  placeholder,
  ...props
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <Search
        className={`text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
          size === 'lg' ? 'w-[18px] h-[18px]' : 'w-4 h-4'
        }`}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-surface border border-border text-primary rounded-md pl-10 pr-10 placeholder:text-muted focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/15 transition-[border-color,box-shadow] duration-[180ms] ${
          size === 'lg' ? 'h-[46px] text-[15px]' : 'h-[42px] text-[14px]'
        }`}
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            onClear?.();
          }}
          aria-label={clearLabel}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-sm text-secondary hover:text-primary hover:bg-surface-soft flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
