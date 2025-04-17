import { Article } from '../models/Article';

export interface ArticleRepository {
  findAll(options?: { limit?: number; offset?: number }): Promise<Article[]>;
  findById(id: string): Promise<Article | null>;
  findByFeedId(feedId: string): Promise<Article[]>;
  findUnread(): Promise<Article[]>;
  findFavorites(): Promise<Article[]>;
  search(query: string): Promise<Article[]>;
  create(article: Omit<Article, 'id' | 'createdAt'>): Promise<Article>;
  markAsRead(id: string, isRead: boolean): Promise<Article | null>;
  markAsFavorite(id: string, isFavorite: boolean): Promise<Article | null>;
}