import { cookies } from 'next/headers';
import { connectToDB } from '@/lib/mongoose';
import { jwtVerify } from 'jose';
import ClientModel, { IClient } from '@/lib/models/Client';
import ClientManager from '@/components/admin/ClientManager'; // This will be a new, more advanced component
import { StatCard } from '@/components/admin/StatCard';
import { Users, UserCheck } from 'lucide-react';

const JWT_SECRET = process.env.JWT_SECRET;

// After serialization, ObjectId and Date are converted to strings.
type SerializedClient = Omit<IClient, 'joinedDate' | '_id'> & {
  _id: string;
  joinedDate: string;
};

interface ClientPageData {
  clients?: SerializedClient[];
  stats?: { totalClients: number; activeClients: number; };
  error?: string;
}

async function getClients(): Promise<ClientPageData> {
  const token = cookies().get('auth_token')?.value;
  if (!token || !JWT_SECRET) {
    return { error: 'Authentication required.' };
  }
  try {
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    await jwtVerify(token, secretKey);

    await connectToDB();
    // Fetch clients and stats in parallel for efficiency.
    const [clientsData, stats] = await Promise.all([
      ClientModel.find({}).sort({ name: 1 }).lean(),
      ClientModel.aggregate([
        {
          $facet: {
            total: [{ $count: 'count' }],
            active: [{ $match: { status: 'Active' } }, { $count: 'count' }],
          },
        },
      ]),
    ]);

    const clientStats = stats[0] || {};
    const totalClients = clientStats.total?.[0]?.count || 0;
    const activeClients = clientStats.active?.[0]?.count || 0;

    return {
      clients: JSON.parse(JSON.stringify(clientsData)),
      stats: { totalClients, activeClients },
    };
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    return { error: 'Session invalid. Please log in again.' };
  }
}

export default async function ClientsPage() {
  const { clients, stats, error } = await getClients();

  if (error) {
    return (
      <div className="bg-destructive/10 border-l-4 border-destructive text-destructive-foreground p-4" role="alert">
        <p className="font-bold">Access Denied</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-background p-4 sm:p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Client Management</h1>
        <p className="text-muted-foreground">Add, view, edit, and manage all your clients.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Clients" value={stats?.totalClients ?? 0} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Active Clients" value={stats?.activeClients ?? 0} icon={<UserCheck className="h-5 w-5" />} description="Currently engaged" />
      </div>
      <ClientManager initialClients={clients || []} />
    </div>
  );
}
