import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import { verifyAdminSession } from '@/lib/auth-utils';
import ServiceModel from '@/lib/models/Service';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await verifyAdminSession();
    await connectToDB();

    const { id } = params;
    const body = await request.json();

    // The slug should be immutable. Prevent it from being updated.
    if (body.slug) {
      console.warn(`Attempted to update immutable field 'slug' for service ${id}. Ignoring.`);
      delete body.slug;
    }

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required.' }, { status: 400 });
    }

    const service = await ServiceModel.findById(id);

    if (!service) {
      return NextResponse.json({ error: 'Service not found.' }, { status: 404 });
    }

    // Update fields from the request body
    Object.assign(service, body);

    // The pre-save hook in the model will handle regenerating the link if the type changes. The slug is immutable.
    const updatedService = await service.save();

    return NextResponse.json(updatedService);
  } catch (error: unknown) {
    console.error(`[API_SERVICES_PUT] (ID: ${params.id})`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';

    if (errorMessage.includes('Authentication') || errorMessage.includes('session')) {
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }

    return NextResponse.json({ error: 'Failed to update service.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await verifyAdminSession();
    await connectToDB();

    const { id } = params;

    const deletedService = await ServiceModel.findByIdAndDelete(id);

    if (!deletedService) {
      return NextResponse.json({ error: 'Service not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Service deleted successfully.' });
  } catch (error: unknown) {
    console.error(`[API_SERVICES_DELETE] (ID: ${params.id})`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';

    if (errorMessage.includes('Authentication') || errorMessage.includes('session')) {
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }

    return NextResponse.json({ error: 'Failed to delete service.' }, { status: 500 });
  }
}