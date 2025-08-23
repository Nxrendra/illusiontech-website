import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose'; // Corrected from dbConnect for consistency
import NewsletterSubscriber from '@/lib/models/NewsletterSubscriber';
import mongoose from 'mongoose';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid subscriber ID.' }, { status: 400 });
    }

    const deletedSubscriber = await NewsletterSubscriber.findByIdAndDelete(id);

    if (!deletedSubscriber) {
      return NextResponse.json({ error: 'Subscriber not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Subscriber removed successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error removing subscriber:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
