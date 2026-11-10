import React, { useState, useEffect } from 'react';
import { Person } from '../../types/person';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

interface PersonFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (personData: Partial<Person>) => void;
  initialPerson?: Person | null;
}

export const PersonFormModal: React.FC<PersonFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPerson,
}) => {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [birthday, setBirthday] = useState('');
  const [clothingSize, setClothingSize] = useState('');
  const [shoeSize, setShoeSize] = useState('');
  const [ringSize, setRingSize] = useState('');
  const [allergiesInput, setAllergiesInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
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
      setNotesInput('');
    } else {
      setName('');
      setRelationship('');
      setBirthday('');
      setClothingSize('');
      setShoeSize('');
      setRingSize('');
      setAllergiesInput('');
      setNotesInput('');
    }
    setError('');
  }, [initialPerson, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a name.');
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
      gifts: initialPerson?.gifts || [],
      notes: initialPerson?.notes || (notesInput.trim() ? [{
        id: `n-${Date.now()}`,
        content: notesInput.trim(),
        createdAt: new Date().toISOString(),
      }] : []),
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialPerson ? 'Edit Person' : 'Add New Person'}
      subtitle="Fast capture — fill in what you know now, expand anytime."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name *"
          placeholder="e.g. Maya Chen"
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
            label="Relationship (optional)"
            placeholder="e.g. Sister, Partner, Friend"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
          />

          <Input
            label="Birthday (optional)"
            placeholder="e.g. April 14 or 1994-04-14"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
        </div>

        <div className="pt-2 border-t border-border-subtle">
          <label className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-2">
            Key Sizes (Optional)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <Input
              label="Clothing"
              placeholder="e.g. S / EU 36"
              value={clothingSize}
              onChange={(e) => setClothingSize(e.target.value)}
            />
            <Input
              label="Shoes"
              placeholder="e.g. EU 38"
              value={shoeSize}
              onChange={(e) => setShoeSize(e.target.value)}
            />
            <Input
              label="Ring"
              placeholder="e.g. 16.5 mm"
              value={ringSize}
              onChange={(e) => setRingSize(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Input
            label="Medical Allergies (if any)"
            placeholder="e.g. Peanuts, Shellfish (comma separated)"
            value={allergiesInput}
            onChange={(e) => setAllergiesInput(e.target.value)}
            hint="Strict medical allergies will show a safety warning badge."
          />
        </div>

        {!initialPerson && (
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">
              Initial Note or Detail (optional)
            </label>
            <textarea
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              placeholder="Write a quick thought, favorite perfume, or coffee order..."
              rows={2}
              className="w-full bg-surface border border-border text-xs rounded-md p-2.5 text-primary placeholder:text-muted focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20"
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialPerson ? 'Save Changes' : 'Create Person'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
