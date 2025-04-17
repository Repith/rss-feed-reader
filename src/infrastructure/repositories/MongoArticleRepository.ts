import { ObjectId } from 'mongodb';
import { Article } from '@/domain/models/Article';
import { ArticleRepository } from '@/domain/repositories/ArticleRepository';
import { connectToDatabase } from '../database/mongodb';

export class MongoArticleRepository implements ArticleRepository {
  private collectionName = 'articles';

  async findAll(options?: { limit?: number; offset?: number }): Promise<Article[]> {
    const { db } = await connectToDatabase();
    let query = db.collection(this.collectionName).find().sort({ publishedAt: -1 });
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.offset) {
      query = query.skip(options.offset);
    }
    
    const articles = await query.toArray();
    
    return articles.map(article => ({
      ...article,
      id: article._id.toString(),
      _id: undefined
    })) as Article[];
  }

  // Other methods implementation...
  
  async findById(id: string): Promise<Article | null> {
    const { db } = await connectToDatabase();
    const article = await db.collection(this.collectionName).findOne({ _id: new ObjectId(id) });
    
    if (!article) return null;
    
    return {
      ...article,
      id: article._id.toString(),
      _id: undefined
    } as Article;
  }

  async findByFeedId(feedId: string): Promise<Article[]> {
    const { db } = await connectToDatabase();
    const articles = await db.collection(this.collectionName)
      .find({ feedId })
      .sort({ publishedAt: -1 })
      .toArray();
    
    return articles.map(article => ({
      ...article,
      id: article._id.toString(),
      _id: undefined
    })) as Article[];
  }

  async search(query: string): Promise<Article[]> {
    const { db } = await connectToDatabase();
    const articles = await db.collection(this.collectionName)
      .find({ title: { $regex: query, $options: 'i' } })
      .sort({ publishedAt: -1 })
      .toArray();
    
    return articles.map(article => ({
      ...article,
      id: article._id.toString(),
      _id: undefined
    })) as Article[];
  }
}