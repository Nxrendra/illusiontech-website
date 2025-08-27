import { verifyAdminSession } from '@/lib/auth-utils';
import { connectToDB } from '@/lib/mongoose';
import ServiceModel, { IServiceData } from '@/lib/models/Service';
import ClientModel, { IClient } from '@/lib/models/Client';
import ContactSubmission, { IContactSubmissionData } from '@/lib/models/ContactSubmission';

import { DashboardStats } from '@/components/admin/DashboardStats';
import { RecentActivity } from '@/components/admin/RecentActivity';
import ServiceList from '@/components/admin/ServiceList';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

type SerializedService = IServiceData & { _id: string; createdAt: string; };
type SerializedClient = IClient & { _id: string; createdAt: string; };
type SerializedSubmission = IContactSubmissionData & { _id: string; createdAt: string; };

interface DashboardPageData {
  services?: SerializedService[];
  clients?: SerializedClient[];
  submissions?: SerializedSubmission[];
  error?: string;
}

async function getDashboardData(): Promise<DashboardPageData> {
  try {
    await verifyAdminSession();
    await connectToDB();

    const [servicesData, clientsData, submissionsData] = await Promise.all([
      ServiceModel.find({}).sort({ position: 1, name: 1 }).lean(),
      ClientModel.find({}).sort({ createdAt: -1 }).lean(),
      ContactSubmission.find({}).sort({ createdAt: -1 }).lean()
    ]);

    // Using JSON.parse(JSON.stringify(...)) is a robust way to serialize the data
    // and ensure all Mongoose-specific properties are removed.
    return {
      services: JSON.parse(JSON.stringify(servicesData)),
      clients: JSON.parse(JSON.stringify(clientsData)),
      submissions: JSON.parse(JSON.stringify(submissionsData)),
    };
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { error: errorMessage };
  }
}

export default async function DashboardPage() {
  const { services, clients, submissions, error } = await getDashboardData();

  if (error) {
    return (
      <div className="bg-destructive/10 border-l-4 border-destructive text-destructive-foreground p-4" role="alert">
        <p className="font-bold">Access Denied</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <DashboardStats
        clientCount={clients?.length || 0}
        serviceCount={services?.length || 0}
        submissionCount={submissions?.length || 0}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4 bg-muted/50 p-6 rounded-lg border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">Service Offerings</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/dashboard/services">Manage Services</Link>
            </Button>
          </div>
          <ServiceList services={services || []} isReadOnly={true} />
        </div>
        <div className="lg:col-span-3"><RecentActivity submissions={submissions || []} clients={clients || []} chats={[]} /></div>
      </div>
    </div>
  );
}