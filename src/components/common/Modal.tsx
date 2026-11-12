import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#292E29]/25 backdrop-blur-[2px] transition-opacity duration-[180ms]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Responsive Dialog: bottom drawer on mobile, centered modal on tablet/desktop */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${maxWidthStyles[maxWidth]} bg-surface rounded-t-xl sm:rounded-xl border border-border shadow-modal p-5 sm:p-6 max-h-[92vh] overflow-y-auto z-10 pb-safe transition-[opacity,transform] duration-[180ms]`}
      >
        {/* Mobile drawer handle indicator */}
        <div className="sm:hidden w-10 h-1 bg-border rounded-full mx-auto mb-4" aria-hidden="true" />

        <div className="flex items-start justify-between gap-3 pb-4 border-b border-border">
          <div>
            {title && <h3 className="text-[18px] font-semibold text-primary leading-[1.3]">{title}</h3>}
            {subtitle && <p className="text-[13px] text-secondary mt-1 leading-[1.45]">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-primary p-1.5 -mr-1 rounded-sm hover:bg-surface-soft transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700/40"
            aria-label={t('common.closeDialog')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-5">{children}</div>
      </div>
    </div>
  );
};
