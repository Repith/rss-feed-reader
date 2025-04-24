import { ArticleService } from "@/src/application/services/ArticleService";
import { MongoArticleRepository } from "@/src/infrastructure/repositories/MongoArticleRepository";
import { decodeJwtWithoutVerify } from "@/src/lib/token";
import { NextRequest, NextResponse } from "next/server";

const articleRepository = new MongoArticleRepository();
const articleService = new ArticleService(articleRepository);

export async function GET(request: NextRequest) {
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
    const searchParams = request.nextUrl.searchParams;
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    
    const articles = await articleService.getFavoriteArticles(userId, { unreadOnly });
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching favorite articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorite articles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id, isFavorite } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }
    
    const article = await articleService.markAsFavorite(id, isFavorite);
    
    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(article);
  } catch (error) {
    console.error("Error marking article as favorite:", error);
    return NextResponse.json(
      { error: "Failed to mark article as favorite" },
      { status: 500 }
    );
  }
}


