import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger';
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
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-dark/20 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 rounded gap-1.5',
    md: 'text-sm px-3.5 py-2 rounded-md gap-2',
    lg: 'text-sm px-4 py-2.5 rounded-md gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-black/90 shadow-subtle',
    secondary: 'bg-surface text-primary border border-border hover:bg-canvas hover:border-border-strong shadow-subtle',
    ghost: 'text-secondary hover:text-primary hover:bg-canvas/80',
    accent: 'bg-accent text-accent-dark hover:bg-accent-hover font-medium',
    danger: 'bg-status-danger text-status-danger-text hover:bg-red-100 border border-red-200/60',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
