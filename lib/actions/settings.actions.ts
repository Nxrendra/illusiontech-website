'use server';

import { revalidatePath } from 'next/cache';
import { connectToDB } from '@/lib/mongoose';
import Settings, { ISettings } from '@/lib/models/Settings';
import { verifyAdminSession } from '../auth-utils';

// Using a singleton approach for settings: find one and only one settings document.
export async function getSettings(): Promise<Partial<ISettings>> {
  try {
    await connectToDB();
    const settings = await Settings.findOne({}).lean();
    if (!settings) {
      // Create default settings if they don't exist on first load
      const defaultSettings = await Settings.create({
        siteName: 'IllusionTech Development',
        siteDescription: 'High-performance web solutions and automation.',
      });
      return JSON.parse(JSON.stringify(defaultSettings));
    }
    return JSON.parse(JSON.stringify(settings));
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {}; // Return empty object on failure
  }
}

export async function updateSettings(data: Partial<ISettings>) {
  await verifyAdminSession();
  await connectToDB();

  const settings = await Settings.findOneAndUpdate({}, data, { new: true, upsert: true });

  revalidatePath('/admin/dashboard/settings');
  return { success: true, data: JSON.parse(JSON.stringify(settings)) };
}

