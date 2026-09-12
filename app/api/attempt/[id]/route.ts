// app/api/attempt/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { Attempt } from '@/lib/models/Attempt';
import { Assessment } from '@/lib/models/Assessment';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    await connectDB();

    const attempt = await Attempt.findById(id).lean();
    if (!attempt) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    if (attempt.userId !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const assessment = await Assessment.findById(attempt.assessmentId).lean();
    if (!assessment) return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });

    return NextResponse.json({
      attempt: {
        ...attempt,
        id: attempt._id.toString(),
      },
      assessment: {
        id:                assessment._id.toString(),
        title:             assessment.title,
        subject:           assessment.subject,
        duration:          assessment.duration,
        difficulty:        assessment.difficulty,
        bloomDistribution: assessment.bloomDistribution,
        questions:         assessment.questions, // Includes correct answers for review
      },
    });

  } catch (err) {
    console.error('[attempt/get]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
