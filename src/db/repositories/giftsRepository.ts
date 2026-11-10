import { getDb } from '../database';
import { GiftIdea, GiftStatus, CreateGiftInput, UpdateGiftInput } from '../../types/gift';

function generateId(): string {
  return `g-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const giftsRepository = {
  async getAll(includeDeleted = false): Promise<GiftIdea[]> {
    const db = await getDb();
    const all = await db.getAll('gifts');
    if (includeDeleted) return all;
    return all.filter((g) => !g.isDeleted);
  },

  async getByPersonId(personId: string, includeDeleted = false): Promise<GiftIdea[]> {
    const db = await getDb();
    const gifts = await db.getAllFromIndex('gifts', 'personId', personId);
    if (includeDeleted) return gifts;
    return gifts.filter((g) => !g.isDeleted);
  },

  async getById(id: string): Promise<GiftIdea | undefined> {
    const db = await getDb();
    return db.get('gifts', id);
  },

  async create(input: CreateGiftInput): Promise<GiftIdea> {
    const db = await getDb();
    const now = new Date().toISOString();

    const newGift: GiftIdea = {
      id: generateId(),
      personId: input.personId,
      title: input.title.trim(),
      description: input.description?.trim() || undefined,
      url: input.url?.trim() || undefined,
      price: input.price !== undefined && !isNaN(input.price) ? Number(input.price) : undefined,
      currency: input.currency || '€',
      occasion: input.occasion?.trim() || undefined,
      imageUrl: input.imageUrl,
      status: input.status || 'idea',
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    };

    await db.put('gifts', newGift);
    return newGift;
  },

  async update(id: string, input: UpdateGiftInput): Promise<GiftIdea> {
    const db = await getDb();
    const existing = await db.get('gifts', id);
    if (!existing) {
      throw new Error(`Gift with id "${id}" not found.`);
    }

    const now = new Date().toISOString();
    const updated: GiftIdea = {
      ...existing,
      ...input,
      title: input.title !== undefined ? input.title.trim() : existing.title,
      description: input.description !== undefined ? input.description?.trim() || undefined : existing.description,
      url: input.url !== undefined ? input.url?.trim() || undefined : existing.url,
      occasion: input.occasion !== undefined ? input.occasion?.trim() || undefined : existing.occasion,
      updatedAt: now,
    };

    await db.put('gifts', updated);
    return updated;
  },

  async updateStatus(id: string, status: GiftStatus): Promise<GiftIdea> {
    const db = await getDb();
    const existing = await db.get('gifts', id);
    if (!existing) {
      throw new Error(`Gift with id "${id}" not found.`);
    }

    const now = new Date().toISOString();
    existing.status = status;
    existing.updatedAt = now;
    await db.put('gifts', existing);
    return existing;
  },

  async softDelete(id: string): Promise<void> {
    const db = await getDb();
    const existing = await db.get('gifts', id);
    if (existing) {
      existing.isDeleted = true;
      existing.deletedAt = new Date().toISOString();
      existing.updatedAt = new Date().toISOString();
      await db.put('gifts', existing);
    }
  },

  async restore(id: string): Promise<GiftIdea | undefined> {
    const db = await getDb();
    const existing = await db.get('gifts', id);
    if (existing) {
      existing.isDeleted = false;
      existing.deletedAt = undefined;
      existing.updatedAt = new Date().toISOString();
      await db.put('gifts', existing);
      return existing;
    }
    return undefined;
  },

  async hardDelete(id: string): Promise<void> {
    const db = await getDb();
    await db.delete('gifts', id);
  },

  async bulkInsert(gifts: GiftIdea[]): Promise<void> {
    const db = await getDb();
    const tx = db.transaction('gifts', 'readwrite');
    for (const g of gifts) {
      await tx.store.put(g);
    }
    await tx.done;
  },
};
