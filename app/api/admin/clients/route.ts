import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import Client from '@/lib/models/Client';
import { verifyAdminSession } from '@/lib/auth-utils';
import { z } from 'zod';

const clientSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Invalid email address.'),
  servicePlan: z.string().min(1, 'Service plan is required.'),
  status: z.string().min(1, 'Status is required.'),
});

export async function POST(request: NextRequest) {
  try {
    await verifyAdminSession();
    await connectToDB();

    const body = await request.json();
    const validation = clientSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 });
    }

    const { name, email, servicePlan, status } = validation.data;

    const newClient = await Client.create({
      name,
      email,
      servicePlan,
      status,
      joinedDate: new Date(),
    });

    return NextResponse.json(JSON.parse(JSON.stringify(newClient)), { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

