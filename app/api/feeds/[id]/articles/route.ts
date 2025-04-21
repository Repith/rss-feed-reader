import { ArticleService } from "@/src/application/services/ArticleService";
import { MongoArticleRepository } from "@/src/infrastructure/repositories/MongoArticleRepository";
import { NextResponse } from "next/server";

const articleRepository = new MongoArticleRepository();
const articleService = new ArticleService(
  articleRepository
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const articles =
      await articleService.getArticlesByFeedId(id);
    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
