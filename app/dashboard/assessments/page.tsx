// app/dashboard/assessments/page.tsx
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { Assessment } from '@/lib/models/Assessment';
import { Attempt } from '@/lib/models/Attempt';
import Link from 'next/link';
import { BookOpen, PlusCircle, CheckCircle2, Clock } from 'lucide-react';
import { formatDate, scoreColor } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Assessments' };

export default async function AssessmentsPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  await connectDB();

  const assessmentsRaw = await Assessment.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  // Fetch attempts to get the latest score
  const assessments = await Promise.all(
    assessmentsRaw.map(async (a) => {
      const attempt = await Attempt.findOne({ assessmentId: a._id.toString() })
        .sort({ submittedAt: -1 })
        .select('_id percentage totalQuestions correct submittedAt')
        .lean();
      
      return {
        ...a,
        id: a._id.toString(),
        attempt: attempt ? {
          id: attempt._id.toString(),
          percentage: attempt.percentage,
          correct: attempt.correct,
          totalQuestions: attempt.totalQuestions,
          submittedAt: attempt.submittedAt,
        } : null
      };
    })
  );

  const difficultyLabel: Record<string, string> = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
  };

  const difficultyColor: Record<string, string> = {
    easy: 'badge-green',
    medium: 'badge-amber',
    hard: 'badge-red',
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Assessments</h1>
          <p className="mt-1 text-sm text-slate-500">
            {assessments.length === 0
              ? 'No assessments yet.'
              : `${assessments.length} assessment${assessments.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Link href="/dashboard/create" className="btn-primary">
          <PlusCircle className="w-4 h-4" />
          New Assessment
        </Link>
      </div>

      {assessments.length === 0 ? (
        /* Empty state */
        <div className="card p-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
            <BookOpen className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No assessments yet</h2>
          <p className="text-slate-500 text-sm max-w-sm mb-6 leading-relaxed">
            Create your first assessment by uploading study material or pasting your notes.
          </p>
          <Link href="/dashboard/create" className="btn-primary btn-lg">
            <PlusCircle className="w-4 h-4" />
            Create Assessment
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100 text-xs font-medium text-slate-500 uppercase tracking-wide">
            <span>Assessment</span>
            <span className="text-center w-20">Questions</span>
            <span className="text-center w-20">Difficulty</span>
            <span className="text-center w-16">Score</span>
            <span className="text-right w-28">Action</span>
          </div>

          {/* Table rows */}
          <div className="divide-y divide-slate-100">
            {assessments.map((a) => {
              const attempt = a.attempt;
              const isCompleted = a.status === 'completed' && attempt;

              return (
                <div
                  key={a.id}
                  className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-4 items-center hover:bg-slate-50 transition-colors"
                >
                  {/* Title + meta */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{a.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {a.subject} · {formatDate(a.createdAt.toISOString())}
                    </p>
                  </div>

                  {/* Question count */}
                  <div className="text-center w-20">
                    <span className="text-sm text-slate-600">{a.questionCount}</span>
                  </div>

                  {/* Difficulty */}
                  <div className="text-center w-20">
                    <span className={difficultyColor[a.difficulty] || 'badge-slate'}>
                      {difficultyLabel[a.difficulty] || a.difficulty}
                    </span>
                  </div>

                  {/* Score */}
                  <div className="text-center w-16">
                    {isCompleted && attempt ? (
                      <span className={`text-sm font-semibold ${scoreColor(attempt.percentage)}`}>
                        {Math.round(attempt.percentage)}%
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </div>

                  {/* Action */}
                  <div className="text-right w-28">
                    {isCompleted && attempt ? (
                      <Link
                        href={`/dashboard/assessment/${a.id}/results?attempt=${attempt.id}`}
                        className="btn-secondary btn-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Results
                      </Link>
                    ) : (
                      <Link
                        href={`/dashboard/assessment/${a.id}`}
                        className="btn-primary btn-sm"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        Continue
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
