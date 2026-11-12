import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: 'default' | 'soft' | 'danger';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({
  label,
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const sizeStyles = {
    sm: 'w-8 h-8 rounded-sm',
    md: 'w-9 h-9 rounded-md',
  };

  const variantStyles = {
    default: 'text-secondary hover:text-primary hover:bg-surface-soft',
    soft: 'text-green-900 bg-surface-soft hover:bg-surface-green',
    danger: 'text-secondary hover:text-danger hover:bg-[#FAF0EF]',
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center transition-[background-color,color,opacity] duration-[180ms] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700/40 focus-visible:ring-offset-1 disabled:opacity-40 disabled:pointer-events-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
