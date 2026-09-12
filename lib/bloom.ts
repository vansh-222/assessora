// lib/bloom.ts
import { BloomLevel, BloomDistribution, AssessmentConfig } from '@/types';

export const BLOOM_LEVELS: BloomLevel[] = ['recall', 'understand', 'apply', 'codeTrace', 'analyze'];

export const BLOOM_LABELS: Record<BloomLevel, string> = {
  recall: 'Recall',
  understand: 'Understand',
  apply: 'Apply',
  codeTrace: 'Code Trace',
  analyze: 'Analyze',
};

export const BLOOM_DESCRIPTIONS: Record<BloomLevel, string> = {
  recall: 'Identify and remember key facts, terms, and definitions',
  understand: 'Explain concepts and interpret information in your own words',
  apply: 'Use concepts to solve new problems in different contexts',
  codeTrace: 'Trace through code execution and predict outputs',
  analyze: 'Break down complex ideas, find patterns, and draw conclusions',
};

export const BLOOM_COLORS: Record<BloomLevel, { bg: string; text: string; border: string }> = {
  recall: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  understand: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  apply: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  codeTrace: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  analyze: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
};

/**
 * Distribute question count evenly across selected bloom levels.
 * Always sums to questionCount exactly.
 */
export function computeBloomDistribution(
  config: Pick<AssessmentConfig, 'questionCount' | 'bloomLevels'>
): BloomDistribution {
  const { questionCount, bloomLevels } = config;
  if (bloomLevels.length === 0) return {};

  const base = Math.floor(questionCount / bloomLevels.length);
  const remainder = questionCount % bloomLevels.length;

  const dist: BloomDistribution = {};
  bloomLevels.forEach((level, i) => {
    dist[level] = base + (i < remainder ? 1 : 0);
  });
  return dist;
}

/**
 * Validate that a distribution sums to target.
 */
export function validateDistribution(dist: BloomDistribution, target: number): boolean {
  const total = Object.values(dist).reduce((a, b) => a + (b ?? 0), 0);
  return total === target;
}
