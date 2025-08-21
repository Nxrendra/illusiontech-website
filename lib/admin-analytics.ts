import { connectToDB } from '@/lib/mongoose';
import ContactSubmission, { IContactSubmission } from '@/lib/models/ContactSubmission';
import Client, { IClient } from '@/lib/models/Client';
import Message from '@/lib/models/Message';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

// A type for the serialized data that can be safely passed to client components
export type SerializedAnalyticsData = {
  totalSubmissions: number;
  totalClients: number;
  activeClients: number;
  totalChatSessions: number;
  newThisMonth: number;
  submissionsOverTime: { date: string; count: number }[];
  clientsByPlan: { name: string; value: number }[];
  recentSubmissions: (IContactSubmission & { _id: string; createdAt: string })[];
  recentClients: (IClient & { _id: string; createdAt: string })[];
  recentChatSessions: { sessionId: string; lastMessage: string; name: string; createdAt: string }[];
  error?: string;
};

export async function getAnalyticsData(): Promise<SerializedAnalyticsData> {
  const JWT_SECRET = process.env.JWT_SECRET;
  const token = cookies().get('auth_token')?.value;
  if (!token || !JWT_SECRET) {
    return { error: 'Authentication required.' } as SerializedAnalyticsData;
  }

  try {
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    await jwtVerify(token, secretKey);

    await connectToDB();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Fetch all data in parallel
    const [totalSubmissions, recentSubmissions, submissionsOverTime, clientStats, totalChatSessions, recentChatSessions] =
      await Promise.all([
        // 1. Get total submission count
        ContactSubmission.countDocuments(),

        // 2. Get 5 most recent submissions
        ContactSubmission.find({}).sort({ createdAt: -1 }).limit(5).lean(),

        // 3. Get submission counts for the last 30 days using aggregation
        ContactSubmission.aggregate([
          { $match: { createdAt: { $gte: thirtyDaysAgo } } },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          { $project: { _id: 0, date: '$_id', count: 1 } },
        ]),

        // 4. Get all client-related stats in one efficient query
        Client.aggregate([
          {
            $facet: {
              total: [{ $count: 'count' }],
              active: [{ $match: { status: 'Active' } }, { $count: 'count' }],
              newThisMonth: [{ $match: { createdAt: { $gte: thirtyDaysAgo } } }, { $count: 'count' }],
              byPlan: [{ $group: { _id: '$servicePlan', count: { $sum: 1 } } }],
              recent: [{ $sort: { createdAt: -1 } }, { $limit: 5 }],
            },
          },
        ]),

        // 5. Get total unique chat session count
        Message.distinct('sessionId').countDocuments(),

        // 6. Get 5 most recent chat sessions
      Message.aggregate([
        { $sort: { timestamp: -1 } },
        {
          $group: {
            _id: '$sessionId',
            lastMessage: { $first: '$text' },
            lastMessageTimestamp: { $first: '$timestamp' },
          },
        },
        { $sort: { lastMessageTimestamp: -1 } },
        { $limit: 5 },
        {
          $project: {
            _id: 0,
            sessionId: '$_id',
            lastMessage: 1,
            name: '$_id',
            createdAt: '$lastMessageTimestamp',
          },
        },
      ]),
    ]);

    // Process the aggregated client data
    const firstClientStats = clientStats[0] || {};
    const totalClients = firstClientStats.total?.[0]?.count || 0;
    const activeClients = firstClientStats.active?.[0]?.count || 0;
    const newThisMonth = firstClientStats.newThisMonth?.[0]?.count || 0;
    const clientsByPlanData = (firstClientStats.byPlan || []).map((item: { _id: any; count: any; }) => ({
      name: item._id || 'None',
      value: item.count,
    }));
    const recentClients = (firstClientStats.recent || []) as (IClient & { _id: string; createdAt: string; })[];

    // Return serialized data
    return JSON.parse(JSON.stringify({
      totalSubmissions,
      totalClients,
      activeClients,
      totalChatSessions,
      newThisMonth,
      submissionsOverTime, clientsByPlan: clientsByPlanData,
      recentSubmissions, recentClients,
      recentChatSessions,
    }));

  } catch (error) {
    console.error('Admin analytics error:', error);
    return { error: 'Session invalid or an error occurred.' } as SerializedAnalyticsData;
  }
}