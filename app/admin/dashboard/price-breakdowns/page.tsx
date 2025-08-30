import { AdminHeader } from '@/components/admin/AdminHeader';
import BreakdownManager from '@/components/admin/price-breakdowns/BreakdownManager';
import { getPriceBreakdowns } from '@/lib/actions/priceBreakdown.actions';
import { getServiceListForSelect } from '@/lib/actions/service.actions';
import { verifyAdminSession } from '@/lib/auth-utils';

export default async function PriceBreakdownsPage() {
  try {
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

  const [breakdowns, services] = await Promise.all([getPriceBreakdowns(), getServiceListForSelect()]);

  return (
    <>
      <AdminHeader title="Price Breakdowns" />
      <main className="flex-1 p-4 sm:px-6 sm:py-0">
        <BreakdownManager initialBreakdowns={breakdowns} services={services} />
      </main>
    </>
  );
}
