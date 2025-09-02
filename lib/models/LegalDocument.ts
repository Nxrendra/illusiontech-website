import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface ILegalDocumentData {
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  isPubliclyVisible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILegalDocument extends ILegalDocumentData, Document {}

const LegalDocumentSchema = new Schema<ILegalDocument>({
  title: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, index: true },
  content: { type: String, default: '' },
  isPublished: { type: Boolean, default: false },
  isPubliclyVisible: { type: Boolean, default: false },
}, { timestamps: true });

const LegalDocument: Model<ILegalDocument> = models.LegalDocument || mongoose.model<ILegalDocument>('LegalDocument', LegalDocumentSchema);

export default LegalDocument;