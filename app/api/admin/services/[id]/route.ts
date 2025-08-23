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

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required.' }, { status: 400 });
    }

    const updatedService = await ServiceModel.findByIdAndUpdate(id, body, { new: true, runValidators: true }).lean();

    if (!updatedService) {
      return NextResponse.json({ error: 'Service not found.' }, { status: 404 });
    }

    return NextResponse.json(updatedService);
  } catch (error) {
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
  } catch (error) {
    console.error(`[API_SERVICES_DELETE] (ID: ${params.id})`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';

    if (errorMessage.includes('Authentication') || errorMessage.includes('session')) {
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }

    return NextResponse.json({ error: 'Failed to delete service.' }, { status: 500 });
  }
}