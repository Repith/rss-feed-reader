import { Article } from "@/src/domain/models/Article";
import { ArticleRepository } from "@/src/domain/repositories/ArticleRepository";

export class ArticleService {
  constructor(private articleRepository: ArticleRepository) {}

  async getArticlesByFeedId(feedId: string, userId: string): Promise<Article[]> {
    return this.articleRepository.findByFeedId(feedId, userId);
  }

  async getArticleById(id: string): Promise<Article | null> {
    return this.articleRepository.findById(id);
  }

  async getFavoriteArticles(userId: string, options?: { unreadOnly?: boolean }): Promise<Article[]> {
    return this.articleRepository.findFavorites({ ...options, userId });
  }

  async markAsFavorite(id: string, isFavorite: boolean): Promise<Article | null> {
    return this.articleRepository.updateArticle(id, { isFavorite });
  }

  async markAsRead(id: string, isRead: boolean): Promise<Article | null> {
    return this.articleRepository.updateArticle(id, { isRead });
  }
}

