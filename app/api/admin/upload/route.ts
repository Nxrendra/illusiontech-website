import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { isAdminSession } from '@/lib/auth';
import { existsSync } from 'fs';

export async function POST(req: NextRequest) {
  if (!await isAdminSession(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
  }

  // Sanitize filename to prevent directory traversal attacks
  const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, '');
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // The path will be relative to the project root, in the public directory
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  const path = join(uploadDir, filename);

  try {
    // Ensure the upload directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    await writeFile(path, buffer);

    // Return the public URL
    return NextResponse.json({ success: true, url: `/uploads/${filename}` });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Failed to save file.' }, { status: 500 });
  }
}
