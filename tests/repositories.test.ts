import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { resetDatabase } from '../src/db/database';
import { peopleRepository } from '../src/db/repositories/peopleRepository';
import { giftsRepository } from '../src/db/repositories/giftsRepository';
import { notesRepository } from '../src/db/repositories/notesRepository';
import { searchAllRecords } from '../src/services/searchService';
import { DEMO_PEOPLE, DEMO_GIFTS, DEMO_NOTES } from '../src/services/demoDataService';

describe('Phase 3 Core Functionality & Database Storage', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  describe('peopleRepository CRUD & Soft Delete', () => {
    it('creates a person with custom fields and food restrictions', async () => {
      const created = await peopleRepository.create({
        name: 'Sophie Germain',
        relationship: 'Mathematician Friend',
        birthday: '1776-04-01',
        details: {
          clothingSize: 'M',
          shoeSize: 'EU 39',
          ringSize: '16 mm',
          customFields: [{ id: 'cf-test', label: 'Hat size', value: '56 cm' }],
        },
        food: {
          allergies: ['Shellfish'],
          intolerances: ['Lactose'],
          dietaryRestrictions: ['Vegetarian'],
          favoriteFoods: ['Croissants'],
          dislikedFoods: ['Celery'],
        },
      });

      expect(created.id).toBeDefined();
      expect(created.name).toBe('Sophie Germain');
      expect(created.details.customFields).toHaveLength(1);
      expect(created.details.customFields[0].label).toBe('Hat size');
      expect(created.food.allergies).toContain('Shellfish');
      expect(created.isDeleted).toBe(false);

      const retrieved = await peopleRepository.getById(created.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe('Sophie Germain');
    });

    it('updates a person details and preferences', async () => {
      const person = await peopleRepository.create({ name: 'Ada Lovelace' });
      const updated = await peopleRepository.update(person.id, {
        relationship: 'Mentor',
        details: { clothingSize: 'S' },
        preferences: { brands: ['Vintage Silk'] },
      });

      expect(updated.relationship).toBe('Mentor');
      expect(updated.details.clothingSize).toBe('S');
      expect(updated.preferences.brands).toContain('Vintage Silk');
    });

    it('soft deletes and restores a person', async () => {
      const person = await peopleRepository.create({ name: 'To Be Deleted' });

      // Soft delete
      await peopleRepository.softDelete(person.id);
      const activePeople = await peopleRepository.getAll(false);
      expect(activePeople.find((p) => p.id === person.id)).toBeUndefined();

      const allPeople = await peopleRepository.getAll(true);
      const deletedPerson = allPeople.find((p) => p.id === person.id);
      expect(deletedPerson?.isDeleted).toBe(true);
      expect(deletedPerson?.deletedAt).toBeDefined();

      // Restore
      await peopleRepository.restore(person.id);
      const restoredActive = await peopleRepository.getAll(false);
      expect(restoredActive.find((p) => p.id === person.id)).toBeDefined();
      expect(restoredActive.find((p) => p.id === person.id)?.isDeleted).toBe(false);
    });

    it('hard deletes a person and cascades to their gifts and notes without deleting unrelated records', async () => {
      const personA = await peopleRepository.create({ name: 'Person A' });
      const personB = await peopleRepository.create({ name: 'Person B' });

      // Add gifts and notes to Person A
      const giftA = await giftsRepository.create({ personId: personA.id, title: 'Gift for A', status: 'idea' });
      const noteA = await notesRepository.create({ personId: personA.id, content: 'Note for A' });

      // Add gifts and notes to Person B
      const giftB = await giftsRepository.create({ personId: personB.id, title: 'Gift for B', status: 'idea' });
      const noteB = await notesRepository.create({ personId: personB.id, content: 'Note for B' });

      // Delete Person A
      await peopleRepository.hardDelete(personA.id);

      // Verify Person A records are gone
      expect(await peopleRepository.getById(personA.id)).toBeUndefined();
      expect(await giftsRepository.getById(giftA.id)).toBeUndefined();
      expect(await notesRepository.getById(noteA.id)).toBeUndefined();

      // Verify Person B records remain completely untouched!
      expect(await peopleRepository.getById(personB.id)).toBeDefined();
      expect(await giftsRepository.getById(giftB.id)).toBeDefined();
      expect(await notesRepository.getById(noteB.id)).toBeDefined();
    });
  });

  describe('giftsRepository CRUD & status updates', () => {
    it('creates, updates status, and queries gifts by person', async () => {
      const person = await peopleRepository.create({ name: 'Recipient' });

      const gift = await giftsRepository.create({
        personId: person.id,
        title: 'Linen Shirt',
        price: 85,
        currency: '€',
        occasion: 'Birthday',
        status: 'idea',
      });

      expect(gift.id).toBeDefined();
      expect(gift.status).toBe('idea');

      // Update status
      const boughtGift = await giftsRepository.updateStatus(gift.id, 'bought');
      expect(boughtGift.status).toBe('bought');

      // Update gift fields
      const updatedGift = await giftsRepository.update(gift.id, {
        price: 90,
        description: 'Navy blue, relaxed collar',
      });
      expect(updatedGift.price).toBe(90);
      expect(updatedGift.description).toBe('Navy blue, relaxed collar');

      const personGifts = await giftsRepository.getByPersonId(person.id);
      expect(personGifts).toHaveLength(1);
      expect(personGifts[0].title).toBe('Linen Shirt');
    });
  });

  describe('notesRepository CRUD & chronological sorting', () => {
    it('creates notes and preserves chronological order (newest first)', async () => {
      const person = await peopleRepository.create({ name: 'Recipient' });

      const note1 = await notesRepository.create({
        personId: person.id,
        content: 'Older observation',
      });
      // Small pause to guarantee different timestamps
      await new Promise((r) => setTimeout(r, 20));

      const note2 = await notesRepository.create({
        personId: person.id,
        content: 'Newer observation',
      });

      const list = await notesRepository.getByPersonId(person.id);
      expect(list).toHaveLength(2);
      expect(list[0].id).toBe(note2.id); // Newest first
      expect(list[1].id).toBe(note1.id);
    });
  });

  describe('searchAllRecords Global Search', () => {
    it('finds records across people, details, preferences, allergies, gifts, and notes', async () => {
      // Seed with sample data
      await peopleRepository.bulkInsert(DEMO_PEOPLE);
      await giftsRepository.bulkInsert(DEMO_GIFTS);
      await notesRepository.bulkInsert(DEMO_NOTES);

      // 1. Search by Allergy (Elena has Peanuts allergy)
      const allergyResults = await searchAllRecords('Peanuts');
      expect(allergyResults.length).toBeGreaterThan(0);
      expect(allergyResults[0].category).toBe('Food & Allergies');
      expect(allergyResults[0].isAllergyAlert).toBe(true);

      // 2. Search by Perfume / Scent
      const scentResults = await searchAllRecords('Diptyque');
      expect(scentResults.length).toBeGreaterThan(0);

      // 3. Search by Clothing / Shoe Size
      const sizeResults = await searchAllRecords('EU 38');
      expect(sizeResults.length).toBeGreaterThan(0);

      // 4. Search by Note content
      const noteResults = await searchAllRecords('Berlin');
      expect(noteResults.length).toBeGreaterThan(0);
      expect(noteResults[0].category).toBe('Note');

      // 5. Search by Gift title
      const giftResults = await searchAllRecords('Timemore');
      expect(giftResults.length).toBeGreaterThan(0);
      expect(giftResults[0].category).toBe('Gift');
    });
  });
});
