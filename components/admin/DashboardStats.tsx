import { BarChart3, FileText, Wrench } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
}

const StatCard = ({ title, value, icon, description }: StatCardProps) => (
  <div className="bg-card border border-border rounded-lg p-6 flex flex-col justify-between shadow-sm">
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="text-accent">{icon}</div>
      </div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
    <p className="text-xs text-muted-foreground mt-2">{description}</p>
  </div>
);

interface DashboardStatsProps {
  totalSubmissions: number;
  newProjectsCount: number;
  maintenanceCount: number;
}

export function DashboardStats({ totalSubmissions, newProjectsCount, maintenanceCount }: DashboardStatsProps) {
  const stats: StatCardProps[] = [
    {
      title: 'Total Submissions',
      value: totalSubmissions,
      icon: <FileText className="h-5 w-5" />,
      description: 'All inquiries received through the contact form.',
    },
    {
      title: 'New Project Inquiries',
      value: newProjectsCount,
      icon: <BarChart3 className="h-5 w-5" />,
      description: 'Potential new website or application builds.',
    },
    {
      title: 'Support & Maintenance',
      value: maintenanceCount,
      icon: <Wrench className="h-5 w-5" />,
      description: 'Requests for ongoing website support.',
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}