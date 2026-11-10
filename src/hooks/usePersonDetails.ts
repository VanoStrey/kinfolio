import { useState, useEffect, useCallback } from 'react';
import { Person, UpdatePersonInput } from '../types/person';
import { GiftIdea, GiftStatus, CreateGiftInput, UpdateGiftInput } from '../types/gift';
import { Note } from '../types/note';
import { peopleRepository } from '../db/repositories/peopleRepository';
import { giftsRepository } from '../db/repositories/giftsRepository';
import { notesRepository } from '../db/repositories/notesRepository';
import { useToast } from './useToast';

export function usePersonDetails(personId: string | null) {
  const [person, setPerson] = useState<Person | null>(null);
  const [gifts, setGifts] = useState<GiftIdea[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const loadData = useCallback(async () => {
    if (!personId) {
      setPerson(null);
      setGifts([]);
      setNotes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [personDoc, giftsList, notesList] = await Promise.all([
        peopleRepository.getById(personId),
        giftsRepository.getByPersonId(personId),
        notesRepository.getByPersonId(personId),
      ]);

      if (!personDoc || personDoc.isDeleted) {
        setPerson(null);
        setError('Person not found or moved to trash.');
      } else {
        setPerson(personDoc);
        setGifts(giftsList);
        setNotes(notesList);
      }
    } catch (err: any) {
      console.error('[usePersonDetails] Error loading details:', err);
      setError(err.message || 'Failed to load details.');
    } finally {
      setLoading(false);
    }
  }, [personId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Update Person info (Details, Preferences, Food, Core)
  const updatePerson = async (input: UpdatePersonInput): Promise<Person> => {
    if (!personId) throw new Error('No person selected');
    try {
      const updated = await peopleRepository.update(personId, input);
      setPerson(updated);
      showToast('Changes saved');
      return updated;
    } catch (err: any) {
      showToast(err.message || 'Failed to save changes', 'error');
      throw err;
    }
  };

  // Gift mutations
  const addGift = async (input: Omit<CreateGiftInput, 'personId'>): Promise<GiftIdea> => {
    if (!personId) throw new Error('No person selected');
    try {
      const created = await giftsRepository.create({
        ...input,
        personId,
      });
      setGifts((prev) => [created, ...prev]);
      showToast(`Added gift idea: "${created.title}"`);
      return created;
    } catch (err: any) {
      showToast(err.message || 'Failed to add gift idea', 'error');
      throw err;
    }
  };

  const updateGift = async (giftId: string, input: UpdateGiftInput): Promise<GiftIdea> => {
    try {
      const updated = await giftsRepository.update(giftId, input);
      setGifts((prev) => prev.map((g) => (g.id === giftId ? updated : g)));
      showToast('Gift updated');
      return updated;
    } catch (err: any) {
      showToast(err.message || 'Failed to update gift', 'error');
      throw err;
    }
  };

  const updateGiftStatus = async (giftId: string, status: GiftStatus): Promise<GiftIdea> => {
    try {
      const updated = await giftsRepository.updateStatus(giftId, status);
      setGifts((prev) => prev.map((g) => (g.id === giftId ? updated : g)));
      showToast(`Marked as ${status}`);
      return updated;
    } catch (err: any) {
      showToast(err.message || 'Failed to update gift status', 'error');
      throw err;
    }
  };

  const deleteGift = async (giftId: string): Promise<void> => {
    try {
      await giftsRepository.hardDelete(giftId);
      setGifts((prev) => prev.filter((g) => g.id !== giftId));
      showToast('Gift idea removed');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete gift', 'error');
      throw err;
    }
  };

  // Note mutations
  const addNote = async (content: string, category?: string): Promise<Note> => {
    if (!personId) throw new Error('No person selected');
    try {
      const created = await notesRepository.create({
        personId,
        content,
        category,
      });
      setNotes((prev) => [created, ...prev]);
      showToast('Note added');
      return created;
    } catch (err: any) {
      showToast(err.message || 'Failed to add note', 'error');
      throw err;
    }
  };

  const updateNote = async (noteId: string, content: string, category?: string): Promise<Note> => {
    try {
      const updated = await notesRepository.update(noteId, { content, category });
      setNotes((prev) => prev.map((n) => (n.id === noteId ? updated : n)));
      showToast('Note saved');
      return updated;
    } catch (err: any) {
      showToast(err.message || 'Failed to update note', 'error');
      throw err;
    }
  };

  const deleteNote = async (noteId: string): Promise<void> => {
    try {
      await notesRepository.hardDelete(noteId);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      showToast('Note removed');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete note', 'error');
      throw err;
    }
  };

  return {
    person,
    gifts,
    notes,
    loading,
    error,
    refresh: loadData,
    updatePerson,
    addGift,
    updateGift,
    updateGiftStatus,
    deleteGift,
    addNote,
    updateNote,
    deleteNote,
  };
}
