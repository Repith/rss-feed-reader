import { ArticleService } from "@/src/application/services/ArticleService";
import { MongoArticleRepository } from "@/src/infrastructure/repositories/MongoArticleRepository";
import { NextRequest, NextResponse } from "next/server";
import { FeedService } from "@/src/application/services/FeedService";
import { MongoFeedRepository } from "@/src/infrastructure/repositories/MongoFeedRepository";
import { RssParserService } from "@/src/infrastructure/services/RssParserService";
import { decodeJwtWithoutVerify } from "@/src/lib/token";

const articleRepository = new MongoArticleRepository();
const articleService = new ArticleService(articleRepository);
const feedRepository = new MongoFeedRepository();
const feedService = new FeedService(
  feedRepository,
  articleRepository,
  new RssParserService()
);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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
    const params = await context.params;
    const { id } = params;
    
    // First verify the feed belongs to this user
    const feed = await feedService.getFeedById(id, userId);
    if (!feed) {
      return NextResponse.json(
        { error: "Feed not found" },
        { status: 404 }
      );
    }
    
    const articles = await articleService.getArticlesByFeedId(id, userId);
    return NextResponse.json(articles);
  } catch (err) {
    console.error('Failed to fetch articles:', err);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
