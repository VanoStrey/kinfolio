import { Person } from '../types/person';
import { PersonProfileTab } from '../types/navigation';
import { peopleRepository } from '../db/repositories/peopleRepository';
import { giftsRepository } from '../db/repositories/giftsRepository';
import { notesRepository } from '../db/repositories/notesRepository';

export interface SearchResultItem {
  id: string;
  personId: string;
  personName: string;
  category: 'Person' | 'Sizes & Details' | 'Preferences' | 'Food & Allergies' | 'Gift' | 'Note';
  targetTab: PersonProfileTab;
  title: string;
  snippet: string;
  isAllergyAlert?: boolean;
}

export async function searchAllRecords(rawQuery: string): Promise<SearchResultItem[]> {
  const query = rawQuery.trim().toLowerCase();
  if (query.length < 2) return [];

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
        snippet: person.relationship ? `Relationship: ${person.relationship}` : 'Person profile',
      });
    }

    // 2. Search Details & Custom Fields
    const details = person.details;
    const sizes = [
      details.clothingSize ? `Clothing: ${details.clothingSize}` : null,
      details.shoeSize ? `Shoes: ${details.shoeSize}` : null,
      details.ringSize ? `Ring: ${details.ringSize}` : null,
      details.height ? `Height: ${details.height}` : null,
    ].filter(Boolean) as string[];

    for (const sizeStr of sizes) {
      if (sizeStr.toLowerCase().includes(query)) {
        results.push({
          id: `search-size-${person.id}-${sizeStr}`,
          personId: person.id,
          personName: person.name,
          category: 'Sizes & Details',
          targetTab: 'details',
          title: person.name,
          snippet: sizeStr,
        });
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
    const prefCategories: Array<{ label: string; items: string[] }> = [
      { label: 'Scents', items: prefs.scents },
      { label: 'Brands', items: prefs.brands },
      { label: 'Colors', items: prefs.colors },
      { label: 'Hobbies', items: prefs.hobbies },
      { label: 'Likes', items: prefs.likes },
      { label: 'Dislikes', items: prefs.dislikes },
    ];

    for (const cat of prefCategories) {
      for (const item of cat.items) {
        if (item.toLowerCase().includes(query)) {
          results.push({
            id: `search-pref-${person.id}-${cat.label}-${item}`,
            personId: person.id,
            personName: person.name,
            category: 'Preferences',
            targetTab: 'preferences',
            title: person.name,
            snippet: `${cat.label}: ${item}`,
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
          snippet: `⚠️ Medical Allergy: ${allergy}`,
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
          snippet: `Intolerance: ${intol}`,
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
          snippet: `Dietary restriction: ${diet}`,
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
          snippet: `Favorite food: ${fav}`,
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
          snippet: `Disliked food: ${dis}`,
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
        snippet: `Dining note: ${person.food.notes}`,
      });
    }
  }

  // 5. Search Gifts
  for (const gift of gifts) {
    const person = peopleMap.get(gift.personId);
    const personName = person ? person.name : 'Unknown';

    if (
      gift.title.toLowerCase().includes(query) ||
      gift.description?.toLowerCase().includes(query) ||
      gift.occasion?.toLowerCase().includes(query)
    ) {
      results.push({
        id: `search-gift-${gift.id}`,
        personId: gift.personId,
        personName,
        category: 'Gift',
        targetTab: 'gifts',
        title: gift.title,
        snippet: `Gift idea for ${personName} (${gift.status}${gift.price ? `, ${gift.currency || '€'}${gift.price}` : ''})`,
      });
    }
  }

  // 6. Search Notes
  for (const note of notes) {
    const person = peopleMap.get(note.personId);
    const personName = person ? person.name : 'Unknown';

    if (note.content.toLowerCase().includes(query)) {
      results.push({
        id: `search-note-${note.id}`,
        personId: note.personId,
        personName,
        category: 'Note',
        targetTab: 'notes',
        title: `Note for ${personName}`,
        snippet: note.content,
      });
    }
  }

  return results;
}
