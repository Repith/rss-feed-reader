import { Article } from "@/src/domain/models/Article";
import { ArticleRepository } from "@/src/domain/repositories/ArticleRepository";


export class ArticleService {
  constructor(private articleRepository: ArticleRepository) {}

  async getAllArticles(options?: { limit?: number; offset?: number; sort?: string }): Promise<Article[]> {
    return this.articleRepository.findAll(options);
  }

  async getArticleById(id: string): Promise<Article | null> {
    return this.articleRepository.findById(id);
  }

  async getArticlesByFeedId(feedId: string, options?: { limit?: number; offset?: number }): Promise<Article[]> {
    return this.articleRepository.findByFeedId(feedId, options);
  }

  async getUnreadArticles(options?: { limit?: number; offset?: number }): Promise<Article[]> {
    return this.articleRepository.findUnread(options);
  }

  async getFavoriteArticles(options?: { limit?: number; offset?: number }): Promise<Article[]> {
    return this.articleRepository.findFavorites(options);
  }

  async searchArticles(query: string, options?: { limit?: number; offset?: number }): Promise<Article[]> {
    return this.articleRepository.search(query, options);
  }

  async markAsRead(id: string, isRead: boolean): Promise<Article | null> {
    const article = await this.articleRepository.markAsRead(id, isRead);
    return article;
  }

  async markAsFavorite(id: string, isFavorite: boolean): Promise<Article | null> {
    const article = await this.articleRepository.markAsFavorite(id, isFavorite);
    return article;
  }

  async markAllAsRead(feedId?: string): Promise<void> {
    return this.articleRepository.markAllAsRead(feedId);
  }

  async getArticleCount(filter?: { feedId?: string; unreadOnly?: boolean }): Promise<number> {
    return this.articleRepository.getCount(filter);
  }
}
