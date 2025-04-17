import { NextResponse } from 'next/server';
import { ArticleService } from '@/application/services/ArticleService';
import { MongoArticleRepository } from '@/infrastructure/repositories/MongoArticleRepository';

const articleRepository = new MongoArticleRepository();
const articleService = new ArticleService(articleRepository);

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const articles = await articleService.getArticlesByFeedId(params.id);
    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}