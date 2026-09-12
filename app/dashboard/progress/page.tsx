// app/dashboard/progress/page.tsx
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { Attempt } from '@/lib/models/Attempt';
import { TrendingUp, Award, Clock, Target } from 'lucide-react';
import { BLOOM_LABELS } from '@/lib/bloom';
import { pct } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Progress Tracker' };

export default async function ProgressPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  await connectDB();
  const attempts = await Attempt.find({ userId }).sort({ createdAt: 1 }).lean();

  const totalAssessments = attempts.length;
  let totalQuestions = 0;
  let totalTimeSeconds = 0;
  let totalCorrect = 0;

  const aggregatedBloom: Record<string, { correct: number; total: number }> = {};

  const recentScores = attempts.slice(-10).map((a: any, i) => ({
    id: i,
    score: a.percentage,
    date: new Date(a.createdAt).toLocaleDateString(),
  }));

  for (const attempt of attempts) {
    totalQuestions += attempt.totalQuestions || 0;
    totalTimeSeconds += attempt.timeTaken || 0;
    totalCorrect += attempt.score || 0;

    if (attempt.bloomPerformance) {
      for (const [level, stat] of Object.entries(attempt.bloomPerformance)) {
        if (!aggregatedBloom[level]) aggregatedBloom[level] = { correct: 0, total: 0 };
        aggregatedBloom[level].correct += (stat as any).correct || 0;
        aggregatedBloom[level].total += (stat as any).total || 0;
      }
    }
  }

  const averageScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const timeHours = Math.floor(totalTimeSeconds / 3600);
  const timeMinutes = Math.floor((totalTimeSeconds % 3600) / 60);

  const bloomStats = Object.entries(BLOOM_LABELS).map(([level, label]) => {
    const stat = aggregatedBloom[level] || { correct: 0, total: 0 };
    return {
      level,
      label,
      percentage: pct(stat.correct, stat.total),
    };
  });

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="page-header mb-8">
        <h1 className="page-title flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-green-600" />
          Progress Dashboard
        </h1>
        <p className="page-subtitle">Track your lifetime learning metrics and cognitive skill mastery.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-4">
            <Award className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-1">{averageScore}%</p>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Avg Score</p>
        </div>
        <div className="card p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-1">{totalQuestions}</p>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Questions Answered</p>
        </div>
        <div className="card p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-1">
            {timeHours}h {timeMinutes}m
          </p>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Time Spent</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Scores Chart */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Recent Scores (Last 10)</h2>
          {recentScores.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">No assessments completed yet.</div>
          ) : (
            <div className="h-64 flex items-end gap-2 pt-4 border-b border-slate-200">
              {recentScores.map((score, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                  <div className="absolute -top-8 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {score.score}% ({score.date})
                  </div>
                  <div 
                    className="w-full bg-green-500 rounded-t-sm hover:bg-green-400 transition-colors"
                    style={{ height: `${score.score}%`, minHeight: '4px' }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Aggregate Bloom's Performance */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Cognitive Skill Mastery (Bloom's)</h2>
          <div className="space-y-4">
            {bloomStats.map(stat => (
              <div key={stat.level}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">{stat.label}</span>
                  <span className="text-slate-500 font-medium">{stat.percentage}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full" 
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
