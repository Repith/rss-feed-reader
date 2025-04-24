export interface Article {
  id: string;
  userId: string;
  feedId: string;
  title: string;
  content: string;
  snippet: string;
  link: string;
  publishedAt: Date;
  author?: string;
  imageUrl?: string | null;
  isRead: boolean;
  isFavorite: boolean;
  createdAt: Date;
}

