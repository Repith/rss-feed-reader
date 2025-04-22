import { Feed } from "@/src/domain/models/Feed";
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
    try {
      // Normalize URL (add https:// if missing)
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      const { feed, articles } = await this.rssParserService.parseFeed(url);

      const createdFeed = await this.feedRepository.create({
        url,
        title: feed.title || "Unnamed Feed",
        description: feed.description || "",
        lastFetched: new Date(),
      });

      const batchSize = 20;
      for (let i = 0; i < articles.length; i += batchSize) {
        const batch = articles.slice(i, i + batchSize);
        await Promise.all(
          batch.map(article => 
            this.articleRepository.saveArticle({
              ...article,
              feedId: createdFeed.id,
            })
          )
        );
      }

      return createdFeed;
    } catch (error) {
      console.error("Error in addFeed:", error);
      throw new Error(`Failed to add feed: ${(error as Error).message || 'Unknown error'}`);
    }
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
