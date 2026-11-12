import React from 'react';

interface ContentContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 ${className}`}>
      {children}
    </div>
  );
};
