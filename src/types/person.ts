import { GiftIdea } from './gift';
import { Note } from './note';

export interface CustomField {
  id: string;
  label: string;
  value: string;
}

export interface PersonDetails {
  clothingSize?: string;
  shoeSize?: string;
  ringSize?: string;
  height?: string;
  customFields: CustomField[];
}

export interface PersonPreferences {
  colors: string[];
  brands: string[];
  scents: string[];
  hobbies: string[];
  likes: string[];
  dislikes: string[];
}

export interface PersonFood {
  allergies: string[];           // Critical medical allergies (e.g. Peanuts, Shellfish)
  intolerances: string[];        // Food intolerances (e.g. Lactose, Gluten sensitivity)
  dietaryRestrictions: string[]; // Lifestyle/ethical (e.g. Vegetarian, Halal, Low sodium)
  favoriteFoods: string[];
  dislikedFoods: string[];
  notes?: string;                // Kitchen / dining advice
}

export interface Person {
  id: string;
  name: string;
  relationship?: string;
  birthday?: string;
  avatarColor?: string;
  starred?: boolean;
  details: PersonDetails;
  preferences: PersonPreferences;
  food: PersonFood;
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PersonWithRelations extends Person {
  gifts: GiftIdea[];
  notes: Note[];
}

export type CreatePersonInput = {
  name: string;
  relationship?: string;
  birthday?: string;
  avatarColor?: string;
  starred?: boolean;
  details?: Partial<PersonDetails>;
  preferences?: Partial<PersonPreferences>;
  food?: Partial<PersonFood>;
};

export type UpdatePersonInput = {
  name?: string;
  relationship?: string;
  birthday?: string;
  avatarColor?: string;
  starred?: boolean;
  details?: Partial<PersonDetails>;
  preferences?: Partial<PersonPreferences>;
  food?: Partial<PersonFood>;
  isDeleted?: boolean;
  deletedAt?: string;
};

export type SortOption = 'updated-desc' | 'name-asc' | 'relationship-asc';
