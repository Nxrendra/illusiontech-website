import mongoose, { Schema, Document, models } from 'mongoose';

export interface IPageContentData {
  contactHeroHeading?: string;
  contactHeroSubheading?: string;
  contactInfoHeading?: string;
  contactInfoSubheading?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  contactWorkingHours?: string;
  contactFormStep1Heading?: string;
  contactFormStep2Heading?: string;
  contactFormStep3Heading?: string;
  projectTimelines?: { value: string; label: string }[];
  maintenanceContractLengths?: { value: string; label: string }[];
}

export interface IPageContent extends IPageContentData, Document {}

const PageContentSchema: Schema = new Schema({
  contactHeroHeading: { type: String, default: "Let's Build Something Great Together" },
  contactHeroSubheading: { type: String, default: "Have a project in mind or just want to say hello? We'd love to hear from you. Fill out the form below or use our contact details to reach out." },
  contactInfoHeading: { type: String, default: 'Contact Information' },
  contactInfoSubheading: { type: String, default: 'Our team is available to answer your questions and discuss your project needs.' },
  contactEmail: { type: String, default: 'illusiontechdev@gmail.com' },
  contactPhone: { type: String, default: '+1 (868) 467-1453' },
  contactAddress: { type: String, default: 'Remote, Trinidad and Tobago' },
  contactWorkingHours: { type: String, default: 'Mon - Fri: 9:00 AM - 5:00 PM\nSaturday: 8:00 AM - 12:00 PM' },
  contactFormStep1Heading: { type: String, default: 'What can we help you with?' },
  contactFormStep2Heading: { type: String, default: 'Tell us more' },
  contactFormStep3Heading: { type: String, default: 'Your Contact Information' },
  projectTimelines: {
    type: [{ value: String, label: String }],
    default: [
      { value: '1w', label: '1 Week' },
      { value: '2-3w', label: '2-3 Weeks' },
      { value: '1m', label: '1 Month' },
      { value: '2m', label: '2 Months' },
      { value: '3m', label: '3 Months' },
      { value: 'flexible', label: 'Flexible' }
    ]
  },
  maintenanceContractLengths: {
    type: [{ value: String, label: String }],
    default: [
      { value: 'monthly', label: 'Monthly' },
      { value: 'quarterly', label: 'Quarterly (3 months)' },
      { value: 'annually', label: 'Annually (1 year)' },
      { value: 'flexible', label: 'Flexible' },
    ]
  },
}, { timestamps: true });

const PageContent = models.PageContent || mongoose.model<IPageContent>('PageContent', PageContentSchema);

export default PageContent;