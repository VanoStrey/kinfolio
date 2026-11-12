import { getDb } from '../database';
import { Person, CreatePersonInput, UpdatePersonInput } from '../../types/person';

function generateId(): string {
  return `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const peopleRepository = {
  async getAll(includeDeleted = false): Promise<Person[]> {
    const db = await getDb();
    const all = await db.getAll('people');
    if (includeDeleted) return all;
    return all.filter((p) => !p.isDeleted);
  },

  async getById(id: string): Promise<Person | undefined> {
    const db = await getDb();
    return db.get('people', id);
  },

  async create(input: CreatePersonInput): Promise<Person> {
    const db = await getDb();
    const now = new Date().toISOString();

    const newPerson: Person = {
      id: generateId(),
      name: input.name.trim(),
      relationship: input.relationship?.trim() || undefined,
      birthday: input.birthday?.trim() || undefined,
      bio: input.bio?.trim() || undefined,
      photoUrl: input.photoUrl || undefined,
      avatarColor: input.avatarColor || '#E8EEE4',
      starred: !!input.starred,
      details: {
        clothingSize: input.details?.clothingSize?.trim() || undefined,
        shoeSize: input.details?.shoeSize?.trim() || undefined,
        ringSize: input.details?.ringSize?.trim() || undefined,
        height: input.details?.height?.trim() || undefined,
        customFields: input.details?.customFields || [],
      },
      preferences: {
        colors: input.preferences?.colors || [],
        brands: input.preferences?.brands || [],
        scents: input.preferences?.scents || [],
        hobbies: input.preferences?.hobbies || [],
        likes: input.preferences?.likes || [],
        dislikes: input.preferences?.dislikes || [],
      },
      food: {
        allergies: input.food?.allergies || [],
        intolerances: input.food?.intolerances || [],
        dietaryRestrictions: input.food?.dietaryRestrictions || [],
        favoriteFoods: input.food?.favoriteFoods || [],
        dislikedFoods: input.food?.dislikedFoods || [],
        notes: input.food?.notes?.trim() || undefined,
      },
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    };

    await db.put('people', newPerson);
    return newPerson;
  },

  async update(id: string, input: UpdatePersonInput): Promise<Person> {
    const db = await getDb();
    const existing = await db.get('people', id);
    if (!existing) {
      throw new Error(`Person with id "${id}" not found.`);
    }

    const now = new Date().toISOString();
    const updated: Person = {
      ...existing,
      ...input,
      details: {
        ...existing.details,
        ...(input.details || {}),
      },
      preferences: {
        ...existing.preferences,
        ...(input.preferences || {}),
      },
      food: {
        ...existing.food,
        ...(input.food || {}),
      },
      updatedAt: now,
    };

    await db.put('people', updated);
    return updated;
  },

  async softDelete(id: string): Promise<void> {
    const db = await getDb();
    const existing = await db.get('people', id);
    if (existing) {
      existing.isDeleted = true;
      existing.deletedAt = new Date().toISOString();
      existing.updatedAt = new Date().toISOString();
      await db.put('people', existing);
    }
  },

  async restore(id: string): Promise<Person | undefined> {
    const db = await getDb();
    const existing = await db.get('people', id);
    if (existing) {
      existing.isDeleted = false;
      existing.deletedAt = undefined;
      existing.updatedAt = new Date().toISOString();
      await db.put('people', existing);
      return existing;
    }
    return undefined;
  },

  async hardDelete(id: string): Promise<void> {
    const db = await getDb();
    const tx = db.transaction(['people', 'gifts', 'notes'], 'readwrite');
    
    // Delete person
    await tx.objectStore('people').delete(id);

    // Delete gifts belonging to person
    const giftsStore = tx.objectStore('gifts');
    const giftsIndex = giftsStore.index('personId');
    const giftKeys = await giftsIndex.getAllKeys(id);
    for (const gk of giftKeys) {
      await giftsStore.delete(gk);
    }

    // Delete notes belonging to person
    const notesStore = tx.objectStore('notes');
    const notesIndex = notesStore.index('personId');
    const noteKeys = await notesIndex.getAllKeys(id);
    for (const nk of noteKeys) {
      await notesStore.delete(nk);
    }

    await tx.done;
  },

  async bulkInsert(people: Person[]): Promise<void> {
    const db = await getDb();
    const tx = db.transaction('people', 'readwrite');
    for (const p of people) {
      await tx.store.put(p);
    }
    await tx.done;
  },
};
