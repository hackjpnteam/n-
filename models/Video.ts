import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVideoStats {
  views: number;
  avgWatchRate?: number;
}

export interface IVideo extends Document {
  title: string;
  description: string;
  durationSec: number;
  thumbnailUrl: string;
  sourceUrl: string;
  instructor: mongoose.Types.ObjectId;
  stats: IVideoStats;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  durationSec: {
    type: Number,
    required: true,
    min: 0
  },
  thumbnailUrl: {
    type: String,
    required: true,
    trim: true
  },
  sourceUrl: {
    type: String,
    required: true,
    trim: true
  },
  instructor: {
    type: Schema.Types.ObjectId,
    ref: 'Instructor',
    required: true
  },
  stats: {
    views: {
      type: Number,
      default: 0,
      min: 0
    },
    avgWatchRate: {
      type: Number,
      min: 0,
      max: 100
    }
  }
}, {
  timestamps: true
});

VideoSchema.index({ instructor: 1 });
VideoSchema.index({ createdAt: -1 });
VideoSchema.index({ 'stats.views': -1 });
VideoSchema.index({ title: 'text', description: 'text' });

const Video: Model<IVideo> = mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);

export default Video;