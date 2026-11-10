import { IDBPDatabase } from 'idb';

export function migrateV1(db: IDBPDatabase<any>) {
  // 1. People Store
  if (!db.objectStoreNames.contains('people')) {
    const peopleStore = db.createObjectStore('people', { keyPath: 'id' });
    peopleStore.createIndex('name', 'name', { unique: false });
    peopleStore.createIndex('updatedAt', 'updatedAt', { unique: false });
    peopleStore.createIndex('isDeleted', 'isDeleted', { unique: false });
  }

  // 2. Gifts Store
  if (!db.objectStoreNames.contains('gifts')) {
    const giftsStore = db.createObjectStore('gifts', { keyPath: 'id' });
    giftsStore.createIndex('personId', 'personId', { unique: false });
    giftsStore.createIndex('status', 'status', { unique: false });
    giftsStore.createIndex('updatedAt', 'updatedAt', { unique: false });
    giftsStore.createIndex('isDeleted', 'isDeleted', { unique: false });
  }

  // 3. Notes Store
  if (!db.objectStoreNames.contains('notes')) {
    const notesStore = db.createObjectStore('notes', { keyPath: 'id' });
    notesStore.createIndex('personId', 'personId', { unique: false });
    notesStore.createIndex('createdAt', 'createdAt', { unique: false });
    notesStore.createIndex('isDeleted', 'isDeleted', { unique: false });
  }

  // 4. Settings Store
  if (!db.objectStoreNames.contains('settings')) {
    db.createObjectStore('settings', { keyPath: 'key' });
  }
}
