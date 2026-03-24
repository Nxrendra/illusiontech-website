import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { isAdminSession } from '@/lib/auth';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

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
    console.error('Error uploading blob:', error);
    return new NextResponse('Failed to upload file.', { status: 500 });
  }
}