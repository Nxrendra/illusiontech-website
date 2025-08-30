'use server';

import { connectToDB } from '@/lib/mongoose';
import Service from '@/lib/models/Service';

/**
 * Fetches a lightweight list of services for use in select/dropdown inputs.
 * This is more efficient than fetching all service data.
 */
export async function getServiceListForSelect(): Promise<{ _id: string; name: string }[]> {
  try {
    await connectToDB();
    const services = await Service.find({}, '_id name').sort({ name: 1 }).lean();
    return JSON.parse(JSON.stringify(services));
  } catch (error) {
    console.error('Error fetching service list:', error);
    return [];
  }
}

