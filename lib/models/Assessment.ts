// lib/models/Assessment.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import type { BloomDistribution, Question, MaterialAnalysis } from '@/types';

export interface IAssessment extends Document {
  _id: mongoose.Types.ObjectId;
  userId: string;
  title: string;
  subject: string;
  difficulty: string;
  questionCount: number;
  duration: number;
  bloomDistribution: Record<string, number>;
  questions: Question[];
  analysis: MaterialAnalysis;
  status: 'ready' | 'completed';
  sourceFileName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema({
  id:           { type: Number, required: true },
  question:     { type: String, required: true },
  type:         { type: String, default: 'mcq' },
  options:      [{ type: String }],
  correctAnswer:{ type: String, required: true },
  explanation:  { type: String, required: true },
  topic:        { type: String, required: true },
  concept:      { type: String, default: '' },
  bloomLevel:   { type: String, required: true },
  difficulty:   { type: String, required: true },
}, { _id: false });

const AssessmentSchema = new Schema<IAssessment>(
  {
    userId:           { type: String, required: true, index: true },
    title:            { type: String, required: true },
    subject:          { type: String, required: true },
    difficulty:       { type: String, required: true, default: 'medium' },
    questionCount:    { type: Number, required: true },
    duration:         { type: Number, required: true, default: 20 },
    bloomDistribution:{ type: Schema.Types.Mixed, default: {} },
    questions:        [QuestionSchema],
    analysis:         { type: Schema.Types.Mixed },
    status:           { type: String, enum: ['ready', 'completed'], default: 'ready' },
    sourceFileName:   { type: String },
  },
  { timestamps: true }
);

export const Assessment: Model<IAssessment> =
  mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', AssessmentSchema);
