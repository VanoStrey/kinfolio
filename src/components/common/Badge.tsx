import React from 'react';

export interface BadgeProps {
  variant?: 'default' | 'accent' | 'warning' | 'danger' | 'success';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  dot = false,
}) => {
  const baseStyles = 'inline-flex items-center font-normal tracking-wide rounded transition-colors';

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const variantStyles = {
    default: 'bg-canvas text-secondary border border-border-subtle',
    accent: 'bg-accent/50 text-accent-dark border border-accent/70',
    warning: 'bg-amber-50 text-amber-900 border border-amber-200/60',
    danger: 'bg-red-50 text-red-800 border border-red-200/80',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60',
  };

  const dotStyles = {
    default: 'bg-secondary',
    accent: 'bg-accent-dark',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    success: 'bg-emerald-500',
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]} shrink-0`} />}
      {children}
    </span>
  );
};
