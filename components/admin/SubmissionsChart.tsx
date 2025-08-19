'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface ChartProps {
  serviceTypeData: { name: string; count: number }[];
  submissionsChartData: { date: string; count: number }[];
}

const serviceTypeLabels: { [key: string]: string } = {
  'new-project': 'New Project',
  'maintenance': 'Maintenance',
  'ui-ux-design': 'UI/UX Design',
  'website-design': 'Web Design',
  'automation': 'Automation',
  'general': 'General Inquiry',
};

export function SubmissionsChart({ serviceTypeData, submissionsChartData }: ChartProps) {
  const formattedServiceData = serviceTypeData.map(item => ({
    ...item,
    name: serviceTypeLabels[item.name] || item.name,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Inquiries by Service</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedServiceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                color: 'hsl(var(--foreground))',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '14px' }} />
            <Bar dataKey="count" name="Submissions" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Submission Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={submissionsChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                color: 'hsl(var(--foreground))',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '14px' }} />
            <Line
              type="monotone"
              dataKey="count"
              name="Submissions"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              dot={{ r: 4, fill: 'hsl(var(--accent))' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}