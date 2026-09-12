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
      Attempt.find({ userId }).select('percentage weaknesses').lean(),
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

    const weakAreaMap: Record<string, number> = {};
    for (const attempt of attempts) {
      const weaknesses = attempt.weaknesses || [];
      for (const w of weaknesses) {
        weakAreaMap[w] = (weakAreaMap[w] || 0) + 1;
      }
    }
    const needsAttention = Object.entries(weakAreaMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([topic]) => topic);

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
      needsAttention,
      recentAssessments,
    });
  } catch (err) {
    console.error('[dashboard/stats]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
