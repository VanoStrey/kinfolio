import React from 'react';

interface PersonAvatarProps {
  name: string;
  photoUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const PersonAvatar: React.FC<PersonAvatarProps> = ({
  name,
  photoUrl,
  size = 'md',
  className = '',
}) => {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const sizeStyles = {
    sm: 'w-9 h-9 text-[13px] rounded-md',
    md: 'w-11 h-11 text-[15px] rounded-lg',
    lg: 'w-14 h-14 text-[18px] rounded-lg',
    xl: 'w-[68px] h-[68px] text-[22px] rounded-xl',
  };

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className={`object-cover border border-border bg-surface-soft shrink-0 ${sizeStyles[size]} ${className}`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`bg-surface-green text-green-900 border border-green-300/60 flex items-center justify-center font-semibold tracking-tight shrink-0 ${sizeStyles[size]} ${className}`}
    >
      {initials || '?'}
    </div>
  );
};
