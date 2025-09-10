import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInstructor extends Document {
  name: string;
  title?: string;
  bio?: string;
  avatarUrl?: string;
  socials?: {
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    website?: string;
  };
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const InstructorSchema = new Schema<IInstructor>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  avatarUrl: {
    type: String,
    trim: true
  },
  socials: {
    twitter: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    youtube: { type: String, trim: true },
    website: { type: String, trim: true }
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

InstructorSchema.index({ name: 'text', bio: 'text', title: 'text' });
InstructorSchema.index({ tags: 1 });
InstructorSchema.index({ createdAt: -1 });

const Instructor: Model<IInstructor> = mongoose.models.Instructor || mongoose.model<IInstructor>('Instructor', InstructorSchema);

export default Instructor;