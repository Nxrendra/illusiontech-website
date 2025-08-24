import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import { verifyAdminSession } from '@/lib/auth-utils';
import ServiceModel from '@/lib/models/Service';
import { generateSlug } from '@/lib/slug-utils';

export async function POST(request: Request) {
  try {
    await verifyAdminSession();
    await connectToDB();

    const body = await request.json();

    // Basic validation
    if (!body.name || !body.type) {
      return NextResponse.json({ error: 'Name and type are required.' }, { status: 400 });
    }

    let attempts = 0;
    const MAX_ATTEMPTS = 5;
    const baseSlug = generateSlug(body.name);
    let slug = baseSlug;

    while (attempts < MAX_ATTEMPTS) {
      try {
        const serviceData = { ...body, slug };
        const newService = new ServiceModel(serviceData);
        // The pre-save hook will now only generate the link.
        const savedService = await newService.save();
        return NextResponse.json(savedService, { status: 201 }); // Success!
      } catch (error: any) {
        // Check for MongoDB duplicate key error (code 11000).
        if (error.code === 11000 && error.keyPattern) {
          if (error.keyPattern.slug) {
            // This is the expected race condition on the 'slug'. We can retry.
            attempts++;
            console.log(`Slug collision for "${slug}". Retrying... (Attempt ${attempts})`);
            const randomSuffix = Math.random().toString(36).substring(2, 7);
            slug = `${baseSlug}-${randomSuffix}`;
          } else if (error.keyPattern.id && error.keyValue.id === null) {
            // This is a specific error indicating a lingering, old unique index on a field named 'id'.
            // This is a schema mismatch and cannot be retried.
            throw new Error('Database schema conflict: A unique index on "id" exists but is no longer used. Please drop this index from the "services" collection in MongoDB.');
          } else {
            // It's a different duplicate key error we didn't anticipate.
            throw error;
          }
        } else {
          // It's not a duplicate key error, so we shouldn't retry.
          throw error;
        }
      }
    }

    // If the loop completes, it means we failed to find a unique slug after multiple attempts.
    throw new Error(`Failed to create a unique service name after ${MAX_ATTEMPTS} attempts. Please try a different name.`);
  } catch (error: unknown) {
    console.error('[API_SERVICES_POST]', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';

    if (errorMessage.includes('Authentication') || errorMessage.includes('session')) {
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }

    if (errorMessage.includes('Database schema conflict')) {
      // This is a server configuration issue, so 500 is appropriate.
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    // If the error is our specific duplicate name error, return a 409 Conflict status.
    if (errorMessage.includes('unique service name')) {
      return NextResponse.json({ error: errorMessage }, { status: 409 });
    }

    return NextResponse.json({ error: 'Failed to create service.' }, { status: 500 });
  }
}