import { Feed } from "../models/Feed";

export interface FeedRepository {
  findAll(userId: string): Promise<Feed[]>;
  findById(id: string, userId: string): Promise<Feed | null>;
  create(feed: Omit<Feed, "id" | "createdAt" | "updatedAt">): Promise<Feed>;
  update(id: string, feed: Partial<Feed>): Promise<Feed | null>;
  delete(id: string): Promise<boolean>;
}
