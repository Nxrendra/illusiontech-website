import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISession extends Document {
  _id: any;
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'closed' | 'ai-fallback';
  tags: string[];
  userTimezone: string;
  lastUserMessageAt: Date;
  lastAgentMessageAt?: Date;
}

const SessionSchema: Schema<ISession> = new Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  status: {
    type: String,
    enum: ['active', 'closed', 'ai-fallback'],
    default: 'active',
  },
  tags: [{ type: String }],
  userTimezone: { type: String, required: true },
  lastUserMessageAt: { type: Date, default: Date.now },
  lastAgentMessageAt: { type: Date },
});

const Session: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);

export default Session;

