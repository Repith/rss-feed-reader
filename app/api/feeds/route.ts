import { NextResponse } from 'next/server';
import { FeedService } from '@/application/services/FeedService';
import { MongoFeedRepository } from '@/infrastructure/repositories/MongoFeedRepository';
import { MongoArticleRepository } from '@/infrastructure/repositories/MongoArticleRepository';
import { RssParserService } from '@/infrastructure/services/RssParserService';

const feedRepository = new MongoFeedRepository();
const articleRepository = new MongoArticleRepository();
const rssParserService = new RssParserService();
const feedService = new FeedService(feedRepository, articleRepository, rssParserService);

export async function GET() {
  try {
    const feeds = await feedService.getAllFeeds();
    return NextResponse.json(feeds);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch feeds' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }
    
    const feed = await feedService.addFeed(url);
    return NextResponse.json(feed, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add feed' }, { status: 500 });
  }
}