import { en, TranslationSchema } from './translations/en';
import { ru } from './translations/ru';
import { Language, InterpolationParams } from './types';

type Join<K, P> = K extends string ? (P extends string ? `${K}.${P}` : never) : never;

export type TranslationKey = {
  [K in keyof TranslationSchema]: TranslationSchema[K] extends string
    ? K
    : Join<K & string, keyof TranslationSchema[K] & string>;
}[keyof TranslationSchema];

export const dictionaries: Record<Language, TranslationSchema> = {
  en,
  ru,
};

export function resolveTranslation(
  language: Language,
  key: TranslationKey,
  params?: InterpolationParams
): string {
  const dict = dictionaries[language] || dictionaries.en;
  const parts = (key as string).split('.');
  let current: any = dict;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      current = undefined;
      break;
    }
  }

  let text = typeof current === 'string' ? current : (key as string);

  if (params) {
    for (const [paramKey, paramValue] of Object.entries(params)) {
      text = text.replace(new RegExp(`{{\\s*${paramKey}\\s*}}`, 'g'), String(paramValue));
    }
  }

  return text;
}

/**
 * Selects the appropriate plural form for English and Russian.
 */
export function selectPluralForm(
  count: number,
  language: Language,
  forms: { singular: string; few: string; many: string }
): string {
  if (language === 'en') {
    return count === 1 ? forms.singular : forms.many;
  }

  // Russian pluralization rules
  const abs = Math.abs(count) % 100;
  const lastDigit = abs % 10;

  if (abs > 10 && abs < 20) return forms.many;
  if (lastDigit > 1 && lastDigit < 5) return forms.few;
  if (lastDigit === 1) return forms.singular;
  return forms.many;
}

export function getLocale(language: Language): string {
  return language === 'ru' ? 'ru-RU' : 'en-US';
}

export function formatShortDate(isoDate: string, language: Language, includeYear = false): string {
  try {
    const options: Intl.DateTimeFormatOptions = includeYear
      ? { month: 'short', day: 'numeric', year: 'numeric' }
      : { month: 'short', day: 'numeric' };
    return new Intl.DateTimeFormat(getLocale(language), options).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}
