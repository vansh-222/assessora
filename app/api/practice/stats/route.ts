// app/api/practice/stats/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { Attempt } from '@/lib/models/Attempt';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const attempts = await Attempt.find({ userId: session.user.id })
      .select('bloomPerformance topicPerformance')
      .lean();

    // Aggregate bloom performance
    const bloomAgg: Record<string, { correct: number; total: number }> = {};
    const topicAgg: Record<string, { correct: number; total: number }> = {};

    for (const attempt of attempts) {
      if (attempt.bloomPerformance) {
        for (const [level, stat] of Object.entries(attempt.bloomPerformance as Record<string, { correct: number; total: number }>)) {
          if (!bloomAgg[level]) bloomAgg[level] = { correct: 0, total: 0 };
          bloomAgg[level].correct += stat.correct;
          bloomAgg[level].total += stat.total;
        }
      }
      if (attempt.topicPerformance) {
        for (const [topic, stat] of Object.entries(attempt.topicPerformance as Record<string, { correct: number; total: number }>)) {
          if (!topicAgg[topic]) topicAgg[topic] = { correct: 0, total: 0 };
          topicAgg[topic].correct += stat.correct;
          topicAgg[topic].total += stat.total;
        }
      }
    }

    const LABELS: Record<string, string> = {
      recall: 'Recall', understand: 'Understand', apply: 'Apply',
      codeTrace: 'Code Trace', analyze: 'Analyze',
    };

    const bloomStats = Object.entries(bloomAgg).map(([level, stat]) => ({
      level,
      label: LABELS[level] || level,
      correct: stat.correct,
      total: stat.total,
      percentage: stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0,
    }));

    const topicStats = Object.entries(topicAgg)
      .map(([topic, stat]) => {
        const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
        return {
          topic,
          score: pct,
          status: pct < 60 ? 'Needs Practice' : pct < 80 ? 'Developing' : 'Strong',
          correct: stat.correct,
          total: stat.total,
        };
      })
      .sort((a, b) => a.score - b.score);

    return NextResponse.json({ bloomStats, topicStats });
  } catch (err) {
    console.error('[practice/stats]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
