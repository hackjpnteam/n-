import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnswer {
  questionId: mongoose.Types.ObjectId;
  selectedKeys: string[];
}

export interface IQuizAttempt extends Document {
  quiz: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  video: mongoose.Types.ObjectId;
  answers: IAnswer[];
  score: number;
  passed: boolean;
  takenAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const QuizAttemptSchema = new Schema<IQuizAttempt>({
  quiz: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
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
  answers: [{
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    selectedKeys: [{
      type: String
    }]
  }],
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  passed: {
    type: Boolean,
    required: true
  },
  takenAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

QuizAttemptSchema.index({ user: 1, quiz: 1 });
QuizAttemptSchema.index({ user: 1, video: 1 });
QuizAttemptSchema.index({ quiz: 1, passed: 1 });
QuizAttemptSchema.index({ takenAt: -1 });

const QuizAttempt: Model<IQuizAttempt> = mongoose.models.QuizAttempt || mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);

export default QuizAttempt;