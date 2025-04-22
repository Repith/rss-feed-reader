import { MongoClient, Db, ServerApiVersion } from "mongodb";

const uri =
  process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.MONGODB_DB_NAME || "rss-reader";

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{
  client: MongoClient;
  db: Db;
}> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const client = await MongoClient.connect(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    const db = client.db(dbName);

    await db.command({ ping: 1 });
    
    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error(
      "Failed to connect to MongoDB Atlas:",
      error
    );
    throw error;
  }
}
