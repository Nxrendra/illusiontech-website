import mongoose, { Schema, Document, models } from 'mongoose';

// This interface represents the plain data structure of a service, without Mongoose's methods.
export interface IServiceData {
  type: 'web-development' | 'design' | 'automation' | 'support' | 'support-main';
  name: string;
  icon?: string; // Storing icon name as a string
  price?: string;
  audience?: string;
  description?: string;
  longDescription?: string;
  timeline?: string;
  features?: string[];
  keyFeatures?: { title: string; description: string }[];
  link?: string;
  theme?: {
    gradient?: string;
    accentClass?: string;
    buttonClass?: string;
  };
  featured?: boolean;
  isCoreService?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// This interface represents the Mongoose Document, including its methods and virtuals.
export interface IService extends IServiceData, Document {}

const ServiceSchema: Schema = new Schema({
  type: { type: String, required: true },
  name: { type: String, required: true },
  icon: { type: String },
  price: { type: String },
  audience: { type: String },
  description: { type: String },
  longDescription: { type: String },
  timeline: { type: String },
  features: { type: [String], default: [] },
  keyFeatures: { type: [{ title: String, description: String }], default: [] },
  link: { type: String },
  theme: {
    gradient: { type: String },
    accentClass: { type: String },
    buttonClass: { type: String },
  },
  featured: { type: Boolean, default: false },
  isCoreService: { type: Boolean, default: false },
}, {
  timestamps: true
});

const Service = models.Service || mongoose.model<IService>('Service', ServiceSchema);

export default Service;
