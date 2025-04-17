export interface Article {
  id: string;
  feedId: string;
  title: string;
  content: string;
  link: string;
  publishedAt: Date;
  author?: string;
  isRead: boolean;
  isFavorite: boolean;
  createdAt: Date;
}