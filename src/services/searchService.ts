import { Person } from '../types/person';
import { PersonProfileTab } from '../types/navigation';
import { peopleRepository } from '../db/repositories/peopleRepository';
import { giftsRepository } from '../db/repositories/giftsRepository';
import { notesRepository } from '../db/repositories/notesRepository';
import { Language } from '../i18n/types';
import { resolveTranslation } from '../i18n/helpers';

export type SearchCategory =
  | 'Person'
  | 'Sizes & Details'
  | 'Preferences'
  | 'Food & Allergies'
  | 'Gift'
  | 'Note';

export interface SearchResultItem {
  id: string;
  personId: string;
  personName: string;
  category: SearchCategory;
  targetTab: PersonProfileTab;
  title: string;
  snippet: string;
  isAllergyAlert?: boolean;
}

export async function searchAllRecords(
  rawQuery: string,
  language: Language = 'en'
): Promise<SearchResultItem[]> {
  const query = rawQuery.trim().toLowerCase();
  if (query.length < 2) return [];

  const t = (key: Parameters<typeof resolveTranslation>[1], params?: Record<string, string | number>) =>
    resolveTranslation(language, key, params);

  const [people, gifts, notes] = await Promise.all([
    peopleRepository.getAll(),
    giftsRepository.getAll(),
    notesRepository.getAll(),
  ]);

  const peopleMap = new Map<string, Person>();
  people.forEach((p) => peopleMap.set(p.id, p));

  const results: SearchResultItem[] = [];

  // 1. Search People
  for (const person of people) {
    if (person.name.toLowerCase().includes(query) || person.relationship?.toLowerCase().includes(query)) {
      results.push({
        id: `search-person-${person.id}`,
        personId: person.id,
        personName: person.name,
        category: 'Person',
        targetTab: 'details',
        title: person.name,
        snippet: person.relationship
          ? t('search.snippetRelationship', { rel: person.relationship })
          : t('search.snippetProfile'),
      });
    }

    // 2. Search Details & Custom Fields
    const details = person.details;
    const sizeEntries: Array<{ value?: string; key: 'snippetClothing' | 'snippetShoes' | 'snippetRing' | 'snippetHeight' }> = [
      { value: details.clothingSize, key: 'snippetClothing' },
      { value: details.shoeSize, key: 'snippetShoes' },
      { value: details.ringSize, key: 'snippetRing' },
      { value: details.height, key: 'snippetHeight' },
    ];

    for (const entry of sizeEntries) {
      if (entry.value) {
        const snippet = t(`search.${entry.key}`, { val: entry.value });
        if (entry.value.toLowerCase().includes(query) || snippet.toLowerCase().includes(query)) {
          results.push({
            id: `search-size-${person.id}-${entry.key}`,
            personId: person.id,
            personName: person.name,
            category: 'Sizes & Details',
            targetTab: 'details',
            title: person.name,
            snippet,
          });
        }
      }
    }

    for (const cf of details.customFields || []) {
      if (cf.label.toLowerCase().includes(query) || cf.value.toLowerCase().includes(query)) {
        results.push({
          id: `search-cf-${person.id}-${cf.id}`,
          personId: person.id,
          personName: person.name,
          category: 'Sizes & Details',
          targetTab: 'details',
          title: person.name,
          snippet: `${cf.label}: ${cf.value}`,
        });
      }
    }

    // 3. Search Preferences
    const prefs = person.preferences;
    const prefCategories: Array<{
      key: 'snippetScents' | 'snippetBrands' | 'snippetColors' | 'snippetHobbies' | 'snippetLikes' | 'snippetDislikes';
      items: string[];
    }> = [
      { key: 'snippetScents', items: prefs.scents },
      { key: 'snippetBrands', items: prefs.brands },
      { key: 'snippetColors', items: prefs.colors },
      { key: 'snippetHobbies', items: prefs.hobbies },
      { key: 'snippetLikes', items: prefs.likes },
      { key: 'snippetDislikes', items: prefs.dislikes },
    ];

    for (const cat of prefCategories) {
      for (const item of cat.items) {
        if (item.toLowerCase().includes(query)) {
          results.push({
            id: `search-pref-${person.id}-${cat.key}-${item}`,
            personId: person.id,
            personName: person.name,
            category: 'Preferences',
            targetTab: 'preferences',
            title: person.name,
            snippet: t(`search.${cat.key}`, { val: item }),
          });
        }
      }
    }

    // 4. Search Food & Allergies (Critical distinct categories!)
    for (const allergy of person.food.allergies) {
      if (allergy.toLowerCase().includes(query)) {
        results.push({
          id: `search-allergy-${person.id}-${allergy}`,
          personId: person.id,
          personName: person.name,
          category: 'Food & Allergies',
          targetTab: 'food',
          title: person.name,
          snippet: t('search.snippetAllergy', { val: allergy }),
          isAllergyAlert: true,
        });
      }
    }

    for (const intol of person.food.intolerances) {
      if (intol.toLowerCase().includes(query)) {
        results.push({
          id: `search-intol-${person.id}-${intol}`,
          personId: person.id,
          personName: person.name,
          category: 'Food & Allergies',
          targetTab: 'food',
          title: person.name,
          snippet: t('search.snippetIntolerance', { val: intol }),
        });
      }
    }

    for (const diet of person.food.dietaryRestrictions) {
      if (diet.toLowerCase().includes(query)) {
        results.push({
          id: `search-diet-${person.id}-${diet}`,
          personId: person.id,
          personName: person.name,
          category: 'Food & Allergies',
          targetTab: 'food',
          title: person.name,
          snippet: t('search.snippetDiet', { val: diet }),
        });
      }
    }

    for (const fav of person.food.favoriteFoods) {
      if (fav.toLowerCase().includes(query)) {
        results.push({
          id: `search-favfood-${person.id}-${fav}`,
          personId: person.id,
          personName: person.name,
          category: 'Food & Allergies',
          targetTab: 'food',
          title: person.name,
          snippet: t('search.snippetFavFood', { val: fav }),
        });
      }
    }

    for (const dis of person.food.dislikedFoods) {
      if (dis.toLowerCase().includes(query)) {
        results.push({
          id: `search-disfood-${person.id}-${dis}`,
          personId: person.id,
          personName: person.name,
          category: 'Food & Allergies',
          targetTab: 'food',
          title: person.name,
          snippet: t('search.snippetDisFood', { val: dis }),
        });
      }
    }

    if (person.food.notes && person.food.notes.toLowerCase().includes(query)) {
      results.push({
        id: `search-foodnote-${person.id}`,
        personId: person.id,
        personName: person.name,
        category: 'Food & Allergies',
        targetTab: 'food',
        title: person.name,
        snippet: t('search.snippetDiningNote', { val: person.food.notes }),
      });
    }
  }

  // 5. Search Gifts
  for (const gift of gifts) {
    const person = peopleMap.get(gift.personId);
    const personName = person ? person.name : t('common.unknown');

    if (
      gift.title.toLowerCase().includes(query) ||
      gift.description?.toLowerCase().includes(query) ||
      gift.occasion?.toLowerCase().includes(query)
    ) {
      const statusKey =
        gift.status === 'idea'
          ? 'gifts.statusIdea'
          : gift.status === 'bought'
          ? 'gifts.statusBought'
          : gift.status === 'given'
          ? 'gifts.statusGiven'
          : 'gifts.statusArchived';
      const statusLabel = t(statusKey);
      const detailsStr = `${statusLabel}${gift.price ? `, ${gift.currency || '€'}${gift.price}` : ''}`;

      results.push({
        id: `search-gift-${gift.id}`,
        personId: gift.personId,
        personName,
        category: 'Gift',
        targetTab: 'gifts',
        title: gift.title,
        snippet: t('search.snippetGift', { name: personName, details: detailsStr }),
      });
    }
  }

  // 6. Search Notes
  for (const note of notes) {
    const person = peopleMap.get(note.personId);
    const personName = person ? person.name : t('common.unknown');

    if (note.content.toLowerCase().includes(query)) {
      results.push({
        id: `search-note-${note.id}`,
        personId: note.personId,
        personName,
        category: 'Note',
        targetTab: 'notes',
        title: t('search.noteForTitle', { name: personName }),
        snippet: note.content,
      });
    }
  }

  return results;
}
