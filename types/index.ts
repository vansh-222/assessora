// types/index.ts

export type BloomLevel = 'recall' | 'understand' | 'apply' | 'codeTrace' | 'analyze';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type SubjectArea = 'programming' | 'science' | 'humanities' | 'mathematics' | 'other';
export type AssessmentStatus = 'active' | 'completed';

export interface Unit {
  id: string;
  title: string;
  description?: string;
  topics: string[];
}

export interface Topic {
  id: string;
  title: string;
  unitId?: string;
}

export interface MaterialAnalysis {
  subject: string;
  subjectArea: SubjectArea;
  units: Unit[];
  topics: Topic[];
  concepts: string[];
  rawText: string;
  isProgramming: boolean;
}

export interface BloomDistribution {
  recall?: number;
  understand?: number;
  apply?: number;
  codeTrace?: number;
  analyze?: number;
}

export interface AssessmentConfig {
  questionCount: 5 | 10;
  difficulty: Difficulty;
  bloomLevels: BloomLevel[];
  bloomDistribution: BloomDistribution;
  duration: number; // minutes
}

export interface Question {
  id: number;
  question: string;
  type: 'multiple_choice';
  options: string[];
  correctAnswer: string;
  explanation: string;
  topic: string;
  concept: string;
  bloomLevel: BloomLevel;
  difficulty: Difficulty;
  sourceConcept: string;
}

export interface Assessment {
  id: string;
  userId: string;
  title: string;
  subject: string;
  subjectArea: SubjectArea;
  sourceMaterial: MaterialAnalysis;
  sourceFileName?: string;
  topics: string[];
  concepts: string[];
  duration: number;
  difficulty: Difficulty;
  questionCount: number;
  bloomDistribution: BloomDistribution;
  questions: Question[];
  status: AssessmentStatus;
  createdAt: string;
}

export interface TopicStat {
  correct: number;
  total: number;
}

export interface BloomStat {
  correct: number;
  total: number;
}

export interface AttemptResult {
  id?: string;
  assessmentId: string;
  userId: string;
  answers: Record<number, string>;
  score: number;
  totalQuestions: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  percentage: number;
  timeTaken: number;
  topicPerformance: Record<string, TopicStat>;
  bloomPerformance: Partial<Record<BloomLevel, BloomStat>>;
  strengths: string[];
  weaknesses: string[];
  startedAt: string;
  submittedAt: string;
}

export interface ProcessingStep {
  label: string;
  status: 'pending' | 'active' | 'done';
}

export type PerformanceCategory = 'strong' | 'developing' | 'needs-attention';
