import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { Attempt } from '@/lib/models/Attempt';
import { Map, Map as MapIcon, List, Book, Calculator, Dna, FileText, Globe, Code, Brain } from 'lucide-react';
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

  // Aggregate topics
  const aggregated: Record<string, { correct: number; total: number }> = {};
  for (const attempt of attempts) {
    const tp = attempt.topicPerformance || {};
    for (const [topic, stat] of Object.entries(tp)) {
      if (!aggregated[topic]) {
        aggregated[topic] = { correct: 0, total: 0 };
      }
      aggregated[topic].correct += (stat as any).correct || 0;
      aggregated[topic].total += (stat as any).total || 0;
    }
  }

  // Format for the visual map
  const subjects = Object.entries(aggregated).map(([topic, stat]) => {
    // Treat topic as a subject for the visual map
    return {
      name: topic,
      // For the UI "X/Y topics completed", we map correct/total or just percentage.
      // Since it's topic performance, total is usually the number of questions.
      // Let's adapt it to look like the UI:
      completedTopics: stat.correct,
      totalTopics: stat.total,
    };
  });

  // If no data, provide dummy data to show off the UI
  const displaySubjects = subjects.length > 0 ? subjects : [
    { name: 'Mathematics', completedTopics: 5, totalTopics: 8 },
    { name: 'Physics', completedTopics: 2, totalTopics: 5 },
    { name: 'Biology', completedTopics: 4, totalTopics: 6 },
    { name: 'English', completedTopics: 5, totalTopics: 7 },
    { name: 'History', completedTopics: 2, totalTopics: 5 },
    { name: 'Computer Science', completedTopics: 1, totalTopics: 4 },
  ];

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-80px)] flex flex-col">
      {/* Header Area */}
      <div className="flex justify-between items-start mb-6 shrink-0">
        <div>
          <h2 className="text-emerald-600 font-bold text-xs uppercase tracking-wider mb-2">Knowledge Map</h2>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Learning Journey</h1>
          <p className="text-slate-500 max-w-xl text-sm">
            Explore your subjects, discover connections between topics, and unlock your full potential.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full">
          <button className="flex items-center gap-2 bg-[#0A3D2C] text-white px-5 py-2 rounded-full text-sm font-medium shadow-sm transition-transform hover:scale-105">
            <MapIcon className="w-4 h-4" />
            Map View
          </button>
          <button className="flex items-center gap-2 text-slate-500 hover:text-slate-900 px-5 py-2 rounded-full text-sm font-medium transition-colors">
            <List className="w-4 h-4" />
            List View
          </button>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 bg-[#f8fbf9] border border-emerald-50/50 rounded-[32px] p-6 relative overflow-hidden shadow-[inset_0_2px_20px_rgba(0,0,0,0.02)] min-h-[600px]">
        {/* Abstract watermark background shapes */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-40 right-40 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-80 h-80 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
          {/* Leaf shapes */}
          <svg className="absolute top-10 right-10 text-emerald-100 w-32 h-32 transform rotate-45" viewBox="0 0 24 24" fill="currentColor"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8.16 20C13.68 20 18.16 15.52 18.16 10C18.16 9.31 18.09 8.64 17.96 8H17Z"/></svg>
          <svg className="absolute bottom-10 left-10 text-emerald-50 w-48 h-48 transform -rotate-12" viewBox="0 0 24 24" fill="currentColor"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8.16 20C13.68 20 18.16 15.52 18.16 10C18.16 9.31 18.09 8.64 17.96 8H17Z"/></svg>
        </div>

        <KnowledgeMapVisual subjects={displaySubjects} />

        {/* Legend */}
        <div className="absolute bottom-6 left-6 flex items-center gap-4 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-sm border border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
            <span className="text-xs font-medium text-slate-600">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-200"></div>
            <span className="text-xs font-medium text-slate-600">In Progress</span>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-6 right-6 flex items-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-slate-100 p-1">
          <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
          </button>
          <div className="w-px h-4 bg-slate-200 mx-1"></div>
          <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
