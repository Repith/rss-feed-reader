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
}
