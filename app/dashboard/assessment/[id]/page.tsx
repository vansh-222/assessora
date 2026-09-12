'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Clock, ChevronLeft, ChevronRight, AlertCircle, BookOpen, Loader2 } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { BLOOM_LABELS, BLOOM_COLORS } from '@/lib/bloom';
import type { BloomLevel, Difficulty } from '@/types';

interface SafeQuestion {
  id: number;
  question: string;
  type: string;
  options: string[];
  explanation: string;
  topic: string;
  concept: string;
  bloomLevel: BloomLevel;
  difficulty: Difficulty;
}

interface SafeAssessment {
  id: string;
  title: string;
  subject: string;
  duration: number;
  questionCount: number;
  questions: SafeQuestion[];
  status: string;
}

type SubmitState = 'idle' | 'confirm' | 'submitting' | 'done';

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: 'badge-green',
  medium: 'badge-amber',
  hard: 'badge-red',
};

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [assessment, setAssessment] = useState<SafeAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [submitError, setSubmitError] = useState('');

  const startTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const submittingRef = useRef(false);

  // Load assessment
  useEffect(() => {
    fetch(`/api/assessment/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setAssessment(data);
        const durationSec = data.duration * 60;
        setTimeLeft(durationSec);
        durationRef.current = durationSec;
        startTimeRef.current = Date.now();
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Timer using elapsed-time logic (reliable across tab switches)
  useEffect(() => {
    if (!assessment || submitState !== 'idle') return;

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(0, durationRef.current - elapsed);
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(timerRef.current!);
        handleSubmit(true);
      }
    }, 1000);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [assessment, submitState]);

  const handleSubmit = useCallback(
    async (autoSubmit = false) => {
      if (submittingRef.current) return;
      submittingRef.current = true;
      setSubmitState('submitting');

      if (timerRef.current) clearInterval(timerRef.current);

      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const timeTaken = Math.min(elapsed, durationRef.current);

      try {
        const res = await fetch('/api/assessment/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assessmentId: id,
            answers,
            timeTaken,
            startedAt: new Date(startTimeRef.current).toISOString(),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Submission failed');

        setSubmitState('done');
        router.push(`/dashboard/assessment/${id}/results?attempt=${data.attemptId}`);
      } catch (err) {
        submittingRef.current = false;
        setSubmitError(err instanceof Error ? err.message : 'Submission failed.');
        setSubmitState('idle');
        // Restart timer if not auto-submit
        if (!autoSubmit && assessment) {
          startTimeRef.current = Date.now() - (durationRef.current - timeLeft) * 1000;
        }
      }
    },
    [id, answers, assessment, router, timeLeft]
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
        <p className="text-slate-500 text-sm">Loading assessment...</p>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-slate-700 font-medium">{error || 'Assessment not found'}</p>
        <button onClick={() => router.push('/dashboard')} className="btn-secondary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const question = assessment.questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = assessment.questionCount - answeredCount;
  const bloomColors = BLOOM_COLORS[question.bloomLevel];
  const isLowTime = timeLeft < 60 && timeLeft > 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-slate-900 truncate">{assessment.title}</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Question {currentIndex + 1} of {assessment.questionCount}
          </p>
        </div>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-mono text-base font-semibold flex-shrink-0 ${
            submitState === 'submitting' || submitState === 'done'
              ? 'bg-slate-100 border-slate-200 text-slate-400'
              : isLowTime
              ? 'bg-red-50 border-red-200 text-red-700 animate-pulse'
              : 'bg-white border-slate-200 text-slate-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex gap-5">
        {/* ─── Question panel ─── */}
        <div className="flex-1 min-w-0">
          <div className="card p-6 mb-4">
            {/* Question metadata */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`badge ${bloomColors.bg} ${bloomColors.text} ${bloomColors.border}`}>
                {BLOOM_LABELS[question.bloomLevel]}
              </span>
              <span className={DIFFICULTY_COLORS[question.difficulty]}>
                {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
              </span>
              <span className="badge-slate flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {question.topic}
              </span>
            </div>

            {/* Question text */}
            <p className="text-base font-medium text-slate-900 leading-relaxed mb-6 whitespace-pre-wrap">
              {question.question}
            </p>

            {/* Options */}
            <div className="space-y-2.5">
              {question.options.map((opt, i) => {
                const isSelected = answers[question.id] === opt;
                const label = String.fromCharCode(65 + i); // A, B, C, D
                return (
                  <button
                    key={i}
                    onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: opt }))}
                    className={`w-full flex items-start gap-3 p-4 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? 'border-green-500 bg-green-50'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold transition-colors ${
                        isSelected
                          ? 'border-green-500 bg-green-500 text-white'
                          : 'border-slate-300 text-slate-400'
                      }`}
                    >
                      {label}
                    </div>
                    <span className={`text-sm leading-relaxed ${isSelected ? 'text-green-900' : 'text-slate-700'}`}>
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="btn-secondary"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {currentIndex < assessment.questionCount - 1 ? (
              <button
                onClick={() => setCurrentIndex((i) => Math.min(assessment.questionCount - 1, i + 1))}
                className="btn-primary"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setSubmitState('confirm')}
                className="btn-primary"
                disabled={submitState !== 'idle'}
              >
                Submit Assessment
              </button>
            )}
          </div>
        </div>

        {/* ─── Question navigator ─── */}
        <div className="w-44 flex-shrink-0">
          <div className="card p-4 sticky top-8">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Questions
            </p>
            <div className="grid grid-cols-5 gap-1.5 mb-4">
              {assessment.questions.map((q, i) => {
                const isAnswered = !!answers[q.id];
                const isCurrent = i === currentIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(i)}
                    title={isAnswered ? 'Answered' : 'Unanswered'}
                    className={`w-8 h-8 rounded text-xs font-semibold transition-colors ${
                      isCurrent
                        ? 'bg-green-600 text-white'
                        : isAnswered
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-600" />
                <span className="text-slate-500">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-100 border border-green-200" />
                <span className="text-slate-500">Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-slate-100" />
                <span className="text-slate-500">Unanswered ({unansweredCount})</span>
              </div>
            </div>

            <div className="divider my-3" />

            <button
              onClick={() => setSubmitState('confirm')}
              disabled={submitState !== 'idle'}
              className="btn-primary w-full text-xs py-2"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* ─── Submit confirmation modal ─── */}
      {(submitState === 'confirm' || submitState === 'submitting') && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="card p-6 w-full max-w-sm animate-slide-up">
            {submitState === 'submitting' ? (
              <div className="text-center py-4">
                <Loader2 className="w-8 h-8 text-green-600 animate-spin mx-auto mb-3" />
                <p className="font-medium text-slate-900">Submitting assessment...</p>
                <p className="text-sm text-slate-400 mt-1">Calculating your score</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Submit Assessment?</h3>
                <p className="text-sm text-slate-500 mb-5">
                  Once submitted, you cannot change your answers.
                </p>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="text-center p-3 rounded-lg bg-green-50">
                    <p className="text-xl font-bold text-green-700">{answeredCount}</p>
                    <p className="text-xs text-green-600 mt-0.5">Answered</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-amber-50">
                    <p className="text-xl font-bold text-amber-700">{unansweredCount}</p>
                    <p className="text-xs text-amber-600 mt-0.5">Unanswered</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-slate-50">
                    <p className="text-xl font-bold text-slate-700">{formatTime(timeLeft)}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Remaining</p>
                  </div>
                </div>
                {submitError && (
                  <p className="text-sm text-red-600 mb-4">{submitError}</p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => setSubmitState('idle')}
                    className="btn-secondary flex-1"
                  >
                    Continue
                  </button>
                  <button
                    onClick={() => handleSubmit(false)}
                    className="btn-primary flex-1"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
