'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Info } from 'lucide-react';
import StepIndicator from '@/components/ui/StepIndicator';
import { computeBloomDistribution, BLOOM_LABELS, BLOOM_DESCRIPTIONS, BLOOM_COLORS } from '@/lib/bloom';
import type { MaterialAnalysis, AssessmentConfig, BloomLevel, BloomDistribution, Difficulty } from '@/types';

const STEPS = [
  { number: 1, label: 'Material' },
  { number: 2, label: 'Review' },
  { number: 3, label: 'Configure' },
  { number: 4, label: 'Blueprint' },
];

const BLOOM_ORDER: BloomLevel[] = ['recall', 'understand', 'apply', 'codeTrace', 'analyze'];
const DURATIONS = [5, 10, 15, 20];

export default function ConfigurePage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<MaterialAnalysis | null>(null);

  const [questionCount, setQuestionCount] = useState<5 | 10>(10);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [selectedLevels, setSelectedLevels] = useState<BloomLevel[]>(['recall', 'understand', 'apply', 'analyze']);
  const [distribution, setDistribution] = useState<BloomDistribution>({});
  const [duration, setDuration] = useState(20);

  useEffect(() => {
    const raw = sessionStorage.getItem('assessora_analysis');
    if (!raw) { router.replace('/dashboard/create'); return; }
    const parsed: MaterialAnalysis = JSON.parse(raw);
    setAnalysis(parsed);
  }, [router]);

  // Auto-compute distribution when levels or count changes
  useEffect(() => {
    if (selectedLevels.length === 0) { setDistribution({}); return; }
    const dist = computeBloomDistribution({ questionCount, bloomLevels: selectedLevels });
    setDistribution(dist);
  }, [selectedLevels, questionCount]);

  const toggleLevel = (level: BloomLevel) => {
    setSelectedLevels((prev) => {
      if (prev.includes(level)) {
        if (prev.length === 1) return prev; // keep at least one
        return prev.filter((l) => l !== level);
      }
      return [...prev, level];
    });
  };

  const adjustDistribution = (level: BloomLevel, delta: number) => {
    const total = Object.values(distribution).reduce((a, b) => a + (b ?? 0), 0);
    const current = distribution[level] ?? 0;
    const newVal = Math.max(1, current + delta);
    const diff = newVal - current;

    if (diff === 0) return;
    if (total + diff > questionCount) return; // can't exceed total
    if (total + diff < questionCount) return; // must equal total — auto-adjust handled below

    setDistribution((prev) => ({ ...prev, [level]: newVal }));
  };

  const handleContinue = () => {
    if (!analysis || selectedLevels.length === 0) return;
    const config: AssessmentConfig = {
      questionCount,
      difficulty,
      bloomLevels: selectedLevels,
      bloomDistribution: distribution,
      duration,
    };
    sessionStorage.setItem('assessora_config', JSON.stringify(config));
    router.push('/dashboard/create/blueprint');
  };

  const totalDist = Object.values(distribution).reduce((a, b) => a + (b ?? 0), 0);
  const distValid = totalDist === questionCount;

  const visibleLevels = analysis?.isProgramming
    ? BLOOM_ORDER
    : BLOOM_ORDER.filter((l) => l !== 'codeTrace');

  if (!analysis) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner border-slate-300 border-t-green-600" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="mb-8">
        <StepIndicator steps={STEPS} current={3} />
      </div>

      <div className="page-header">
        <h1 className="page-title">Configure Assessment</h1>
        <p className="page-subtitle">
          Set the number of questions, difficulty, and Bloom&apos;s taxonomy levels.
        </p>
      </div>

      <div className="space-y-5">
        {/* Question count */}
        <div className="card p-5">
          <p className="text-sm font-semibold text-slate-900 mb-3">Number of Questions</p>
          <div className="flex gap-3">
            {([5, 10] as const).map((n) => (
              <button
                key={n}
                onClick={() => setQuestionCount(n)}
                className={`flex-1 py-3 rounded-lg border-2 text-sm font-semibold transition-colors ${
                  questionCount === n
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {n} Questions
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="card p-5">
          <p className="text-sm font-semibold text-slate-900 mb-3">Difficulty</p>
          <div className="flex gap-3">
            {(['easy', 'medium', 'hard'] as const).map((d) => {
              const colors = {
                easy: questionCount && difficulty === d ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600 hover:border-slate-300',
                medium: difficulty === d ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 text-slate-600 hover:border-slate-300',
                hard: difficulty === d ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 text-slate-600 hover:border-slate-300',
              };
              return (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-3 rounded-lg border-2 text-sm font-semibold transition-colors capitalize ${
                    difficulty === d
                      ? d === 'easy' ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : d === 'medium' ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-red-500 bg-red-50 text-red-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration */}
        <div className="card p-5">
          <p className="text-sm font-semibold text-slate-900 mb-3">Time Limit</p>
          <div className="grid grid-cols-4 gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`py-2.5 rounded-lg border-2 text-sm font-medium transition-colors ${
                  duration === d
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {d} min
              </button>
            ))}
          </div>
        </div>

        {/* Bloom's Taxonomy */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-slate-900">Bloom&apos;s Taxonomy</p>
            <span className={`text-xs font-medium ${distValid ? 'text-green-600' : 'text-amber-600'}`}>
              {totalDist} / {questionCount} assigned
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Select the cognitive levels to test. Questions will be distributed accordingly.
          </p>

          {!analysis.isProgramming && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-sky-50 border border-sky-100 mb-4 text-xs text-sky-700">
              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              Code Trace is only available for programming subjects.
            </div>
          )}

          <div className="space-y-2">
            {visibleLevels.map((level) => {
              const isSelected = selectedLevels.includes(level);
              const colors = BLOOM_COLORS[level];
              const count = distribution[level] ?? 0;

              return (
                <div
                  key={level}
                  className={`rounded-lg border-2 transition-all ${
                    isSelected ? `${colors.border} ${colors.bg}` : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 p-3">
                    <button
                      onClick={() => toggleLevel(level)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected ? 'border-current bg-current' : 'border-slate-300'
                      } ${isSelected ? colors.text : ''}`}
                    >
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isSelected ? colors.text : 'text-slate-500'}`}>
                        {BLOOM_LABELS[level]}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{BLOOM_DESCRIPTIONS[level]}</p>
                    </div>
                    {isSelected && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => adjustDistribution(level, -1)}
                          disabled={count <= 1}
                          className={`w-6 h-6 rounded border flex items-center justify-center text-sm font-bold transition-colors disabled:opacity-30 ${colors.text} ${colors.border} ${colors.bg} hover:opacity-80`}
                        >
                          −
                        </button>
                        <span className={`w-6 text-center text-sm font-semibold ${colors.text}`}>{count}</span>
                        <button
                          onClick={() => adjustDistribution(level, 1)}
                          disabled={totalDist >= questionCount}
                          className={`w-6 h-6 rounded border flex items-center justify-center text-sm font-bold transition-colors disabled:opacity-30 ${colors.text} ${colors.border} ${colors.bg} hover:opacity-80`}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {!distValid && selectedLevels.length > 0 && (
            <p className="text-xs text-amber-600 mt-3">
              ⚠ Distribution must total exactly {questionCount}. Currently {totalDist}.
            </p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button onClick={() => router.push('/dashboard/create/analyze')} className="btn-ghost">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={handleContinue}
          className="btn-primary btn-lg"
          disabled={selectedLevels.length === 0 || !distValid}
        >
          Review Blueprint
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
