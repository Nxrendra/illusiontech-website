import { connectToDB } from '@/lib/mongoose';
import PageContent, { IPageContentData } from '@/lib/models/PageContent';

/**
 * Fetches the single PageContent document from the database.
 * This is a centralized function to be used across different pages.
 */
export async function getPageContent(): Promise<IPageContentData & { updatedAt?: string }> {
  try {
    await connectToDB();
    const content = await PageContent.findOne({}).lean();
    return content ? JSON.parse(JSON.stringify(content)) : {};
  } catch (error) {
    console.error('Failed to fetch page content:', error);
    return {};
  }
}