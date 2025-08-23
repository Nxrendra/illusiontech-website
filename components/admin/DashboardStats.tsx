import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Users, Briefcase, FileText, MessageSquare, Rocket, ShieldCheck } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

interface DashboardStatsProps {
  // Main dashboard props
  clientCount?: number;
  serviceCount?: number;
  submissionCount?: number;
  // Submission page props
  totalSubmissions?: number;
  newProjectsCount?: number;
  maintenanceCount?: number;
}

export function DashboardStats({
  clientCount,
  serviceCount,
  submissionCount,
  totalSubmissions,
  newProjectsCount,
  maintenanceCount,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Render main dashboard stats if clientCount is provided */}
      {typeof clientCount === 'number' && (
        <>
          <StatCard title="Total Clients" value={clientCount} icon={<Users className="h-4 w-4 text-muted-foreground" />} />
          <StatCard title="Total Services" value={serviceCount ?? 0} icon={<Briefcase className="h-4 w-4 text-muted-foreground" />} />
          <StatCard title="Submissions" value={submissionCount ?? 0} icon={<FileText className="h-4 w-4 text-muted-foreground" />} />
          <StatCard title="Active Chats" value={0} icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />} />
        </>
      )}
      {/* Render submission-specific stats if totalSubmissions is provided */}
      {typeof totalSubmissions === 'number' && (
        <>
          <StatCard title="Total Submissions" value={totalSubmissions} icon={<FileText className="h-4 w-4 text-muted-foreground" />} />
          <StatCard title="New Project Inquiries" value={newProjectsCount ?? 0} icon={<Rocket className="h-4 w-4 text-muted-foreground" />} />
          <StatCard title="Maintenance Inquiries" value={maintenanceCount ?? 0} icon={<ShieldCheck className="h-4 w-4 text-muted-foreground" />} />
        </>
      )}
    </div>
  );
}