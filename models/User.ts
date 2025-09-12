import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  createdAt: Date;
  profile?: {
    company?: string;
    position?: string;
    companyUrl?: string;
    bio?: string;
    avatarUrl?: string;
  };
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  profile: {
    company: { type: String, trim: true },
    position: { type: String, trim: true },
    companyUrl: { type: String, trim: true },
    bio: { type: String, trim: true },
    avatarUrl: { type: String, trim: true }
  }
}, {
  timestamps: true
});

// Index for queries
UserSchema.index({ email: 1 });
UserSchema.index({ 'profile.company': 1 });
UserSchema.index({ createdAt: -1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;