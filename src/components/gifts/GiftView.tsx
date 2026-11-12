import React, { useState, useMemo } from 'react';
import { Plus, Gift } from 'lucide-react';
import { Person } from '../../types/person';
import { GiftStatus } from '../../types/gift';
import { GiftWithRecipient } from '../../hooks/useGifts';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { EmptyState } from '../common/EmptyState';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { PageHeader } from '../layout/PageHeader';
import { GiftCard } from './GiftCard';
import { useTranslation } from '../../i18n/LanguageContext';

interface GiftViewProps {
  gifts: GiftWithRecipient[];
  people: Person[];
  onAddGift: () => void;
  onEditGift: (gift: GiftWithRecipient) => void;
  onDeleteGift: (giftId: string) => Promise<void> | void;
  onSelectPerson: (personId: string) => void;
  onUpdateGiftStatus: (giftId: string, newStatus: GiftStatus) => void;
}

export const GiftView: React.FC<GiftViewProps> = ({
  gifts,
  people,
  onAddGift,
  onEditGift,
  onDeleteGift,
  onSelectPerson,
  onUpdateGiftStatus,
}) => {
  const { t, locale } = useTranslation();
  const [selectedPersonFilter, setSelectedPersonFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedOccasionFilter, setSelectedOccasionFilter] = useState<string>('all');
  const [giftToDelete, setGiftToDelete] = useState<GiftWithRecipient | null>(null);

  const distinctOccasions = useMemo(() => {
    const set = new Set<string>();
    gifts.forEach((g) => {
      if (g.occasion) set.add(g.occasion.trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, locale));
  }, [gifts, locale]);

  const filteredGifts = useMemo(() => {
    return gifts.filter((g) => {
      const matchesPerson = selectedPersonFilter === 'all' || g.personId === selectedPersonFilter;
      const matchesStatus = selectedStatusFilter === 'all' || g.status === selectedStatusFilter;
      const matchesOccasion =
        selectedOccasionFilter === 'all' ||
        (g.occasion && g.occasion.trim() === selectedOccasionFilter);
      return matchesPerson && matchesStatus && matchesOccasion;
    });
  }, [gifts, selectedPersonFilter, selectedStatusFilter, selectedOccasionFilter]);

  const getStatusLabel = (status: GiftStatus | 'all') => {
    switch (status) {
      case 'all': return t('gifts.statusAll');
      case 'idea': return t('gifts.statusIdea');
      case 'bought': return t('gifts.statusBought');
      case 'given': return t('gifts.statusGiven');
      case 'archived': return t('gifts.statusArchived');
    }
  };

  return (
    <div className="space-y-7">
      <PageHeader
        title={t('gifts.heading')}
        subtitle={t('gifts.subtitle')}
        action={
          <Button
            size="md"
            variant="primary"
            onClick={onAddGift}
            icon={<Plus className="w-4 h-4" />}
          >
            {t('gifts.addGiftIdea')}
          </Button>
        }
      />

      {/* Filter Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Status filter pills */}
        <div className="inline-flex items-center gap-1 bg-surface-soft border border-border p-1 rounded-full self-start flex-wrap max-w-full">
          {(['all', 'idea', 'bought', 'given', 'archived'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-[background-color,color] duration-[180ms] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700/40 ${
                selectedStatusFilter === st
                  ? 'bg-surface-green text-green-900 font-semibold shadow-soft'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              {getStatusLabel(st)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Person filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="filter-person-select" className="text-[13px] text-secondary shrink-0">
              {t('gifts.recipientFilter')}
            </label>
            <Select
              compact
              id="filter-person-select"
              value={selectedPersonFilter}
              onChange={(e) => setSelectedPersonFilter(e.target.value)}
            >
              <option value="all">{t('gifts.allPeople')}</option>
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Occasion filter */}
          {distinctOccasions.length > 0 && (
            <div className="flex items-center gap-2">
              <label htmlFor="filter-occasion-select" className="text-[13px] text-secondary shrink-0">
                {t('gifts.occasionFilter')}
              </label>
              <Select
                compact
                id="filter-occasion-select"
                value={selectedOccasionFilter}
                onChange={(e) => setSelectedOccasionFilter(e.target.value)}
              >
                <option value="all">{t('gifts.allOccasions')}</option>
                {distinctOccasions.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* Gifts Visual Grid */}
      {filteredGifts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGifts.map((gift) => (
            <GiftCard
              key={gift.id}
              gift={gift}
              recipientName={gift.recipientName || t('common.unknown')}
              recipientRelationship={gift.recipientRelationship}
              showImagePlaceholder={true}
              onSelectPerson={onSelectPerson}
              onEdit={() => onEditGift(gift)}
              onDelete={() => setGiftToDelete(gift)}
              onUpdateStatus={(st) => onUpdateGiftStatus(gift.id, st)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Gift className="w-5 h-5 text-green-700" />}
          title={t('gifts.noGiftsMatchTitle')}
          description={t('gifts.noGiftsMatchDesc')}
          action={
            <Button
              size="md"
              variant="secondary"
              onClick={() => {
                setSelectedPersonFilter('all');
                setSelectedStatusFilter('all');
                setSelectedOccasionFilter('all');
              }}
            >
              {t('gifts.resetFilters')}
            </Button>
          }
        />
      )}

      <ConfirmDialog
        isOpen={!!giftToDelete}
        onClose={() => setGiftToDelete(null)}
        title={t('gifts.confirmDeleteGift', { title: giftToDelete?.title || '' })}
        description={t('gifts.confirmDeleteDesc', { title: giftToDelete?.title || '' })}
        onConfirm={async () => {
          if (giftToDelete) {
            await onDeleteGift(giftToDelete.id);
            setGiftToDelete(null);
          }
        }}
      />
    </div>
  );
};
