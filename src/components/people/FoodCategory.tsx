import React from 'react';
import { TagManager } from '../common/TagManager';

interface FoodCategoryProps {
  title: string;
  hint?: string;
  items: string[];
  placeholder: string;
  variant?: 'allergy' | 'intolerance' | 'diet' | 'favorite' | 'disliked';
  seamless?: boolean;
  onChange: (items: string[]) => void;
}

export const FoodCategory: React.FC<FoodCategoryProps> = ({
  title,
  hint,
  items,
  placeholder,
  variant = 'diet',
  seamless = false,
  onChange,
}) => {
  const badgeVariant =
    variant === 'allergy'
      ? 'danger'
      : variant === 'intolerance'
      ? 'warning'
      : variant === 'favorite'
      ? 'success'
      : 'default';

  return (
    <TagManager
      title={title}
      hint={hint}
      tags={items}
      placeholder={placeholder}
      badgeVariant={badgeVariant}
      isAllergy={variant === 'allergy'}
      seamless={seamless}
      onChange={onChange}
    />
  );
};
