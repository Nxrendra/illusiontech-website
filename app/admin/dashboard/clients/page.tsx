import { cookies } from 'next/headers';
import { connectToDB } from '@/lib/mongoose';
import { jwtVerify } from 'jose';
import ClientModel, { IClient } from '@/lib/models/Client';
import ClientManager from '@/components/admin/ClientManager';

const JWT_SECRET = process.env.JWT_SECRET;

// After serialization, ObjectId and Date are converted to strings.
type SerializedClient = Omit<IClient, 'joinedDate' | '_id'> & {
  _id: string;
  joinedDate: string;
};

async function getClients(): Promise<{ clients?: SerializedClient[]; error?: string }> {
  const token = cookies().get('auth_token')?.value;
  if (!token || !JWT_SECRET) {
    return { error: 'Authentication required.' };
  }
  try {
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    await jwtVerify(token, secretKey);

    await connectToDB();
    // Use the Mongoose model for type-safe, consistent data access.
    // .lean() returns plain JS objects for better performance in read-only scenarios.
    const clientsData = await ClientModel.find({}).sort({ name: 1 }).lean();
    
    return { clients: JSON.parse(JSON.stringify(clientsData)) };
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    return { error: 'Session invalid. Please log in again.' };
  }
}

export default async function ClientsPage() {
  const { clients, error } = await getClients();

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p className="font-bold">Access Denied</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <ClientManager initialClients={clients || []} />
  );
}
