import { ArticleService } from "@/src/application/services/ArticleService";
import { MongoArticleRepository } from "@/src/infrastructure/repositories/MongoArticleRepository";
import { NextRequest, NextResponse } from "next/server";

const articleRepository = new MongoArticleRepository();
const articleService = new ArticleService(articleRepository);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    const articles = await articleService.getArticlesByFeedId(id);
    return NextResponse.json(articles);
  } catch (err) {
    console.error('Failed to fetch articles:', err);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
