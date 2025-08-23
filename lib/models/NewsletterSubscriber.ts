import mongoose, { Document, Model, Schema } from 'mongoose';

export interface INewsletterSubscriber extends Document {
  email: string;
  subscribed_at: Date;
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>({
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    lowercase: true,
    trim: true,
    // Using a more common and slightly more specific regex for email validation, aligned with other models.
    // Also corrected the typo in the error message.
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address.'],
  },
  subscribed_at: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model recompilation if it already exists
const NewsletterSubscriber: Model<INewsletterSubscriber> =
  mongoose.models.NewsletterSubscriber ||
  mongoose.model<INewsletterSubscriber>('NewsletterSubscriber', NewsletterSubscriberSchema, 'newsletter_subscribers');

export default NewsletterSubscriber;