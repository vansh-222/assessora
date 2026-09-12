'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Sparkles, BookOpen, Clock, Target, BarChart3 } from 'lucide-react';
import StepIndicator from '@/components/ui/StepIndicator';
import ProcessingSteps from '@/components/ui/ProcessingSteps';
import { BLOOM_LABELS, BLOOM_COLORS } from '@/lib/bloom';
import type { MaterialAnalysis, AssessmentConfig, BloomLevel, ProcessingStep } from '@/types';

const STEPS = [
  { number: 1, label: 'Material' },
  { number: 2, label: 'Review' },
  { number: 3, label: 'Configure' },
  { number: 4, label: 'Blueprint' },
];

export default function BlueprintPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<MaterialAnalysis | null>(null);
  const [config, setConfig] = useState<AssessmentConfig | null>(null);
  const [title, setTitle] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    { label: 'Building assessment blueprint', status: 'pending' },
    { label: 'Generating questions with AI', status: 'pending' },
    { label: 'Validating question quality', status: 'pending' },
    { label: 'Finalising assessment', status: 'pending' },
  ]);

  useEffect(() => {
    const rawAnalysis = sessionStorage.getItem('assessora_analysis');
    const rawConfig = sessionStorage.getItem('assessora_config');
    if (!rawAnalysis || !rawConfig) {
      router.replace('/dashboard/create');
      return;
    }
    const parsedAnalysis: MaterialAnalysis = JSON.parse(rawAnalysis);
    const parsedConfig: AssessmentConfig = JSON.parse(rawConfig);
    setAnalysis(parsedAnalysis);
    setConfig(parsedConfig);
    setTitle(`${parsedAnalysis.subject} Assessment`);
  }, [router]);

  const updateStep = (index: number, status: ProcessingStep['status']) => {
    setProcessingSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, status } : s))
    );
  };

  const handleGenerate = async () => {
    if (!analysis || !config) return;
    setError('');
    setGenerating(true);

    updateStep(0, 'active');
    await delay(600);
    updateStep(0, 'done');
    updateStep(1, 'active');

    try {
      const fileName = sessionStorage.getItem('assessora_fileName') || undefined;

      const res = await fetch('/api/assessment/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || `${analysis.subject} Assessment`,
          analysis,
          config,
          sourceFileName: fileName,
        }),
      });

      updateStep(1, 'done');
      updateStep(2, 'active');
      await delay(400);

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');

      updateStep(2, 'done');
      updateStep(3, 'active');
      await delay(300);
      updateStep(3, 'done');

      // Clean up session storage
      sessionStorage.removeItem('assessora_analysis');
      sessionStorage.removeItem('assessora_config');
      sessionStorage.removeItem('assessora_fileName');

      router.push(`/dashboard/assessment/${data.assessmentId}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Generation failed. Please try again.';
      setError(msg);
      setGenerating(false);
      setProcessingSteps((prev) => prev.map((s) => ({ ...s, status: 'pending' })));
    }
  };

  if (!analysis || !config) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner border-slate-300 border-t-green-600" />
      </div>
    );
  }

  const bloomEntries = Object.entries(config.bloomDistribution) as [BloomLevel, number][];

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="mb-8">
        <StepIndicator steps={STEPS} current={4} />
      </div>

      <div className="page-header">
        <h1 className="page-title">Assessment Blueprint</h1>
        <p className="page-subtitle">
          Review your assessment configuration before generating questions.
        </p>
      </div>

      {/* Assessment title */}
      <div className="card p-5 mb-4">
        <label className="label">Assessment Name</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
          placeholder="Assessment name"
        />
      </div>

      {/* Blueprint summary */}
      <div className="card p-5 mb-4">
        <p className="text-sm font-semibold text-slate-900 mb-4">Configuration Summary</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Subject</p>
              <p className="text-sm font-medium text-slate-900">{analysis.subject}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-4 h-4 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Questions</p>
              <p className="text-sm font-medium text-slate-900">{config.questionCount} questions</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
              <Target className="w-4 h-4 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Difficulty</p>
              <p className="text-sm font-medium text-slate-900 capitalize">{config.difficulty}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Time Limit</p>
              <p className="text-sm font-medium text-slate-900">{config.duration} minutes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bloom distribution */}
      <div className="card p-5 mb-4">
        <p className="text-sm font-semibold text-slate-900 mb-3">Bloom&apos;s Taxonomy Distribution</p>
        <div className="space-y-2">
          {bloomEntries.map(([level, count]) => {
            if (!count) return null;
            const colors = BLOOM_COLORS[level];
            const pct = Math.round((count / config.questionCount) * 100);
            return (
              <div key={level} className="flex items-center gap-3">
                <span className={`badge ${colors.bg} ${colors.text} ${colors.border} w-28 justify-center flex-shrink-0`}>
                  {BLOOM_LABELS[level]}
                </span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${colors.bg.replace('bg-', 'bg-').replace('-50', '-400')}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-700 w-16 text-right flex-shrink-0">
                  {count} Q{count !== 1 ? 's' : ''}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Topic coverage */}
      <div className="card p-5 mb-6">
        <p className="text-sm font-semibold text-slate-900 mb-3">Topic Coverage</p>
        <div className="flex flex-wrap gap-1.5">
          {analysis.topics.slice(0, 12).map((t) => (
            <span key={t.id} className="badge-slate">{t.title}</span>
          ))}
          {analysis.topics.length > 12 && (
            <span className="badge-slate">+{analysis.topics.length - 12} more</span>
          )}
        </div>
      </div>

      {/* Processing */}
      {generating && (
        <div className="card p-5 mb-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
            Generating Assessment
          </p>
          <ProcessingSteps steps={processingSteps} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm mb-5">
          {error}
        </div>
      )}

      {/* Navigation */}
      {!generating && (
        <div className="flex items-center justify-between">
          <button onClick={() => router.push('/dashboard/create/configure')} className="btn-ghost">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button onClick={handleGenerate} className="btn-primary btn-lg">
            <Sparkles className="w-4 h-4" />
            Generate Assessment
          </button>
        </div>
      )}
    </div>
  );
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
