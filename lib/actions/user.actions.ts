'use server';

import bcrypt from 'bcrypt';
import { connectToDB } from '@/lib/mongoose';
import User from '@/lib/models/User';
import { verifyAdminSession } from '../auth-utils';

export async function changeAdminPassword({ currentPassword, newPassword }: { currentPassword: string; newPassword: string; }) {
  try {
    const { user } = await verifyAdminSession();
    

    await connectToDB();

// Fetch user and explicitly select the password field which is excluded by default
    const adminUser = await User.findById(user.userId).select('+password');
        if (!adminUser) {
      throw new Error('Admin user not found.');
    }
    if (!adminUser.password) {
      // This should not happen for a valid user but is a good safeguard.
      throw new Error('User password data is not available.');
    }

    const isMatch = await bcrypt.compare(currentPassword, adminUser.password);
    if (!isMatch) {
      throw new Error('Incorrect current password.');
    }

    if (newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long.');
    }

    adminUser.password = newPassword; // Set the new password, the pre-save hook will hash it
    await adminUser.save();

    return { success: true, message: 'Password updated successfully.' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: errorMessage };
  }
}

