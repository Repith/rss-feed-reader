import { ObjectId } from "mongodb";
import { Article } from "@/src/domain/models/Article";
import { ArticleRepository } from "@/src/domain/repositories/ArticleRepository";
import { connectToDatabase } from "../database/mongodb";

interface MongoArticle extends Omit<Article, "id"> {
  _id: ObjectId;
}

export class MongoArticleRepository
  implements ArticleRepository
{
  private collectionName = "articles";

  async findAll(options?: {
    limit?: number;
    offset?: number;
  }): Promise<Article[]> {
    const { db } = await connectToDatabase();
    let query = db
      .collection<MongoArticle>(this.collectionName)
      .find()
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
    })) as Article[];
  }

  async findByFeedId(feedId: string): Promise<Article[]> {
    const { db } = await connectToDatabase();
    const articles = await db
      .collection(this.collectionName)
      .find({ feedId })
      .sort({ publishedAt: -1 })
      .toArray();

    return articles.map((article) => ({
      ...article,
      id: article._id.toString(),
      _id: undefined,
    })) as Article[];
  }

  async search(query: string): Promise<Article[]> {
    const { db } = await connectToDatabase();
    const articles = await db
      .collection(this.collectionName)
      .find({ title: { $regex: query, $options: "i" } })
      .sort({ publishedAt: -1 })
      .toArray();

    return articles.map((article) => ({
      ...article,
      id: article._id.toString(),
      _id: undefined,
    })) as Article[];
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
    } as Article;
  }

  async findUnread(options?: {
    limit?: number;
    offset?: number;
  }): Promise<Article[]> {
    const { db } = await connectToDatabase();
    let query = db
      .collection<MongoArticle>(this.collectionName)
      .find({ isRead: false })
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
    })) as Article[];
  }

  async findFavorites(options?: {
    limit?: number;
    offset?: number;
  }): Promise<Article[]> {
    const { db } = await connectToDatabase();
    let query = db
      .collection<MongoArticle>(this.collectionName)
      .find({ isFavorite: true })
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
    })) as Article[];
  }

  async create(article: Omit<Article, 'id' | 'createdAt'>): Promise<Article> {
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

  async saveArticle(article: Omit<Article, 'id' | 'createdAt'>): Promise<Article> {
    return this.create(article);
  }

  async markAsRead(id: string, isRead: boolean): Promise<Article | null> {
    const { db } = await connectToDatabase();
    
    const result = await db
      .collection(this.collectionName)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { isRead } },
        { returnDocument: "after" }
      );

    if (!result) return null;

    return {
      ...result,
      id: result._id.toString(),
      _id: undefined,
    } as Article;
  }

  async markAsFavorite(id: string, isFavorite: boolean): Promise<Article | null> {
    const { db } = await connectToDatabase();
    
    const result = await db
      .collection(this.collectionName)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { isFavorite } },
        { returnDocument: "after" }
      );

    if (!result) return null;

    return {
      ...result,
      id: result._id.toString(),
      _id: undefined,
    } as Article;
  }

  async markAllAsRead(feedId?: string): Promise<void> {
    const { db } = await connectToDatabase();
    
    const filter = feedId ? { feedId } : {};
    
    await db
      .collection(this.collectionName)
      .updateMany(filter, { $set: { isRead: true } });
  }

  async getCount(filter?: { feedId?: string; unreadOnly?: boolean }): Promise<number> {
    const { db } = await connectToDatabase();
    
    const queryFilter: any = {};
    
    if (filter?.feedId) {
      queryFilter.feedId = filter.feedId;
    }
    
    if (filter?.unreadOnly) {
      queryFilter.isRead = false;
    }
    
    return db
      .collection(this.collectionName)
      .countDocuments(queryFilter);
  }
}
