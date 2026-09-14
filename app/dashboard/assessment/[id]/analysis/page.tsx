'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles, ArrowLeft, Loader2, AlertTriangle, Target,
  BookOpen, TrendingUp, TrendingDown, CheckCircle2, XCircle,
  Brain, Lightbulb, ArrowRight, ChevronRight, AlertCircle,
  Clock, Zap
} from 'lucide-react';
import { BLOOM_LABELS } from '@/lib/bloom';
import { pct } from '@/lib/utils';
import type { AttemptResult, Question, BloomLevel } from '@/types';

interface FullAssessment {
  id: string;
  title: string;
  subject: string;
  duration: number;
  difficulty: string;
  questions: Question[];
}

interface PageData {
  attempt: AttemptResult & { id: string };
  assessment: FullAssessment;
}

interface MistakeDetail {
  questionNumber: number;
  question: string;
  topic: string;
  bloomLevel: string;
  userAnswer: string | undefined;
  correctAnswer: string;
  explanation: string;
  wasUnanswered: boolean;
}

export default function AnalysisPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get('attempt');
  const assessmentId = params.id as string;

  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!attemptId) { setError('No attempt ID provided.'); setLoading(false); return; }
    fetch(`/api/attempt/${attemptId}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#046B46] animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Generating AI Analysis...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-slate-800 font-bold text-lg">{error || 'Analysis not available'}</p>
        <Link href="/dashboard" className="text-sm font-bold text-[#046B46] hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const { attempt, assessment } = data;
  const percentage = Math.round(attempt.percentage);

  // ─── Build mistake details ───
  const mistakes: MistakeDetail[] = [];
  const answers = attempt.answers || {};

  for (const q of assessment.questions) {
    const userAnswer = answers[q.id];
    const isCorrect = userAnswer === q.correctAnswer;
    if (!isCorrect) {
      mistakes.push({
        questionNumber: q.id,
        question: q.question,
        topic: q.topic,
        bloomLevel: (q as any).bloomLevel || 'understand',
        userAnswer,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        wasUnanswered: !userAnswer,
      });
    }
  }

  // ─── Topic analysis ───
  const topicEntries = Object.entries(attempt.topicPerformance || {});
  const weakTopics = topicEntries
    .map(([name, stat]) => ({ name, correct: stat.correct, total: stat.total, pct: pct(stat.correct, stat.total) }))
    .filter(t => t.pct < 70)
    .sort((a, b) => a.pct - b.pct);

  const strongTopics = topicEntries
    .map(([name, stat]) => ({ name, correct: stat.correct, total: stat.total, pct: pct(stat.correct, stat.total) }))
    .filter(t => t.pct >= 70)
    .sort((a, b) => b.pct - a.pct);

  // ─── Bloom analysis ───
  const bloomEntries = Object.entries(attempt.bloomPerformance || {})
    .map(([level, stat]) => ({
      level,
      label: BLOOM_LABELS[level as BloomLevel] || level,
      correct: (stat as any).correct || 0,
      total: (stat as any).total || 0,
      pct: pct((stat as any).correct || 0, (stat as any).total || 0),
    }))
    .filter(b => b.total > 0)
    .sort((a, b) => a.pct - b.pct);

  const weakBloom = bloomEntries.filter(b => b.pct < 70);
  const strongBloom = bloomEntries.filter(b => b.pct >= 70);

  // ─── Mistakes by topic ───
  const mistakesByTopic: Record<string, MistakeDetail[]> = {};
  for (const m of mistakes) {
    if (!mistakesByTopic[m.topic]) mistakesByTopic[m.topic] = [];
    mistakesByTopic[m.topic].push(m);
  }

  // ─── Improvement suggestions ───
  const suggestions: { title: string; desc: string; icon: typeof Target; color: string; bg: string }[] = [];

  if (weakTopics.length > 0) {
    suggestions.push({
      title: `Focus on ${weakTopics.slice(0, 2).map(t => t.name).join(' and ')}`,
      desc: `These topics have the lowest accuracy (${weakTopics[0].pct}%). Review the core concepts and practice with targeted questions.`,
      icon: Target,
      color: 'text-red-600',
      bg: 'bg-red-50',
    });
  }

  if (attempt.unanswered > 0) {
    suggestions.push({
      title: `Address ${attempt.unanswered} unanswered question${attempt.unanswered > 1 ? 's' : ''}`,
      desc: 'Unanswered questions cost you points. Practice time management to ensure you attempt every question.',
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    });
  }

  if (weakBloom.length > 0) {
    suggestions.push({
      title: `Strengthen ${weakBloom[0].label} skills`,
      desc: `Your ${weakBloom[0].label} accuracy is ${weakBloom[0].pct}%. Practice ${weakBloom[0].label.toLowerCase()}-level questions to build this cognitive skill.`,
      icon: Brain,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    });
  }

  if (percentage >= 70) {
    suggestions.push({
      title: 'Push for mastery',
      desc: 'You\'re performing well. Focus on the few remaining weak areas to achieve full mastery of this material.',
      icon: Zap,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    });
  } else {
    suggestions.push({
      title: 'Build a stronger foundation',
      desc: 'Revisit the study material systematically. Start with the basics before moving to advanced topics.',
      icon: BookOpen,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    });
  }

  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-16 px-6 md:px-10">

      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          
         
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{assessment.title}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{assessment.subject} · Detailed performance breakdown and improvement roadmap</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className={`px-5 py-3 rounded-2xl text-center ${percentage >= 70 ? 'bg-emerald-50 border border-emerald-100' : percentage >= 40 ? 'bg-amber-50 border border-amber-100' : 'bg-red-50 border border-red-100'}`}>
            <div className={`text-2xl font-black ${percentage >= 70 ? 'text-emerald-700' : percentage >= 40 ? 'text-amber-700' : 'text-red-600'}`}>{percentage}%</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Score</div>
          </div>
        </div>
      </div>

      {/* ─── Overview Cards ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
          <div className="text-2xl font-black text-emerald-600">{attempt.correct}</div>
          <div className="text-[11px] font-bold text-slate-400 mt-1">Correct</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
          <div className="text-2xl font-black text-red-500">{attempt.incorrect}</div>
          <div className="text-[11px] font-bold text-slate-400 mt-1">Incorrect</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
          <div className="text-2xl font-black text-slate-500">{attempt.unanswered}</div>
          <div className="text-[11px] font-bold text-slate-400 mt-1">Unanswered</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
          <div className="text-2xl font-black text-slate-700">{mistakes.length}</div>
          <div className="text-[11px] font-bold text-slate-400 mt-1">Total Mistakes</div>
        </div>
      </div>

      {/* ─── Improvement Roadmap ─── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 md:p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#046B46] to-emerald-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Improvement Roadmap</h2>
            <p className="text-xs text-slate-400">Personalized recommendations based on your performance.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((s, i) => (
            <div key={i} className={`flex items-start gap-4 p-5 rounded-2xl ${s.bg} border border-slate-100`}>
              <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.color} flex items-center justify-center flex-shrink-0 border border-white/50`}>
                <s.icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Topic Breakdown ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* Weak Topics */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-2 mb-5">
            <TrendingDown className="w-5 h-5 text-red-500" />
            <h2 className="text-base font-bold text-slate-900">Weak Topics</h2>
            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full ml-auto">{weakTopics.length} topic{weakTopics.length !== 1 ? 's' : ''}</span>
          </div>

          {weakTopics.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-300 mx-auto mb-2" />
              No weak topics — great job!
            </div>
          ) : (
            <div className="space-y-3">
              {weakTopics.map((t) => (
                <div key={t.name} className="p-4 rounded-2xl bg-red-50/50 border border-red-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{t.name}</span>
                    <span className="text-xs font-bold text-red-600">{t.pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-red-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-400 rounded-full" style={{ width: `${t.pct}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    {t.correct}/{t.total} correct · Needs focused revision
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Strong Topics */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h2 className="text-base font-bold text-slate-900">Strong Topics</h2>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full ml-auto">{strongTopics.length} topic{strongTopics.length !== 1 ? 's' : ''}</span>
          </div>

          {strongTopics.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-400">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              Keep practicing to build strong topics.
            </div>
          ) : (
            <div className="space-y-3">
              {strongTopics.map((t) => (
                <div key={t.name} className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{t.name}</span>
                    <span className="text-xs font-bold text-emerald-600">{t.pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${t.pct}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    {t.correct}/{t.total} correct · Well understood
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── Bloom's Cognitive Skills ─── */}
      {bloomEntries.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 md:p-8 mb-8">
          <div className="flex items-center gap-2 mb-5">
            <Brain className="w-5 h-5 text-violet-500" />
            <h2 className="text-base font-bold text-slate-900">Cognitive Skills Analysis</h2>
          </div>
          <p className="text-xs text-slate-400 mb-5">How you perform across different thinking levels (Bloom&apos;s Taxonomy).</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bloomEntries.map((b) => {
              const isWeak = b.pct < 70;
              return (
                <div key={b.level} className={`p-4 rounded-2xl border ${isWeak ? 'bg-amber-50/50 border-amber-100' : 'bg-emerald-50/30 border-emerald-100'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-800">{b.label}</span>
                    <span className={`text-xs font-bold ${isWeak ? 'text-amber-600' : 'text-emerald-600'}`}>{b.pct}%</span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${isWeak ? 'bg-amber-100' : 'bg-emerald-100'}`}>
                    <div className={`h-full rounded-full ${isWeak ? 'bg-amber-400' : 'bg-emerald-500'}`} style={{ width: `${b.pct}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2">{b.correct}/{b.total} correct</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Detailed Mistake Breakdown ─── */}
      {mistakes.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 md:p-8 mb-8">
          <div className="flex items-center gap-2 mb-5">
            <XCircle className="w-5 h-5 text-red-500" />
            <h2 className="text-base font-bold text-slate-900">Mistake Breakdown</h2>
            <span className="text-[10px] font-bold text-slate-400 ml-auto">{mistakes.length} mistake{mistakes.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="space-y-4">
            {Object.entries(mistakesByTopic).map(([topic, topicMistakes]) => (
              <div key={topic} className="border border-slate-100 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3.5 bg-slate-50 border-b border-slate-100">
                  <Target className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-bold text-slate-800">{topic}</span>
                  <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full ml-auto">
                    {topicMistakes.length} mistake{topicMistakes.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="divide-y divide-slate-50">
                  {topicMistakes.map((m, idx) => (
                    <div key={idx} className="px-5 py-4">
                      <p className="text-sm text-slate-800 font-semibold mb-3">
                        <span className="text-slate-400 mr-1.5">Q{m.questionNumber}.</span>
                        {m.question}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-2 mb-3">
                        {m.wasUnanswered ? (
                          <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500">
                            <Clock className="w-3 h-3" /> Not answered
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-100">
                            <XCircle className="w-3 h-3" /> Your answer: {m.userAnswer}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <CheckCircle2 className="w-3 h-3" /> Correct: {m.correctAnswer}
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 inline mr-1.5 -mt-0.5" />
                        {m.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Bottom Actions ─── */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <Link
          href={`/dashboard/assessment/${assessmentId}/results?attempt=${attemptId}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 px-6 py-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Results
        </Link>
        <Link
          href="/dashboard/practice"
          className="inline-flex items-center gap-2 text-sm font-bold text-white bg-[#046B46] hover:bg-[#035437] px-6 py-3 rounded-full transition-colors shadow-md shadow-emerald-900/10"
        >
          Start Practice <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
