import React from 'react';
import { Gift, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { Person } from '../../types/person';
import { Badge } from '../common/Badge';
import { PersonAvatar } from './PersonAvatar';
import { useTranslation } from '../../i18n/LanguageContext';
import { formatShortDate, selectPluralForm } from '../../i18n/helpers';

interface PersonCardProps {
  person: Person;
  giftCount?: number;
  onSelect: (personId: string) => void;
}

export const PersonCard: React.FC<PersonCardProps> = ({ person, giftCount = 0, onSelect }) => {
  const { t, language } = useTranslation();

  const formattedUpdated = formatShortDate(person.updatedAt, language);
  const hasAllergies = person.food.allergies && person.food.allergies.length > 0;

  const giftLabel = selectPluralForm(giftCount, language, {
    singular: t('personCard.giftSingular'),
    few: t('personCard.giftFew'),
    many: t('personCard.giftMany'),
  });

  // Quick glance key lines matching Section 6.1 design spec
  const quickLines: Array<{ label: string; value: string }> = [];
  if (person.details.clothingSize) {
    quickLines.push({
      label: t('personCard.clothPrefix'),
      value: person.details.clothingSize.split('(')[0].trim(),
    });
  }
  if (person.details.shoeSize) {
    quickLines.push({
      label: t('personCard.shoePrefix'),
      value: person.details.shoeSize.split('(')[0].trim(),
    });
  }
  if (person.birthday) {
    quickLines.push({
      label: t('personCard.birthdayPrefix'),
      value: person.birthday.split(',')[0].trim(),
    });
  } else if (person.details.ringSize && quickLines.length < 3) {
    quickLines.push({
      label: t('personCard.ringPrefix'),
      value: person.details.ringSize.split('(')[0].trim(),
    });
  }

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
      className="group bg-surface border border-border hover:border-green-300 rounded-lg p-5 transition-[border-color,box-shadow,background-color] duration-[180ms] cursor-pointer hover:shadow-soft flex flex-col justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700/40"
    >
      <div>
        {/* Top Header: Avatar + Name + Relationship + Arrow */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <PersonAvatar name={person.name} photoUrl={person.photoUrl} size="md" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-[17px] font-semibold text-primary leading-[1.3] truncate group-hover:text-green-900 transition-colors">
                  {person.name}
                </h3>
                {person.starred && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-green-600 shrink-0"
                    title={t('personCard.starred')}
                  />
                )}
              </div>
              {person.relationship && (
                <p className="text-[13px] text-secondary mt-0.5 truncate">
                  {person.relationship}
                </p>
              )}
            </div>
          </div>

          <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-green-700 transition-colors shrink-0 mt-1" />
        </div>

        {/* Clean Typographic Detail Lines */}
        {(quickLines.length > 0 || person.bio) && (
          <div className="mt-4 pt-3.5 border-t border-border space-y-1.5">
            {quickLines.map((line, i) => (
              <div key={i} className="text-[13.5px] leading-[1.45] flex items-baseline gap-1.5 truncate">
                <span className="text-secondary">{line.label}</span>
                <span className="text-muted">·</span>
                <span className="text-primary font-medium truncate">{line.value}</span>
              </div>
            ))}
            {quickLines.length === 0 && person.bio && (
              <p className="text-[13px] text-secondary line-clamp-2 leading-[1.45]">
                {person.bio}
              </p>
            )}
          </div>
        )}

        {/* Useful Medical Allergy Indicator (Restrained & clear) */}
        {hasAllergies && (
          <div className="mt-3">
            <Badge size="sm" variant="danger">
              <AlertTriangle className="w-3.5 h-3.5 text-danger shrink-0" />
              <span className="truncate">
                {t('personCard.allergyPrefix')}: {person.food.allergies[0].split('(')[0].trim()}
              </span>
            </Badge>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-[12px] text-muted">
        <div className="flex items-center gap-2 min-w-0">
          {giftCount > 0 && (
            <div className="inline-flex items-center gap-1.5 text-secondary font-medium">
              <Gift className="w-3.5 h-3.5 text-green-600 shrink-0" />
              <span>{giftCount} {giftLabel}</span>
            </div>
          )}
        </div>

        <span className="shrink-0">
          {t('personCard.updatedPrefix')} {formattedUpdated}
        </span>
      </div>
    </div>
  );
};
