import { Schema, model, models, Document, Model } from 'mongoose';

export interface IAgentData {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  bankAccountNumber?: string;
  commissionRate: number;
  status: 'Active' | 'Inactive';
  notes?: string;
  }
export interface IAgent extends IAgentData, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

const AgentSchema = new Schema<IAgent>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  companyName: { type: String, required: true },
  bankAccountNumber: { type: String },
  commissionRate: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  notes: { type: String },
}, { timestamps: true });

const Agent: Model<IAgent> = models.Agent || model<IAgent>('Agent', AgentSchema);

export default Agent;
