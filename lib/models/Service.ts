import mongoose, { Schema, Document, models } from 'mongoose';

// This interface represents the plain data structure of a service, without Mongoose's methods.
export interface IServiceData {
  type: 'web-development' | 'design' | 'automation' | 'support' | 'support-main';
  name: string;
  icon: string; // Storing icon name as a string
  price: string;
  audience: string;
  description: string;
  longDescription: string;
  timeline: string;
  features: string[];
  keyFeatures: { title: string; description: string }[];
  link: string;
  theme: {
    gradient: string;
    accentClass: string;
    buttonClass: string;
  };
  featured?: boolean;
  isCoreService?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// This interface represents the Mongoose Document, including its methods and virtuals.
export interface IService extends IServiceData, Document {}

const ServiceSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  icon: { type: String, required: true },
  price: { type: String, required: true },
  audience: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String, required: true },
  timeline: { type: String, required: true },
  features: [{ type: String }],
  keyFeatures: [{ title: { type: String }, description: { type: String } }],
  link: { type: String, required: true },
  theme: {
    gradient: { type: String, required: true },
    accentClass: { type: String, required: true },
    buttonClass: { type: String, required: true },
  },
  featured: { type: Boolean, default: false },
  isCoreService: { type: Boolean, default: false },
}, {
  timestamps: true
});

const Service = models.Service || mongoose.model<IService>('Service', ServiceSchema);

export default Service;
