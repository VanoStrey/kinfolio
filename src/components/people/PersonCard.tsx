import React from 'react';
import { Gift, Calendar, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { Person } from '../../types/person';
import { Badge } from '../common/Badge';
import { useTranslation } from '../../i18n/LanguageContext';
import { formatShortDate, selectPluralForm } from '../../i18n/helpers';

interface PersonCardProps {
  person: Person;
  giftCount?: number;
  onSelect: (personId: string) => void;
}

export const PersonCard: React.FC<PersonCardProps> = ({ person, giftCount = 0, onSelect }) => {
  const { t, language } = useTranslation();

  // Extract initials
  const initials = person.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Format updated date nicely
  const formattedUpdated = formatShortDate(person.updatedAt, language);

  const hasAllergies = person.food.allergies && person.food.allergies.length > 0;

  const giftLabel = selectPluralForm(giftCount, language, {
    singular: t('personCard.giftSingular'),
    few: t('personCard.giftFew'),
    many: t('personCard.giftMany'),
  });

  return (
    <div
      onClick={() => onSelect(person.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(person.id);
        }
      }}
      className="group relative bg-surface border border-border hover:border-primary/40 rounded-xl p-5 transition-all duration-150 cursor-pointer shadow-subtle hover:shadow-card flex flex-col justify-between text-left"
    >
      <div>
        {/* Top Header: Avatar + Name + Relationship + Arrow */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/60 text-accent-dark flex items-center justify-center font-medium text-sm border border-accent/80 shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-primary group-hover:text-black transition-colors">
                  {person.name}
                </h3>
                {person.starred && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-dark" title={t('personCard.starred')} />
                )}
              </div>
              {person.relationship && (
                <p className="text-xs text-secondary mt-0.5">{person.relationship}</p>
              )}
            </div>
          </div>

          <div className="text-secondary/40 group-hover:text-primary transition-colors p-1">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* Key Quick Glance Details */}
        <div className="mt-4 pt-3 border-t border-border-subtle flex flex-wrap gap-1.5">
          {person.details.clothingSize && (
            <Badge size="sm" variant="default">
              {t('personCard.clothPrefix')} {person.details.clothingSize.split(' ')[0]}
            </Badge>
          )}
          {person.details.shoeSize && (
            <Badge size="sm" variant="default">
              {t('personCard.shoePrefix')} {person.details.shoeSize.split(' ')[0]} {person.details.shoeSize.split(' ')[1] || ''}
            </Badge>
          )}
          {person.details.ringSize && (
            <Badge size="sm" variant="default">
              {t('personCard.ringPrefix')} {person.details.ringSize.split(' ')[0]}
            </Badge>
          )}
        </div>

        {/* Critical Food Allergy Alert Badge (Prominent for safety) */}
        {hasAllergies && (
          <div className="mt-2.5">
            <Badge size="sm" variant="danger" dot>
              <AlertTriangle className="w-3 h-3 text-red-600 mr-0.5 inline" />
              {t('personCard.allergyPrefix')} {person.food.allergies[0].split('(')[0].trim()}
            </Badge>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="mt-5 pt-3 border-t border-border-subtle flex items-center justify-between text-[11px] text-muted">
        <div className="flex items-center gap-3">
          {person.birthday && (
            <div className="flex items-center gap-1 text-secondary">
              <Calendar className="w-3 h-3 text-secondary/70" />
              <span>{person.birthday.split(',')[0]}</span>
            </div>
          )}

          {giftCount > 0 && (
            <div className="flex items-center gap-1 text-secondary">
              <Gift className="w-3 h-3 text-secondary/70" />
              <span>{giftCount} {giftLabel}</span>
            </div>
          )}
        </div>

        <span>{t('personCard.updatedPrefix')} {formattedUpdated}</span>
      </div>
    </div>
  );
};
