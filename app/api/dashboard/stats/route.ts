// app/api/dashboard/stats/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { Assessment } from '@/lib/models/Assessment';
import { Attempt } from '@/lib/models/Attempt';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const userId = session.user.id;

    const [totalAssessments, attempts, recentRaw] = await Promise.all([
      Assessment.countDocuments({ userId }),
      Attempt.find({ userId }).select('percentage weaknesses topicPerformance timeTaken').lean(),
      Assessment.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const completed = attempts.length;
    const avgScore =
      completed > 0
        ? Math.round(attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / completed)
        : 0;

    const totalStudyTimeSeconds = attempts.reduce((sum, a) => sum + (a.timeTaken || 0), 0);

    // Aggregate topic performance across all attempts
    const topicStats: Record<string, { correct: number; total: number }> = {};
    for (const attempt of attempts) {
      if (attempt.topicPerformance) {
        for (const [topic, stats] of Object.entries(attempt.topicPerformance as Record<string, { correct: number; total: number }>)) {
          if (!topicStats[topic]) topicStats[topic] = { correct: 0, total: 0 };
          topicStats[topic].correct += stats.correct;
          topicStats[topic].total += stats.total;
        }
      }
    }

    // Calculate concepts mastered (topics with >80% score and at least 3 questions)
    let conceptsMastered = 0;
    const needsAttention = [];

    for (const [topic, stats] of Object.entries(topicStats)) {
      if (stats.total > 0) {
        const percentage = Math.round((stats.correct / stats.total) * 100);
        if (percentage >= 80 && stats.total >= 3) {
          conceptsMastered++;
        }
        
        // Let's populate needsAttention with topics that have lowest scores
        needsAttention.push({
          topic,
          score: percentage,
          status: percentage < 60 ? 'Needs Practice' : percentage < 80 ? 'Developing' : 'Strong'
        });
      }
    }

    // Sort needsAttention by lowest score first, take top 4
    needsAttention.sort((a, b) => a.score - b.score);
    const topNeedsAttention = needsAttention.slice(0, 4);

    // Fetch latest attempt for each recent assessment
    const recentAssessments = await Promise.all(
      recentRaw.map(async (a) => {
        const latestAttempt = await Attempt.findOne({ assessmentId: a._id.toString() })
          .sort({ submittedAt: -1 })
          .select('_id percentage')
          .lean();

        return {
          id: a._id.toString(),
          title: a.title,
          subject: a.subject,
          difficulty: a.difficulty,
          questionCount: a.questionCount,
          status: a.status,
          createdAt: a.createdAt,
          score: latestAttempt ? latestAttempt.percentage : null,
          attemptId: latestAttempt ? latestAttempt._id.toString() : null,
        };
      })
    );

    return NextResponse.json({
      totalAssessments,
      completed,
      avgScore,
      needsAttention: topNeedsAttention,
      recentAssessments,
      totalStudyTimeSeconds,
      conceptsMastered
    });
  } catch (err) {
    console.error('[dashboard/stats]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
