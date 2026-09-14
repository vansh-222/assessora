// app/api/assistant/route.ts â€” scratch copy
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import Groq from 'groq-sdk';

let _client: Groq | null = null;
function getClient(): Groq {
  if (!_client) {
    const key = process.env.GROQ_ASSISTANT_API_KEY || process.env.GROQ_API_KEY;
    if (!key) throw new Error('GROQ_ASSISTANT_API_KEY not set');
    _client = new Groq({ apiKey: key });
  }
  return _client;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { message, context, history } = await req.json();
  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'Missing message' }, { status: 400 });
  }

  // Build a context summary for the AI
  const contextLines: string[] = [];
  contextLines.push(`Page: ${context.page}`);
  if (context.user?.name) contextLines.push(`Student: ${context.user.name}`);
  if (context.averageScore !== undefined) contextLines.push(`Average Score: ${context.averageScore}%`);
  if (context.totalAssessments !== undefined) contextLines.push(`Total Assessments: ${context.totalAssessments}`);
  if (context.completedAssessments !== undefined) contextLines.push(`Completed: ${context.completedAssessments}`);
  if (context.conceptsMastered !== undefined) contextLines.push(`Concepts Mastered: ${context.conceptsMastered}`);

  if (context.weakConcepts?.length) contextLines.push(`Weak Concepts: ${context.weakConcepts.join(', ')}`);
  if (context.strongConcepts?.length) contextLines.push(`Strong Concepts: ${context.strongConcepts.join(', ')}`);

  if (context.topicPerformance) {
    const topicSummary = Object.entries(context.topicPerformance)
      .map(([topic, s]: [string, any]) => `${topic}: ${s.correct}/${s.total} (${s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0}%)`)
      .join('; ');
    contextLines.push(`Topic Performance: ${topicSummary}`);
  }

  if (context.bloomPerformance) {
    const bloomSummary = Object.entries(context.bloomPerformance)
      .map(([level, s]: [string, any]) => `${level}: ${s.correct}/${s.total}`)
      .join('; ');
    contextLines.push(`Bloom Performance: ${bloomSummary}`);
  }

  if (context.recentAssessments?.length) {
    const recent = context.recentAssessments.slice(0, 3).map((a: any) => `"${a.title}" (${a.subject}, ${a.score}%, ${a.date})`).join('; ');
    contextLines.push(`Recent Assessments: ${recent}`);
  }

  if (context.totalStudyTime) {
    const h = Math.floor(context.totalStudyTime / 3600);
    const m = Math.floor((context.totalStudyTime % 3600) / 60);
    contextLines.push(`Total Study Time: ${h}h ${m}m`);
  }

  const systemPrompt = `You are Assessora Assistant, a professional academic learning companion built into the Assessora platform. Your purpose is to help students understand their assessment performance, identify weaknesses, and plan what to study next.

RULES:
- Use ONLY the student data provided below. Never invent scores, assessments, or concepts.
- Give evidence-based answers. Always cite specific numbers (e.g., "You scored 40% on Pointers").
- Keep responses concise (2-4 short paragraphs max).
- You CAN answer general academic and educational questions (e.g. "What is Python?", "Explain recursion", "Who invented calculus?"). You are a knowledgeable tutor.
- If asked something completely non-academic (e.g. gossip, politics, entertainment), politely redirect: "I'm best at helping with academics and your learning data. Try asking me an academic question or about your performance!"
- Use professional, encouraging language. Never say "you failed" â€” say "needs review" or "room for growth".
- When recommending practice, be specific about the topic and why.

STUDENT DATA:
${contextLines.join('\n')}

RESPONSE FORMAT:
Return ONLY a JSON object:
{
  "message": "Your response text here",
  "insights": ["Optional insight 1", "Optional insight 2"],
  "actions": [{"label": "Button text", "action": "practice|view-results|open-knowledge-map|create-assessment", "payload": {"concept": "optional"}}]
}

The "actions" array should contain 0-2 relevant actions. Only include actions when they directly help the student.
The "insights" array should contain 0-3 key data points. Only include when useful.`;

  const chatHistory = (history || []).slice(-6).map((h: any) => ({
    role: h.role as 'user' | 'assistant',
    content: h.content,
  }));

  try {
    const client = getClient();
    const completion = await client.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...chatHistory,
        { role: 'user', content: message },
      ],
      model: 'openai/gpt-oss-120b',
      temperature: 0.4,
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    if (!raw) throw new Error('Empty response');

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // If JSON fails, treat raw text as the message
      parsed = { message: raw, insights: [], actions: [] };
    }

    return NextResponse.json({
      message: parsed.message || raw,
      insights: Array.isArray(parsed.insights) ? parsed.insights : [],
      actions: Array.isArray(parsed.actions) ? parsed.actions : [],
    });
  } catch (err) {
    console.error('[assistant]', err);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}



