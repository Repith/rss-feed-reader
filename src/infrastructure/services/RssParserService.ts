import { Article } from "@/src/domain/models/Article";
import { Feed } from "@/src/domain/models/Feed";
import Parser from "rss-parser";

export class RssParserService {
  private parser: Parser;

  constructor() {
    this.parser = new Parser();
  }

  async parseFeed(url: string): Promise<{
    feed: Partial<Feed>;
    articles: Omit<Article, "id" | "createdAt">[];
  }> {
    try {
      console.log(`Attempting to parse feed from: ${url}`);

      this.parser = new Parser({
        headers: {
          "User-Agent": "RSS Reader/1.0",
          Accept:
            "application/rss+xml, application/xml, text/xml",
        },
        customFields: {
          item: ["content:encoded", "description"],
        },
      });

      const parsedFeed = await this.parser.parseURL(url);
      console.log(
        `Feed parsed successfully. Title: ${parsedFeed.title}, Items: ${parsedFeed.items.length}`
      );

      const feed: Partial<Feed> = {
        url,
        title: parsedFeed.title || "Unnamed Feed",
        description: parsedFeed.description,
        lastFetched: new Date(),
      };

      const articles = parsedFeed.items.map((item) => ({
        feedId: "", // Will be filled later
        title: item.title || "Untitled",
        content:
          item.content ||
          item["content:encoded"] ||
          item.contentSnippet ||
          item.description ||
          "",
        link: item.link || "",
        publishedAt: item.pubDate
          ? new Date(item.pubDate)
          : new Date(),
        author: item.creator || item.author,
        isRead: false,
        isFavorite: false,
      }));

      console.log(
        `Processed ${articles.length} articles from feed`
      );
      return { feed, articles };
    } catch (error) {
      console.error("Error parsing RSS feed:", error);
      console.error(`Failed URL: ${url}`);
      throw new Error(
        `Failed to parse RSS feed: ${error.message}`
      );
    }
  }
}
