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
  let MONGODB_URI = process.env.MONGODB_URI;

  // Log the URI to debug the connection issue. This will show in your Vercel function logs.
  // Using JSON.stringify makes it very clear if the variable contains extra quotes.
  console.log(`Attempting to connect with MONGODB_URI: ${JSON.stringify(MONGODB_URI)}`);

  if (!MONGODB_URI || MONGODB_URI.trim() === '') {
    throw new Error(
      'The MONGODB_URI environment variable is not defined or is empty. Please set it in your hosting provider\'s environment settings.'
    );
  }

  // Defensively remove quotes from the start and end of the URI, which some platforms add automatically.
  if (MONGODB_URI.startsWith('"') && MONGODB_URI.endsWith('"')) {
    console.log('Detected and removed surrounding quotes from MONGODB_URI.');
    MONGODB_URI = MONGODB_URI.slice(1, -1);
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