import React, { useState, useEffect } from 'react';
import { Person } from '../../types/person';
import { GiftIdea, GiftStatus } from '../../types/gift';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

interface GiftFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (giftData: Omit<GiftIdea, 'id' | 'createdAt' | 'updatedAt'>) => void;
  people: Person[];
  defaultPersonId?: string;
  initialGift?: GiftIdea | null;
}

export const GiftFormModal: React.FC<GiftFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  people,
  defaultPersonId,
  initialGift,
}) => {
  const [personId, setPersonId] = useState(defaultPersonId || people[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('€');
  const [occasion, setOccasion] = useState('');
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<GiftStatus>('idea');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialGift) {
      setPersonId(initialGift.personId);
      setTitle(initialGift.title);
      setDescription(initialGift.description || '');
      setPrice(initialGift.price ? String(initialGift.price) : '');
      setCurrency(initialGift.currency || '€');
      setOccasion(initialGift.occasion || '');
      setUrl(initialGift.url || '');
      setStatus(initialGift.status);
    } else {
      setPersonId(defaultPersonId || people[0]?.id || '');
      setTitle('');
      setDescription('');
      setPrice('');
      setCurrency('€');
      setOccasion('');
      setUrl('');
      setStatus('idea');
    }
    setError('');
  }, [initialGift, defaultPersonId, people, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a gift title.');
      return;
    }
    if (!personId) {
      setError('Please select a recipient.');
      return;
    }

    onSave({
      personId,
      title: title.trim(),
      description: description.trim() || undefined,
      price: price ? parseFloat(price) : undefined,
      currency,
      occasion: occasion.trim() || undefined,
      url: url.trim() || undefined,
      status,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialGift ? 'Edit Gift Idea' : 'Add Gift Idea'}
      subtitle="Save links, sizes, and ideas for upcoming occasions."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="gift-recipient-select" className="text-xs font-medium text-secondary block mb-1">
            Recipient *
          </label>
          <select
            id="gift-recipient-select"
            value={personId}
            onChange={(e) => setPersonId(e.target.value)}
            className="w-full bg-surface border border-border text-primary text-xs rounded-md p-2.5 focus:outline-none focus:border-primary/60 cursor-pointer"
          >
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.relationship ? `(${p.relationship})` : ''}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Gift Item / Title *"
          placeholder="e.g. Diptyque Candle or Cashmere Beanie"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError('');
          }}
          error={error}
          autoFocus
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="flex gap-2">
            <div className="w-16 shrink-0">
              <label htmlFor="gift-currency-select" className="text-xs font-medium text-secondary block mb-1">Currency</label>
              <select
                id="gift-currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-surface border border-border text-primary text-xs rounded-md py-2 px-1 focus:outline-none focus:border-primary/60"
              >
                <option value="€">€ (EUR)</option>
                <option value="$">$ (USD)</option>
                <option value="£">£ (GBP)</option>
                <option value="₽">₽ (RUB)</option>
              </select>
            </div>
            <div className="flex-1">
              <Input
                label="Price (approx)"
                type="number"
                placeholder="45"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <Input
            label="Occasion"
            placeholder="e.g. Birthday, Christmas"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
          />
        </div>

        <Input
          label="Product / Store URL (optional)"
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <div>
          <label className="text-xs font-medium text-secondary block mb-1">
            Notes & Details
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Color preference, specific store, or size..."
            rows={2}
            className="w-full bg-surface border border-border text-xs rounded-md p-2.5 text-primary placeholder:text-muted focus:outline-none focus:border-primary/60"
          />
        </div>

        <div>
          <label htmlFor="gift-status-select" className="text-xs font-medium text-secondary block mb-1">Status</label>
          <select
            id="gift-status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value as GiftStatus)}
            className="w-full bg-surface border border-border text-primary text-xs rounded-md p-2 focus:outline-none focus:border-primary/60 cursor-pointer capitalize"
          >
            <option value="idea">Idea (Considering)</option>
            <option value="bought">Bought (Purchased / Ready)</option>
            <option value="given">Given (Delivered)</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialGift ? 'Update Gift' : 'Save Gift Idea'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
