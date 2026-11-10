import { getDb } from '../database';
import { Note, CreateNoteInput, UpdateNoteInput } from '../../types/note';

function generateId(): string {
  return `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const notesRepository = {
  async getAll(includeDeleted = false): Promise<Note[]> {
    const db = await getDb();
    const all = await db.getAll('notes');
    if (includeDeleted) return all;
    return all.filter((n) => !n.isDeleted);
  },

  async getByPersonId(personId: string, includeDeleted = false): Promise<Note[]> {
    const db = await getDb();
    const notes = await db.getAllFromIndex('notes', 'personId', personId);
    const filtered = includeDeleted ? notes : notes.filter((n) => !n.isDeleted);
    // Chronological sort: newest first
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getById(id: string): Promise<Note | undefined> {
    const db = await getDb();
    return db.get('notes', id);
  },

  async create(input: CreateNoteInput): Promise<Note> {
    const db = await getDb();
    const now = new Date().toISOString();

    const newNote: Note = {
      id: generateId(),
      personId: input.personId,
      content: input.content.trim(),
      category: input.category?.trim() || undefined,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    };

    await db.put('notes', newNote);
    return newNote;
  },

  async update(id: string, input: UpdateNoteInput): Promise<Note> {
    const db = await getDb();
    const existing = await db.get('notes', id);
    if (!existing) {
      throw new Error(`Note with id "${id}" not found.`);
    }

    const now = new Date().toISOString();
    const updated: Note = {
      ...existing,
      content: input.content !== undefined ? input.content.trim() : existing.content,
      category: input.category !== undefined ? input.category?.trim() || undefined : existing.category,
      updatedAt: now,
    };

    await db.put('notes', updated);
    return updated;
  },

  async softDelete(id: string): Promise<void> {
    const db = await getDb();
    const existing = await db.get('notes', id);
    if (existing) {
      existing.isDeleted = true;
      existing.deletedAt = new Date().toISOString();
      existing.updatedAt = new Date().toISOString();
      await db.put('notes', existing);
    }
  },

  async restore(id: string): Promise<Note | undefined> {
    const db = await getDb();
    const existing = await db.get('notes', id);
    if (existing) {
      existing.isDeleted = false;
      existing.deletedAt = undefined;
      existing.updatedAt = new Date().toISOString();
      await db.put('notes', existing);
      return existing;
    }
    return undefined;
  },

  async hardDelete(id: string): Promise<void> {
    const db = await getDb();
    await db.delete('notes', id);
  },

  async bulkInsert(notes: Note[]): Promise<void> {
    const db = await getDb();
    const tx = db.transaction('notes', 'readwrite');
    for (const n of notes) {
      await tx.store.put(n);
    }
    await tx.done;
  },
};
