'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, ArrowRight, ArrowLeft, BookOpen, Layers, Tag } from 'lucide-react';
import StepIndicator from '@/components/ui/StepIndicator';
import type { MaterialAnalysis, Topic, Unit } from '@/types';

const STEPS = [
  { number: 1, label: 'Material' },
  { number: 2, label: 'Review' },
  { number: 3, label: 'Configure' },
  { number: 4, label: 'Blueprint' },
];

export default function AnalyzePage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<MaterialAnalysis | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTopic, setNewTopic] = useState('');

  useEffect(() => {
    const raw = sessionStorage.getItem('assessora_analysis');
    if (!raw) {
      router.replace('/dashboard/create');
      return;
    }
    const parsed: MaterialAnalysis = JSON.parse(raw);
    setAnalysis(parsed);
    setTopics(parsed.topics);
  }, [router]);

  const removeTopic = (id: string) => {
    setTopics((prev) => prev.filter((t) => t.id !== id));
  };

  const addTopic = () => {
    const trimmed = newTopic.trim();
    if (!trimmed) return;
    setTopics((prev) => [
      ...prev,
      { id: `custom-${Date.now()}`, title: trimmed },
    ]);
    setNewTopic('');
  };

  const handleContinue = () => {
    if (!analysis) return;
    const updated: MaterialAnalysis = { ...analysis, topics };
    sessionStorage.setItem('assessora_analysis', JSON.stringify(updated));
    router.push('/dashboard/create/configure');
  };

  if (!analysis) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner border-slate-300 border-t-green-600" />
      </div>
    );
  }

  const areaLabel: Record<string, string> = {
    programming: 'Programming',
    science: 'Science',
    humanities: 'Humanities',
    mathematics: 'Mathematics',
    other: 'General',
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      {/* Step indicator */}
      <div className="mb-8">
        <StepIndicator steps={STEPS} current={2} />
      </div>

      <div className="page-header">
        <h1 className="page-title">Review Detected Content</h1>
        <p className="page-subtitle">
          Assessora has analysed your material. Review and edit the detected topics before continuing.
        </p>
      </div>

      {/* Subject card */}
      <div className="card p-5 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Subject</p>
            <p className="text-lg font-bold text-slate-900">{analysis.subject}</p>
          </div>
          <div className="ml-auto">
            <span className="badge-slate">{areaLabel[analysis.subjectArea] || analysis.subjectArea}</span>
            {analysis.isProgramming && (
              <span className="badge-green ml-2">Programming</span>
            )}
          </div>
        </div>

        <div className="divider mb-4" />

        {/* Units */}
        {analysis.units.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Units detected</span>
            </div>
            <div className="space-y-1.5">
              {analysis.units.map((unit: Unit) => (
                <div key={unit.id} className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-100">
                  <p className="text-sm font-medium text-slate-700">{unit.title}</p>
                  {unit.topics.length > 0 && (
                    <p className="text-xs text-slate-400 mt-0.5">{unit.topics.join(' · ')}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key concepts */}
        {analysis.concepts.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Key concepts</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {analysis.concepts.map((c, i) => (
                <span key={i} className="badge-slate text-xs">{c}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Topics editor */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Topics</p>
            <p className="text-xs text-slate-400 mt-0.5">
              These topics will be used to generate questions. Add or remove as needed.
            </p>
          </div>
          <span className="badge-slate">{topics.length} topics</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700 group"
            >
              {topic.title}
              <button
                onClick={() => removeTopic(topic.id)}
                className="text-slate-300 hover:text-red-500 transition-colors group-hover:text-slate-400"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {topics.length === 0 && (
            <p className="text-sm text-slate-400 italic">No topics. Add some below.</p>
          )}
        </div>

        {/* Add topic */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') addTopic(); }}
            placeholder="Add a topic..."
            className="input flex-1"
          />
          <button onClick={addTopic} className="btn-secondary" disabled={!newTopic.trim()}>
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.push('/dashboard/create')} className="btn-ghost">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={handleContinue}
          className="btn-primary btn-lg"
          disabled={topics.length === 0}
        >
          Configure Assessment
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
