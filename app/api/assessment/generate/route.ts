// app/api/assessment/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { Assessment } from '@/lib/models/Assessment';
import { generateQuestions } from '@/lib/generate';
import type { MaterialAnalysis, AssessmentConfig } from '@/types';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, analysis, config, sourceFileName } = body as {
      title: string;
      analysis: MaterialAnalysis;
      config: AssessmentConfig;
      sourceFileName?: string;
    };

    if (!analysis || !config) {
      return NextResponse.json({ error: 'Missing analysis or config' }, { status: 400 });
    }

    // Generate questions via Gemini
    const questions = await generateQuestions(analysis, config);

    if (!questions || questions.length === 0) {
      return NextResponse.json({ error: 'Failed to generate questions. Please try again.' }, { status: 500 });
    }

    await connectDB();

    const assessment = await Assessment.create({
      userId:            session.user.id,
      title:             title || `${analysis.subject} Assessment`,
      subject:           analysis.subject,
      difficulty:        config.difficulty,
      questionCount:     questions.length,
      duration:          config.duration,
      bloomDistribution: config.bloomDistribution as unknown as Record<string, number>,
      questions,
      analysis,
      status:            'ready',
      sourceFileName,
    });

    return NextResponse.json({ assessmentId: assessment._id.toString() }, { status: 201 });

  } catch (err) {
    console.error('[assessment/generate]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Generation failed' },
      { status: 500 }
    );
  }
}
