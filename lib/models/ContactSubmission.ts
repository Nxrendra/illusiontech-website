// /Users/macbookair/Documents/IllusionTech-Development/lib/models/ContactSubmission.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContactSubmission extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  message: string;
  serviceType: string;
  newProjectPackage?: string;
  maintenancePlan?: string;
  websiteURL?: string;
  budget?: string;
  timeline?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSubmissionSchema = new Schema<IContactSubmission>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String },
  message: { type: String, required: true },
  serviceType: { type: String, required: true },
  newProjectPackage: { type: String },
  maintenancePlan: { type: String },
  websiteURL: { type: String },
  budget: { type: String },
  timeline: { type: String },
},
  {
  timestamps: true,});

const ContactSubmission: Model<IContactSubmission> = mongoose.models.ContactSubmission || mongoose.model<IContactSubmission>('ContactSubmission', ContactSubmissionSchema);

export default ContactSubmission;