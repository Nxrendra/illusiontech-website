import { Schema, model, models, Document, Types, Model } from 'mongoose';

export interface IPriceBreakdownItem {
  name: string;
  price: string;
  description?: string;
}

export interface IPriceBreakdownSection {
  title: string;
  idealFor?: string;
  description?: string;
  items: IPriceBreakdownItem[];
  totalPrice: string;
}

export interface IPriceBreakdownData {
  title: string;
  slug: string;
  serviceId: Types.ObjectId;
  summary: string;
  priceRange: string;
  timeframe: string;
  sections: IPriceBreakdownSection[];
  notes?: string;
}

export interface IPriceBreakdown extends IPriceBreakdownData, Document {}

const PriceBreakdownItemSchema = new Schema<IPriceBreakdownItem>({ name: { type: String, required: true }, price: { type: String, required: true }, description: { type: String } }, { _id: false });

const PriceBreakdownSectionSchema = new Schema<IPriceBreakdownSection>({ title: { type: String, required: true }, idealFor: { type: String }, description: { type: String }, items: [PriceBreakdownItemSchema], totalPrice: { type: String, required: true } }, { _id: false });

const PriceBreakdownSchema = new Schema<IPriceBreakdown>({
  title: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, index: true },
  serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  summary: { type: String, required: true },
  priceRange: { type: String, required: true },
  timeframe: { type: String, required: true },
  sections: [PriceBreakdownSectionSchema],
  notes: { type: String },
}, { timestamps: true });

const PriceBreakdown: Model<IPriceBreakdown> = models.PriceBreakdown || model<IPriceBreakdown>('PriceBreakdown', PriceBreakdownSchema);

export default PriceBreakdown;
