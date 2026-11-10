export type GiftStatus = 'idea' | 'bought' | 'given' | 'archived';

export interface GiftIdea {
  id: string;
  personId: string;
  title: string;
  description?: string;
  url?: string;
  price?: number;
  currency?: string;
  occasion?: string;
  imageUrl?: string;
  status: GiftStatus;
  createdAt: string;
  updatedAt: string;
}
