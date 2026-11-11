import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { CustomField } from '../../types/person';
import { Button } from '../common/Button';
import { useTranslation } from '../../i18n/LanguageContext';

interface CustomFieldsEditorProps {
  fields: CustomField[];
  onChange: (fields: CustomField[]) => void;
}

export const CustomFieldsEditor: React.FC<CustomFieldsEditorProps> = ({ fields, onChange }) => {
  const { t } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleAddField = () => {
    if (!newLabel.trim() || !newValue.trim()) return;
    const newField: CustomField = {
      id: `cf-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      label: newLabel.trim(),
      value: newValue.trim(),
    };
    onChange([...fields, newField]);
    setNewLabel('');
    setNewValue('');
    setIsAdding(false);
  };

  const handleRemoveField = (id: string) => {
    onChange(fields.filter((f) => f.id !== id));
  };

  const handleUpdateField = (id: string, updatedLabel: string, updatedValue: string) => {
    onChange(
      fields.map((f) =>
        f.id === id ? { ...f, label: updatedLabel, value: updatedValue } : f
      )
    );
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-5 shadow-subtle space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
        <div>
          <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider">
            {t('customFields.heading')}
          </h3>
          <p className="text-[11px] text-muted mt-0.5">
            {t('customFields.subheading')}
          </p>
        </div>

        {!isAdding && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsAdding(true)}
            icon={<Plus className="w-3 h-3" />}
          >
            {t('customFields.addField')}
          </Button>
        )}
      </div>

      {/* Field List */}
      <div className="space-y-2.5">
        {fields.length > 0 ? (
          fields.map((field) => (
            <div
              key={field.id}
              className="flex items-center gap-2 bg-canvas border border-border-subtle p-2.5 rounded-lg text-xs"
            >
              <input
                type="text"
                value={field.label}
                onChange={(e) => handleUpdateField(field.id, e.target.value, field.value)}
                placeholder={t('customFields.labelPlaceholder')}
                className="w-1/3 bg-surface border border-border rounded px-2 py-1 text-primary font-medium text-xs focus:outline-none focus:border-primary/60"
              />
              <span className="text-secondary">:</span>
              <input
                type="text"
                value={field.value}
                onChange={(e) => handleUpdateField(field.id, field.label, e.target.value)}
                placeholder={t('customFields.valuePlaceholder')}
                className="flex-1 bg-surface border border-border rounded px-2 py-1 text-primary text-xs focus:outline-none focus:border-primary/60"
              />
              <button
                type="button"
                onClick={() => handleRemoveField(field.id)}
                className="text-secondary hover:text-red-600 p-1 rounded hover:bg-surface transition-colors"
                title={t('customFields.deleteFieldTitle')}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        ) : (
          !isAdding && (
            <p className="text-xs text-muted py-2 italic">
              {t('customFields.empty')}
            </p>
          )
        )}
      </div>

      {/* New field row */}
      {isAdding && (
        <div className="bg-canvas border border-border rounded-lg p-3 space-y-2 animate-in fade-in">
          <span className="text-xs font-semibold text-primary block">{t('customFields.newMeasurement')}</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder={t('customFields.newLabelPlaceholder')}
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="bg-surface border border-border rounded px-2.5 py-1.5 text-xs text-primary focus:outline-none focus:border-primary/60"
              autoFocus
            />
            <input
              type="text"
              placeholder={t('customFields.newValuePlaceholder')}
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddField();
              }}
              className="bg-surface border border-border rounded px-2.5 py-1.5 text-xs text-primary focus:outline-none focus:border-primary/60"
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              size="sm"
              variant="ghost"
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewLabel('');
                setNewValue('');
              }}
            >
              {t('common.cancel')}
            </Button>
            <Button
              size="sm"
              variant="primary"
              type="button"
              onClick={handleAddField}
              disabled={!newLabel.trim() || !newValue.trim()}
            >
              {t('customFields.addField')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
