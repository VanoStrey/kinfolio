import React from 'react';

export interface BadgeProps {
  variant?: 'default' | 'accent' | 'warning' | 'danger' | 'success' | 'info';
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
  const baseStyles = 'inline-flex items-center font-medium rounded-sm transition-colors';

  const sizeStyles = {
    sm: 'text-[12px] px-2 py-0.5 gap-1.5 leading-[1.35]',
    md: 'text-[12.5px] px-2.5 py-1 gap-1.5 leading-[1.35]',
  };

  const variantStyles = {
    default: 'bg-surface-soft text-secondary border border-border',
    accent: 'bg-surface-green text-green-900 border border-green-300/60',
    success: 'bg-surface-green text-green-900 border border-green-300/60',
    warning: 'bg-[#FAF4E8] text-[#8B6735] border border-warning/35',
    danger: 'bg-[#FAF0EF] text-[#964F49] border border-danger/35',
    info: 'bg-[#EEF3F4] text-[#536B72] border border-info/30',
  };

  const dotStyles = {
    default: 'bg-secondary',
    accent: 'bg-green-700',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    info: 'bg-info',
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]} shrink-0`} />}
      {children}
    </span>
  );
};
