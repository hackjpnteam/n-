import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProgress extends Document {
  user: mongoose.Types.ObjectId;
  video: mongoose.Types.ObjectId;
  status: 'in_progress' | 'completed';
  watchedSeconds: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressSchema = new Schema<IProgress>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  video: {
    type: Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed'],
    default: 'in_progress'
  },
  watchedSeconds: {
    type: Number,
    default: 0,
    min: 0
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

ProgressSchema.index({ user: 1, video: 1 }, { unique: true });
ProgressSchema.index({ user: 1, status: 1 });
ProgressSchema.index({ video: 1, status: 1 });

ProgressSchema.pre('save', function(next) {
  if (this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

const Progress: Model<IProgress> = mongoose.models.Progress || mongoose.model<IProgress>('Progress', ProgressSchema);

export default Progress;