// /lib/models/Message.ts

import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// This interface is for client-side use, ensuring _id is a string.
export interface IMessage {
  _id: string;
  sessionId: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  timezone: string;
}

// This interface is for the Mongoose Document, where _id can be an ObjectId.
export interface IMessageDocument extends Document {
  _id: Types.ObjectId;
  sessionId: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  timezone: string;
}

const messageSchema: Schema<IMessageDocument> = new Schema({
  sessionId: { type: String, required: true, index: true },
  text: { type: String, required: true },
  sender: { type: String, enum: ['user', 'bot'], required: true },
  timestamp: { type: Date, default: Date.now },
  timezone: { type: String, required: true },
});

const Message: Model<IMessageDocument> =
  mongoose.models.Message || mongoose.model<IMessageDocument>('Message', messageSchema);

export default Message;
