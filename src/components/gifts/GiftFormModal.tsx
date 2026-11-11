import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Trash2 } from 'lucide-react';
import { Person } from '../../types/person';
import { GiftIdea, GiftStatus, CreateGiftInput, UpdateGiftInput } from '../../types/gift';
import { processImageFile } from '../../services/imageService';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useTranslation } from '../../i18n/LanguageContext';

interface GiftFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (giftData: CreateGiftInput | UpdateGiftInput) => void;
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
  const { t } = useTranslation();
  const [personId, setPersonId] = useState(defaultPersonId || people[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('€');
  const [occasion, setOccasion] = useState('');
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<GiftStatus>('idea');
  const [error, setError] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialGift) {
      setPersonId(initialGift.personId);
      setTitle(initialGift.title);
      setDescription(initialGift.description || '');
      setPrice(initialGift.price ? String(initialGift.price) : '');
      setCurrency(initialGift.currency || '€');
      setOccasion(initialGift.occasion || '');
      setUrl(initialGift.url || '');
      setImageUrl(initialGift.imageUrl);
      setStatus(initialGift.status);
    } else {
      setPersonId(defaultPersonId || people[0]?.id || '');
      setTitle('');
      setDescription('');
      setPrice('');
      setCurrency('€');
      setOccasion('');
      setUrl('');
      setImageUrl(undefined);
      setStatus('idea');
    }
    setError('');
  }, [initialGift, defaultPersonId, people, isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingImage(true);
      const compressedDataUrl = await processImageFile(file, 800, 0.85);
      setImageUrl(compressedDataUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to process image');
    } finally {
      setIsProcessingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(t('giftForm.titleError'));
      return;
    }
    if (!personId) {
      setError(t('giftForm.recipientError'));
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
      imageUrl: imageUrl || undefined,
      status,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialGift ? t('giftForm.editTitle') : t('giftForm.addTitle')}
      subtitle={t('giftForm.subtitle')}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="gift-recipient-select" className="text-xs font-medium text-secondary block mb-1">
            {t('giftForm.recipientLabel')}
          </label>
          <select
            id="gift-recipient-select"
            value={personId}
            onChange={(e) => setPersonId(e.target.value)}
            disabled={!!initialGift}
            className="w-full bg-surface border border-border text-primary text-xs rounded-md p-2.5 focus:outline-none focus:border-primary/60 cursor-pointer disabled:bg-canvas disabled:text-secondary"
          >
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.relationship ? `(${p.relationship})` : ''}
              </option>
            ))}
          </select>
        </div>

        <Input
          label={t('giftForm.titleLabel')}
          placeholder={t('giftForm.titlePlaceholder')}
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
              <label htmlFor="gift-currency-select" className="text-xs font-medium text-secondary block mb-1">
                {t('giftForm.currencyLabel')}
              </label>
              <select
                id="gift-currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-surface border border-border text-primary text-xs rounded-md py-2 px-1 focus:outline-none focus:border-primary/60"
              >
                <option value="€">€</option>
                <option value="$">$</option>
                <option value="£">£</option>
                <option value="₽">₽</option>
              </select>
            </div>
            <div className="flex-1">
              <Input
                label={t('giftForm.priceLabel')}
                type="number"
                placeholder="45"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <Input
            label={t('giftForm.occasionLabel')}
            placeholder={t('giftForm.occasionPlaceholder')}
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
          />
        </div>

        <Input
          label={t('giftForm.urlLabel')}
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <div>
          <label className="text-xs font-medium text-secondary block mb-1">
            {t('giftForm.notesLabel')}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('giftForm.notesPlaceholder')}
            rows={2}
            className="w-full bg-surface border border-border text-xs rounded-md p-2.5 text-primary placeholder:text-muted focus:outline-none focus:border-primary/60"
          />
        </div>

        {/* Local Image Upload */}
        <div>
          <label className="text-xs font-medium text-secondary block mb-1">
            {t('giftForm.photoLabel')}
          </label>
          {imageUrl ? (
            <div className="relative inline-block border border-border rounded-lg overflow-hidden group">
              <img
                src={imageUrl}
                alt="Gift preview"
                className="w-24 h-24 object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title={t('giftForm.removePhoto')}
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="gift-photo-input"
              />
              <label
                htmlFor="gift-photo-input"
                className="inline-flex items-center gap-2 px-3 py-2 border border-dashed border-border rounded-lg text-xs text-secondary hover:text-primary hover:border-primary/40 cursor-pointer transition-colors bg-canvas"
              >
                <ImageIcon className="w-4 h-4" />
                <span>{isProcessingImage ? t('giftForm.optimizingPhoto') : t('giftForm.uploadPhoto')}</span>
              </label>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="gift-status-select" className="text-xs font-medium text-secondary block mb-1">
            {t('giftForm.statusLabel')}
          </label>
          <select
            id="gift-status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value as GiftStatus)}
            className="w-full bg-surface border border-border text-primary text-xs rounded-md p-2 focus:outline-none focus:border-primary/60 cursor-pointer"
          >
            <option value="idea">{t('giftForm.statusOptionIdea')}</option>
            <option value="bought">{t('giftForm.statusOptionBought')}</option>
            <option value="given">{t('giftForm.statusOptionGiven')}</option>
            <option value="archived">{t('giftForm.statusOptionArchived')}</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="primary">
            {initialGift ? t('giftForm.updateGift') : t('giftForm.saveGift')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
