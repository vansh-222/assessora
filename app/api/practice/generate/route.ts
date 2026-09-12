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
    const { topics } = await req.json();
    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return NextResponse.json({ error: 'No topics provided' }, { status: 400 });
    }

    const prompt = `You are an expert academic assessment designer.
Generate exactly 5 multiple-choice practice questions focused ONLY on the following weak topics:
${topics.join(', ')}

Return ONLY a JSON array of exactly 5 question objects following this exact structure:
{
  "question": "Clear, specific question text",
  "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
  "correctAnswer": "Exact text matching one of the options",
  "explanation": "Detailed explanation of why the answer is correct",
  "topic": "The specific topic from the list provided above",
  "concept": "The specific concept being tested",
  "bloomLevel": "understand",
  "difficulty": "medium",
  "sourceConcept": "The term/concept being tested"
}

CRITICAL RULES:
1. correctAnswer must be the exact text of one of the 4 options.
2. All 4 options must be distinct and plausible.
3. Explanations must be substantive.
4. Return ONLY the JSON array. No markdown fences. No extra text.`;

    let practiceQuestions: Question[] = [];
    let attempts = 0;

    while (practiceQuestions.length < 5 && attempts < 3) {
      attempts++;
      try {
        const raw = await generateJSON<any[]>(prompt);
        const { valid } = validateQuestions(Array.isArray(raw) ? raw : []);
        if (valid.length > 0) {
          practiceQuestions = valid.slice(0, 5);
        }
      } catch (err) {
        console.error(`Practice generation attempt ${attempts} failed:`, err);
      }
    }

    if (practiceQuestions.length === 0) {
      return NextResponse.json({ error: 'Failed to generate practice questions.' }, { status: 500 });
    }

    await connectDB();

    // Create a new assessment document for the practice session
    const assessment = await Assessment.create({
      userId: session.user.id,
      title: 'Targeted Practice Session',
      subject: 'Mixed Review',
      difficulty: 'medium',
      questionCount: practiceQuestions.length,
      duration: 5, // 5 minutes
      bloomDistribution: { understand: practiceQuestions.length },
      questions: practiceQuestions,
      analysis: {
        subject: 'Mixed Review',
        subjectArea: 'other',
        isProgramming: false,
        units: [],
        topics: topics.map((t, i) => ({ id: `t${i}`, title: t })),
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
