import mongoose from 'mongoose';

const MONGO_URI = process.env.DB_KEY!;

if (!MONGO_URI) throw new Error("Please define DB_KEY in .env.local");

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  console.log('✅ Connected to MongoDB');
  return cached.conn;
}
