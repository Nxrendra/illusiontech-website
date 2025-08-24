import mongoose, { Schema, Document, models } from 'mongoose';

// This interface represents the plain data structure of a service, without Mongoose's methods.
export interface IServiceData {
  slug?: string; // A unique, URL-friendly slug for the service
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
  slug: { type: String, unique: true, index: true },
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

// Pre-save hook to generate a unique, URL-friendly slug from the service name.
// This ensures that every service has a consistent identifier for URLs and anchors.
ServiceSchema.pre<IService>('save', async function(next) {
  // Generate or update the slug if the name changes or it's a new document.
  if (this.isNew || this.isModified('name')) {
    const generateBaseSlug = (name: string): string => {
      return name
        .toLowerCase()
        .replace(/&/g, 'and') // Replace ampersands
        .replace(/[^\w\s-]/g, '') // Remove all non-word, non-space, non-hyphen chars
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with a single hyphen
        .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens
    };

    const ServiceModel = this.constructor as mongoose.Model<IService>;
    const baseSlug = generateBaseSlug(this.name);
    let slug = baseSlug;
    let counter = 1;

    // If a service with this slug already exists, append a number until we find a unique slug
    while (await ServiceModel.findOne({ slug, _id: { $ne: this._id } })) {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    this.slug = slug;
  }
  next();
});

const Service = models.Service || mongoose.model<IService>('Service', ServiceSchema);

export default Service;
