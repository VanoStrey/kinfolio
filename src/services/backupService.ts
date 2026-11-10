import { peopleRepository } from '../db/repositories/peopleRepository';
import { giftsRepository } from '../db/repositories/giftsRepository';
import { notesRepository } from '../db/repositories/notesRepository';
import { settingsRepository } from '../db/repositories/settingsRepository';
import { resetDatabase } from '../db/database';
import { BackupPayload } from '../types/settings';

export async function exportAllData(): Promise<void> {
  const [people, gifts, notes, settings] = await Promise.all([
    peopleRepository.getAll(true),
    giftsRepository.getAll(true),
    notesRepository.getAll(true),
    settingsRepository.getAll(),
  ]);

  const payload: BackupPayload = {
    app: 'little-details',
    version: 1,
    exportedAt: new Date().toISOString(),
    data: {
      people,
      gifts,
      notes,
      settings,
    },
  };

  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `little-details-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importDataFromFile(file: File): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const text = await file.text();
    const parsed = JSON.parse(text) as BackupPayload;

    if (!parsed || parsed.app !== 'little-details' || !parsed.data) {
      return { success: false, count: 0, error: 'Invalid backup file format.' };
    }

    const { people = [], gifts = [], notes = [], settings = {} } = parsed.data;

    // Bulk insert imported items
    if (people.length > 0) {
      await peopleRepository.bulkInsert(people);
    }
    if (gifts.length > 0) {
      await giftsRepository.bulkInsert(gifts);
    }
    if (notes.length > 0) {
      await notesRepository.bulkInsert(notes);
    }
    for (const [key, value] of Object.entries(settings)) {
      await settingsRepository.set(key, value);
    }

    return { success: true, count: people.length };
  } catch (err: any) {
    return { success: false, count: 0, error: err.message || 'Failed to parse JSON backup.' };
  }
}

export async function clearAllLocalData(): Promise<void> {
  await resetDatabase();
}
