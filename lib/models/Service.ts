import mongoose, { Schema, Document, models } from 'mongoose';

// This interface represents the plain data structure of a service, without Mongoose's methods.
export interface IServiceData {
  slug?: string; // A unique, URL-friendly slug for the service
  type: 'web-development' | 'design' | 'website-design' | 'automation' | 'support' | 'support-main';
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
  keyFeatures: { type: [{ title: String, description: String }], default: [] },
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

// Pre-save hook to automatically generate the service link from its slug and type.
ServiceSchema.pre<IService>('save', async function(next) {
  if (this.isModified('slug') || this.isModified('type')) {
    let generatedLink = '';
    // Determine the base path based on the service type
    switch (this.type) {
      case 'web-development':
        // Services of type 'web-development' are sections on the /services/web-development page
        generatedLink = `/services/web-development#${this.slug}`;
        break;
      case 'support':
        // Services of type 'support' are sections on the /services/support-maintenance page
        generatedLink = `/services/support-maintenance#${this.slug}`;
        break;
      case 'website-design':
      case 'design':
      case 'automation':
        // For these types, the slug itself defines the page route.
        // e.g., a service named "UI/UX Design" has slug "ui-ux-design" and page "/services/ui-ux-design"
        generatedLink = `/services/${this.slug}`;
        break;
      case 'support-main':
        // This is a special case for the summary card.
        generatedLink = `/services/support-maintenance`;
        break;
      default:
        // Fallback for any other types, linking to a section on the main services page.
        generatedLink = `/services#${this.slug}`;
        break;
    }
    this.link = generatedLink;
  }
  next();
});

const Service = models.Service || mongoose.model<IService>('Service', ServiceSchema);

export default Service;
