// app/api/topic-insight/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { generateJSON } from '@/lib/groq';

interface TopicInsight {
  theory: string;
  keyPoints: string[];
  questions: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }[];
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { topic } = await req.json();
  if (!topic || typeof topic !== 'string') {
    return NextResponse.json({ error: 'Missing topic' }, { status: 400 });
  }

  const prompt = `You are an expert academic tutor. Generate a brief topic insight for: "${topic}".

Return ONLY a JSON object with this exact structure:
{
  "theory": "A clear, concise 3-4 sentence explanation of this topic that covers the core concept and why it matters.",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
  "questions": [
    {
      "question": "A meaningful MCQ question about the topic",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "The exact text of the correct option",
      "explanation": "A brief explanation of why the answer is correct"
    },
    {
      "question": "A second, different MCQ question about the topic",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "The exact text of the correct option",
      "explanation": "A brief explanation of why the answer is correct"
    }
  ]
}`;

  try {
    const data = await generateJSON<TopicInsight>(prompt);
    return NextResponse.json(data);
  } catch (err) {
    console.error('[topic-insight]', err);
    return NextResponse.json({ error: 'Failed to generate insight' }, { status: 500 });
  }
}
