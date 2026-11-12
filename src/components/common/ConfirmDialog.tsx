import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useTranslation } from '../../i18n/LanguageContext';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant = 'danger',
  isLoading = false,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isLoading) onClose();
      }}
      title={title}
      maxWidth="sm"
    >
      <div className="space-y-5">
        <p className="text-[14px] text-secondary leading-[1.55]">{description}</p>
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            size="md"
            disabled={isLoading}
            onClick={onClose}
          >
            {cancelLabel || t('common.cancel')}
          </Button>
          <Button
            type="button"
            variant={variant}
            size="md"
            disabled={isLoading}
            onClick={onConfirm}
          >
            {confirmLabel || t('common.delete')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
