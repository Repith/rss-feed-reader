import { NextResponse } from 'next/server';
import { FeedService } from '@/application/services/FeedService';
import { MongoFeedRepository } from '@/infrastructure/repositories/MongoFeedRepository';
import { MongoArticleRepository } from '@/infrastructure/repositories/MongoArticleRepository';
import { RssParserService } from '@/infrastructure/services/RssParserService';

const feedRepository = new MongoFeedRepository();
const articleRepository = new MongoArticleRepository();
const rssParserService = new RssParserService();
const feedService = new FeedService(feedRepository, articleRepository, rssParserService);

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const feed = await feedService.getFeedById(params.id);
    if (!feed) {
      return NextResponse.json({ error: 'Feed not found' }, { status: 404 });
    }
    return NextResponse.json(feed);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const success = await feedService.deleteFeed(params.id);
    if (!success) {
      return NextResponse.json({ error: 'Feed not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete feed' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const feed = await feedService.refreshFeed(params.id);
    if (!feed) {
      return NextResponse.json({ error: 'Feed not found' }, { status: 404 });
    }
    return NextResponse.json(feed);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to refresh feed' }, { status: 500 });
  }
}