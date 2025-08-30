import { verifyAdminSession } from '@/lib/auth-utils';
import { connectToDB } from '@/lib/mongoose';
import ServiceModel, { IServiceData } from '@/lib/models/Service';
import ClientModel, { IClient } from '@/lib/models/Client';
import ContactSubmission, { IContactSubmissionData } from '@/lib/models/ContactSubmission';

import { DashboardStats } from '@/components/admin/DashboardStats';
import { RecentActivity } from '@/components/admin/RecentActivity';
import ServiceList from '@/components/admin/ServiceList';
import { DashboardCharts } from '@/components/admin/DashboardCharts';
import { AdminHeader } from '@/components/admin/AdminHeader';
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

  const newProjectInquiries = submissions?.filter(s => s.serviceType === 'new-project').length || 0;
  const maintenanceInquiries = submissions?.filter(s => s.serviceType === 'maintenance').length || 0;

  // Process data for charts
  const clientsByPlan = (clients || []).reduce((acc: { [key: string]: number }, client) => {
    const plan = client.servicePlan || 'Unknown';
    acc[plan] = (acc[plan] || 0) + 1;
    return acc;
  }, {});
  const clientsChartData = Object.entries(clientsByPlan).map(([name, value]) => ({ name, value }));

  const submissionsByDate = (submissions || []).reduce((acc: { [key: string]: number }, s) => {
    const date = new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  const submissionsChartData = Object.entries(submissionsByDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30); // Get last 30 days of activity

  return (
    <>
      <AdminHeader title="Dashboard" />
      <main className="flex-1 space-y-6 p-4 sm:p-6 md:p-8">
        <DashboardStats
          clientCount={clients?.length || 0}
          serviceCount={services?.length || 0}
          newProjectInquiries={newProjectInquiries}
          maintenanceInquiries={maintenanceInquiries}
        />

        <DashboardCharts submissionsData={submissionsChartData} clientsData={clientsChartData} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <div className="bg-card p-6 rounded-lg border h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-foreground">Service Offerings</h2>
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/dashboard/services">Manage Services</Link>
                </Button>
              </div>
              <ServiceList services={services || []} isReadOnly={true} />
            </div>
          </div>
          <div className="lg:col-span-3">
            <RecentActivity submissions={submissions || []} clients={clients || []} chats={[]} />
          </div>
        </div>
      </main>
    </>
  );
}