import { openDB, IDBPDatabase } from 'idb';
import { migrateV1 } from './migrations/v1';

export const DB_NAME = 'little_details_db';
export const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<any>> | null = null;

export async function getDb(): Promise<IDBPDatabase<any>> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, _newVersion, _transaction) {
        if (oldVersion < 1) {
          migrateV1(db);
        }
      },
      blocked() {
        console.warn('[Little Details DB] Database open blocked by another tab.');
      },
      blocking() {
        console.warn('[Little Details DB] Older database version blocking upgrade.');
      },
      terminated() {
        console.warn('[Little Details DB] Database connection unexpectedly terminated.');
        dbPromise = null;
      },
    });
  }
  return dbPromise;
}

export async function closeDb(): Promise<void> {
  if (dbPromise) {
    const db = await dbPromise;
    db.close();
    dbPromise = null;
  }
}

export async function resetDatabase(): Promise<void> {
  await closeDb();
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onsuccess = () => resolve();
    request.onerror = (e) => reject(e);
    request.onblocked = () => {
      console.warn('[Little Details DB] Delete blocked by open connections.');
      resolve();
    };
  });
}
