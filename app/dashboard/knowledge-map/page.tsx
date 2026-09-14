import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { Assessment } from '@/lib/models/Assessment';
import { Attempt } from '@/lib/models/Attempt';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { KnowledgeMapVisual } from './KnowledgeMapVisual';

export const metadata: Metadata = { title: 'Knowledge Map - Assessora' };

export interface AssessmentEntry {
  id: string;
  title: string;
  subject: string;
  sourceFileName?: string;
  createdAt: string;
  topics: {
    name: string;
    correct: number;
    total: number;
  }[];
  /** Units from the material analysis — used for the tree diagram */
  units: {
    title: string;
    topics: string[];
  }[];
}

export default async function KnowledgeMapPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  const userId = session.user.id;

  await connectDB();

  // Fetch all assessments with questions + analysis for unit hierarchy
  const assessments = await Assessment.find({ userId })
    .sort({ createdAt: -1 })
    .select('title subject sourceFileName questions analysis createdAt')
    .lean();

  // Fetch all attempts for performance data
  const attempts = await Attempt.find({ userId })
    .select('assessmentId topicPerformance')
    .lean();

  // Build per-assessment topic performance map
  const perfByAssessment: Record<string, Record<string, { correct: number; total: number }>> = {};
  for (const attempt of attempts) {
    const aid = attempt.assessmentId;
    if (!perfByAssessment[aid]) perfByAssessment[aid] = {};
    const tp = attempt.topicPerformance || {};
    for (const [topic, stat] of Object.entries(tp)) {
      if (!perfByAssessment[aid][topic]) perfByAssessment[aid][topic] = { correct: 0, total: 0 };
      perfByAssessment[aid][topic].correct += (stat as any).correct || 0;
      perfByAssessment[aid][topic].total += (stat as any).total || 0;
    }
  }

  // Build assessment entries with unique topics from questions
  const assessmentEntries: AssessmentEntry[] = assessments.map((a) => {
    const aid = a._id.toString();
    const perfMap = perfByAssessment[aid] || {};

    // Extract unique topics from questions
    const topicNames = new Set<string>();
    for (const q of (a.questions || [])) {
      if (q.topic) topicNames.add(q.topic);
    }

    const topics = Array.from(topicNames).map((name) => ({
      name,
      correct: perfMap[name]?.correct || 0,
      total: perfMap[name]?.total || 0,
    }));

    // Extract units from analysis for tree diagram
    const analysisUnits = (a as any).analysis?.units || [];
    const units = analysisUnits.map((u: any) => ({
      title: u.title || 'Untitled',
      topics: (u.topics || []) as string[],
    }));

    return {
      id: aid,
      title: a.title,
      subject: a.subject,
      sourceFileName: (a as any).sourceFileName || undefined,
      createdAt: a.createdAt.toISOString(),
      topics,
      units,
    };
  });

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <KnowledgeMapVisual assessments={assessmentEntries} />
    </div>
  );
}
