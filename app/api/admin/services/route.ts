import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import { verifyAdminSession } from '@/lib/auth-utils';
import ServiceModel from '@/lib/models/Service';

export async function POST(request: Request) {
  try {
    await verifyAdminSession();
    await connectToDB();

    const body = await request.json();

    // Basic validation
    if (!body.name || !body.type) {
      return NextResponse.json({ error: 'Name and type are required.' }, { status: 400 });
    }

    const newService = new ServiceModel(body);
    const savedService = await newService.save();

    return NextResponse.json(savedService, { status: 201 });
  } catch (error) {
    console.error('[API_SERVICES_POST]', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';

    if (errorMessage.includes('Authentication') || errorMessage.includes('session')) {
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }

    return NextResponse.json({ error: 'Failed to create service.' }, { status: 500 });
  }
}