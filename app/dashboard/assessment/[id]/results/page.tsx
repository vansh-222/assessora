'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2, XCircle, Clock, Target, BookOpen,
  ChevronDown, ChevronUp, TrendingUp, TrendingDown,
  AlertTriangle, Download, Loader2, BarChart3,
} from 'lucide-react';
import { formatTime, pct, scoreColor } from '@/lib/utils';
import { BLOOM_LABELS, BLOOM_COLORS } from '@/lib/bloom';
import type { AttemptResult, Question, BloomLevel, BloomDistribution } from '@/types';

interface FullAssessment {
  id: string;
  title: string;
  subject: string;
  duration: number;
  difficulty: string;
  bloomDistribution: BloomDistribution;
  questions: Question[];
}

interface PageData {
  attempt: AttemptResult & { id: string };
  assessment: FullAssessment;
}

function PerformanceBar({ label, correct, total, color }: { label: string; correct: number; total: number; color: string }) {
  const percentage = pct(correct, total);
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-sm text-slate-600 w-32 flex-shrink-0 truncate">{label}</span>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-semibold text-slate-700 w-16 text-right flex-shrink-0">
        {correct}/{total} · {percentage}%
      </span>
    </div>
  );
}

function QuestionReview({ question, userAnswer, index }: { question: Question; userAnswer?: string; index: number }) {
  const [open, setOpen] = useState(false);
  const isAnswered = !!userAnswer;
  const isCorrect = isAnswered && userAnswer === question.correctAnswer;
  const bloomColors = BLOOM_COLORS[question.bloomLevel];

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex-shrink-0">
          {!isAnswered ? (
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-400">—</span>
            </div>
          ) : isCorrect ? (
            <CheckCircle2 className="w-7 h-7 text-emerald-500" />
          ) : (
            <XCircle className="w-7 h-7 text-red-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-400">Q{index + 1}</span>
            <span className={`badge ${bloomColors.bg} ${bloomColors.text} ${bloomColors.border}`}>
              {BLOOM_LABELS[question.bloomLevel]}
            </span>
            <span className="badge-slate text-xs">{question.topic}</span>
          </div>
          <p className="text-sm text-slate-800 line-clamp-2">{question.question}</p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-3">
          {/* Options */}
          <div className="space-y-2">
            {question.options.map((opt, i) => {
              const isUserAns = opt === userAnswer;
              const isCorrectAns = opt === question.correctAnswer;
              return (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 p-3 rounded-lg text-sm ${
                    isCorrectAns
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                      : isUserAns && !isCorrect
                      ? 'bg-red-50 border border-red-200 text-red-900'
                      : 'bg-slate-50 border border-slate-100 text-slate-600'
                  }`}
                >
                  <span className="font-bold flex-shrink-0">{String.fromCharCode(65 + i)}.</span>
                  <span className="flex-1">{opt}</span>
                  {isCorrectAns && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />}
                  {isUserAns && !isCorrect && <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
                </div>
              );
            })}
          </div>

          {/* Answer labels */}
          <div className="flex gap-4 text-xs">
            <span className="text-slate-400">
              Your answer: <span className="font-medium text-slate-700">{userAnswer || 'Not answered'}</span>
            </span>
            <span className="text-slate-400">
              Correct: <span className="font-medium text-emerald-700">{question.correctAnswer}</span>
            </span>
          </div>

          {/* Explanation */}
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
            <p className="text-xs font-semibold text-blue-600 mb-1">Explanation</p>
            <p className="text-sm text-blue-900 leading-relaxed">{question.explanation}</p>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-2 text-xs text-slate-400">
            <span>Concept: <span className="text-slate-600">{question.concept}</span></span>
            <span>·</span>
            <span>Difficulty: <span className="text-slate-600 capitalize">{question.difficulty}</span></span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const assessmentId = params.id as string;
  const attemptId = searchParams.get('attempt');

  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!attemptId) { setError('No attempt ID provided.'); setLoading(false); return; }
    fetch(`/api/attempt/${attemptId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [attemptId]);

  const handleDownloadPDF = async () => {
    if (!data) return;
    setDownloading(true);
    try {
      const { generateReport } = await import('@/lib/report');
      await generateReport(data.attempt, data.assessment);
    } catch (e) {
      console.error('PDF generation failed:', e);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
        <p className="text-slate-500 text-sm">Loading results...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertTriangle className="w-10 h-10 text-red-400" />
        <p className="text-slate-700 font-medium">{error || 'Results not found'}</p>
        <Link href="/dashboard" className="btn-secondary">Back to Dashboard</Link>
      </div>
    );
  }

  const { attempt, assessment } = data;
  const percentage = Math.round(attempt.percentage);
  const timeUsed = attempt.timeTaken;

  const scoreLabel = percentage >= 80 ? 'Excellent' : percentage >= 60 ? 'Good' : percentage >= 40 ? 'Fair' : 'Needs Work';
  const scoreBgClass = percentage >= 80 ? 'bg-emerald-50 border-emerald-200' : percentage >= 60 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';
  const scoreTextClass = percentage >= 80 ? 'text-emerald-700' : percentage >= 60 ? 'text-amber-700' : 'text-red-700';

  const bloomEntries = Object.entries(attempt.bloomPerformance) as [BloomLevel, { correct: number; total: number }][];
  const topicEntries = Object.entries(attempt.topicPerformance);

  // Categorize topics
  const strongTopics = topicEntries.filter(([, s]) => pct(s.correct, s.total) >= 80);
  const developingTopics = topicEntries.filter(([, s]) => { const p = pct(s.correct, s.total); return p >= 60 && p < 80; });
  const weakTopics = topicEntries.filter(([, s]) => pct(s.correct, s.total) < 60);

  // Generate insight sentence
  const insight = generateInsight(attempt.strengths, attempt.weaknesses, percentage);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <p className="text-sm text-slate-500 mb-1">Assessment Results</p>
          <h1 className="text-2xl font-bold text-slate-900">{assessment.title}</h1>
          <p className="text-sm text-slate-400 mt-1">{assessment.subject}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={handleDownloadPDF} disabled={downloading} className="btn-secondary">
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            PDF Report
          </button>
          <Link href="/dashboard" className="btn-primary">Dashboard</Link>
        </div>
      </div>

      {/* ─── Score hero ─── */}
      <div className={`card border-2 ${scoreBgClass} p-6 mb-5`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Overall Score</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-6xl font-bold ${scoreTextClass}`}>{percentage}%</span>
              <span className={`text-lg font-semibold ${scoreTextClass}`}>{scoreLabel}</span>
            </div>
            <p className="text-slate-500 text-sm mt-1">
              {attempt.correct} correct out of {attempt.totalQuestions} questions
            </p>
          </div>
          <div className={`w-20 h-20 rounded-full border-4 ${percentage >= 80 ? 'border-emerald-400' : percentage >= 60 ? 'border-amber-400' : 'border-red-400'} flex items-center justify-center flex-shrink-0`}>
            <span className={`text-2xl font-bold ${scoreTextClass}`}>{attempt.score}</span>
          </div>
        </div>
      </div>

      {/* ─── Stats row ─── */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Correct', value: attempt.correct, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Incorrect', value: attempt.incorrect, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Unanswered', value: attempt.unanswered, color: 'text-slate-500', bg: 'bg-slate-50' },
          { label: 'Time Used', value: formatTime(timeUsed), color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((s) => (
          <div key={s.label} className={`card p-4 text-center ${s.bg}`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ─── Bloom performance ─── */}
      {bloomEntries.length > 0 && (
        <div className="card p-5 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-slate-400" />
            <h2 className="text-base font-semibold text-slate-900">Bloom&apos;s Taxonomy Performance</h2>
          </div>
          <div className="space-y-1">
            {bloomEntries.map(([level, stat]) => {
              const bloomPct = pct(stat.correct, stat.total);
              const color = bloomPct >= 80 ? '#10b981' : bloomPct >= 60 ? '#f59e0b' : '#ef4444';
              return (
                <PerformanceBar
                  key={level}
                  label={BLOOM_LABELS[level]}
                  correct={stat.correct}
                  total={stat.total}
                  color={color}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Topic performance ─── */}
      {topicEntries.length > 0 && (
        <div className="card p-5 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <h2 className="text-base font-semibold text-slate-900">Topic Performance</h2>
          </div>
          <div className="space-y-1">
            {topicEntries.map(([topic, stat]) => {
              const topicPct = pct(stat.correct, stat.total);
              const color = topicPct >= 80 ? '#10b981' : topicPct >= 60 ? '#f59e0b' : '#ef4444';
              return (
                <PerformanceBar key={topic} label={topic} correct={stat.correct} total={stat.total} color={color} />
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Strengths & Weaknesses ─── */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-semibold text-slate-900">Strengths</h2>
          </div>
          {attempt.strengths.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {attempt.strengths.map((s) => (
                <span key={s} className="badge-green text-xs">{s}</span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">Keep practising to build strengths.</p>
          )}
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-semibold text-slate-900">Needs Attention</h2>
          </div>
          {attempt.weaknesses.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {attempt.weaknesses.map((w) => (
                <span key={w} className="badge-amber text-xs">{w}</span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">No major weak areas — great work!</p>
          )}
        </div>
      </div>

      {/* ─── AI insight ─── */}
      <div className="card p-5 mb-5 border-l-4 border-l-green-500">
        <p className="text-sm font-semibold text-slate-900 mb-2">Assessment Insight</p>
        <p className="text-sm text-slate-600 leading-relaxed">{insight}</p>
        {weakTopics.length > 0 && (
          <p className="text-sm text-slate-500 mt-2">
            <span className="font-medium text-amber-600">Recommended next step:</span>{' '}
            Review {weakTopics.slice(0, 2).map(([t]) => t).join(' and ')} before your next assessment.
          </p>
        )}
      </div>

      {/* ─── Question Review ─── */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Question Review</h2>
        <div className="space-y-2">
          {assessment.questions.map((q, i) => (
            <QuestionReview
              key={q.id}
              question={q}
              userAnswer={attempt.answers[q.id]}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex items-center justify-between pb-8">
        <Link href="/dashboard/assessments" className="btn-secondary">
          My Assessments
        </Link>
        <Link href="/dashboard/create" className="btn-primary">
          New Assessment
        </Link>
      </div>
    </div>
  );
}

function generateInsight(strengths: string[], weaknesses: string[], percentage: number): string {
  if (percentage >= 90) {
    return 'Excellent performance across all areas. You have a strong command of this material.';
  }
  if (strengths.length > 0 && weaknesses.length === 0) {
    return `Strong understanding of ${strengths.slice(0, 2).join(' and ')}. All topics are above the proficiency threshold.`;
  }
  if (strengths.length > 0 && weaknesses.length > 0) {
    return `Strong understanding of ${strengths.slice(0, 2).join(' and ')}. ${weaknesses.slice(0, 2).join(' and ')} ${weaknesses.length === 1 ? 'requires' : 'require'} additional practice.`;
  }
  if (weaknesses.length > 0) {
    return `${weaknesses.slice(0, 2).join(' and ')} ${weaknesses.length === 1 ? 'needs' : 'need'} additional review. Focus on these areas in your next study session.`;
  }
  return percentage >= 60
    ? 'Good progress overall. Continue practising to reinforce your understanding.'
    : 'This material requires more focused study. Consider reviewing the source material and retaking the assessment.';
}
