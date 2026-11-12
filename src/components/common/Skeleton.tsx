import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div
    className={`bg-surface-soft rounded-md animate-pulse ${className}`}
    aria-hidden="true"
  />
);
