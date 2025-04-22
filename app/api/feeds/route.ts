import { FeedService } from "@/src/application/services/FeedService";
import { MongoArticleRepository } from "@/src/infrastructure/repositories/MongoArticleRepository";
import { MongoFeedRepository } from "@/src/infrastructure/repositories/MongoFeedRepository";
import { RssParserService } from "@/src/infrastructure/services/RssParserService";
import { NextResponse } from "next/server";

const feedRepository = new MongoFeedRepository();
const articleRepository = new MongoArticleRepository();
const rssParserService = new RssParserService();
const feedService = new FeedService(
  feedRepository,
  articleRepository,
  rssParserService
);

export async function GET() {
  try {
    const feeds = await feedService.getAllFeeds();
    return NextResponse.json(feeds);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch feeds, error: ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    try {
      const feed = await feedService.addFeed(url);
      return NextResponse.json(feed, { status: 201 });
    } catch (feedError) {
      return NextResponse.json(
        { error: (feedError as Error)?.message || "Failed to add feed" },
        { status: 422 }
      );
    }
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Server error processing request" },
      { status: 500 }
    );
  }
}
