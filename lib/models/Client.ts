import mongoose, { Schema, Document, models } from 'mongoose';

export interface IClient extends Document {
  name: string;
  email: string;
  phoneNumber?: string;
  company?: string;
  servicePlan?: string;
  status?: string;
  notes?: string;
  joinedDate: Date;
}

const ClientSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Client name is required.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Client email is required.'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address.'],
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  company: {
    type: String,
    trim: true,
  },
  servicePlan: {
    type: String,
    default: 'None',
  },
  status: {
    type: String,
    default: 'Active',
  },
  notes: {
    type: String,
    trim: true,
  },
  joinedDate: {
    type: Date,
    default: Date.now,
  },
});

const Client = models.Client || mongoose.model<IClient>('Client', ClientSchema);

export default Client;