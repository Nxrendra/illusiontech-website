import { connectToDB } from '@/lib/mongoose';
import { verifyAdminSession } from '@/lib/auth-utils';
import ClientModel, { IClient } from '@/lib/models/Client';
import ServiceModel from '@/lib/models/Service';
import ClientManager from '@/components/admin/ClientManager';

type SerializedClient = Omit<IClient, 'joinedDate' | '_id'> & {
  _id: string;
  joinedDate: string;
};

interface ClientsPageData {
  clients?: SerializedClient[];
  serviceNames?: string[];
  error?: string;
}

async function getClientsAndServices(): Promise<ClientsPageData> {
  try {
    await verifyAdminSession();
    await connectToDB();

    const [clientsData, servicesData] = await Promise.all([
      ClientModel.find({}).sort({ joinedDate: -1 }).lean(),
      ServiceModel.find({}).select('name').sort({ name: 1 }).lean()
    ]);

    const serviceNames = servicesData.map(s => s.name);

    return { 
      clients: JSON.parse(JSON.stringify(clientsData)),
      serviceNames
    };
  } catch (error) {
    console.error("Failed to fetch clients and services:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { error: errorMessage };
  }
}

export default async function ClientsPage() {
  const { clients, serviceNames, error } = await getClientsAndServices();

  if (error) {
    return (
      <div className="bg-destructive/10 border-l-4 border-destructive text-destructive-foreground p-4" role="alert">
        <p className="font-bold">Access Denied</p><p>{error}</p>
      </div>
    );
  }

  return <div className="flex-1 space-y-4 p-4 sm:p-6 md:p-8"><ClientManager initialClients={clients || []} serviceNames={serviceNames || []} /></div>;
}