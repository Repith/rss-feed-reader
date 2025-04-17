import { NextResponse } from 'next/server';
import { ArticleService } from '@/application/services/ArticleService';
import { MongoArticleRepository } from '@/infrastructure/repositories/MongoArticleRepository';

const articleRepository = new MongoArticleRepository();
const articleService = new ArticleService(articleRepository);

export async function POST(request: Request) {
  try {
    const { id, isFavorite } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }
    
    const article = await articleService.markAsFavorite(id, isFavorite);
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    
    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const articles = await articleService.getFavoriteArticles();
    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch favorite articles' }, { status: 500 });
  }
}