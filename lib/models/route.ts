import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Visitor from '@/lib/models/Visitor';

const MONGODB_URI = process.env.MONGODB_URI!;
async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGODB_URI);
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Time ranges
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // 1. Total Stats
    const totalVisitors = await Visitor.countDocuments();
    
    // 2. Active in last 24h
    const activeLast24h = await Visitor.countDocuments({
      lastVisit: { $gte: twentyFourHoursAgo }
    });

    // 3. New vs Returning (All time)
    const returningVisitors = await Visitor.countDocuments({ visitCount: { $gt: 1 } });
    const newVisitors = totalVisitors - returningVisitors;

    // 4. Device Breakdown
    const devices = await Visitor.aggregate([
      { $group: { _id: '$deviceType', count: { $sum: 1 } } }
    ]);

    // 5. Page Views (Last 7 Days)
    // Unwind visits array to count individual page hits
    const pageViews = await Visitor.aggregate([
      { $unwind: '$visits' },
      { $match: { 'visits.timestamp': { $gte: sevenDaysAgo } } },
      { 
        $group: { 
          _id: { 
            $dateToString: { format: "%Y-%m-%d", date: "$visits.timestamp" } 
          }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { _id: 1 } }
    ]);
    
    // 6. Top Pages (All time or last 30 days)
    const topPages = await Visitor.aggregate([
      { $unwind: '$visits' },
      { $group: { _id: '$visits.page', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    return NextResponse.json({
      overview: {
        totalVisitors,
        activeLast24h,
        newVisitors,
        returningVisitors,
      },
      devices: devices.map(d => ({ name: d._id || 'Unknown', value: d.count })),
      pageViews: pageViews.map(p => ({ date: p._id, views: p.count })),
      topPages: topPages.map(p => ({ page: p._id, views: p.count })),
    });

  } catch (error) {
    console.error('Analytics Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}