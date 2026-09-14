// app/api/practice/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { Assessment } from '@/lib/models/Assessment';
import { generateJSON } from '@/lib/groq';
import { validateQuestions } from '@/lib/validate';
import type { Question } from '@/types';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { topics, difficulty = 'medium', bloomLevel, questionCount = 5 } = body;

    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return NextResponse.json({ error: 'No topics provided' }, { status: 400 });
    }

    const count = Math.min(Math.max(questionCount, 3), 20);
    const difficultyLabel = difficulty || 'medium';
    const bloomInstruction = bloomLevel
      ? `All questions must be at the "${bloomLevel}" Bloom's taxonomy level.`
      : 'Use a mix of Bloom taxonomy levels (recall, understand, apply, analyze).';

    const prompt = `You are an expert academic assessment designer.
Generate exactly ${count} multiple-choice practice questions focused ONLY on the following topics:
${topics.join(', ')}

Difficulty level: ${difficultyLabel}
${bloomInstruction}

Return ONLY a JSON array of exactly ${count} question objects following this exact structure:
{
  "question": "Clear, specific question text",
  "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
  "correctAnswer": "Exact text matching one of the options",
  "explanation": "Detailed explanation of why the answer is correct",
  "topic": "The specific topic from the list provided above",
  "concept": "The specific concept being tested",
  "bloomLevel": "${bloomLevel || 'understand'}",
  "difficulty": "${difficultyLabel}",
  "sourceConcept": "The term/concept being tested"
}

CRITICAL RULES:
1. correctAnswer must be the exact text of one of the 4 options.
2. All 4 options must be distinct and plausible.
3. Explanations must be substantive.
4. Return ONLY the JSON array. No markdown fences. No extra text.`;

    let practiceQuestions: Question[] = [];
    let attempts = 0;

    while (practiceQuestions.length < count && attempts < 3) {
      attempts++;
      try {
        const raw = await generateJSON<any[]>(prompt);
        const { valid } = validateQuestions(Array.isArray(raw) ? raw : []);
        if (valid.length > 0) {
          practiceQuestions = valid.slice(0, count);
        }
      } catch (err) {
        console.error(`Practice generation attempt ${attempts} failed:`, err);
      }
    }

    if (practiceQuestions.length === 0) {
      return NextResponse.json({ error: 'Failed to generate practice questions.' }, { status: 500 });
    }

    await connectDB();

    const bloomDist: Record<string, number> = {};
    if (bloomLevel) {
      bloomDist[bloomLevel] = practiceQuestions.length;
    } else {
      bloomDist['understand'] = practiceQuestions.length;
    }

    const assessment = await Assessment.create({
      userId: session.user.id,
      title: `Practice: ${topics.slice(0, 2).join(', ')}${topics.length > 2 ? ` +${topics.length - 2}` : ''}`,
      subject: 'Practice Session',
      difficulty: difficultyLabel,
      questionCount: practiceQuestions.length,
      duration: Math.ceil(practiceQuestions.length * 1.5),
      bloomDistribution: bloomDist,
      questions: practiceQuestions,
      analysis: {
        subject: 'Practice Session',
        subjectArea: 'other',
        isProgramming: false,
        units: [],
        topics: topics.map((t: string, i: number) => ({ id: `t${i}`, title: t })),
        concepts: [],
        rawText: 'Practice Session',
      },
      status: 'ready',
    });

    return NextResponse.json({ assessmentId: assessment._id.toString() });

  } catch (err) {
    console.error('[practice/generate]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
