import React from 'react';
import { Gift as GiftIcon } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

interface GiftImageProps {
  src?: string;
  alt: string;
  showPlaceholder?: boolean;
  className?: string;
}

export const GiftImage: React.FC<GiftImageProps> = ({
  src,
  alt,
  showPlaceholder = true,
  className = '',
}) => {
  const { t } = useTranslation();

  if (src) {
    return (
      <div className={`w-full aspect-[16/10] bg-surface-soft overflow-hidden border-b border-border ${className}`}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  if (!showPlaceholder) return null;

  return (
    <div
      className={`w-full h-28 bg-surface-soft/80 border-b border-border flex flex-col items-center justify-center gap-1.5 text-muted ${className}`}
    >
      <div className="w-9 h-9 rounded-full bg-surface-green/80 flex items-center justify-center text-green-700/75">
        <GiftIcon className="w-4 h-4 stroke-[1.75]" />
      </div>
      <span className="text-[11.5px] font-medium text-muted">{t('gifts.noImage')}</span>
    </div>
  );
};
