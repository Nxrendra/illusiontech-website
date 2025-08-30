'use server';

import { revalidatePath } from 'next/cache';
import { connectToDB } from '@/lib/mongoose';
import PriceBreakdown, { IPriceBreakdown, IPriceBreakdownData } from '@/lib/models/PriceBreakdown';
import { verifyAdminSession } from '../auth-utils';

// The form sends serviceId as a string, so we define the input type accordingly.
type BreakdownInput = Omit<IPriceBreakdownData, 'slug' | 'serviceId'> & { serviceId: string };

export async function createPriceBreakdown(data: BreakdownInput) {
  await verifyAdminSession();
  try {
    await connectToDB();
    const newBreakdown = await PriceBreakdown.create(data);
    revalidatePath('/admin/dashboard/price-breakdowns');
    revalidatePath(`/documents/${newBreakdown.slug}`);
    return { success: true, data: JSON.parse(JSON.stringify(newBreakdown)) as IPriceBreakdownData & { _id: string } };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: errorMessage };
  }
}

export async function getPriceBreakdowns() {
  try {
    await connectToDB();
    const breakdowns = await PriceBreakdown.find({}).sort({ title: 1 }).populate('serviceId', 'name').lean();
    // This type matches the `SerializedBreakdown` type used in the client components,
    // ensuring that we are returning plain objects, not Mongoose documents.
    type SerializedBreakdownWithService = Omit<IPriceBreakdownData, 'serviceId'> & { _id: string; serviceId: { _id: string; name: string } };

    return JSON.parse(JSON.stringify(breakdowns)) as SerializedBreakdownWithService[];
  } catch (error) {
    console.error('Error fetching price breakdowns:', error);
    return [];
  }
}

export async function getPriceBreakdownBySlug(slug: string) {
  try {
    await connectToDB();
    const breakdown = await PriceBreakdown.findOne({ slug }).lean().exec();
    if (!breakdown) return null;
    // The data is serialized, so it's a plain object, not a Mongoose document.
    // We cast to a type that reflects this to ensure type safety on the client.
    return JSON.parse(JSON.stringify(breakdown)) as IPriceBreakdownData & { _id: string };
  } catch (error) {
    console.error(`Error fetching breakdown by slug ${slug}:`, error);
    return null;
  }
}

export async function updatePriceBreakdown(id: string, data: Partial<BreakdownInput>) {
  await verifyAdminSession();
  try {
    await connectToDB();
    const updatedBreakdown = await PriceBreakdown.findByIdAndUpdate(id, data, { new: true });
    if (!updatedBreakdown) return { success: false, error: 'Breakdown not found.' };
    revalidatePath('/admin/dashboard/price-breakdowns');
    revalidatePath(`/documents/${updatedBreakdown.slug}`);
    return { success: true, data: JSON.parse(JSON.stringify(updatedBreakdown)) as IPriceBreakdownData & { _id: string } };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: errorMessage };
  }
}

export async function deletePriceBreakdown(id: string) {
  await verifyAdminSession();
  try {
    await connectToDB();
    const deletedBreakdown = await PriceBreakdown.findByIdAndDelete(id);
    if (!deletedBreakdown) return { success: false, error: 'Breakdown not found.' };
    revalidatePath('/admin/dashboard/price-breakdowns');
    return { success: true, message: 'Breakdown deleted successfully.' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: errorMessage };
  }
}
