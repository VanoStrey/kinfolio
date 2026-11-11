import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { en } from '../src/i18n/translations/en';
import { ru } from '../src/i18n/translations/ru';
import { resolveTranslation, selectPluralForm } from '../src/i18n/helpers';
import { resetDatabase } from '../src/db/database';
import { settingsRepository } from '../src/db/repositories/settingsRepository';
import { peopleRepository } from '../src/db/repositories/peopleRepository';
import { searchAllRecords } from '../src/services/searchService';

function collectKeys(obj: Record<string, any>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    return typeof v === 'object' && v !== null ? collectKeys(v, key) : [key];
  });
}

describe('i18n English & Russian Localization', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it('has identical, non-empty keys across English and Russian dictionaries', () => {
    const enKeys = collectKeys(en).sort();
    const ruKeys = collectKeys(ru).sort();

    expect(ruKeys).toEqual(enKeys);

    for (const key of enKeys) {
      const enVal = resolveTranslation('en', key as any);
      const ruVal = resolveTranslation('ru', key as any);
      expect(enVal.trim().length, `Empty EN translation for ${key}`).toBeGreaterThan(0);
      expect(ruVal.trim().length, `Empty RU translation for ${key}`).toBeGreaterThan(0);
    }
  });

  it('interpolates parameters cleanly in both languages', () => {
    expect(resolveTranslation('en', 'toasts.addedPerson', { name: 'Elena' })).toBe('Added Elena');
    expect(resolveTranslation('ru', 'toasts.addedPerson', { name: 'Елена' })).toBe('Добавлен профиль «Елена»');
  });

  it('handles English and Russian pluralization rules accurately', () => {
    const ruForms = {
      singular: 'идея подарка',
      few: 'идеи подарка',
      many: 'идей подарков',
    };
    expect(selectPluralForm(1, 'ru', ruForms)).toBe('идея подарка');
    expect(selectPluralForm(2, 'ru', ruForms)).toBe('идеи подарка');
    expect(selectPluralForm(5, 'ru', ruForms)).toBe('идей подарков');
    expect(selectPluralForm(11, 'ru', ruForms)).toBe('идей подарков');
    expect(selectPluralForm(21, 'ru', ruForms)).toBe('идея подарка');

    const enForms = {
      singular: 'gift idea',
      few: 'gift ideas',
      many: 'gift ideas',
    };
    expect(selectPluralForm(1, 'en', enForms)).toBe('gift idea');
    expect(selectPluralForm(2, 'en', enForms)).toBe('gift ideas');
    expect(selectPluralForm(0, 'en', enForms)).toBe('gift ideas');
  });

  it('persists selected language in IndexedDB settings store', async () => {
    expect(await settingsRepository.get('language', 'en')).toBe('en');
    await settingsRepository.set('language', 'ru');
    expect(await settingsRepository.get('language', 'en')).toBe('ru');
  });

  it('formats search snippets in Russian when language is ru', async () => {
    await peopleRepository.create({
      name: 'Elena',
      food: { allergies: ['Peanuts'] },
    });

    const resultsRu = await searchAllRecords('Peanuts', 'ru');
    expect(resultsRu).toHaveLength(1);
    expect(resultsRu[0].snippet).toContain('Аллергия');
    expect(resultsRu[0].isAllergyAlert).toBe(true);
  });
});
