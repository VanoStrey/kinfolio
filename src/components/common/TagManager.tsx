import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

interface TagManagerProps {
  title: string;
  tags: string[];
  onChange: (newTags: string[]) => void;
  placeholder?: string;
  badgeVariant?: 'default' | 'accent' | 'warning' | 'danger' | 'success';
  hint?: string;
  isAllergy?: boolean;
  seamless?: boolean;
}

export const TagManager: React.FC<TagManagerProps> = ({
  title,
  tags,
  onChange,
  placeholder,
  badgeVariant = 'default',
  hint,
  isAllergy = false,
  seamless = false,
}) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const effectivePlaceholder = placeholder || t('tagManager.defaultPlaceholder');

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) {
      setInputValue('');
      return;
    }
    onChange([...tags, trimmed]);
    setInputValue('');
    setIsAdding(false);
  };

  const handleRemove = (indexToRemove: number) => {
    onChange(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setInputValue('');
    }
  };

  return (
    <div
      className={
        seamless
          ? 'pt-2 flex flex-col justify-between'
          : 'bg-surface border border-border rounded-lg p-5 flex flex-col justify-between'
      }
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div>
            <h4 className="text-[13px] font-semibold text-primary uppercase tracking-[0.04em]">
              {title}
            </h4>
            {hint && <p className="text-[12.5px] text-secondary mt-0.5 leading-[1.4]">{hint}</p>}
          </div>

          {!isAdding && (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="text-[13px] text-green-700 hover:text-green-900 px-2.5 py-1 rounded-sm hover:bg-surface-green transition-colors inline-flex items-center gap-1 font-semibold shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700/40"
              title={t('tagManager.addItemTitle')}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('tagManager.add')}</span>
            </button>
          )}
        </div>

        {/* Existing tags */}
        <div className="flex flex-wrap gap-2 min-h-[34px] items-center">
          {tags.length > 0 ? (
            tags.map((tag, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1.5 text-[13px] px-3 py-1 rounded-sm font-medium transition-colors ${
                  isAllergy
                    ? 'bg-[#FAF0EF] text-[#964F49] border border-danger/35'
                    : badgeVariant === 'warning'
                    ? 'bg-[#FAF4E8] text-[#8B6735] border border-warning/35'
                    : badgeVariant === 'success'
                    ? 'bg-surface-green/70 text-green-900 border border-green-300/50'
                    : 'bg-surface-soft text-primary border border-border'
                }`}
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="text-secondary hover:text-danger p-0.5 rounded-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700/40"
                  aria-label={t('tagManager.removeLabel', { tag })}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))
          ) : (
            !isAdding && <span className="text-[13.5px] text-muted">{t('common.noneRecorded')}</span>
          )}
        </div>
      </div>

      {/* Add Tag Input field */}
      {isAdding && (
        <div className="mt-4 pt-3.5 border-t border-border flex flex-wrap sm:flex-nowrap items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={effectivePlaceholder}
            autoFocus
            className="flex-1 min-w-[160px] h-10 bg-surface border border-border text-[13.5px] rounded-md px-3 text-primary placeholder:text-muted focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
          />
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!inputValue.trim()}
              className="h-10 text-[13px] bg-green-700 text-inverse px-3.5 rounded-md font-semibold disabled:opacity-45 hover:bg-green-900 transition-colors"
            >
              {t('tagManager.add')}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setInputValue('');
              }}
              className="h-10 text-[13px] text-secondary hover:text-primary px-2.5 rounded-md hover:bg-surface-soft transition-colors"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
