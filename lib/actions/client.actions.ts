'use server';

import { revalidatePath } from 'next/cache';
import { connectToDB } from '@/lib/mongoose';
import Client, { IClientData } from '@/lib/models/Client';
import { verifyAdminSession } from '../auth-utils';

// This type is now the single source of truth for what a serialized client object looks like on the client-side.
// It's based on IClientData to represent a plain object, not a Mongoose document.
export type SerializedClient = Omit<IClientData, 'joinedDate'> & {
  _id: string;
  joinedDate: string; // Dates are stringified during serialization
};

// This type is for the data coming from the form.
type ClientInput = Omit<IClientData, 'joinedDate'>;

export async function getClientsForManager(): Promise<SerializedClient[]> {
  try {
    await connectToDB();
    const clients = await Client.find({}).sort({ joinedDate: -1 }).lean();
    // Manually serialize to ensure the shape matches SerializedClient
    return JSON.parse(JSON.stringify(clients));
  } catch (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
}

export async function createClient(data: ClientInput): Promise<{ success: boolean; data?: SerializedClient; error?: string }> {
  await verifyAdminSession();
  try {
    await connectToDB();
    const newClient = await Client.create(data);
    revalidatePath('/admin/dashboard/clients');
    return { success: true, data: JSON.parse(JSON.stringify(newClient)) };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: errorMessage };
  }
}

export async function updateClient(id: string, data: Partial<ClientInput>): Promise<{ success: boolean; data?: SerializedClient; error?: string }> {
  await verifyAdminSession();
  try {
    await connectToDB();
    const updatedClient = await Client.findByIdAndUpdate(id, data, { new: true });
    if (!updatedClient) return { success: false, error: 'Client not found.' };
    revalidatePath('/admin/dashboard/clients');
    return { success: true, data: JSON.parse(JSON.stringify(updatedClient)) };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: errorMessage };
  }
}

export async function deleteClient(id: string): Promise<{ success: boolean; message?: string; error?: string }> {
  await verifyAdminSession();
  try {
    await connectToDB();
    const deletedClient = await Client.findByIdAndDelete(id);
    if (!deletedClient) return { success: false, error: 'Client not found.' };
    revalidatePath('/admin/dashboard/clients');
    return { success: true, message: 'Client deleted successfully.' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: errorMessage };
  }
}