'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Clock, ChevronLeft, ChevronRight, AlertCircle, BookOpen, Loader2, Target, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { BLOOM_LABELS } from '@/lib/bloom';
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
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
         <div className="flex flex-col items-center animate-pulse">
            <div className="w-16 h-16 bg-[#Edf5f0] rounded-full flex items-center justify-center mb-4">
               <svg className="animate-spin w-8 h-8 text-[#0A3D2C]" viewBox="0 0 50 50">
                  <circle cx="25" cy="25" r="23" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="100" strokeDashoffset="25" />
               </svg>
            </div>
            <p className="text-slate-500 font-bold">Loading Assessment...</p>
         </div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] gap-6">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500">
           <AlertCircle className="w-10 h-10" />
        </div>
        <p className="text-xl font-bold text-slate-900">{error || 'Assessment not found'}</p>
        <button onClick={() => router.push('/dashboard')} className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const question = assessment.questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = assessment.questionCount - answeredCount;
  const isLowTime = timeLeft < 60 && timeLeft > 0;

  return (
    <div className="animate-fade-in w-full max-w-6xl mx-auto py-8 px-4 sm:px-8 flex flex-col min-h-[calc(100vh-80px)]">
      
      {/* ─── Header ─── */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold text-[#1a2b25] tracking-tight mb-2 truncate">
            {assessment.title}
          </h1>
          <p className="text-[15px] font-medium text-slate-500 flex items-center gap-2">
            Question <span className="font-bold text-[#0A3D2C]">{currentIndex + 1}</span> of {assessment.questionCount}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-12 flex-1 items-start">
        
        {/* ─── Question Panel (Left Column) ─── */}
        <div className="flex flex-col min-w-0">
          
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 md:p-12 mb-8 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#Edf5f0] to-transparent opacity-50 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

            {/* Question Metadata */}
            <div className="flex flex-wrap items-center gap-3 mb-8 relative z-10">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                <BrainCircuit className="w-3.5 h-3.5" />
                {BLOOM_LABELS[question.bloomLevel]}
              </span>
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] font-bold uppercase tracking-wider ${
                question.difficulty === 'easy' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                question.difficulty === 'medium' ? 'bg-amber-50 border-amber-100 text-amber-700' :
                'bg-red-50 border-red-100 text-red-700'
              }`}>
                <Target className="w-3.5 h-3.5" />
                {question.difficulty}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-600">
                <BookOpen className="w-3.5 h-3.5" />
                {question.topic}
              </span>
            </div>

            {/* Question Text */}
            <h2 className="text-xl md:text-[22px] font-bold text-[#1a2b25] leading-relaxed mb-10 whitespace-pre-wrap relative z-10">
              {question.question}
            </h2>

            {/* Options */}
            <div className="space-y-4 relative z-10">
              {question.options.map((opt, i) => {
                const isSelected = answers[question.id] === opt;
                const label = String.fromCharCode(65 + i); // A, B, C, D
                
                return (
                  <button
                    key={i}
                    onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: opt }))}
                    className={`w-full flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all group outline-none focus:ring-4 focus:ring-[#Edf5f0]
                      ${isSelected
                        ? 'border-[#0A3D2C] bg-[#F4F9F6] shadow-sm'
                        : 'border-slate-100 bg-white hover:border-[#c1e2d1] hover:bg-[#F9FCFA] hover:shadow-sm'
                      }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold transition-all shadow-sm
                        ${isSelected
                          ? 'bg-[#0A3D2C] text-white'
                          : 'bg-white border border-slate-200 text-slate-400 group-hover:border-[#c1e2d1] group-hover:text-[#0A3D2C]'
                        }`}
                    >
                      {label}
                    </div>
                    <span className={`text-[15px] leading-relaxed font-medium mt-1 ${isSelected ? 'text-[#0A3D2C] font-bold' : 'text-slate-600 group-hover:text-slate-800'}`}>
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="px-6 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Question
            </button>

            {currentIndex < assessment.questionCount - 1 ? (
              <button
                onClick={() => setCurrentIndex((i) => Math.min(assessment.questionCount - 1, i + 1))}
                className="bg-[#0A3D2C] text-white hover:bg-[#06281c] px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2 hover:shadow-md transform hover:-translate-y-0.5"
              >
                Next Question
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setSubmitState('confirm')}
                disabled={submitState !== 'idle'}
                className="bg-[#0A3D2C] text-white hover:bg-[#06281c] px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2 hover:shadow-md transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Submit Assessment
              </button>
            )}
          </div>
        </div>

        {/* ─── Navigator Panel (Right Column) ─── */}
        <div className="sticky top-8 flex flex-col gap-6 w-full">
          
          {/* Timer Card */}
          <div className={`rounded-2xl border flex items-center justify-center gap-3 py-4 px-6 shadow-sm transition-colors ${
              submitState === 'submitting' || submitState === 'done'
                ? 'bg-slate-50 border-slate-200 text-slate-400'
                : isLowTime
                ? 'bg-red-50 border-red-200 text-red-600 animate-pulse'
                : 'bg-white border-slate-100 text-[#0A3D2C]'
            }`}
          >
            <Clock className={`w-5 h-5 ${isLowTime ? 'text-red-500' : 'text-[#0A3D2C]'}`} />
            <span className="font-mono text-xl font-bold tracking-tight">
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* Question Navigator Card */}
          <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 flex flex-col">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
              Question Navigator
            </h3>
            
            <div className="grid grid-cols-5 gap-2 mb-8">
              {assessment.questions.map((q, i) => {
                const isAnswered = !!answers[q.id];
                const isCurrent = i === currentIndex;
                
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(i)}
                    title={isAnswered ? 'Answered' : 'Unanswered'}
                    className={`aspect-square rounded-xl text-sm font-bold transition-all flex items-center justify-center relative
                      ${isCurrent
                        ? 'bg-[#0A3D2C] text-white shadow-md transform -translate-y-0.5'
                        : isAnswered
                        ? 'bg-[#Edf5f0] text-[#0A3D2C] border border-[#c1e2d1] hover:border-[#0A3D2C]/40 hover:bg-[#F4F9F6]'
                        : 'bg-white border border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    {i + 1}
                    {isAnswered && !isCurrent && (
                       <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-100 mb-6">
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#0A3D2C]" />
                  <span className="font-semibold text-slate-700">Current</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#Edf5f0] border border-[#c1e2d1]" />
                  <span className="font-semibold text-slate-700">Answered</span>
                </div>
                <span className="font-bold text-[#0A3D2C]">{answeredCount}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white border border-slate-200" />
                  <span className="font-semibold text-slate-700">Unanswered</span>
                </div>
                <span className="font-bold text-slate-500">{unansweredCount}</span>
              </div>
            </div>

            <button
              onClick={() => setSubmitState('confirm')}
              disabled={submitState !== 'idle'}
              className="w-full bg-[#Edf5f0] hover:bg-[#c1e2d1] text-[#0A3D2C] py-3.5 rounded-xl font-bold text-sm transition-colors border border-[#c1e2d1] disabled:opacity-50"
            >
              Submit Assessment
            </button>
          </div>
        </div>
      </div>

      {/* ─── Submit confirmation modal ─── */}
      {(submitState === 'confirm' || submitState === 'submitting') && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md animate-slide-up shadow-2xl border border-slate-100">
            {submitState === 'submitting' ? (
              <div className="text-center py-8 flex flex-col items-center">
                <div className="w-20 h-20 bg-[#Edf5f0] rounded-full flex items-center justify-center mb-6 relative">
                  <CheckCircle2 className="w-8 h-8 text-[#0A3D2C] absolute" />
                  <svg className="animate-spin w-full h-full text-[#0A3D2C] opacity-20" viewBox="0 0 50 50">
                    <circle cx="25" cy="25" r="23" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="100" strokeDashoffset="25" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Submitting assessment...</h3>
                <p className="text-sm font-medium text-slate-500">Calculating your final score</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 mb-6 mx-auto">
                   <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-center text-[#1a2b25] mb-2">Ready to submit?</h3>
                <p className="text-center text-sm font-medium text-slate-500 mb-8">
                  Once submitted, you cannot change your answers. Please review your progress before continuing.
                </p>
                
                <div className="grid grid-cols-3 gap-3 mb-8">
                  <div className="text-center p-4 rounded-2xl bg-[#Edf5f0] border border-[#c1e2d1]">
                    <p className="text-2xl font-bold text-[#0A3D2C] mb-1">{answeredCount}</p>
                    <p className="text-[10px] font-bold text-[#0A3D2C]/70 uppercase tracking-wider">Answered</p>
                  </div>
                  <div className={`text-center p-4 rounded-2xl border ${unansweredCount > 0 ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                    <p className="text-2xl font-bold mb-1">{unansweredCount}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">Unanswered</p>
                  </div>
                  <div className="text-center p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                    <p className="text-xl font-bold text-indigo-700 mb-1 leading-8">{formatTime(timeLeft)}</p>
                    <p className="text-[10px] font-bold text-indigo-700/70 uppercase tracking-wider">Remaining</p>
                  </div>
                </div>
                
                {submitError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 mb-6">
                    <div className="w-5 h-5 mt-0.5 shrink-0 bg-red-100 rounded-full flex items-center justify-center font-bold">!</div>
                    <p className="text-sm font-bold">{submitError}</p>
                  </div>
                )}
                
                <div className="flex gap-4">
                  <button
                    onClick={() => setSubmitState('idle')}
                    className="flex-1 py-3.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSubmit(false)}
                    className="flex-1 bg-[#0A3D2C] text-white hover:bg-[#06281c] py-3.5 rounded-xl font-bold transition-colors shadow-sm"
                  >
                    Submit Now
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
