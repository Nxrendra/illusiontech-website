import mongoose, { Schema, Document, models, Model } from 'mongoose';

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
  keyFeatures?: { title: string; description: string; section?: string }[];
  link?: string;
  themeName?: string; // The name of the selected theme preset
  theme?: {
    gradient?: string;
    accentClass?: string;
    buttonClass?: string;
  };
  featured?: boolean;
  isCoreService?: boolean;
  homepagePosition?: number;
  position?: number;
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
  keyFeatures: { type: [{ title: String, description: String, section: String }], default: [] },
  link: { type: String },
  themeName: { type: String, default: 'Default' },
  theme: {
    gradient: { type: String },
    accentClass: { type: String },
    buttonClass: { type: String },
  },
  featured: { type: Boolean, default: false },
  isCoreService: { type: Boolean, default: false },
  homepagePosition: { type: Number, default: 99, index: true },
  position: { type: Number, default: 99, index: true },
}, {
  timestamps: true
});

// This single pre-save hook handles both slug and link generation to ensure they are always in sync.
// It runs on every save to correct any stale data and handle name changes gracefully.
ServiceSchema.pre<IService>('save', function(next) {
  // --- 1. Slug Generation ---
  // We generate the slug from the name. This is the source of truth for the URL part.
  if (this.name) {
    // Special case for "Automation & Integration" to match the existing page route /services/automation
    const nameForSlug = this.name === 'Automation & Integration' ? 'Automation' : this.name;

    this.slug = nameForSlug.toLowerCase()
      .replace(/\//g, '-')          // Replace slashes with hyphens
      .replace(/[^a-z0-9\s-]/g, '') // Remove other non-alphanumeric chars
      .replace(/\s+/g, '-')       // Replace spaces with hyphens
      .replace(/-+/g, '-');       // Replace multiple hyphens with a single one
  }

  // --- 2. Link Generation ---
  // We generate the link based on the newly generated slug and the service type.
  // This runs every time to ensure the link is always correct.
  if (this.slug && this.type) {
    let generatedLink = '';
    switch (this.type) {
      case 'web-development':
        generatedLink = `/services/web-development#${this.slug}`;
        break;
      case 'support':
        generatedLink = `/services/support-maintenance#${this.slug}`;
        break;
      case 'design':
      case 'automation':
        // These types link to their own dedicated page, using the slug for the path.
        generatedLink = `/services/${this.slug}`;
        break;
      case 'support-main':
        generatedLink = `/services/support-maintenance`;
        break;
      default:
        generatedLink = `/services#${this.slug}`;
        break;
    }
    this.link = generatedLink;
  }

  next();
});

const Service: Model<IService> = models.Service || mongoose.model<IService>('Service', ServiceSchema);

export default Service;
