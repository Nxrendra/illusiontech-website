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

// We only want to attach these listeners once to avoid memory leaks.
if (!mongoose.connection.listeners('connected').length) {
  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB.');
  });

  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose has been disconnected.');
  });
}

export async function connectToDB() {
  let MONGODB_URI = process.env.MONGODB_URI;

  // Log the URI to debug the connection issue. This will show in your Vercel function logs.
  // Using JSON.stringify makes it very clear if the variable contains extra quotes.
  console.log(`Attempting to connect with MONGODB_URI: ${JSON.stringify(MONGODB_URI)}`);

  // Explicitly log the database name being connected to for easier debugging.
  if (MONGODB_URI) {
    try {
      const url = new URL(MONGODB_URI);
      const dbName = url.pathname.substring(1);
      if (dbName) {
        console.log(`Connecting to database: "${dbName}"`);
      } else {
        console.warn('MONGODB_URI is missing a database name. The driver will default to the "test" database.');
      }
    } catch (e) {
      console.warn('Could not parse MONGODB_URI to determine database name.');
    }
  }

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

  // If we have a cached connection, we're good to go.
  // The index cleanup will be handled below.
  if (!cached.conn) {
    if (!cached.promise) {
      console.log('Creating new database connection promise.');
      cached.promise = mongoose.connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      }).then((mongooseInstance) => {
        console.log('Database connection promise resolved.');
        return mongooseInstance;
      });
    }

    try {
      cached.conn = await cached.promise;
    } catch (e) {
      cached.promise = null; // Reset promise on error
      console.error('Database connection failed:', e);
      throw e;
    }
  }

  // --- One-time Index Cleanup ---
  // This block will run for both new and cached connections, but the logic inside
  // ensures the index check and drop operation only happens once per server instance.
  try {
    if (!(global as any)._legacyIndexDropped) {
      const servicesCollection = mongoose.connection.db.collection('services');
      if (await servicesCollection.indexExists('id_1')) {
        console.log('Found legacy unique index "id_1" on services collection. Attempting to drop it.');
        await servicesCollection.dropIndex('id_1');
        console.log('Successfully dropped legacy index "id_1".');
      }
      (global as any)._legacyIndexDropped = true;
    }
  } catch (indexError) {
    // Log the error but don't block the application.
    console.error('Could not drop legacy index "id_1":', indexError);
  }

  return cached.conn;
}