import React, { useState, useEffect } from 'react';
import { Person, CreatePersonInput, UpdatePersonInput } from '../../types/person';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useTranslation } from '../../i18n/LanguageContext';

interface PersonFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (personData: CreatePersonInput | UpdatePersonInput) => void;
  initialPerson?: Person | null;
}

export const PersonFormModal: React.FC<PersonFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPerson,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [birthday, setBirthday] = useState('');
  const [clothingSize, setClothingSize] = useState('');
  const [shoeSize, setShoeSize] = useState('');
  const [ringSize, setRingSize] = useState('');
  const [allergiesInput, setAllergiesInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialPerson) {
      setName(initialPerson.name);
      setRelationship(initialPerson.relationship || '');
      setBirthday(initialPerson.birthday || '');
      setClothingSize(initialPerson.details?.clothingSize || '');
      setShoeSize(initialPerson.details?.shoeSize || '');
      setRingSize(initialPerson.details?.ringSize || '');
      setAllergiesInput(initialPerson.food?.allergies?.join(', ') || '');
    } else {
      setName('');
      setRelationship('');
      setBirthday('');
      setClothingSize('');
      setShoeSize('');
      setRingSize('');
      setAllergiesInput('');
    }
    setError('');
  }, [initialPerson, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t('personForm.nameError'));
      return;
    }

    const allergiesArray = allergiesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onSave({
      name: name.trim(),
      relationship: relationship.trim() || undefined,
      birthday: birthday.trim() || undefined,
      details: {
        clothingSize: clothingSize.trim() || undefined,
        shoeSize: shoeSize.trim() || undefined,
        ringSize: ringSize.trim() || undefined,
        customFields: initialPerson?.details?.customFields || [],
      },
      food: {
        allergies: allergiesArray,
        intolerances: initialPerson?.food?.intolerances || [],
        dietaryRestrictions: initialPerson?.food?.dietaryRestrictions || [],
        favoriteFoods: initialPerson?.food?.favoriteFoods || [],
        dislikedFoods: initialPerson?.food?.dislikedFoods || [],
        notes: initialPerson?.food?.notes,
      },
      preferences: initialPerson?.preferences || {
        colors: [],
        brands: [],
        scents: [],
        hobbies: [],
        likes: [],
        dislikes: [],
      },
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialPerson ? t('personForm.editTitle') : t('personForm.addTitle')}
      subtitle={t('personForm.subtitle')}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('personForm.nameLabel')}
          placeholder={t('personForm.namePlaceholder')}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          error={error}
          autoFocus
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label={t('personForm.relationshipLabel')}
            placeholder={t('personForm.relationshipPlaceholder')}
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
          />

          <Input
            label={t('personForm.birthdayLabel')}
            placeholder={t('personForm.birthdayPlaceholder')}
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
        </div>

        <div className="pt-2 border-t border-border-subtle">
          <label className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-2">
            {t('personForm.keySizesLabel')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            <Input
              label={t('personDetail.clothingLabel')}
              placeholder={t('personDetail.clothingPlaceholder')}
              value={clothingSize}
              onChange={(e) => setClothingSize(e.target.value)}
            />
            <Input
              label={t('personDetail.shoeLabel')}
              placeholder={t('personDetail.shoePlaceholder')}
              value={shoeSize}
              onChange={(e) => setShoeSize(e.target.value)}
            />
            <Input
              label={t('personDetail.ringLabel')}
              placeholder={t('personDetail.ringPlaceholder')}
              value={ringSize}
              onChange={(e) => setRingSize(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Input
            label={t('personForm.allergiesLabel')}
            placeholder={t('personForm.allergiesPlaceholder')}
            value={allergiesInput}
            onChange={(e) => setAllergiesInput(e.target.value)}
            hint={t('personForm.allergiesHint')}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="primary">
            {initialPerson ? t('personForm.saveChanges') : t('personForm.createPerson')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
