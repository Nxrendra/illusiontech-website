import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { isAdminSession } from '@/lib/auth';

export async function POST(request: Request): Promise<NextResponse> {
  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch (e) {
    console.error('Failed to parse request body');
    return new NextResponse('Invalid request body', { status: 400 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('Missing BLOB_READ_WRITE_TOKEN environment variable');
    return new NextResponse('Server configuration error.', { status: 500 });
  }

  // Vercel Blob's client helper requires a NextRequest-like object.
  // We can pass the original request directly.
  if (!(await isAdminSession(request as any))) {
    console.error('Unauthorized access attempt to upload-blob');
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname: string) => {
        // This is where we can add additional security checks.
        // For example, only allow uploads to a specific user's folder.
        console.log('Generating token for upload:', pathname);
        return {
          maximumSizeInBytes: 50 * 1024 * 1024, // Limit to 50MB
          allowedContentTypes: ['video/mp4', 'video/webm'],
          tokenPayload: JSON.stringify({
            // Optional payload to be passed to onUploadCompleted
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Blob upload completed', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Detailed Blob Upload Error:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return new NextResponse(`Failed to upload file: ${errorMessage}`, { status: 500 });
  }
}