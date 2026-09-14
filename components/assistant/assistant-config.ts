// components/assistant/assistant-config.ts
import type { AssistantPage } from './assistant-types';

export const PAGE_GREETINGS: Record<AssistantPage, string> = {
  dashboard: "I can help you understand your assessment performance and decide what to focus on next.",
  results: "I can help you understand your results, explain mistakes, and suggest what to review.",
  'knowledge-map': "I can help you explore your knowledge map and identify learning gaps.",
  practice: "I can help you choose what to practice and track your improvement.",
  assessment: "I can help you with strategies for this assessment.",
  progress: "I can help you understand your learning trends and set goals.",
  settings: "I can help you configure your learning preferences.",
};

export const QUICK_ACTIONS: Record<AssistantPage, { label: string; message: string }[]> = {
  dashboard: [
    { label: 'Explain my performance', message: 'Explain my overall performance across all assessments.' },
    { label: 'What should I practice?', message: 'Based on my data, what topics should I practice next?' },
    { label: 'My weakest concept', message: 'What is my weakest concept and how can I improve it?' },
    { label: 'Review latest assessment', message: 'Give me a summary of my most recent assessment.' },
  ],
  results: [
    { label: 'Explain my score', message: 'Explain my score on this assessment.' },
    { label: 'What did I get wrong?', message: 'Summarize the questions I got wrong.' },
    { label: 'Improvement tips', message: 'How can I improve based on these results?' },
  ],
  'knowledge-map': [
    { label: 'Explain my map', message: 'Explain my current knowledge map status.' },
    { label: 'What gaps do I have?', message: 'What knowledge gaps should I focus on?' },
  ],
  practice: [
    { label: 'What to practice?', message: 'What should I practice based on my weak areas?' },
    { label: 'Track my progress', message: 'How has my practice performance changed over time?' },
  ],
  assessment: [
    { label: 'Assessment tips', message: 'Give me tips for doing well on this assessment.' },
  ],
  progress: [
    { label: 'Explain my trends', message: 'Explain my learning trends and progress.' },
    { label: 'Set a goal', message: 'Suggest a realistic learning goal for me.' },
  ],
  settings: [
    { label: 'Help with settings', message: 'What settings should I configure for the best experience?' },
  ],
};
