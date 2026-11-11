import React, { useState, useEffect } from 'react';
import { Note } from '../../types/note';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useTranslation } from '../../i18n/LanguageContext';

interface NoteEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string, category?: string) => void;
  initialNote?: Note | null;
}

export const NoteEditorModal: React.FC<NoteEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialNote,
}) => {
  const { t } = useTranslation();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialNote) {
      setContent(initialNote.content);
      setCategory(initialNote.category || '');
    } else {
      setContent('');
      setCategory('');
    }
    setError('');
  }, [initialNote, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError(t('notes.contentError'));
      return;
    }
    onSave(content.trim(), category.trim() || undefined);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialNote ? t('notes.modalEditTitle') : t('notes.modalAddTitle')}
      subtitle={t('notes.modalSubtitle')}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-secondary block mb-1">
            {t('notes.categoryLabel')}
          </label>
          <input
            type="text"
            placeholder={t('notes.categoryPlaceholder')}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-surface border border-border text-xs rounded-md p-2 text-primary focus:outline-none focus:border-primary/60"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-secondary block mb-1">
            {t('notes.contentLabel')}
          </label>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (error) setError('');
            }}
            placeholder={t('notes.contentPlaceholder')}
            rows={5}
            autoFocus
            className={`w-full bg-canvas border rounded-md p-3 text-xs text-primary placeholder:text-muted focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 ${
              error ? 'border-red-400' : 'border-border'
            }`}
          />
          {error && <span className="text-xs text-status-danger-text mt-1 block">{error}</span>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-subtle">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="primary">
            {initialNote ? t('notes.updateNote') : t('notes.saveNote')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
