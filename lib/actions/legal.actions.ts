'use server';

import { revalidatePath } from 'next/cache';
import { connectToDB } from '@/lib/mongoose';
import LegalDocument, { ILegalDocumentData } from '@/lib/models/LegalDocument';

type LegalDocumentInput = Omit<ILegalDocumentData, 'slug' | 'createdAt' | 'updatedAt'>;

export async function getLegalDocuments(): Promise<(ILegalDocumentData & { _id: string })[]> {
  await connectToDB();
  const documents = await LegalDocument.find({}).sort({ title: 1 }).lean();
  return JSON.parse(JSON.stringify(documents));
}

export async function getLegalDocumentBySlug(slug: string): Promise<(ILegalDocumentData & { _id: string }) | null> {
  await connectToDB();
  const document = await LegalDocument.findOne({ slug }).lean();
  return document ? JSON.parse(JSON.stringify(document)) : null;
}

export async function createOrUpdateLegalDocument(id: string | undefined | null, data: LegalDocumentInput) {
  try {
    await connectToDB();
    let document;
    if (id) {
      document = await LegalDocument.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    } else {
      document = await LegalDocument.create(data);
    }
    if (!document) throw new Error('Document not found or failed to create.');

    revalidatePath('/admin/dashboard/legal');
    revalidatePath(`/legal/${document.slug}`);
    return { document: JSON.parse(JSON.stringify(document)) };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Database Error' };
  }
}

export async function deleteLegalDocument(id: string) {
  try {
    await connectToDB();
    const doc = await LegalDocument.findByIdAndDelete(id);
    if (!doc) throw new Error('Document not found.');
    revalidatePath('/admin/dashboard/legal');
    revalidatePath(`/legal/${doc.slug}`);
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Database Error' };
  }
}