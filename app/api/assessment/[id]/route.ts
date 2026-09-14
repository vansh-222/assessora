// app/api/assessment/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
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

    const assessment = await Assessment.findById(id).lean();
    if (!assessment) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (assessment.userId !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // Strip correct answers from questions before sending to client
    const safeQuestions = assessment.questions.map((q: any) => ({
      id:          q.id,
      question:    q.question,
      type:        q.type,
      options:     q.options,
      explanation: q.explanation,
      topic:       q.topic,
      concept:     q.concept,
      bloomLevel:  q.bloomLevel,
      difficulty:  q.difficulty,
      // correctAnswer intentionally omitted
    }));

    return NextResponse.json({
      id:            assessment._id.toString(),
      title:         assessment.title,
      subject:       assessment.subject,
      duration:      assessment.duration,
      questionCount: assessment.questionCount,
      difficulty:    assessment.difficulty,
      status:        assessment.status,
      questions:     safeQuestions,
    });

  } catch (err) {
    console.error('[assessment/get]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    await connectDB();

    const assessment = await Assessment.findById(id).lean();
    if (!assessment) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (assessment.userId !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // Delete attempts for this assessment
    const { Attempt } = await import('@/lib/models/Attempt');
    await Attempt.deleteMany({ assessmentId: id });

    // Delete assessment
    await Assessment.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[assessment/delete]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
