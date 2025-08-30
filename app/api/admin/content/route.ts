import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import { verifyAdminSession } from '@/lib/auth-utils';
import PageContent, { IPageContentData } from '@/lib/models/PageContent';

// GET handler to fetch the page content for the admin form
export async function GET() {
  try {
    await verifyAdminSession();
    await connectToDB();
    // Find the single document, or return an empty object if it doesn't exist
    const content = await PageContent.findOne({});
    return NextResponse.json(content || {});
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST handler to update (or create) the page content
export async function POST(request: Request) {
  try {
    await verifyAdminSession();
    await connectToDB();

    const body: IPageContentData = await request.json();

    // Use findOneAndUpdate with upsert to create the document if it doesn't exist, or update it if it does.
    const updatedContent = await PageContent.findOneAndUpdate(
      {}, // An empty filter will match the single document
      { $set: body },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(updatedContent);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}