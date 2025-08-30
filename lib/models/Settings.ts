import { Schema, model, models, Document } from 'mongoose';

export interface ISettings extends Document {
  siteName: string;
  siteDescription: string;
  // Future settings like logo URL, theme color, etc., can be added here.
}

const SettingsSchema = new Schema<ISettings>({
  siteName: { type: String, default: 'IllusionTech' },
  siteDescription: { type: String, default: 'High-performance web solutions and automation.' },
}, { timestamps: true });

const Settings = models.Settings || model<ISettings>('Settings', SettingsSchema);

export default Settings;

