import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { Attempt } from '@/lib/models/Attempt';
import { List } from 'lucide-react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { KnowledgeMapVisual } from './KnowledgeMapVisual';

export const metadata: Metadata = { title: 'Knowledge Map - Assessora' };

export default async function KnowledgeMapPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  const userId = session.user.id;

  await connectDB();
  const attempts = await Attempt.find({ userId }).select('topicPerformance').lean();

  const aggregated: Record<string, { correct: number; total: number }> = {};
  for (const attempt of attempts) {
    const tp = attempt.topicPerformance || {};
    for (const [topic, stat] of Object.entries(tp)) {
      if (!aggregated[topic]) aggregated[topic] = { correct: 0, total: 0 };
      aggregated[topic].correct += (stat as any).correct || 0;
      aggregated[topic].total += (stat as any).total || 0;
    }
  }

  const subjects = Object.entries(aggregated).map(([topic, stat]) => ({
    name: topic,
    completedTopics: stat.correct,
    totalTopics: stat.total,
  }));

  const displaySubjects = subjects.length > 0 ? subjects : [
    { name: 'Mathematics', completedTopics: 5, totalTopics: 8 },
    { name: 'Physics', completedTopics: 2, totalTopics: 5 },
    { name: 'Biology', completedTopics: 4, totalTopics: 6 },
    { name: 'English', completedTopics: 5, totalTopics: 7 },
    { name: 'History', completedTopics: 2, totalTopics: 5 },
    { name: 'Computer Science', completedTopics: 1, totalTopics: 4 },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex justify-between items-start mb-6 px-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Learning Journey</h1>
          <p className="text-slate-500 max-w-xl text-sm">
            Click any topic number to see its theory and practice questions below.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full mt-1">
          <button className="flex items-center gap-2 bg-[#0A3D2C] text-white px-5 py-2 rounded-full text-sm font-medium shadow-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Map View
          </button>
          <button className="flex items-center gap-2 text-slate-500 hover:text-slate-900 px-5 py-2 rounded-full text-sm font-medium transition-colors">
            <List className="w-4 h-4" />
            List View
          </button>
        </div>
      </div>
      <KnowledgeMapVisual subjects={displaySubjects} />
    </div>
  );
}
