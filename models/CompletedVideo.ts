import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICompletedVideo extends Document {
  user: mongoose.Types.ObjectId;
  video: mongoose.Types.ObjectId;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CompletedVideoSchema = new Schema<ICompletedVideo>({
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
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

CompletedVideoSchema.index({ user: 1, video: 1 }, { unique: true });
CompletedVideoSchema.index({ user: 1, completedAt: -1 });

const CompletedVideo: Model<ICompletedVideo> = mongoose.models.CompletedVideo || mongoose.model<ICompletedVideo>('CompletedVideo', CompletedVideoSchema);

export default CompletedVideo;