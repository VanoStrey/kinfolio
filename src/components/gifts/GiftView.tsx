import React, { useState, useMemo } from 'react';
import { Plus, ExternalLink, Gift, Clock, CheckCircle2, Archive, Lightbulb, Edit3, Trash2 } from 'lucide-react';
import { Person } from '../../types/person';
import { GiftStatus } from '../../types/gift';
import { GiftWithRecipient } from '../../hooks/useGifts';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { useTranslation } from '../../i18n/LanguageContext';

interface GiftViewProps {
  gifts: GiftWithRecipient[];
  people: Person[];
  onAddGift: () => void;
  onEditGift: (gift: GiftWithRecipient) => void;
  onDeleteGift: (giftId: string) => void;
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

  // Collect distinct occasions for filtering
  const distinctOccasions = useMemo(() => {
    const set = new Set<string>();
    gifts.forEach((g) => {
      if (g.occasion) set.add(g.occasion.trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, locale));
  }, [gifts, locale]);

  // Filtered gifts
  const filteredGifts = useMemo(() => {
    return gifts.filter((g) => {
      const matchesPerson = selectedPersonFilter === 'all' || g.personId === selectedPersonFilter;
      const matchesStatus = selectedStatusFilter === 'all' || g.status === selectedStatusFilter;
      const matchesOccasion =
        selectedOccasionFilter === 'all' || (g.occasion && g.occasion.trim() === selectedOccasionFilter);
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

  const getStatusBadge = (status: GiftStatus) => {
    switch (status) {
      case 'idea':
        return (
          <Badge size="sm" variant="default">
            <Lightbulb className="w-3 h-3 mr-1 text-secondary" /> {t('gifts.statusIdea')}
          </Badge>
        );
      case 'bought':
        return (
          <Badge size="sm" variant="accent">
            <Clock className="w-3 h-3 mr-1 text-accent-dark" /> {t('gifts.statusBought')}
          </Badge>
        );
      case 'given':
        return (
          <Badge size="sm" variant="success">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-700" /> {t('gifts.statusGiven')}
          </Badge>
        );
      case 'archived':
        return (
          <Badge size="sm" variant="default">
            <Archive className="w-3 h-3 mr-1 text-muted" /> {t('gifts.statusArchived')}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-primary">{t('gifts.heading')}</h2>
          <p className="text-xs text-secondary mt-1">
            {t('gifts.subtitle')}
          </p>
        </div>

        <Button
          variant="primary"
          onClick={onAddGift}
          icon={<Plus className="w-4 h-4" />}
        >
          {t('gifts.addGiftIdea')}
        </Button>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Person filter */}
        <div className="flex items-center gap-1.5 text-xs text-secondary">
          <label htmlFor="filter-person-select" className="shrink-0">{t('gifts.recipientFilter')}</label>
          <select
            id="filter-person-select"
            value={selectedPersonFilter}
            onChange={(e) => setSelectedPersonFilter(e.target.value)}
            className="bg-surface border border-border rounded-md px-2.5 py-1.5 text-xs text-primary focus:outline-none focus:border-primary/60 cursor-pointer"
          >
            <option value="all">{t('gifts.allPeople')}</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Occasion filter (if any occasions exist) */}
        {distinctOccasions.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-secondary">
            <label htmlFor="filter-occasion-select" className="shrink-0">{t('gifts.occasionFilter')}</label>
            <select
              id="filter-occasion-select"
              value={selectedOccasionFilter}
              onChange={(e) => setSelectedOccasionFilter(e.target.value)}
              className="bg-surface border border-border rounded-md px-2.5 py-1.5 text-xs text-primary focus:outline-none focus:border-primary/60 cursor-pointer"
            >
              <option value="all">{t('gifts.allOccasions')}</option>
              {distinctOccasions.map((occ) => (
                <option key={occ} value={occ}>
                  {occ}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status filter tabs */}
        <div className="flex items-center gap-1 bg-surface border border-border p-1 rounded-lg text-xs flex-wrap">
          {(['all', 'idea', 'bought', 'given', 'archived'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatusFilter(st)}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                selectedStatusFilter === st
                  ? 'bg-canvas text-primary font-semibold border border-border-subtle shadow-subtle'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              {getStatusLabel(st)}
            </button>
          ))}
        </div>
      </div>

      {/* Gifts Grid */}
      {filteredGifts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGifts.map((gift) => {
            const recipientDisplay = gift.recipientName || t('common.unknown');
            return (
              <div
                key={gift.id}
                className="bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <button
                        onClick={() => onSelectPerson(gift.personId)}
                        className="text-xs text-secondary hover:text-primary hover:underline font-medium text-left block"
                      >
                        {t('gifts.forPerson', { name: recipientDisplay })}
                        {gift.recipientRelationship ? ` (${gift.recipientRelationship})` : ''}
                      </button>
                      <h3 className="text-sm font-semibold text-primary mt-1">
                        {gift.title}
                      </h3>
                    </div>
                    {getStatusBadge(gift.status)}
                  </div>

                  {/* Optional Gift Image */}
                  {gift.imageUrl && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-border-subtle bg-canvas max-h-36 flex items-center justify-center">
                      <img
                        src={gift.imageUrl}
                        alt={gift.title}
                        className="w-full h-36 object-cover"
                      />
                    </div>
                  )}

                  {gift.description && (
                    <p className="text-xs text-secondary mt-2.5 leading-relaxed">
                      {gift.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
                    {gift.price !== undefined && (
                      <span className="font-semibold text-primary bg-canvas px-2 py-0.5 rounded border border-border-subtle">
                        {gift.currency || '€'}{gift.price}
                      </span>
                    )}
                    {gift.occasion && (
                      <span className="text-secondary bg-canvas px-2 py-0.5 rounded border border-border-subtle">
                        {gift.occasion}
                      </span>
                    )}
                    {gift.url && (
                      <a
                        href={gift.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <span>{t('gifts.storeLink')}</span>
                        <ExternalLink className="w-3 h-3 text-secondary" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Status Selector & Actions */}
                <div className="mt-4 pt-3 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1 flex-wrap">
                    {(['idea', 'bought', 'given', 'archived'] as GiftStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => onUpdateGiftStatus(gift.id, st)}
                        className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
                          gift.status === st
                            ? 'bg-primary text-white font-medium'
                            : 'text-secondary hover:text-primary hover:bg-canvas'
                        }`}
                      >
                        {getStatusLabel(st)}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <button
                      onClick={() => onEditGift(gift)}
                      className="p-1 text-secondary hover:text-primary rounded hover:bg-canvas"
                      title={t('gifts.editGift')}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(t('gifts.confirmDeleteGift', { title: gift.title }))) {
                          onDeleteGift(gift.id);
                        }
                      }}
                      className="p-1 text-secondary hover:text-red-600 rounded hover:bg-canvas"
                      title={t('gifts.deleteGift')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Gift className="w-5 h-5 text-secondary" />}
          title={t('gifts.noGiftsMatchTitle')}
          description={t('gifts.noGiftsMatchDesc')}
          action={
            <Button
              size="sm"
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
    </div>
  );
};
