import { GiftIdea } from './gift';

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
  allergies: string[];         // Critical medical allergies (e.g. Peanuts, Shellfish)
  intolerances: string[];      // Intolerances (e.g. Lactose, Gluten sensitivity)
  dietaryRestrictions: string[]; // Lifestyle/ethical (e.g. Vegetarian, Halal, Kosher)
  favoriteFoods: string[];
  dislikedFoods: string[];
  notes?: string;
}

export interface PersonNote {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Person {
  id: string;
  name: string;
  relationship?: string;
  birthday?: string;
  avatarColor?: string;
  details: PersonDetails;
  preferences: PersonPreferences;
  food: PersonFood;
  gifts: GiftIdea[];
  notes: PersonNote[];
  starred?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SortOption = 'updated-desc' | 'name-asc' | 'relationship-asc';
