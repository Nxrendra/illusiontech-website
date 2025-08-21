import mongoose, { Mongoose } from 'mongoose';

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

let cached: MongooseCache = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDB() {
  // TEMPORARY DEBUGGING: Hardcode the URI to bypass environment variable issues.
  // REMOVE THIS LINE BEFORE DEPLOYING TO PRODUCTION!
  const MONGODB_URI = "mongodb+srv://Narendra:Narendraa11%24@illusion-tech.ffagxqj.mongodb.net/?retryWrites=true&w=majority&appName=Illusion-Tech";
  // const MONGODB_URI = process.env.MONGODB_URI; // Keep this line commented out for now

  // Log the URI to debug the connection issue. This will show in your Vercel function logs.
  console.log(`Attempting to connect with MONGODB_URI: "${MONGODB_URI}"`);

  if (!MONGODB_URI || MONGODB_URI.trim() === '') {
    throw new Error(
      'The MONGODB_URI environment variable is not defined or is empty. Please set it in your hosting provider\'s environment settings.'
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}