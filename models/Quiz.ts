import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuiz extends Document {
  video: mongoose.Types.ObjectId;
  title: string;
  passThreshold: number;
  questions: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const QuizSchema = new Schema<IQuiz>({
  video: {
    type: Schema.Types.ObjectId,
    ref: 'Video',
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  passThreshold: {
    type: Number,
    default: 80,
    min: 0,
    max: 100
  },
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'Question'
  }]
}, {
  timestamps: true
});

QuizSchema.index({ video: 1 });

const Quiz: Model<IQuiz> = mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', QuizSchema);

export default Quiz;