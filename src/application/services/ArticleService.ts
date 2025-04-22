import { Article } from "@/src/domain/models/Article";
import { ArticleRepository } from "@/src/domain/repositories/ArticleRepository";


export class ArticleService {
  constructor(private articleRepository: ArticleRepository) {}

  async getAllArticles(options?: { limit?: number; offset?: number }): Promise<Article[]> {
    return this.articleRepository.findAll(options);
  }

  async getArticleById(id: string): Promise<Article | null> {
    return this.articleRepository.findById(id);
  }

  async getArticlesByFeedId(feedId: string): Promise<Article[]> {
    return this.articleRepository.findByFeedId(feedId);
  }

  async getUnreadArticles(): Promise<Article[]> {
    return this.articleRepository.findUnread();
  }

  async getFavoriteArticles(): Promise<Article[]> {
    return this.articleRepository.findFavorites();
  }

  async searchArticles(query: string): Promise<Article[]> {
    return this.articleRepository.search(query);
  }

  async createArticle(article: Omit<Article, 'id' | 'createdAt'>): Promise<Article> {
    return this.articleRepository.create(article);
  }

  async markAsRead(id: string, isRead: boolean): Promise<Article | null> {
    return this.articleRepository.markAsRead(id, isRead);
  }

  async markAsFavorite(id: string, isFavorite: boolean): Promise<Article | null> {
    return this.articleRepository.markAsFavorite(id, isFavorite);
  }
}


