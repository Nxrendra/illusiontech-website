'use server';

import { revalidatePath } from 'next/cache';
import { connectToDB } from '@/lib/mongoose';
import PriceBreakdown, { IPriceBreakdown, IPriceBreakdownData } from '@/lib/models/PriceBreakdown';
import { verifyAdminSession } from '../auth-utils';
import { generateSlug } from '../slug-utils';

// The form sends serviceId as a string, so we define the input type accordingly.
type BreakdownInput = Omit<IPriceBreakdownData, 'slug' | 'serviceId'> & { serviceId: string };

export async function createPriceBreakdown(data: BreakdownInput) {
  await verifyAdminSession();
  try {
    await connectToDB();

    // Manually generate the slug here to make the data flow explicit and avoid
    // any potential type inference issues with the pre-save hook.
    const slug = generateSlug(data.title);
    const dataWithSlug = { ...data, slug };

    // Explicitly type `newBreakdown` as `IPriceBreakdown`. This removes all ambiguity
    // for TypeScript and should force it to recognize the correct type.
    // We instantiate, then save, and re-assign from the result of `save()`.
    // This is an extremely explicit pattern to ensure TypeScript understands
    // that `newBreakdown` is a single, saved document instance.
    let newBreakdown: IPriceBreakdown = new PriceBreakdown(dataWithSlug);
    newBreakdown = await newBreakdown.save();

    revalidatePath('/admin/dashboard/price-breakdowns');
    revalidatePath(`/documents/${newBreakdown.slug}`);
    return { success: true, data: JSON.parse(JSON.stringify(newBreakdown)) as IPriceBreakdownData & { _id: string } };
  } catch (error) {
    let errorMessage = 'An unexpected error occurred.';
    if (error instanceof Error) {
      // Check for Mongoose duplicate key error for the 'title' or 'slug' field
      if ((error as any).code === 11000) {
        errorMessage = 'A breakdown with this title already exists. Please use a unique title.';
      } else {
        errorMessage = error.message;
      }
    }
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

// This type is now shared between getPriceBreakdowns and getPriceBreakdownBySlug
export type SerializedBreakdownWithService = Omit<IPriceBreakdownData, 'serviceId'> & { _id: string; serviceId: { _id: string; name: string } };

export async function getPriceBreakdownBySlug(slug: string) {
  try {
    await connectToDB();
    const breakdown = await PriceBreakdown.findOne({ slug })
      .populate('serviceId', 'name') // Populate the service name
      .lean()
      .exec();
    if (!breakdown) return null;
    // The data is serialized, so it's a plain object, not a Mongoose document.
    // We cast to a type that reflects this to ensure type safety on the client.
    return JSON.parse(JSON.stringify(breakdown)) as SerializedBreakdownWithService;
  } catch (error) {
    console.error(`Error fetching breakdown by slug ${slug}:`, error);
    return null;
  }
}

export async function updatePriceBreakdown(id: string, data: Partial<BreakdownInput>) {
  await verifyAdminSession();
  try {
    await connectToDB();

    const existingBreakdown = await PriceBreakdown.findById(id).lean();
    if (!existingBreakdown) {
      return { success: false, error: 'Breakdown not found to update.' };
    }
    const oldSlug = existingBreakdown.slug;

    // If the title is being updated, we must also update the slug.
    // We type the payload to match the incoming data (BreakdownInput) plus the optional slug.
    // This resolves the string vs. ObjectId type mismatch for `serviceId`.
    // Mongoose will handle the string-to-ObjectId conversion during the update.
    const updatePayload: Partial<BreakdownInput & { slug?: string }> = { ...data };
    if (data.title) {
      updatePayload.slug = generateSlug(data.title);
    }

    const updatedBreakdown = await PriceBreakdown.findByIdAndUpdate(id, updatePayload, { new: true });
    if (!updatedBreakdown) {
      return { success: false, error: 'Breakdown not found after update attempt.' };
    }

    revalidatePath('/admin/dashboard/price-breakdowns');
    if (oldSlug && oldSlug !== updatedBreakdown.slug) {
      revalidatePath(`/documents/${oldSlug}`);
    }
    revalidatePath(`/documents/${updatedBreakdown.slug}`);
    return { success: true, data: JSON.parse(JSON.stringify(updatedBreakdown)) as IPriceBreakdownData & { _id: string } };
  } catch (error) {
    let errorMessage = 'An unexpected error occurred during update.';
    if (error instanceof Error) {
      if ((error as any).code === 11000) {
        errorMessage = 'A breakdown with this title already exists. Please use a unique title.';
      } else {
        errorMessage = error.message;
      }
    }
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
    revalidatePath(`/documents/${deletedBreakdown.slug}`);
    return { success: true, message: 'Breakdown deleted successfully.' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: errorMessage };
  }
}
