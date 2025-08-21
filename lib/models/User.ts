import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

// Interface for the User document
export interface IUser extends Document {
  email: string;
  password?: string; // Optional because it's not always selected
  firstName: string;
  lastName: string;
}

const userSchema: Schema<IUser> = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    select: false, // Exclude password from query results by default
  },
  firstName: {
    type: String,
    required: [true, 'First name is required.'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required.'],
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

// This pre-save hook will automatically hash the password before saving it to the database.
userSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password') && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;