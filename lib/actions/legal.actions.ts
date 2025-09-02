'use server';

import { revalidatePath } from 'next/cache';
import { connectToDB } from '@/lib/mongoose';
import LegalDocument, { ILegalDocumentData } from '@/lib/models/LegalDocument';

const generateSlug = (title: string) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .replace(/&/g, '-and-')          // Replace & with 'and'
    .replace(/[^a-z0-9\s-]/g, '')   // Remove invalid chars
    .replace(/\s+/g, '-')           // Collapse whitespace and replace by -
    .replace(/-+/g, '-');           // Collapse dashes
};

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

    const slug = generateSlug(data.title);
    if (!slug) {
      return { error: 'Title cannot be empty and is required to create a document.' };
    }

    const payload = { ...data, slug };

    let document;
    if (id) {
      document = await LegalDocument.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    } else {
      document = await LegalDocument.create(payload);
    }
    if (!document) throw new Error('Document not found or failed to create.');

    revalidatePath('/admin/dashboard/legal');
    revalidatePath(`/legal/${document.slug}`);
    return { document: JSON.parse(JSON.stringify(document)) };
  } catch (error) {
    let errorMessage = 'Database Error';
    if (error instanceof Error) {
      // Check for Mongoose duplicate key error (code 11000)
      if ((error as any).code === 11000) {
        errorMessage = 'A legal document with this title already exists. Please use a unique title.';
      } else {
        errorMessage = error.message;
      }
    }
    return { error: errorMessage };
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