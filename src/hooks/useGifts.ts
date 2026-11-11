import { useState, useEffect, useCallback } from 'react';
import { GiftIdea, GiftStatus, CreateGiftInput, UpdateGiftInput } from '../types/gift';
import { giftsRepository } from '../db/repositories/giftsRepository';
import { peopleRepository } from '../db/repositories/peopleRepository';
import { useToast } from './useToast';
import { useTranslation } from '../i18n/LanguageContext';

export interface GiftWithRecipient extends GiftIdea {
  recipientName: string;
  recipientRelationship?: string;
}

export function useGifts() {
  const [gifts, setGifts] = useState<GiftWithRecipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const { t } = useTranslation();

  const statusLabel = (status: GiftStatus) => {
    switch (status) {
      case 'idea': return t('gifts.statusIdea');
      case 'bought': return t('gifts.statusBought');
      case 'given': return t('gifts.statusGiven');
      case 'archived': return t('gifts.statusArchived');
    }
  };

  const loadGifts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [allGifts, allPeople] = await Promise.all([
        giftsRepository.getAll(),
        peopleRepository.getAll(),
      ]);

      const peopleMap = new Map<string, { name: string; relationship?: string }>();
      allPeople.forEach((p) => peopleMap.set(p.id, { name: p.name, relationship: p.relationship }));

      const enriched: GiftWithRecipient[] = allGifts.map((g) => {
        const recipient = peopleMap.get(g.personId);
        return {
          ...g,
          recipientName: recipient?.name || '',
          recipientRelationship: recipient?.relationship,
        };
      });

      setGifts(enriched);
    } catch (err: any) {
      console.error('[useGifts] Error loading gifts:', err);
      setError(err.message || 'Failed to load gifts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGifts();
  }, [loadGifts]);

  const addGift = async (input: CreateGiftInput): Promise<GiftIdea> => {
    try {
      const created = await giftsRepository.create(input);
      await loadGifts();
      showToast(t('toasts.giftAdded', { title: created.title }));
      return created;
    } catch (err: any) {
      showToast(err.message || t('toasts.failedAddGift'), 'error');
      throw err;
    }
  };

  const updateGift = async (id: string, input: UpdateGiftInput): Promise<GiftIdea> => {
    try {
      const updated = await giftsRepository.update(id, input);
      setGifts((prev) =>
        prev.map((g) => (g.id === id ? { ...g, ...updated } : g))
      );
      showToast(t('toasts.giftUpdated'));
      return updated;
    } catch (err: any) {
      showToast(err.message || t('toasts.failedUpdateGift'), 'error');
      throw err;
    }
  };

  const updateGiftStatus = async (id: string, status: GiftStatus): Promise<void> => {
    try {
      await giftsRepository.updateStatus(id, status);
      setGifts((prev) =>
        prev.map((g) => (g.id === id ? { ...g, status } : g))
      );
      showToast(t('toasts.giftStatusMarked', { status: statusLabel(status) }));
    } catch (err: any) {
      showToast(err.message || t('toasts.failedUpdateGiftStatus'), 'error');
      throw err;
    }
  };

  const deleteGift = async (id: string): Promise<void> => {
    try {
      await giftsRepository.hardDelete(id);
      setGifts((prev) => prev.filter((g) => g.id !== id));
      showToast(t('toasts.giftRemoved'));
    } catch (err: any) {
      showToast(err.message || t('toasts.failedDeleteGift'), 'error');
      throw err;
    }
  };

  return {
    gifts,
    loading,
    error,
    refresh: loadGifts,
    addGift,
    updateGift,
    updateGiftStatus,
    deleteGift,
  };
}
