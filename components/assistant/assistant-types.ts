// components/assistant/assistant-types.ts

export type AssistantPage = 'dashboard' | 'results' | 'knowledge-map' | 'practice' | 'assessment' | 'progress' | 'settings';

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: AssistantAction[];
  insights?: string[];
}

export interface AssistantAction {
  label: string;
  action: 'practice' | 'view-results' | 'open-knowledge-map' | 'view-assessment' | 'review-question' | 'create-assessment';
  payload?: Record<string, unknown>;
}

export interface AssistantContext {
  page: AssistantPage;
  user?: { name: string; email: string };
  averageScore?: number;
  totalAssessments?: number;
  completedAssessments?: number;
  recentAssessments?: { title: string; subject: string; score: number; date: string }[];
  topicPerformance?: Record<string, { correct: number; total: number }>;
  bloomPerformance?: Record<string, { correct: number; total: number }>;
  weakConcepts?: string[];
  strongConcepts?: string[];
  conceptsMastered?: number;
  totalStudyTime?: number;
}

export interface AssistantAPIRequest {
  message: string;
  context: AssistantContext;
  history: { role: 'user' | 'assistant'; content: string }[];
}

export interface AssistantAPIResponse {
  message: string;
  insights?: string[];
  actions?: AssistantAction[];
}
