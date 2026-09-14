'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2, XCircle, Clock, Target, BookOpen,
  ChevronDown, ChevronUp, TrendingUp, TrendingDown,
  AlertTriangle, Download, Loader2, BarChart3, ArrowRight, Sparkles
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
    <div className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
      <span className="text-sm font-medium text-slate-700 w-36 flex-shrink-0 truncate">{label}</span>
      <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-bold text-slate-700 w-24 text-right flex-shrink-0">
        {correct}/{total} <span className="text-slate-400 font-normal">({percentage}%)</span>
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
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-slate-300">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex-shrink-0">
          {!isAnswered ? (
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-400">—</span>
            </div>
          ) : isCorrect ? (
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[#046B46]" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-400">Q{index + 1}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${bloomColors?.bg || 'bg-slate-100'} ${bloomColors?.text || 'text-slate-700'} border ${bloomColors?.border || 'border-slate-200'}`}>
              {BLOOM_LABELS[question.bloomLevel]}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">{question.topic}</span>
          </div>
          <p className="text-sm font-medium text-slate-900 line-clamp-2">{question.question}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-400">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-slate-100 pt-4 space-y-4 bg-slate-50/30">
          {/* Options */}
          <div className="space-y-2.5">
            {question.options.map((opt, i) => {
              const isUserAns = opt === userAnswer;
              const isCorrectAns = opt === question.correctAnswer;
              return (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3.5 rounded-xl text-sm transition-all ${
                    isCorrectAns
                      ? 'bg-emerald-50/80 border border-emerald-200 text-emerald-950 font-medium'
                      : isUserAns && !isCorrect
                      ? 'bg-red-50/80 border border-red-200 text-red-950 font-medium'
                      : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="font-bold flex-shrink-0 w-5">{String.fromCharCode(65 + i)}.</span>
                  <span className="flex-1">{opt}</span>
                  {isCorrectAns && <CheckCircle2 className="w-4 h-4 text-[#046B46] flex-shrink-0 mt-0.5" />}
                  {isUserAns && !isCorrect && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />}
                </div>
              );
            })}
          </div>

          {/* Answer labels */}
          <div className="flex gap-6 text-xs pt-1">
            <span className="text-slate-500">
              Your answer: <span className="font-semibold text-slate-800">{userAnswer || 'Not answered'}</span>
            </span>
            <span className="text-slate-500">
              Correct answer: <span className="font-semibold text-[#046B46]">{question.correctAnswer}</span>
            </span>
          </div>

          {/* Explanation */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
            <p className="text-xs font-bold text-[#046B46] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Explanation
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">{question.explanation}</p>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-2 text-xs text-slate-400 pt-1">
            <span>Concept: <span className="text-slate-600 font-medium">{question.concept}</span></span>
            <span>·</span>
            <span>Difficulty: <span className="text-slate-600 font-medium capitalize">{question.difficulty}</span></span>
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
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#046B46] animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Analyzing your assessment results...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4 px-6">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-slate-800 font-bold text-lg">{error || 'Results not found'}</p>
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-white bg-[#046B46] hover:bg-[#035437] px-6 py-3 rounded-full transition-colors shadow-md shadow-emerald-900/10">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const { attempt, assessment } = data;
  const percentage = Math.round(attempt.percentage);
  const timeUsed = attempt.timeTaken;

  const scoreLabel = percentage >= 80 ? 'Excellent Performance' : percentage >= 60 ? 'Good Effort' : percentage >= 40 ? 'Fair Attempt' : 'Needs Focus';
  
  const bloomEntries = Object.entries(attempt.bloomPerformance) as [BloomLevel, { correct: number; total: number }][];
  const topicEntries = Object.entries(attempt.topicPerformance);

  const weakTopics = topicEntries.filter(([, s]) => pct(s.correct, s.total) < 60);
  const insight = generateInsight(attempt.strengths, attempt.weaknesses, percentage);

  return (
    <div className="animate-fade-in space-y-8 px-6 md:px-10  max-w-7xl mx-auto">
      
      {/* ─── Header Row (Title & Action Buttons aligned on the same row) ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] font-bold text-[#046B46] uppercase tracking-[0.2em] mb-1.5 before:content-[''] before:block before:w-6 before:h-[1px] before:bg-[#046B46]">
            Assessment Analysis
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-1">{assessment.title}</h1>
          <p className="text-sm font-medium text-slate-500">{assessment.subject} · <span className="capitalize">{assessment.difficulty}</span> Level</p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button 
            onClick={handleDownloadPDF} 
            disabled={downloading} 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#046B46] bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 rounded-full transition-colors border border-emerald-100 shadow-sm"
          >
            {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            Export Report PDF
          </button>
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#046B46] hover:bg-[#035437] px-5 py-2.5 rounded-full transition-colors shadow-md shadow-emerald-900/10">
            Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ─── Score Hero Banner (Clean, Professional, Modern) ─── */}
      {/* ─── Sleek, Compact Executive Score Banner ─── */}
      <div className="relative rounded-2xl bg-[#046B46] text-white px-8 py-6 overflow-hidden shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />

        <div className="flex items-center gap-6 w-full md:w-auto">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center flex-shrink-0">
            <span className="text-2xl font-black tracking-tight">{percentage}%</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">{scoreLabel}</span>
            </div>
            <h2 className="text-lg font-bold text-white leading-snug">
              {attempt.correct} of {attempt.totalQuestions} questions answered accurately
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-white/15 pt-4 md:pt-0 md:pl-8 w-full md:w-auto justify-between md:justify-start">
          <div>
            <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider block">Score Points</span>
            <span className="text-xl font-extrabold text-white">{attempt.score} Pts</span>
          </div>
          <div className="text-right md:text-left">
            <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider block">Accuracy Rate</span>
            <span className="text-xl font-extrabold text-white">{percentage}%</span>
          </div>
        </div>
      </div>

      {/* ─── Quick Stats Row ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Correct Answers', value: attempt.correct, color: 'text-emerald-600', bg: 'bg-emerald-50/50 border-emerald-100' },
          { label: 'Incorrect Answers', value: attempt.incorrect, color: 'text-red-500', bg: 'bg-red-50/50 border-red-100' },
          { label: 'Unanswered', value: attempt.unanswered, color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200/60' },
          { label: 'Time Utilized', value: formatTime(timeUsed), color: 'text-blue-600', bg: 'bg-blue-50/50 border-blue-100' },
        ].map((s) => (
          <div key={s.label} className={`bg-white p-6 rounded-2xl border shadow-sm flex flex-col justify-between ${s.bg}`}>
            <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-2">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ─── Bloom's Taxonomy & Topic Breakdowns Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bloom Performance */}
        {bloomEntries.length > 0 && (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/80 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#046B46] flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Bloom&apos;s Taxonomy Breakdown</h2>
            </div>
            <div className="space-y-2 flex-1">
              {bloomEntries.map(([level, stat]) => {
                const bloomPct = pct(stat.correct, stat.total);
                const color = bloomPct >= 80 ? '#046B46' : bloomPct >= 60 ? '#f59e0b' : '#ef4444';
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

        {/* Topic Performance */}
        {topicEntries.length > 0 && (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/80 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#046B46] flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Topic Performance Matrix</h2>
            </div>
            <div className="space-y-2 flex-1">
              {topicEntries.map(([topic, stat]) => {
                const topicPct = pct(stat.correct, stat.total);
                const color = topicPct >= 80 ? '#046B46' : topicPct >= 60 ? '#f59e0b' : '#ef4444';
                return (
                  <PerformanceBar key={topic} label={topic} correct={stat.correct} total={stat.total} color={color} />
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* ─── Strengths & Weaknesses Grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/80">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Identified Strengths</h2>
          </div>
          {attempt.strengths.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {attempt.strengths.map((s) => (
                <span key={s} className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-[#046B46] border border-emerald-100">{s}</span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">Keep practicing consistently to build noticeable strengths.</p>
          )}
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/80">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Areas Needing Attention</h2>
          </div>
          {attempt.weaknesses.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {attempt.weaknesses.map((w) => (
                <span key={w} className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-100">{w}</span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">No major weak areas detected — exceptional work!</p>
          )}
        </div>
      </div>

      {/* ─── AI Insight Panel ─── */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/80 relative overflow-hidden">
        <div className="absolute top-0 left-0 bottom-0 w-2 bg-[#046B46]" />
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-[#046B46]" />
          <h2 className="text-base font-bold text-slate-900">Comprehensive AI Insight</h2>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">{insight}</p>
        {weakTopics.length > 0 && (
          <div className="mt-4 p-4 rounded-2xl bg-amber-50/60 border border-amber-100 text-xs text-amber-900 flex items-start gap-2.5">
            <Target className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-950">Recommended Next Step:</span> Target your revision on <span className="font-semibold">{weakTopics.slice(0, 2).map(([t]) => t).join(' and ')}</span> before undertaking your next evaluation test.
            </div>
          </div>
        )}
      </div>

      {/* ─── Question Review Section ─── */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Detailed Question Review</h2>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{assessment.questions.length} Questions</span>
        </div>
        <div className="space-y-3">
          {assessment.questions.map((q, i) => (
            <QuestionReview
              key={q.id}
              question={q}
              userAnswer={attempt.answers?.[q.id]}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Bottom Actions Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200 pb-12">
        <Link href="/dashboard/assessments" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 px-6 py-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm">
          My Assessments
        </Link>
        <Link href="/dashboard/create" className="inline-flex items-center gap-2 text-sm font-bold text-white bg-[#046B46] hover:bg-[#035437] px-6 py-3 rounded-full transition-colors shadow-md shadow-emerald-900/10">
          Create New Assessment <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}

function generateInsight(strengths: string[], weaknesses: string[], percentage: number): string {
  if (percentage >= 90) {
    return 'Outstanding performance across all domains. You display an expert-level command of this material framework.';
  }
  if (strengths.length > 0 && weaknesses.length === 0) {
    return `Robust mastery demonstrated in ${strengths.slice(0, 2).join(' and ')}. All assessed sub-topics comfortably exceed standard proficiency thresholds.`;
  }
  if (strengths.length > 0 && weaknesses.length > 0) {
    return `Solid comprehension shown around ${strengths.slice(0, 2).join(' and ')}. However, concepts related to ${weaknesses.slice(0, 2).join(' and ')} ${weaknesses.length === 1 ? 'requires' : 'require'} targeted review.`;
  }
  if (weaknesses.length > 0) {
    return `Core foundational focus is needed regarding ${weaknesses.slice(0, 2).join(' and ')}. Direct your upcoming study sessions toward clearing these specific obstacles.`;
  }
  return percentage >= 60
    ? 'Satisfactory overall progress. Maintain regular review cycles to solidify your long-term understanding.'
    : 'This learning content requires deeper engagement. Consider revisiting core reference notes before initiating a re-test attempt.';
}