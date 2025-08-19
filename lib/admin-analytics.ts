import { connectToDB } from '@/lib/mongoose';
import ContactSubmission, { IContactSubmission } from '@/lib/models/ContactSubmission';
import Client, { IClient } from '@/lib/models/Client';
import Message from '@/lib/models/Message';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

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
    const [
      submissions,
      clients,
      newThisMonthCount,
      chatSessions,
    ] = await Promise.all([
      ContactSubmission.find({}).sort({ createdAt: -1 }).limit(5).lean(),
      Client.find({}).sort({ createdAt: -1 }).lean(),
      Client.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Message.aggregate([
        { $sort: { timestamp: -1 } },
        { $group: { _id: '$sessionId', lastMessage: { $first: '$text' }, lastMessageTimestamp: { $first: '$timestamp' } } },
        { $sort: { lastMessageTimestamp: -1 } },
        { $limit: 5 },
        { $project: { _id: 0, sessionId: '$_id', lastMessage: 1, lastMessageTimestamp: 1, name: '$sessionId', createdAt: '$lastMessageTimestamp' } },
      ]),
    ]);

    // Process data
    const totalSubmissions = await ContactSubmission.countDocuments();
    const totalClients = clients.length;
    const totalChatSessions = (await Message.distinct('sessionId')).length;
    const activeClients = clients.filter(c => c.status === 'Active').length;

    const submissionsByDate = (await ContactSubmission.find({ createdAt: { $gte: thirtyDaysAgo } })).reduce((acc: { [key: string]: number }, s) => {
      const date = new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const submissionsOverTime = Object.entries(submissionsByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const clientsByPlan = clients.reduce((acc: { [key: string]: number }, c) => {
      const plan = c.servicePlan || 'None';
      acc[plan] = (acc[plan] || 0) + 1;
      return acc;
    }, {});
    
    const clientsByPlanData = Object.entries(clientsByPlan).map(([name, value]) => ({ name, value }));

    // Return serialized data
    return JSON.parse(JSON.stringify({
      totalSubmissions,
      totalClients,
      activeClients,
      totalChatSessions,
      newThisMonth: newThisMonthCount,
      submissionsOverTime, clientsByPlan: clientsByPlanData,
      recentSubmissions: submissions, recentClients: clients.slice(0, 5),
      recentChatSessions: chatSessions,
    }));

  } catch (error) {
    console.error('Admin analytics error:', error);
    return { error: 'Session invalid or an error occurred.' } as SerializedAnalyticsData;
  }
}