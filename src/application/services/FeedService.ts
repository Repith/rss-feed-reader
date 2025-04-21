import { Feed } from "@/src/domain/models/Feed";
import { ArticleRepository } from "@/src/domain/repositories/ArticleRepository";
import { FeedRepository } from "@/src/domain/repositories/FeedRepository";
import { MongoArticleRepository } from "@/src/infrastructure/repositories/MongoArticleRepository";
import { MongoFeedRepository } from "@/src/infrastructure/repositories/MongoFeedRepository";
import { RssParserService } from "@/src/infrastructure/services/RssParserService";

export class FeedService {
  constructor(
    private feedRepository: MongoFeedRepository,
    private articleRepository: MongoArticleRepository,
    private rssParserService: RssParserService
  ) {}

  async getAllFeeds(): Promise<Feed[]> {
    return this.feedRepository.findAll();
  }

  async getFeedById(id: string): Promise<Feed | null> {
    return this.feedRepository.findById(id);
  }

  async addFeed(url: string): Promise<Feed> {
    const { feed, articles } =
      await this.rssParserService.parseFeed(url);

    const createdFeed = await this.feedRepository.create({
      url,
      title: feed.title || "Unnamed Feed",
      description: feed.description,
      lastFetched: new Date(),
    });

    for (const article of articles) {
      await this.articleRepository.create({
        ...article,
        feedId: createdFeed.id,
      });
    }

    return createdFeed;
  }

  async updateFeed(
    id: string,
    data: Partial<Feed>
  ): Promise<Feed | null> {
    return this.feedRepository.update(id, data);
  }

  async refreshFeed(id: string): Promise<Feed | null> {
    const feed = await this.feedRepository.findById(id);
    if (!feed) return null;

    const { articles } =
      await this.rssParserService.parseFeed(feed.url);

    for (const article of articles) {
      await this.articleRepository.create({
        ...article,
        feedId: feed.id,
      });
    }

    return this.feedRepository.update(id, {
      lastFetched: new Date(),
    });
  }

  async deleteFeed(id: string): Promise<boolean> {
    return this.feedRepository.delete(id);
  }
}
