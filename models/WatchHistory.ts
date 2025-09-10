import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWatchHistory extends Document {
  user: string; // User email or ID
  video: mongoose.Types.ObjectId;
  watchedAt: Date;
  progress: number; // Percentage of video watched (0-100)
  completed: boolean;
}

const WatchHistorySchema = new Schema<IWatchHistory>({
  user: {
    type: String,
    required: true,
    index: true
  },
  video: {
    type: Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  watchedAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
WatchHistorySchema.index({ user: 1, video: 1 });
WatchHistorySchema.index({ user: 1, watchedAt: -1 });

const WatchHistory: Model<IWatchHistory> = mongoose.models.WatchHistory || mongoose.model<IWatchHistory>('WatchHistory', WatchHistorySchema);

export default WatchHistory;