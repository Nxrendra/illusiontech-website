'use client';

import React, { useEffect, useState } from 'react';
import { Users, Smartphone, Monitor, Globe, Clock, Activity, ArrowUp, ArrowDown } from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalVisitors: number;
    activeLast24h: number;
    newVisitors: number;
    returningVisitors: number;
  };
  devices: { name: string; value: number }[];
  pageViews: { date: string; views: number }[];
  topPages: { page: string; views: number }[];
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-white/50 animate-pulse">Loading Analytics...</div>;
  }

  if (!data) return null;

  const retentionRate = data.overview.totalVisitors > 0 
    ? ((data.overview.returningVisitors / data.overview.totalVisitors) * 100).toFixed(1) 
    : 0;

  // Find max views for scaling the chart
  const maxViews = Math.max(...data.pageViews.map(p => p.views), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="text-[#00f0ff]" /> 
          Visitor Intelligence
        </h2>
        <p className="text-sm text-gray-400">Real-time tracking of user engagement and device metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Visitors" 
          value={data.overview.totalVisitors} 
          icon={<Users size={20} className="text-[#bd00ff]" />}
          subtext="All time unique IDs"
        />
        <StatCard 
          title="Active (24h)" 
          value={data.overview.activeLast24h} 
          icon={<Clock size={20} className="text-[#00f0ff]" />}
          subtext="Visits in last 24 hours"
        />
        <StatCard 
          title="Retention Rate" 
          value={`${retentionRate}%`} 
          icon={<ArrowUp size={20} className="text-green-400" />}
          subtext={`${data.overview.returningVisitors} returning users`}
        />
        <StatCard 
          title="Mobile Users" 
          value={data.devices.find(d => d.name === 'mobile')?.value || 0} 
          icon={<Smartphone size={20} className="text-orange-400" />}
          subtext="Mobile device count"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Chart */}
        <div className="lg:col-span-2 bg-gray-900/50 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Traffic Volume (Last 7 Days)</h3>
          <div className="h-48 flex items-end gap-2 sm:gap-4">
            {data.pageViews.length === 0 ? (
               <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">No traffic data yet</div>
            ) : (
              data.pageViews.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div 
                    className="w-full bg-[#00f0ff]/20 border-t border-[#00f0ff] rounded-t-sm transition-all duration-500 hover:bg-[#00f0ff]/40 relative"
                    style={{ height: `${(item.views / maxViews) * 100}%`, minHeight: '4px' }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black border border-white/20 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {item.views} Views
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-500 rotate-0 sm:truncate w-full text-center">
                    {new Date(item.date).toLocaleDateString(undefined, { weekday: 'short' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Pages</h3>
          <div className="space-y-4">
            {data.topPages.map((page, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs text-gray-300">
                  <span className="truncate max-w-[70%] font-mono" title={page.page}>{page.page}</span>
                  <span className="text-[#00f0ff]">{page.views}</span>
                </div>
                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#bd00ff] to-[#00f0ff]" 
                    style={{ width: `${(page.views / Math.max(...data.topPages.map(p=>p.views))) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {data.topPages.length === 0 && <div className="text-gray-500 text-sm">No page data yet</div>}
          </div>

          <h3 className="text-lg font-semibold text-white mt-8 mb-4">Device Breakdown</h3>
          <div className="flex gap-2">
             {data.devices.map((device, i) => {
                const total = data.devices.reduce((acc, curr) => acc + curr.value, 0);
                const percentage = total > 0 ? (device.value / total) * 100 : 0;
                return (
                  <div key={i} className="h-2 rounded-full first:rounded-l-full last:rounded-r-full" 
                       style={{ 
                         width: `${percentage}%`, 
                         backgroundColor: device.name === 'mobile' ? '#f97316' : device.name === 'desktop' ? '#3b82f6' : '#a855f7'
                       }} 
                       title={`${device.name}: ${device.value} (${percentage.toFixed(0)}%)`}
                  />
                )
             })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
             <span>Desktop</span>
             <span>Tablet</span>
             <span>Mobile</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, subtext }: { title: string, value: string | number, icon: React.ReactNode, subtext: string }) {
  return (
    <div className="bg-gray-900/50 border border-white/10 p-5 rounded-xl hover:bg-gray-800/50 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <span className="text-gray-400 text-sm font-medium">{title}</span>
        <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-gray-500">{subtext}</div>
    </div>
  );
}