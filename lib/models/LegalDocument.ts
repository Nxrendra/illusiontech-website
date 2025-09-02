import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface ILegalDocumentData {
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILegalDocument extends ILegalDocumentData, Document {}

const LegalDocumentSchema = new Schema<ILegalDocument>({
  title: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, index: true },
  content: { type: String, default: '' },
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

LegalDocumentSchema.pre<ILegalDocument>('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/&/g, '-and-')          // Replace & with 'and'
      .replace(/[^a-z0-9\s-]/g, '')   // Remove invalid chars
      .replace(/\s+/g, '-')           // Collapse whitespace and replace by -
      .replace(/-+/g, '-');           // Collapse dashes
  }
  next();
});

const LegalDocument: Model<ILegalDocument> = models.LegalDocument || mongoose.model<ILegalDocument>('LegalDocument', LegalDocumentSchema);

export default LegalDocument;