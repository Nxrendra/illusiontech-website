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
  // Generate the slug ONLY when the document is new. This makes the slug immutable.
  if (this.isNew) {
    if (!this.name || this.name.trim() === '') {
      // Prevent saving if the name is empty, which would result in an empty slug.
      return next(new Error('Service name is required to generate a slug.'));
    }

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

    // This loop handles the rare case of a slug collision. In a concurrent environment,
    // two services with the same name could be created at the same time. This loop
    // ensures that if the generated slug already exists, we append a short random
    // string until we find a unique one. This is more robust than a simple counter.
    let attempts = 0;
    while (await ServiceModel.findOne({ slug })) {
      attempts++;
      // After 5 attempts, something is likely wrong, so we throw an error
      // to prevent an infinite loop.
      if (attempts > 5) {
        return next(new Error(`Failed to generate a unique slug for "${this.name}" after ${attempts} attempts.`));
      }
      const randomSuffix = Math.random().toString(36).substring(2, 7); // e.g., "a1b2c"
      slug = `${baseSlug}-${randomSuffix}`;
    }

    this.slug = slug;
  }

  // Always update the link if the slug or type has been modified.
  // This ensures the link is always in sync with the slug and type.
  if (this.isNew || this.isModified('type')) {
    // The `web-development` services have their own page. Other services are sections on the main /services page.
    const basePath = this.type === 'web-development' ? '/services/web-development' : '/services';
    this.link = `${basePath}#${this.slug}`;
  }

  next();
});

const Service = models.Service || mongoose.model<IService>('Service', ServiceSchema);

export default Service;
