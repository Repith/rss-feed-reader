import { ArticleService } from '@/src/application/services/ArticleService';
import { MongoArticleRepository } from '@/src/infrastructure/repositories/MongoArticleRepository';
import { NextResponse } from 'next/server';

const articleRepository = new MongoArticleRepository();
const articleService = new ArticleService(articleRepository);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    
    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }
    
    const articles = await articleService.getArticleById(query);
    return NextResponse.json(articles);
  } catch (err) {
    console.error('Failed to search articles:', err);
    return NextResponse.json({ error: 'Failed to search articles' }, { status: 500 });
  }
}