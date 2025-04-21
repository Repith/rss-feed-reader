import { ObjectId } from "mongodb";
import { connectToDatabase } from "../database/mongodb";
import { Feed } from "@/src/domain/models/Feed";
import { FeedRepository } from "@/src/domain/repositories/FeedRepository";

interface MongoFeed extends Omit<Feed, "id"> {
  _id: ObjectId;
}

export class MongoFeedRepository implements FeedRepository {
  private collectionName = "feeds";

  async findAll(): Promise<Feed[]> {
    const { db } = await connectToDatabase();
    const feeds = await db
      .collection<MongoFeed>(this.collectionName)
      .find()
      .toArray();

    return feeds.map((feed) => ({
      ...feed,
      id: feed._id.toString(),
      _id: undefined,
    })) as Feed[];
  }

  async findById(id: string): Promise<Feed | null> {
    const { db } = await connectToDatabase();
    const feed = await db
      .collection<MongoFeed>(this.collectionName)
      .findOne({ _id: new ObjectId(id) });

    if (!feed) return null;

    return {
      ...feed,
      id: feed._id.toString(),
      _id: undefined,
    } as Feed;
  }

  async create(
    feed: Omit<Feed, "id" | "createdAt" | "updatedAt">
  ): Promise<Feed> {
    const { db } = await connectToDatabase();
    const now = new Date();

    const result = await db
      .collection(this.collectionName)
      .insertOne({
        ...feed,
        createdAt: now,
        updatedAt: now,
      });

    return {
      ...feed,
      id: result.insertedId.toString(),
      createdAt: now,
      updatedAt: now,
    } as Feed;
  }

  async update(
    id: string,
    feed: Partial<Feed>
  ): Promise<Feed | null> {
    const { db } = await connectToDatabase();
    const now = new Date();

    const result = await db
      .collection(this.collectionName)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...feed, updatedAt: now } },
        { returnDocument: "after" }
      );

    if (!result) return null;

    return {
      ...result,
      id: result._id.toString(),
      _id: undefined,
    } as Feed;
  }

  async delete(id: string): Promise<boolean> {
    const { db } = await connectToDatabase();
    const result = await db
      .collection(this.collectionName)
      .deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }
}
