import { FeedService } from "@/src/application/services/FeedService";
import { MongoArticleRepository } from "@/src/infrastructure/repositories/MongoArticleRepository";
import { MongoFeedRepository } from "@/src/infrastructure/repositories/MongoFeedRepository";
import { RssParserService } from "@/src/infrastructure/services/RssParserService";
import { decodeJwtWithoutVerify } from "@/src/lib/token";
import { NextResponse, NextRequest } from "next/server";

const feedRepository = new MongoFeedRepository();
const articleRepository = new MongoArticleRepository();
const rssParserService = new RssParserService();
const feedService = new FeedService(
  feedRepository,
  articleRepository,
  rssParserService
);

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const decoded = decodeJwtWithoutVerify(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = decoded.userId;
    const feeds = await feedService.getAllFeeds(userId);
    return NextResponse.json(feeds);
  } catch (err) {
    console.error('Failed to fetch feeds:', err);
    return NextResponse.json(
      { error: "Failed to fetch feeds" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const decoded = decodeJwtWithoutVerify(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = decoded.userId;
    const { url, category } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }
    
    const feed = await feedService.addFeed(url, userId, category);
    return NextResponse.json(feed);
  } catch (err) {
    console.error('Failed to add feed:', err);
    return NextResponse.json(
      { error: (err as Error).message || "Failed to add feed" },
      { status: 500 }
    );
  }
}
