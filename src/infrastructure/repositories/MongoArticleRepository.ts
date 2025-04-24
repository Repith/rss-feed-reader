import { ObjectId } from "mongodb";
import { connectToDatabase } from "../database/mongodb";
import { Article } from "@/src/domain/models/Article";
import { ArticleRepository } from "@/src/domain/repositories/ArticleRepository";

interface MongoArticle extends Omit<Article, "id"> {
  _id: ObjectId;
}

export class MongoArticleRepository implements ArticleRepository {
  private collectionName = "articles";

  async findByFeedId(feedId: string, userId: string): Promise<Article[]> {
    const { db } = await connectToDatabase();
    const articles = await db
      .collection<MongoArticle>(this.collectionName)
      .find({ feedId, userId })
      .sort({ publishedAt: -1 })
      .toArray();

    return articles.map((article) => ({
      ...article,
      id: article._id.toString(),
      _id: undefined,
    })) as unknown as Article[];
  }

  async findById(id: string): Promise<Article | null> {
    const { db } = await connectToDatabase();
    const article = await db
      .collection<MongoArticle>(this.collectionName)
      .findOne({ _id: new ObjectId(id) });

    if (!article) return null;

    return {
      ...article,
      id: article._id.toString(),
      _id: undefined,
    } as unknown as Article;
  }

  async findFavorites(options?: {
    limit?: number;
    offset?: number;
    unreadOnly?: boolean;
    userId: string;
  }): Promise<Article[]> {
    const { db } = await connectToDatabase();
    
    const filter: any = { 
      isFavorite: true,
      userId: options?.userId 
    };
    
    if (options?.unreadOnly) {
      filter.isRead = false;
    }
    
    let query = db
      .collection<MongoArticle>(this.collectionName)
      .find(filter)
      .sort({ publishedAt: -1 });

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.skip(options.offset);
    }

    const articles = await query.toArray();

    return articles.map((article) => ({
      ...article,
      id: article._id.toString(),
      _id: undefined,
    })) as unknown as Article[];
  }

  async saveArticle(article: Omit<Article, "id" | "createdAt">): Promise<Article> {
    const { db } = await connectToDatabase();
    const now = new Date();

    const result = await db
      .collection(this.collectionName)
      .insertOne({
        ...article,
        createdAt: now,
      });

    return {
      ...article,
      id: result.insertedId.toString(),
      createdAt: now,
    } as Article;
  }

  async updateArticle(id: string, article: Partial<Article>): Promise<Article | null> {
    const { db } = await connectToDatabase();

    const result = await db
      .collection(this.collectionName)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: article },
        { returnDocument: "after" }
      );

    if (!result) return null;

    return {
      ...result,
      id: result._id.toString(),
      _id: undefined,
    } as unknown as Article;
  }

  async deleteByFeedId(feedId: string): Promise<boolean> {
    const { db } = await connectToDatabase();
    const result = await db
      .collection(this.collectionName)
      .deleteMany({ feedId });
    return result.deletedCount > 0;
  }
}
