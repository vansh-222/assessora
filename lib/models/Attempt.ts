// lib/models/Attempt.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAttempt extends Document {
  _id: mongoose.Types.ObjectId;
  assessmentId: string;
  userId: string;
  answers: Record<string, string>;   // questionId -> chosen option text
  correct: number;
  incorrect: number;
  unanswered: number;
  totalQuestions: number;
  score: number;                      // raw points
  percentage: number;
  timeTaken: number;                  // seconds
  startedAt: Date;
  submittedAt: Date;
  strengths: string[];
  weaknesses: string[];
  bloomPerformance: Record<string, { correct: number; total: number }>;
  topicPerformance: Record<string, { correct: number; total: number }>;
  createdAt: Date;
  updatedAt: Date;
}

const AttemptSchema = new Schema<IAttempt>(
  {
    assessmentId:    { type: String, required: true, index: true },
    userId:          { type: String, required: true, index: true },
    answers:         { type: Schema.Types.Mixed, default: {} },
    correct:         { type: Number, default: 0 },
    incorrect:       { type: Number, default: 0 },
    unanswered:      { type: Number, default: 0 },
    totalQuestions:  { type: Number, required: true },
    score:           { type: Number, default: 0 },
    percentage:      { type: Number, default: 0 },
    timeTaken:       { type: Number, default: 0 },
    startedAt:       { type: Date },
    submittedAt:     { type: Date, default: Date.now },
    strengths:       [{ type: String }],
    weaknesses:      [{ type: String }],
    bloomPerformance:{ type: Schema.Types.Mixed, default: {} },
    topicPerformance:{ type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Attempt: Model<IAttempt> =
  mongoose.models.Attempt || mongoose.model<IAttempt>('Attempt', AttemptSchema);
