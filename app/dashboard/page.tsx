// app/dashboard/page.tsx
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { Assessment } from '@/lib/models/Assessment';
import { Attempt } from '@/lib/models/Attempt';
import Link from 'next/link';
import {
  PlusCircle,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Clock,
  BarChart3,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { formatDate, scoreColor } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard' };

interface RecentAssessment {
  id: string;
  title: string;
  subject: string;
  difficulty: string;
  questionCount: number;
  status: string;
  createdAt: string;
  score: number | null;
  attemptId: string | null;
}

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(' ')[0] || 'there';
  const userId = session!.user!.id!;

  // Fetch data using MongoDB directly
  await connectDB();

  const [totalAssessments, attempts, recentRaw] = await Promise.all([
    Assessment.countDocuments({ userId }),
    Attempt.find({ userId }).select('percentage weaknesses').lean(),
    Assessment.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  const completed = attempts.length;
  const avgScore =
    completed > 0
      ? Math.round(attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / completed)
      : 0;

  const weakAreaMap: Record<string, number> = {};
  for (const attempt of attempts) {
    const weaknesses = attempt.weaknesses || [];
    for (const w of weaknesses) {
      weakAreaMap[w] = (weakAreaMap[w] || 0) + 1;
    }
  }
  const needsAttention = Object.entries(weakAreaMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([topic]) => topic);

  // Fetch latest attempt for each recent assessment
  const recentAssessments = await Promise.all(
    recentRaw.map(async (a) => {
      const latestAttempt = await Attempt.findOne({ assessmentId: a._id.toString() })
        .sort({ submittedAt: -1 })
        .select('_id percentage')
        .lean();

      return {
        id: a._id.toString(),
        title: a.title,
        subject: a.subject,
        difficulty: a.difficulty,
        questionCount: a.questionCount,
        status: a.status,
        createdAt: a.createdAt.toISOString(),
        score: latestAttempt ? latestAttempt.percentage : null,
        attemptId: latestAttempt ? latestAttempt._id.toString() : null,
      };
    })
  );

  const isEmpty = totalAssessments === 0;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Good to see you, {firstName} 👋</h1>
        <p className="mt-1 text-sm text-slate-500">
          {isEmpty
            ? 'Create your first assessment to get started.'
            : `You have completed ${completed} assessment${completed !== 1 ? 's' : ''}. Keep going!`}
        </p>
      </div>

      {isEmpty ? (
        /* ─── Empty state ─── */
        <div className="card p-12 flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-5">
            <BookOpen className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Create your first assessment</h2>
          <p className="text-slate-500 text-sm max-w-sm mb-6 leading-relaxed">
            Upload a PDF, paste your study notes, or drop in a Markdown file. Assessora will analyse it
            and generate a personalised Bloom&apos;s Taxonomy quiz.
          </p>
          <Link href="/dashboard/create" className="btn-primary btn-lg">
            <PlusCircle className="w-4 h-4" />
            Create Assessment
          </Link>
        </div>
      ) : (
        <>
          {/* ─── Stats row ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Avg Score</span>
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <p className={`text-3xl font-bold ${scoreColor(avgScore)}`}>{avgScore}%</p>
              <p className="text-xs text-slate-400 mt-1">Across {completed} submitted</p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Completed</span>
                <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900">{completed}</p>
              <p className="text-xs text-slate-400 mt-1">of {totalAssessments} total</p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Created</span>
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-violet-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900">{totalAssessments}</p>
              <p className="text-xs text-slate-400 mt-1">assessments total</p>
            </div>
          </div>

          {/* ─── Create CTA ─── */}
          <div className="card p-5 flex items-center justify-between mb-8 border-green-100 bg-green-50">
            <div>
              <p className="font-semibold text-green-900">Ready for another assessment?</p>
              <p className="text-sm text-green-700 mt-0.5">Upload new material and generate questions instantly.</p>
            </div>
            <Link href="/dashboard/create" className="btn-primary flex-shrink-0">
              <PlusCircle className="w-4 h-4" />
              New Assessment
            </Link>
          </div>
        </>
      )}

      {/* ─── Recent Assessments ─── */}
      {!isEmpty && (
        <div className="card mb-6">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Recent Assessments</h2>
            <Link href="/dashboard/assessments" className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentAssessments.map((a) => (
              <div key={a.id} className="px-5 py-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{a.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {a.subject} · {a.questionCount} questions · {formatDate(a.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {a.score !== null ? (
                    <span className={`text-sm font-semibold ${scoreColor(a.score)}`}>{Math.round(a.score)}%</span>
                  ) : (
                    <span className="badge-amber text-xs">In progress</span>
                  )}
                  {a.attemptId ? (
                    <Link
                      href={`/dashboard/assessment/${a.id}/results?attempt=${a.attemptId}`}
                      className="btn-secondary btn-sm"
                    >
                      Results
                    </Link>
                  ) : (
                    <Link href={`/dashboard/assessment/${a.id}`} className="btn-primary btn-sm">
                      Continue
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Needs Attention ─── */}
      {needsAttention.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <h2 className="text-base font-semibold text-slate-900">Areas Needing Attention</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {needsAttention.map((topic) => (
              <span key={topic} className="badge-amber">
                {topic}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">
            These topics scored below 60% across your recent assessments.
          </p>
        </div>
      )}
    </div>
  );
}
