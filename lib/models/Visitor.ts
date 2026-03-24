import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IVisit {
  timestamp: Date;
  page: string;
  referrer?: string;
  userAgent?: string;
  duration?: number;
}

export interface IVisitor extends Document {
  visitorId: string; // Unique hash (IP + UA) or Cookie UUID
  ipHash?: string;
  firstVisit: Date;
  lastVisit: Date;
  visitCount: number;
  visits: IVisit[];
  deviceType: string; // 'mobile', 'desktop', 'tablet'
  country?: string;
  browser?: string;
  os?: string;
}

const VisitSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  page: { type: String, required: true },
  referrer: String,
  userAgent: String,
  duration: Number, // Time spent in seconds
});

const VisitorSchema = new Schema({
  visitorId: { type: String, required: true, unique: true, index: true },
  ipHash: String,
  firstVisit: { type: Date, default: Date.now },
  lastVisit: { type: Date, default: Date.now },
  visitCount: { type: Number, default: 1 },
  visits: [VisitSchema],
  deviceType: String,
  country: String,
  browser: String,
  os: String,
}, { 
  timestamps: true,
  collection: 'visitors'
});

const Visitor: Model<IVisitor> = models.Visitor || mongoose.model<IVisitor>('Visitor', VisitorSchema);

export default Visitor;