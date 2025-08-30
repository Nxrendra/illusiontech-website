import { verifyAdminSession } from '@/lib/auth-utils';
import { connectToDB } from '@/lib/mongoose';
import PageContent, { IPageContentData } from '@/lib/models/PageContent';
import PageContentManager from '@/components/admin/PageContentManager';
import React from 'react';

async function getContentData(): Promise<{ content?: IPageContentData; error?: string }> {
  try {
    await verifyAdminSession();
    await connectToDB();
    const contentData = await PageContent.findOne({}).lean();
    const content = JSON.parse(JSON.stringify(contentData || {}));
    return { content };
  } catch (error) {
    console.error("Failed to fetch page content:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { error: errorMessage };
  }
}

export default async function ContentPage() {
  const { content, error } = await getContentData();

  if (error) {
    return (
      <div className="bg-destructive/10 border-l-4 border-destructive text-destructive-foreground p-4" role="alert">
        <p className="font-bold">Access Denied</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Manage Page Content</h1>
      <PageContentManager initialContent={content || {}} />
    </div>
  );
}