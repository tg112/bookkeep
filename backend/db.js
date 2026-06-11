import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "bookkeep";

let db;

export async function connectDB() {
  const client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  console.log("Connected to MongoDB");
}

export function getDB() {
  if (!db) throw new Error("Database not initialized. Call connectDB first.");
  return db;
}
