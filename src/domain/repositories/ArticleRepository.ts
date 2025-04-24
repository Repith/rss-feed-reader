import { Article } from "../models/Article";

export interface ArticleRepository {
  findByFeedId(feedId: string, userId: string): Promise<Article[]>;
  findById(id: string): Promise<Article | null>;
  findFavorites(options?: {
    limit?: number;
    offset?: number;
    unreadOnly?: boolean;
    userId: string;
  }): Promise<Article[]>;
  saveArticle(article: Omit<Article, "id" | "createdAt">): Promise<Article>;
  updateArticle(id: string, article: Partial<Article>): Promise<Article | null>;
  deleteByFeedId(feedId: string): Promise<boolean>;
}

