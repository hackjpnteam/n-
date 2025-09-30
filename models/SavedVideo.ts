import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISavedVideo extends Document {
  user: mongoose.Types.ObjectId;
  video: mongoose.Types.ObjectId;
  savedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SavedVideoSchema = new Schema<ISavedVideo>({
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
  savedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

SavedVideoSchema.index({ user: 1, video: 1 }, { unique: true });
SavedVideoSchema.index({ user: 1, savedAt: -1 });

const SavedVideo: Model<ISavedVideo> = mongoose.models.SavedVideo || mongoose.model<ISavedVideo>('SavedVideo', SavedVideoSchema);

export default SavedVideo;