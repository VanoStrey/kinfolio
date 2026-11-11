import { useState, useEffect, useCallback } from 'react';
import { Person, CreatePersonInput, UpdatePersonInput } from '../types/person';
import { peopleRepository } from '../db/repositories/peopleRepository';
import { settingsRepository } from '../db/repositories/settingsRepository';
import { loadDemoData } from '../services/demoDataService';
import { useToast } from './useToast';
import { useTranslation } from '../i18n/LanguageContext';

export function usePeople() {
  const [people, setPeople] = useState<Person[]>([]);
  const [deletedPeople, setDeletedPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const { t } = useTranslation();

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
      showToast(t('toasts.addedPerson', { name: created.name }));
      return created;
    } catch (err: any) {
      showToast(err.message || t('toasts.failedAddPerson'), 'error');
      throw err;
    }
  };

  const updatePerson = async (id: string, input: UpdatePersonInput): Promise<Person> => {
    try {
      const updated = await peopleRepository.update(id, input);
      setPeople((prev) => prev.map((p) => (p.id === id ? updated : p)));
      showToast(t('toasts.updatedPerson', { name: updated.name }));
      return updated;
    } catch (err: any) {
      showToast(err.message || t('toasts.failedUpdatePerson'), 'error');
      throw err;
    }
  };

  const deletePerson = async (id: string, permanent = false): Promise<void> => {
    try {
      const target = people.find((p) => p.id === id);
      const name = target?.name || t('common.unknown');

      if (permanent) {
        await peopleRepository.hardDelete(id);
        setPeople((prev) => prev.filter((p) => p.id !== id));
        setDeletedPeople((prev) => prev.filter((p) => p.id !== id));
        showToast(t('toasts.deletedPersonPermanent', { name }));
      } else {
        await peopleRepository.softDelete(id);
        setPeople((prev) => prev.filter((p) => p.id !== id));
        if (target) {
          setDeletedPeople((prev) => [{ ...target, isDeleted: true }, ...prev]);
        }
        showToast(t('toasts.movedToTrash', { name }));
      }
    } catch (err: any) {
      showToast(err.message || t('toasts.failedDeletePerson'), 'error');
      throw err;
    }
  };

  const restorePerson = async (id: string): Promise<void> => {
    try {
      const restored = await peopleRepository.restore(id);
      if (restored) {
        setDeletedPeople((prev) => prev.filter((p) => p.id !== id));
        setPeople((prev) => [restored, ...prev]);
        showToast(t('toasts.restoredPerson', { name: restored.name }));
      }
    } catch (err: any) {
      showToast(err.message || t('toasts.failedRestorePerson'), 'error');
      throw err;
    }
  };

  const reloadDemoData = async (): Promise<void> => {
    try {
      setLoading(true);
      await loadDemoData();
      await loadPeople();
      showToast(t('toasts.sampleLoaded'));
    } catch (err: any) {
      showToast(err.message || t('toasts.failedLoadDemo'), 'error');
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
