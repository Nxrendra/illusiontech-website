import { getAnalyticsData } from '@/lib/admin-analytics';
import { StatCard } from '@/components/admin/StatCard';
import { DashboardCharts } from '@/components/admin/DashboardCharts';
import { RecentActivity } from '@/components/admin/RecentActivity';
import { MessageSquare, Users, CheckCircle, BarChart2, FileText, Newspaper } from 'lucide-react';

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  if (data.error) {
    return (
      <div className="bg-destructive/10 border-l-4 border-destructive text-destructive-foreground p-4" role="alert">
        <p className="font-bold">Access Denied</p>
        <p>{data.error}</p>
      </div>
    );
  }

  return (
    <div className="bg-background p-4 sm:p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Site Analytics</h1>
        <p className="text-muted-foreground">A detailed overview of your website's performance and engagement.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Total Submissions" value={data.totalSubmissions} icon={<FileText className="h-5 w-5" />} />
        <StatCard title="Total Clients" value={data.totalClients} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Active Clients" value={data.activeClients} icon={<CheckCircle className="h-5 w-5" />} />
        <StatCard title="New Clients (Month)" value={data.newThisMonth} icon={<BarChart2 className="h-5 w-5" />} />
        <StatCard title="Chat Sessions" value={data.totalChatSessions} icon={<MessageSquare className="h-5 w-5" />} />
        <StatCard title="Newsletter Subs" value={data.totalSubscribers} icon={<Newspaper className="h-5 w-5" />} />
      </div>

      {/* Charts */}
      <DashboardCharts submissionsData={data.submissionsOverTime} clientsData={data.clientsByPlan} />

      {/* Recent Activity */}
      <div className="grid grid-cols-1">
        <RecentActivity submissions={data.recentSubmissions} clients={data.recentClients} chats={data.recentChatSessions} />
      </div>
    </div>
  );
}
