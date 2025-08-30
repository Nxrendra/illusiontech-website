import { getClientsForManager } from '@/lib/actions/client.actions';
import { getServiceListForSelect } from '@/lib/actions/service.actions';
import { verifyAdminSession } from '@/lib/auth-utils';
import ClientManager from '@/components/admin/ClientManager';

export default async function ClientsPage() {
  let clients, serviceNames, error;

  try {
    await verifyAdminSession();

    const [clientsData, servicesData] = await Promise.all([
      getClientsForManager(),
      getServiceListForSelect(),
    ]);

    clients = clientsData;
    serviceNames = servicesData.map(s => s.name);

  } catch (e) {
    console.error("Failed to fetch clients and services:", e);
    error = e instanceof Error ? e.message : 'An unexpected error occurred.';
  }

  if (error || !clients || !serviceNames) {
    return (
      <div className="bg-destructive/10 border-l-4 border-destructive text-destructive-foreground p-4" role="alert">
        <p className="font-bold">Access Denied or Data Fetching Failed</p>
        <p>{error || 'Could not load client data.'}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6 md:p-8">
      <ClientManager initialClients={clients} serviceNames={serviceNames} />
    </div>
  );
}