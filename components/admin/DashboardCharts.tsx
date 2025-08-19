'use client';

import {
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
} from 'recharts';

interface SubmissionsOverTimeData {
  date: string;
  count: number;
}

interface ClientsByPlanData {
  name: string;
  value: number;
}

interface DashboardChartsProps {
  submissionsData: SubmissionsOverTimeData[];
  clientsData: ClientsByPlanData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function DashboardCharts({ submissionsData, clientsData }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      <div className="xl:col-span-3 bg-card border border-border rounded-lg p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Submissions Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={submissionsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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

      <div className="xl:col-span-2 bg-card border border-border rounded-lg p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Clients by Plan</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                color: 'hsl(var(--foreground))',
              }}
            />
            <Pie
              data={clientsData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {clientsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend wrapperStyle={{ fontSize: '14px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}