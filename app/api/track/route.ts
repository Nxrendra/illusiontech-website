import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Visitor from '@/lib/models/Visitor';

// Helper to ensure DB connection (adapt to your existing dbConnect if you have one)
const MONGODB_URI = process.env.MONGODB_URI!;
async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGODB_URI);
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { page, referrer } = body;
    
    // 1. Identification
    let visitorId = req.cookies.get('it_visitor')?.value;
    const isNewVisitor = !visitorId;
    
    if (!visitorId) {
      visitorId = crypto.randomUUID();
    }

    // 2. Device Detection (Simple)
    const userAgent = req.headers.get('user-agent') || '';
    let deviceType = 'desktop';
    if (/mobile/i.test(userAgent)) deviceType = 'mobile';
    else if (/tablet|ipad/i.test(userAgent)) deviceType = 'tablet';

    // 3. Browser/OS (Simple parsing)
    let browser = 'Unknown';
    if (/chrome/i.test(userAgent)) browser = 'Chrome';
    else if (/safari/i.test(userAgent)) browser = 'Safari';
    else if (/firefox/i.test(userAgent)) browser = 'Firefox';
    else if (/edge/i.test(userAgent)) browser = 'Edge';

    let os = 'Unknown';
    if (/windows/i.test(userAgent)) os = 'Windows';
    else if (/mac/i.test(userAgent)) os = 'macOS';
    else if (/linux/i.test(userAgent)) os = 'Linux';
    else if (/android/i.test(userAgent)) os = 'Android';
    else if (/ios|iphone|ipad/i.test(userAgent)) os = 'iOS';

    // 4. Update Database
    let visitor = await Visitor.findOne({ visitorId });

    if (!visitor) {
      // Create new visitor
      visitor = new Visitor({
        visitorId,
        firstVisit: new Date(),
        lastVisit: new Date(),
        visitCount: 1,
        deviceType,
        browser,
        os,
        visits: [{
          timestamp: new Date(),
          page,
          referrer,
          userAgent,
        }]
      });
    } else {
      // Update existing visitor
      visitor.lastVisit = new Date();
      visitor.visitCount += 1;
      visitor.visits.push({
        timestamp: new Date(),
        page,
        referrer,
        userAgent
      });
      
      // Update metadata if it changed (e.g. user switched devices but kept cookie?) 
      // Usually cookie is device specific, but good to keep fresh.
      if (!visitor.deviceType) visitor.deviceType = deviceType;
    }

    await visitor.save();

    // 5. Response with Cookie
    const response = NextResponse.json({ success: true, visitorId });
    
    // Set a long-lived cookie (1 year)
    response.cookies.set('it_visitor', visitorId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365, 
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Tracking Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
