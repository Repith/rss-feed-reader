import Parser from 'rss-parser';
import { Feed } from '@/domain/models/Feed';
import { Article } from '@/domain/models/Article';

export class RssParserService {
  private parser: Parser;

  constructor() {
    this.parser = new Parser();
  }

  async parseFeed(url: string): Promise<{ feed: Partial<Feed>; articles: Omit<Article, 'id' | 'createdAt'>[] }> {
    try {
      const parsedFeed = await this.parser.parseURL(url);
      
      const feed: Partial<Feed> = {
        url,
        title: parsedFeed.title || 'Unnamed Feed',
        description: parsedFeed.description,
        lastFetched: new Date()
      };
      
      const articles = parsedFeed.items.map(item => ({
        feedId: '', // Will be filled later
        title: item.title || 'Untitled',
        content: item.content || item.contentSnippet || '',
        link: item.link || '',
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
        author: item.creator,
        isRead: false,
        isFavorite: false
      }));
      
      return { feed, articles };
    } catch (error) {
      console.error('Error parsing RSS feed:', error);
      throw new Error(`Failed to parse RSS feed: ${error.message}`);
    }
  }
}