// app/api/assessment/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { Assessment } from '@/lib/models/Assessment';
import { Attempt } from '@/lib/models/Attempt';
import { scoreAttempt } from '@/lib/scoring';
import { z } from 'zod';

const schema = z.object({
  assessmentId: z.string(),
  answers:      z.record(z.string()),
  timeTaken:    z.number().min(0),
  startedAt:    z.string().datetime(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { assessmentId, answers, timeTaken, startedAt } = schema.parse(body);

    await connectDB();

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }
    if (assessment.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Score on the server using secure assessment questions
    const scoringResult = scoreAttempt(assessment.questions, answers, timeTaken, assessmentId, session.user.id, startedAt);

    // Create attempt
    const attempt = await Attempt.create({
      assessmentId,
      userId:           session.user.id,
      answers,
      correct:          scoringResult.correct,
      incorrect:        scoringResult.incorrect,
      unanswered:       scoringResult.unanswered,
      totalQuestions:   assessment.questionCount,
      score:            scoringResult.score,
      percentage:       scoringResult.percentage,
      timeTaken,
      startedAt:        new Date(startedAt),
      submittedAt:      new Date(),
      strengths:        scoringResult.strengths,
      weaknesses:       scoringResult.weaknesses,
      bloomPerformance: scoringResult.bloomPerformance,
      topicPerformance: scoringResult.topicPerformance,
    });

    // Mark assessment as completed
    if (assessment.status !== 'completed') {
      assessment.status = 'completed';
      await assessment.save();
    }

    return NextResponse.json({ attemptId: attempt._id.toString() }, { status: 201 });

  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    console.error('[assessment/submit]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
