import mongoose, { Schema, Document, Model } from 'mongoose';

export type QuestionType = 'MCQ' | 'MultiSelect' | 'TrueFalse';

export interface IChoice {
  key: string;
  text: string;
}

export interface IQuestion extends Document {
  quiz: mongoose.Types.ObjectId;
  type: QuestionType;
  prompt: string;
  choices?: IChoice[];
  correctKeys?: string[];
  explanation?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  quiz: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  type: {
    type: String,
    enum: ['MCQ', 'MultiSelect', 'TrueFalse'],
    required: true
  },
  prompt: {
    type: String,
    required: true,
    trim: true
  },
  choices: [{
    key: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  }],
  correctKeys: [{
    type: String
  }],
  explanation: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

QuestionSchema.index({ quiz: 1 });

const Question: Model<IQuestion> = mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;