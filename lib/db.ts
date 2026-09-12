// lib/db.ts — MongoDB connection singleton for Next.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

// Cached connection across hot-reloads in development
let cached = (global as any).__mongoose;
if (!cached) {
  cached = (global as any).__mongoose = { conn: null, promise: null };
}

export async function connectDB(): Promise<mongoose.Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        maxPoolSize: 10,
      })
      .then((m) => m.connection);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// For use with @auth/mongodb-adapter — returns the native MongoClient
let clientPromise: Promise<import('mongodb').MongoClient>;

export function getMongoClient(): Promise<import('mongodb').MongoClient> {
  if (!clientPromise) {
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(MONGODB_URI);
    clientPromise = client.connect();
  }
  return clientPromise;
}
