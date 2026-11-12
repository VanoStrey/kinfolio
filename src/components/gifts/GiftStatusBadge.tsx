import React from 'react';
import { Lightbulb, Clock, CheckCircle2, Archive } from 'lucide-react';
import { GiftStatus } from '../../types/gift';
import { Badge } from '../common/Badge';
import { useTranslation } from '../../i18n/LanguageContext';

interface GiftStatusBadgeProps {
  status: GiftStatus;
}

export const GiftStatusBadge: React.FC<GiftStatusBadgeProps> = ({ status }) => {
  const { t } = useTranslation();

  switch (status) {
    case 'idea':
      return (
        <Badge size="sm" variant="default">
          <Lightbulb className="w-3 h-3 text-secondary" />
          <span>{t('gifts.statusIdea')}</span>
        </Badge>
      );
    case 'bought':
      return (
        <Badge size="sm" variant="info">
          <Clock className="w-3 h-3 text-info" />
          <span>{t('gifts.statusBought')}</span>
        </Badge>
      );
    case 'given':
      return (
        <Badge size="sm" variant="success">
          <CheckCircle2 className="w-3 h-3 text-green-700" />
          <span>{t('gifts.statusGiven')}</span>
        </Badge>
      );
    case 'archived':
      return (
        <Badge size="sm" variant="default">
          <Archive className="w-3 h-3 text-muted" />
          <span>{t('gifts.statusArchived')}</span>
        </Badge>
      );
  }
};
