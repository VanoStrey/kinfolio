import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent' | 'soft' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold tracking-[-0.005em] transition-[background-color,border-color,color,opacity] duration-[180ms] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:opacity-50 disabled:pointer-events-none select-none';

  const sizeStyles = {
    sm: 'h-8 text-[13px] px-3 rounded-sm gap-1.5',
    md: 'h-10 text-[13.5px] px-4 rounded-md gap-2',
    lg: 'h-11 text-[14px] px-5 rounded-md gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-green-700 text-inverse hover:bg-green-900 shadow-soft',
    secondary: 'bg-surface text-primary border border-border hover:bg-surface-soft hover:border-green-300 shadow-soft',
    soft: 'bg-surface-green text-green-900 hover:bg-green-300/40',
    accent: 'bg-surface-green text-green-900 hover:bg-green-300/40',
    ghost: 'text-secondary hover:text-primary hover:bg-surface-soft',
    danger: 'bg-[#FAF0EF] text-danger border border-danger/30 hover:bg-[#F5E2E0] hover:border-danger/50',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      {children}
    </button>
  );
};
