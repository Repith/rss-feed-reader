import { FeedService } from "@/src/application/services/FeedService";
import { MongoArticleRepository } from "@/src/infrastructure/repositories/MongoArticleRepository";
import { MongoFeedRepository } from "@/src/infrastructure/repositories/MongoFeedRepository";
import { RssParserService } from "@/src/infrastructure/services/RssParserService";
import { decodeJwtWithoutVerify } from "@/src/lib/token";
import { NextRequest, NextResponse } from "next/server";

const feedRepository = new MongoFeedRepository();
const articleRepository = new MongoArticleRepository();
const rssParserService = new RssParserService();
const feedService = new FeedService(
  feedRepository,
  articleRepository,
  rssParserService
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
    const feed = await feedService.getFeedById(id, userId);
    if (!feed) {
      return NextResponse.json(
        { error: "Feed not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(feed);
  } catch (err) {
    console.error('Failed to fetch feed:', err);
    return NextResponse.json(
      { error: "Failed to fetch feed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    await feedService.deleteFeed(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to delete feed:', err);
    return NextResponse.json(
      { error: "Failed to delete feed" },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    const feed = await feedService.refreshFeed(params.id, userId);
    if (!feed) {
      return NextResponse.json(
        { error: "Feed not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(feed);
  } catch (err) {
    console.error('Failed to refresh feed:', err);
    return NextResponse.json(
      { error: "Failed to refresh feed" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    const { url, category } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }
    
    const feed = await feedService.updateFeed(id, { url, category });
    
    if (!feed) {
      return NextResponse.json(
        { error: "Feed not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(feed);
  } catch (err) {
    console.error('Failed to update feed:', err);
    return NextResponse.json(
      { error: "Failed to update feed" },
      { status: 500 }
    );
  }
}
