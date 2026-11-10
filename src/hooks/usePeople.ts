import { useState, useEffect, useCallback } from 'react';
import { Person, CreatePersonInput, UpdatePersonInput } from '../types/person';
import { peopleRepository } from '../db/repositories/peopleRepository';
import { settingsRepository } from '../db/repositories/settingsRepository';
import { loadDemoData } from '../services/demoDataService';
import { useToast } from './useToast';

export function usePeople() {
  const [people, setPeople] = useState<Person[]>([]);
  const [deletedPeople, setDeletedPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const loadPeople = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const all = await peopleRepository.getAll(true);
      const active = all.filter((p) => !p.isDeleted);
      const deleted = all.filter((p) => p.isDeleted);

      // Check if DB is completely empty and demo data hasn't been explicitly declined
      const hasLoadedDemo = await settingsRepository.get('hasLoadedDemoData', false);
      if (all.length === 0 && !hasLoadedDemo) {
        // Auto-initialize demo data on very first launch so the user isn't faced with an empty screen,
        // while clearly marking it and allowing 1-click wipe or reset.
        await loadDemoData();
        const freshAll = await peopleRepository.getAll(true);
        setPeople(freshAll.filter((p) => !p.isDeleted));
        setDeletedPeople(freshAll.filter((p) => p.isDeleted));
      } else {
        setPeople(active);
        setDeletedPeople(deleted);
      }
    } catch (err: any) {
      console.error('[usePeople] Error loading people from IndexedDB:', err);
      setError(err.message || 'Failed to load people');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPeople();
  }, [loadPeople]);

  const createPerson = async (input: CreatePersonInput): Promise<Person> => {
    try {
      const created = await peopleRepository.create(input);
      setPeople((prev) => [created, ...prev]);
      showToast(`Added ${created.name}`);
      return created;
    } catch (err: any) {
      showToast(err.message || 'Failed to add person', 'error');
      throw err;
    }
  };

  const updatePerson = async (id: string, input: UpdatePersonInput): Promise<Person> => {
    try {
      const updated = await peopleRepository.update(id, input);
      setPeople((prev) => prev.map((p) => (p.id === id ? updated : p)));
      showToast(`Updated ${updated.name}`);
      return updated;
    } catch (err: any) {
      showToast(err.message || 'Failed to update person', 'error');
      throw err;
    }
  };

  const deletePerson = async (id: string, permanent = false): Promise<void> => {
    try {
      const target = people.find((p) => p.id === id);
      const name = target?.name || 'Person';

      if (permanent) {
        await peopleRepository.hardDelete(id);
        setPeople((prev) => prev.filter((p) => p.id !== id));
        setDeletedPeople((prev) => prev.filter((p) => p.id !== id));
        showToast(`Permanently deleted ${name}`);
      } else {
        await peopleRepository.softDelete(id);
        setPeople((prev) => prev.filter((p) => p.id !== id));
        if (target) {
          setDeletedPeople((prev) => [{ ...target, isDeleted: true }, ...prev]);
        }
        showToast(`Moved ${name} to trash`);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete person', 'error');
      throw err;
    }
  };

  const restorePerson = async (id: string): Promise<void> => {
    try {
      const restored = await peopleRepository.restore(id);
      if (restored) {
        setDeletedPeople((prev) => prev.filter((p) => p.id !== id));
        setPeople((prev) => [restored, ...prev]);
        showToast(`Restored ${restored.name}`);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to restore person', 'error');
      throw err;
    }
  };

  const reloadDemoData = async (): Promise<void> => {
    try {
      setLoading(true);
      await loadDemoData();
      await loadPeople();
      showToast('Sample records loaded successfully');
    } catch (err: any) {
      showToast(err.message || 'Failed to load demo data', 'error');
    } finally {
      setLoading(false);
    }
  };

  return {
    people,
    deletedPeople,
    loading,
    error,
    refresh: loadPeople,
    createPerson,
    updatePerson,
    deletePerson,
    restorePerson,
    reloadDemoData,
  };
}
