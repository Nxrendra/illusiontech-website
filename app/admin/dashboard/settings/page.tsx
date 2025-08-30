import { AdminHeader } from '@/components/admin/AdminHeader';
import SettingsManager from '@/components/admin/SettingsManager';
import { getSettings } from '@/lib/actions/settings.actions';
import { verifyAdminSession } from '@/lib/auth-utils';

export default async function SettingsPage() {
  try {
    // This function throws an error if the session is not valid.
    await verifyAdminSession();
  } catch (error) {
    const authError = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return (
      <div className="bg-destructive/10 border-l-4 border-destructive text-destructive-foreground p-4" role="alert">
        <p className="font-bold">Access Denied</p>
        <p>{authError}</p>
      </div>
    );
  }

  const settings = await getSettings();

  return (
    <>
      <AdminHeader title="Settings" />
      <main className="flex-1 p-4 sm:px-6 sm:py-0">
        <SettingsManager settings={settings} />
      </main>
    </>
  );
}

