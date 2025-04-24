import { ArticleService } from '@/src/application/services/ArticleService';
import { MongoArticleRepository } from '@/src/infrastructure/repositories/MongoArticleRepository';
import { NextResponse } from 'next/server';

const articleRepository = new MongoArticleRepository();
const articleService = new ArticleService(articleRepository);

export async function POST(request: Request) {
  try {
    const { id, isRead } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }
    
    const article = await articleService.markAsRead(id, isRead);
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    
    return NextResponse.json(article);
  } catch (err) {
    console.error('Failed to update article:', err);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}