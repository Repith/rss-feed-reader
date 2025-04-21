import { MongoClient, Db, ObjectId } from "mongodb";
import { connectToDatabase } from "../database/mongodb";
import { hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

export interface User {
  id: string;
  email: string;
  password: string;
  name?: string;
  createdAt: Date;
}

export class AuthService {
  private collectionName = "users";

  async registerUser(
    email: string,
    password: string,
    name?: string
  ): Promise<Omit<User, "password">> {
    const { db } = await connectToDatabase();

    // Check if user already exists
    const existingUser = await db
      .collection(this.collectionName)
      .findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const result = await db
      .collection(this.collectionName)
      .insertOne({
        email,
        password: hashedPassword,
        name,
        createdAt: new Date(),
      });

    const user = {
      id: result.insertedId.toString(),
      email,
      name,
      createdAt: new Date(),
    };

    return user;
  }

  async loginUser(
    email: string,
    password: string
  ): Promise<{
    token: string;
    user: Omit<User, "password">;
  }> {
    const { db } = await connectToDatabase();

    // Find user
    const user = await db
      .collection(this.collectionName)
      .findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Verify password
    const isValid = await compare(password, user.password);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT
    const token = sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET || "supersecret",
      { expiresIn: "7d" }
    );

    return {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    };
  }

  async getUserFromToken(
    token: string
  ): Promise<Omit<User, "password"> | null> {
    try {
      const decoded = verify(
        token,
        process.env.JWT_SECRET || "supersecret"
      ) as { userId: string };
      const { db } = await connectToDatabase();

      const user = await db
        .collection(this.collectionName)
        .findOne({ _id: new ObjectId(decoded.userId) });
      if (!user) return null;

      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      };
    } catch (error) {
      return null;
    }
  }
}
