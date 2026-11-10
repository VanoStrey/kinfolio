import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface TagManagerProps {
  title: string;
  tags: string[];
  onChange: (newTags: string[]) => void;
  placeholder?: string;
  badgeVariant?: 'default' | 'accent' | 'warning' | 'danger' | 'success';
  hint?: string;
  isAllergy?: boolean;
}

export const TagManager: React.FC<TagManagerProps> = ({
  title,
  tags,
  onChange,
  placeholder = 'Add new item...',
  badgeVariant = 'default',
  hint,
  isAllergy = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

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
    <div className="bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <h4 className="text-xs font-semibold text-primary uppercase tracking-wider">
              {title}
            </h4>
            {hint && <p className="text-[11px] text-secondary mt-0.5">{hint}</p>}
          </div>

          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="text-xs text-secondary hover:text-primary p-1 rounded-md hover:bg-canvas transition-colors inline-flex items-center gap-1 font-medium"
              title="Add item"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>

        {/* Existing tags */}
        <div className="flex flex-wrap gap-1.5 min-h-[32px] items-center">
          {tags.length > 0 ? (
            tags.map((tag, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                  isAllergy
                    ? 'bg-red-50 text-red-900 border border-red-200/80'
                    : badgeVariant === 'warning'
                    ? 'bg-amber-50 text-amber-900 border border-amber-200/80'
                    : 'bg-canvas text-primary border border-border-subtle'
                }`}
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="hover:text-red-600 p-0.5 rounded transition-colors"
                  aria-label={`Remove ${tag}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          ) : (
            !isAdding && <span className="text-xs text-muted italic">None recorded.</span>
          )}
        </div>
      </div>

      {/* Add Tag Input field */}
      {isAdding && (
        <div className="mt-3 pt-3 border-t border-border-subtle flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus
            className="flex-1 bg-canvas border border-border text-xs rounded-md px-2.5 py-1.5 text-primary placeholder:text-muted focus:outline-none focus:border-primary/60"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!inputValue.trim()}
            className="text-xs bg-primary text-white px-2.5 py-1.5 rounded-md font-medium disabled:opacity-40 hover:bg-black/90 transition-all"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAdding(false);
              setInputValue('');
            }}
            className="text-xs text-secondary hover:text-primary px-2 py-1.5"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
