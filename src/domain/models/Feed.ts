export interface Feed {
  id: string;
  userId: string;
  url: string;
  title: string;
  description?: string;
  category?: string;
  lastFetched?: Date;
  createdAt: Date;
  updatedAt: Date;
}


