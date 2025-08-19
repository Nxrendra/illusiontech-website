import { getAnalyticsData } from '@/lib/admin-analytics';
import { MessageSquare, Users, CheckCircle, BarChart2 } from 'lucide-react';

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  if (data.error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p className="font-bold">Access Denied</p>
        <p>{data.error}</p>
      </div>
    );
  }

  const stats = [
    { name: 'Total Contact Submissions', value: data.totalSubmissions, icon: MessageSquare },
    { name: 'Total Clients', value: data.totalClients, icon: Users },
    { name: 'Active Clients', value: data.activeClients, icon: CheckCircle },
    { name: 'New Clients This Month', value: data.newThisMonth, icon: BarChart2 },
  ];

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Site Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-accent/10 text-accent">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900">{(stat.value || 0).toString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Future Enhancements</h2>
        <p className="text-gray-600">
          This dashboard will be expanded with visual charts and graphs to track client growth,
          service plan popularity, and submission trends over time.
        </p>
      </div>
    </div>
  );
}
