import React from 'react';
import { ExternalLink, Edit3, Trash2 } from 'lucide-react';
import { GiftIdea, GiftStatus } from '../../types/gift';
import { GiftImage } from './GiftImage';
import { GiftStatusBadge } from './GiftStatusBadge';
import { IconButton } from '../common/IconButton';
import { useTranslation } from '../../i18n/LanguageContext';

interface GiftCardProps {
  gift: GiftIdea;
  recipientName?: string;
  recipientRelationship?: string;
  showImagePlaceholder?: boolean;
  onSelectPerson?: (personId: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateStatus: (status: GiftStatus) => void;
}

export const GiftCard: React.FC<GiftCardProps> = ({
  gift,
  recipientName,
  recipientRelationship,
  showImagePlaceholder = true,
  onSelectPerson,
  onEdit,
  onDelete,
  onUpdateStatus,
}) => {
  const { t } = useTranslation();

  const getStatusLabel = (status: GiftStatus) => {
    switch (status) {
      case 'idea': return t('gifts.statusIdea');
      case 'bought': return t('gifts.statusBought');
      case 'given': return t('gifts.statusGiven');
      case 'archived': return t('gifts.statusArchived');
    }
  };

  return (
    <article className="bg-surface border border-border hover:border-green-300 rounded-lg overflow-hidden transition-[border-color,box-shadow] duration-[180ms] hover:shadow-soft flex flex-col justify-between">
      <div>
        <GiftImage
          src={gift.imageUrl}
          alt={gift.title}
          showPlaceholder={showImagePlaceholder}
        />

        <div className="p-5">
          <div className="flex items-start justify-between gap-2.5">
            <div className="min-w-0">
              {recipientName && onSelectPerson && (
                <button
                  type="button"
                  onClick={() => onSelectPerson(gift.personId)}
                  className="text-[12.5px] text-green-700 hover:text-green-900 hover:underline font-medium text-left block truncate mb-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700/40 rounded-sm"
                >
                  {t('gifts.forPerson', { name: recipientName })}
                  {recipientRelationship ? ` · ${recipientRelationship}` : ''}
                </button>
              )}
              <h3 className="text-[16px] font-semibold text-primary leading-[1.35]">
                {gift.title}
              </h3>
            </div>
            <div className="shrink-0">
              <GiftStatusBadge status={gift.status} />
            </div>
          </div>

          {gift.description && (
            <p className="text-[14px] text-secondary mt-2.5 leading-[1.55] line-clamp-3">
              {gift.description}
            </p>
          )}

          {(gift.price !== undefined || gift.occasion || gift.url) && (
            <div className="flex flex-wrap items-center gap-2 mt-4 text-[13px]">
              {gift.price !== undefined && (
                <span className="font-semibold text-primary bg-surface-soft px-2.5 py-0.5 rounded-sm border border-border">
                  {gift.currency || '€'}{gift.price}
                </span>
              )}
              {gift.occasion && (
                <span className="text-secondary bg-surface-soft px-2.5 py-0.5 rounded-sm border border-border">
                  {gift.occasion}
                </span>
              )}
              {gift.url && (
                <a
                  href={gift.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-green-700 hover:text-green-900 hover:underline font-medium px-1"
                >
                  <span>{t('gifts.storeLink')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Status Changer & Actions */}
      <div className="px-4 py-2.5 bg-surface-soft/50 border-t border-border flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-0.5 flex-wrap">
          {(['idea', 'bought', 'given', 'archived'] as GiftStatus[]).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => onUpdateStatus(st)}
              className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700/40 ${
                gift.status === st
                  ? 'bg-green-700 text-inverse font-semibold'
                  : 'text-secondary hover:text-primary hover:bg-surface'
              }`}
            >
              {getStatusLabel(st)}
            </button>
          ))}
        </div>

        <div className="flex items-center shrink-0">
          <IconButton
            label={t('gifts.editGift')}
            size="sm"
            onClick={onEdit}
          >
            <Edit3 className="w-3.5 h-3.5" />
          </IconButton>
          <IconButton
            label={t('gifts.deleteGift')}
            variant="danger"
            size="sm"
            onClick={onDelete}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </IconButton>
        </div>
      </div>
    </article>
  );
};
