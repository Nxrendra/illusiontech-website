import mongoose, { Document, Schema, Model } from 'mongoose';

/**
 * Interface representing a contact document in MongoDB.
 */
export interface IContact extends Document {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
  ipAddress?: string;

}

// Mongoose Schema for Contact
const ContactSchema: Schema<IContact> = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address.'],
  },
  message: {
    type: String,
    required: [true, 'Message is required.'],
    trim: true,
  },
  ipAddress: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// To prevent model overwrite errors in Next.js, check if the model already exists.
const Contact: Model<IContact> = mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;

