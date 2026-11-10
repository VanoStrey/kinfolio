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
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateGiftInput = Omit<GiftIdea, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'deletedAt'>;
export type UpdateGiftInput = Partial<Omit<GiftIdea, 'id' | 'personId' | 'createdAt' | 'updatedAt'>>;
