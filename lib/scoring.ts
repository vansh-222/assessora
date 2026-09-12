// lib/scoring.ts
import { Question, AttemptResult, BloomLevel, BloomStat, TopicStat } from '@/types';
import { pct } from './utils';

export function scoreAttempt(
  questions: Question[],
  answers: Record<number, string>,
  timeTaken: number,
  assessmentId: string,
  userId: string,
  startedAt: string
): AttemptResult {
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;

  const topicPerformance: Record<string, TopicStat> = {};
  const bloomPerformance: Partial<Record<BloomLevel, BloomStat>> = {};

  for (const q of questions) {
    const answer = answers[q.id];
    const isAnswered = answer !== undefined && answer !== null && answer !== '';
    const isCorrect = isAnswered && answer === q.correctAnswer;

    if (!isAnswered) {
      unanswered++;
    } else if (isCorrect) {
      correct++;
    } else {
      incorrect++;
    }

    // Topic performance
    if (!topicPerformance[q.topic]) {
      topicPerformance[q.topic] = { correct: 0, total: 0 };
    }
    topicPerformance[q.topic].total++;
    if (isCorrect) topicPerformance[q.topic].correct++;

    // Bloom performance
    if (!bloomPerformance[q.bloomLevel]) {
      bloomPerformance[q.bloomLevel] = { correct: 0, total: 0 };
    }
    bloomPerformance[q.bloomLevel]!.total++;
    if (isCorrect) bloomPerformance[q.bloomLevel]!.correct++;
  }

  const total = questions.length;
  const percentage = pct(correct, total);

  // Strength/weakness analysis
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  for (const [topic, stat] of Object.entries(topicPerformance)) {
    const p = pct(stat.correct, stat.total);
    if (p >= 80) strengths.push(topic);
    else if (p < 60) weaknesses.push(topic);
  }

  return {
    assessmentId,
    userId,
    answers,
    score: correct,
    totalQuestions: total,
    correct,
    incorrect,
    unanswered,
    percentage,
    timeTaken,
    topicPerformance,
    bloomPerformance,
    strengths,
    weaknesses,
    startedAt,
    submittedAt: new Date().toISOString(),
  };
}
