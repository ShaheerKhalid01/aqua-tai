import mongoose from "mongoose";

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not defined. Add it to your .env.local file.\n" +
      "Example: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/aquatai"
    );
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    }).catch((err) => {
      cached.promise = null; // reset so next call retries
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}