import { getDb } from '../database';

export const settingsRepository = {
  async get<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const db = await getDb();
      const record = await db.get('settings', key);
      if (record && record.value !== undefined) {
        return record.value as T;
      }
      return defaultValue;
    } catch {
      return defaultValue;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    const db = await getDb();
    const now = new Date().toISOString();
    await db.put('settings', {
      key,
      value,
      updatedAt: now,
    });
  },

  async getAll(): Promise<Record<string, any>> {
    const db = await getDb();
    const list = await db.getAll('settings');
    const result: Record<string, any> = {};
    for (const item of list) {
      result[item.key] = item.value;
    }
    return result;
  },
};
