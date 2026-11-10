export interface Note {
  id: string;
  personId: string;
  content: string;
  category?: string;
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateNoteInput = Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'deletedAt'>;
export type UpdateNoteInput = Partial<Pick<Note, 'content' | 'category'>>;
