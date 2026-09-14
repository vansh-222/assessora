'use client';

import { useState, useEffect } from 'react';
import {
  Loader2, Target, Zap, Play, ChevronRight,
  Compass, AlertCircle, CheckCircle2, Sparkles,
  BarChart3, Layers, SlidersHorizontal, BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TopicStat {
  topic: string;
  score: number;
  status: string;
  correct: number;
  total: number;
}

interface BloomStat {
  level: string;
  label: string;
  correct: number;
  total: number;
  percentage: number;
}

const BLOOM_LABELS: Record<string, string> = {
  recall: 'Recall',
  understand: 'Understand',
  apply: 'Apply',
  codeTrace: 'Code Trace',
  analyze: 'Analyze',
};

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy', desc: 'Foundational concepts and basic recall questions', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { value: 'medium', label: 'Medium', desc: 'Application-level problems requiring deeper understanding', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  { value: 'hard', label: 'Hard', desc: 'Analysis and complex multi-step reasoning problems', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
];

const BLOOM_OPTIONS = [
  { value: 'recall', label: 'Recall', desc: 'Identify and remember key facts, terms, and definitions' },
  { value: 'understand', label: 'Understand', desc: 'Explain concepts and interpret information' },
  { value: 'apply', label: 'Apply', desc: 'Use concepts to solve new problems' },
  { value: 'codeTrace', label: 'Code Trace', desc: 'Trace through code execution and predict outputs' },
  { value: 'analyze', label: 'Analyze', desc: 'Break down complex ideas and find patterns' },
];

type Tab = 'Recommended' | 'By Topic' | 'By Difficulty' | "By Bloom's Level" | 'Custom Practice';

export default function PracticePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('Recommended');

  // Data from API
  const [topicStats, setTopicStats] = useState<TopicStat[]>([]);
  const [bloomStats, setBloomStats] = useState<BloomStat[]>([]);
  const [avgScore, setAvgScore] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);

  // Selection state for tabs
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [selectedBloom, setSelectedBloom] = useState('understand');

  // Custom practice state
  const [customTopics, setCustomTopics] = useState<string[]>([]);
  const [customDifficulty, setCustomDifficulty] = useState('medium');
  const [customBloom, setCustomBloom] = useState<string[]>(['understand']);
  const [customCount, setCustomCount] = useState(5);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        setAvgScore(data.avgScore || 0);
        setTotalCompleted(data.completed || 0);

        if (data.needsAttention && data.needsAttention.length > 0) {
          setTopicStats(data.needsAttention.map((t: any) => ({
            topic: t.topic,
            score: t.score,
            status: t.status,
            correct: 0,
            total: 0,
          })));
        }
      })
      .catch(() => setError('Failed to load practice data.'))
      .finally(() => setLoading(false));

    // Also fetch bloom stats from attempts
    fetch('/api/practice/stats')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.bloomStats) setBloomStats(data.bloomStats);
        if (data?.topicStats) setTopicStats(prev => prev.length > 0 ? prev : data.topicStats);
      })
      .catch(() => {});
  }, []);

  const handleStartPractice = async (id: string, opts: {
    topics?: string[];
    difficulty?: string;
    bloomLevel?: string;
    questionCount?: number;
  }) => {
    setGeneratingId(id);
    setError('');

    const topics = opts.topics && opts.topics.length > 0 ? opts.topics : topicStats.slice(0, 3).map(t => t.topic);
    if (topics.length === 0) {
      setError('No topics available. Complete an assessment first.');
      setGeneratingId(null);
      return;
    }

    try {
      const res = await fetch('/api/practice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topics,
          difficulty: opts.difficulty || 'medium',
          bloomLevel: opts.bloomLevel,
          questionCount: opts.questionCount || 5,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate practice');
      router.push(`/dashboard/assessment/${data.assessmentId}`);
    } catch (err: any) {
      setError(err.message);
      setGeneratingId(null);
    }
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const toggleCustomTopic = (topic: string) => {
    setCustomTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const toggleCustomBloom = (level: string) => {
    setCustomBloom(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#046B46] animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Loading practice area...</p>
      </div>
    );
  }

  const isEmpty = topicStats.length === 0;

  // Separate weak / needs practice / developing
  const weakTopics = topicStats.filter(t => t.status === 'Needs Practice' || t.score < 60);
  const developingTopics = topicStats.filter(t => t.status === 'Developing' || (t.score >= 60 && t.score < 80));
  const strongTopics = topicStats.filter(t => t.status === 'Strong' || t.score >= 80);

  const tabs: Tab[] = ['Recommended', 'By Topic', 'By Difficulty', "By Bloom's Level", 'Custom Practice'];

  return (
    <div className="animate-fade-in max-w-7xl mx-auto pb-16 px-6 md:px-10">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Practice Smarter, Improve Faster</h1>
        <p className="text-sm text-slate-500 mt-0.5">Focus on your weak areas and build real exam readiness with targeted practice.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold border border-red-100 mb-6">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
          <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">âœ•</button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl mb-8 overflow-x-auto flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-[#046B46] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• RECOMMENDED TAB â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {activeTab === 'Recommended' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#046B46]" /> Recommended Practice
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Based on your recent performance and weak concepts.</p>
              </div>
              {weakTopics.length > 0 && (
                <button
                  onClick={() => handleStartPractice('all-weak', { topics: weakTopics.slice(0, 3).map(t => t.topic) })}
                  disabled={!!generatingId}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#046B46] hover:bg-[#035437] px-5 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                >
                  {generatingId === 'all-weak' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                  Practice All Weak
                </button>
              )}
            </div>

            {isEmpty ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-[#046B46]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No Practice Data Yet</h3>
                <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">Complete at least one assessment so Assessora can identify your weak areas and recommend targeted practice.</p>
                <Link href="/dashboard/create" className="inline-flex items-center gap-2 text-sm font-bold text-white bg-[#046B46] hover:bg-[#035437] px-6 py-3 rounded-xl transition-colors shadow-sm">
                  Create Assessment <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              topicStats.map((topic, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-slate-300 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-slate-500" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900">{topic.topic}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        topic.score < 60
                          ? 'bg-red-50 text-red-600 border border-red-100'
                          : topic.score < 80
                          ? 'bg-amber-50 text-amber-600 border border-amber-100'
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                        {topic.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Accuracy: <span className="font-bold text-slate-600">{topic.score}%</span></p>
                    {/* Score bar */}
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-2 max-w-xs">
                      <div
                        className={`h-full rounded-full transition-all ${topic.score < 60 ? 'bg-red-500' : topic.score < 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${topic.score}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartPractice(topic.topic, { topics: [topic.topic] })}
                    disabled={!!generatingId}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#046B46] hover:bg-[#035437] px-4 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-50 flex-shrink-0"
                  >
                    {generatingId === topic.topic ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    Start Practice
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Progress card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Your Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Avg Score</span>
                  <span className="text-sm font-bold text-slate-900">{avgScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Assessments Done</span>
                  <span className="text-sm font-bold text-slate-900">{totalCompleted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Weak Concepts</span>
                  <span className="text-sm font-bold text-red-600">{weakTopics.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Strong Concepts</span>
                  <span className="text-sm font-bold text-emerald-600">{strongTopics.length}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Quick Actions</h3>
              <Link href="/dashboard/create" className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100 group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#046B46] flex items-center justify-center"><Zap className="w-4 h-4" /></div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-[#046B46] transition-colors">New Assessment</div>
                    <div className="text-[10px] text-slate-400">Upload material to generate</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </Link>
              <Link href="/dashboard/knowledge-map" className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100 group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center"><Compass className="w-4 h-4" /></div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors">Knowledge Map</div>
                    <div className="text-[10px] text-slate-400">Explore concept relationships</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• BY TOPIC TAB â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {activeTab === 'By Topic' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Select Topics to Practice</h2>
              <p className="text-xs text-slate-400 mt-0.5">Choose one or more topics, then start your practice session.</p>
            </div>
            {selectedTopics.length > 0 && (
              <button
                onClick={() => handleStartPractice('by-topic', { topics: selectedTopics })}
                disabled={!!generatingId}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#046B46] hover:bg-[#035437] px-5 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-50"
              >
                {generatingId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                Practice {selectedTopics.length} Topic{selectedTopics.length > 1 ? 's' : ''}
              </button>
            )}
          </div>

          {isEmpty ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-12 text-center">
              <p className="text-sm text-slate-500">Complete assessments to see your topics here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topicStats.map((topic, i) => {
                const isSelected = selectedTopics.includes(topic.topic);
                return (
                  <button
                    key={i}
                    onClick={() => toggleTopic(topic.topic)}
                    className={`text-left p-5 rounded-2xl border-2 transition-all ${
                      isSelected
                        ? 'border-[#046B46] bg-emerald-50/50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-slate-900">{topic.topic}</h3>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected ? 'border-[#046B46] bg-[#046B46]' : 'border-slate-300'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        topic.score < 60 ? 'bg-red-50 text-red-600' : topic.score < 80 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {topic.status}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{topic.score}% accuracy</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${topic.score < 60 ? 'bg-red-500' : topic.score < 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${topic.score}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• BY DIFFICULTY TAB â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {activeTab === 'By Difficulty' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Practice by Difficulty Level</h2>
            <p className="text-xs text-slate-400 mt-0.5">Choose a difficulty level for your practice questions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {DIFFICULTY_OPTIONS.map(opt => {
              const isSelected = selectedDifficulty === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setSelectedDifficulty(opt.value)}
                  className={`text-left p-6 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? `${opt.border} ${opt.bg} shadow-sm`
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-lg font-bold ${isSelected ? opt.color : 'text-slate-900'}`}>{opt.label}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? `${opt.border.replace('border', 'border')} ${opt.bg.replace('bg', 'bg')}` : 'border-slate-300'
                    }`}>
                      {isSelected && <CheckCircle2 className={`w-3.5 h-3.5 ${opt.color}`} />}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{opt.desc}</p>
                </button>
              );
            })}
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={() => handleStartPractice('by-difficulty', { topics: topicStats.length > 0 ? topicStats.slice(0, 3).map(t => t.topic) : ['General'], difficulty: selectedDifficulty })}
              disabled={!!generatingId}
              className="inline-flex items-center gap-2 text-sm font-bold text-white bg-[#046B46] hover:bg-[#035437] px-8 py-3.5 rounded-xl transition-colors shadow-sm disabled:opacity-50"
            >
              {generatingId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              Start {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)} Practice
            </button>
          </div>
        </div>
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• BY BLOOM'S LEVEL TAB â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {activeTab === "By Bloom's Level" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#046B46]" /> Practice by Bloom's Taxonomy
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Choose a cognitive skill level to practice.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BLOOM_OPTIONS.map(opt => {
              const isSelected = selectedBloom === opt.value;
              const stat = bloomStats.find(b => b.level === opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => setSelectedBloom(opt.value)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? 'border-[#046B46] bg-emerald-50/50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-900">{opt.label}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-[#046B46] bg-[#046B46]' : 'border-slate-300'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{opt.desc}</p>
                  {stat && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400">Your score:</span>
                      <span className={`font-bold ${stat.percentage >= 80 ? 'text-emerald-600' : stat.percentage >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                        {stat.percentage}%
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={() => handleStartPractice('by-bloom', { topics: topicStats.length > 0 ? topicStats.slice(0, 3).map(t => t.topic) : ['General'], bloomLevel: selectedBloom })}
              disabled={!!generatingId}
              className="inline-flex items-center gap-2 text-sm font-bold text-white bg-[#046B46] hover:bg-[#035437] px-8 py-3.5 rounded-xl transition-colors shadow-sm disabled:opacity-50"
            >
              {generatingId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              Start {BLOOM_LABELS[selectedBloom] || selectedBloom} Practice
            </button>
          </div>
        </div>
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• CUSTOM PRACTICE TAB â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {activeTab === 'Custom Practice' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-[#046B46]" /> Custom Practice Session
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Configure every aspect of your practice â€” topics, difficulty, Bloom level, and question count.</p>
          </div>

          {/* Step 1: Topics */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-1">1. Select Topics</h3>
            <p className="text-[11px] text-slate-400 mb-4">Choose one or more topics to practice.</p>
            {topicStats.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Complete assessments to unlock topic selection.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {topicStats.map((t, i) => {
                  const isSelected = customTopics.includes(t.topic);
                  return (
                    <button
                      key={i}
                      onClick={() => toggleCustomTopic(t.topic)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                        isSelected
                          ? 'bg-[#046B46] text-white border-[#046B46]'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-[#046B46] hover:text-[#046B46]'
                      }`}
                    >
                      {t.topic} ({t.score}%)
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Step 2: Difficulty */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-1">2. Difficulty Level</h3>
            <p className="text-[11px] text-slate-400 mb-4">Choose the difficulty for generated questions.</p>
            <div className="flex gap-3">
              {DIFFICULTY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setCustomDifficulty(opt.value)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    customDifficulty === opt.value
                      ? `${opt.bg} ${opt.color} ${opt.border}`
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Bloom Levels */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-1">3. Bloom's Taxonomy Levels</h3>
            <p className="text-[11px] text-slate-400 mb-4">Select one or more cognitive skill levels.</p>
            <div className="flex flex-wrap gap-2">
              {BLOOM_OPTIONS.map(opt => {
                const isSelected = customBloom.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => toggleCustomBloom(opt.value)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-[#046B46] text-white border-[#046B46]'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-[#046B46]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Question Count */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-1">4. Number of Questions</h3>
            <p className="text-[11px] text-slate-400 mb-4">How many questions do you want?</p>
            <div className="flex gap-3">
              {[5, 10, 15, 20].map(n => (
                <button
                  key={n}
                  onClick={() => setCustomCount(n)}
                  className={`w-14 h-10 rounded-xl text-sm font-bold transition-all border ${
                    customCount === n
                      ? 'bg-[#046B46] text-white border-[#046B46]'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Start button */}
          <div className="flex justify-center">
            <button
              onClick={() => handleStartPractice('custom', {
                topics: customTopics.length > 0 ? customTopics : topicStats.slice(0, 3).map(t => t.topic),
                difficulty: customDifficulty,
                bloomLevel: customBloom[0],
                questionCount: customCount,
              })}
              disabled={!!generatingId || (topicStats.length === 0 && customTopics.length === 0)}
              className="inline-flex items-center gap-2 text-sm font-bold text-white bg-[#046B46] hover:bg-[#035437] px-10 py-4 rounded-xl transition-colors shadow-md disabled:opacity-50"
            >
              {generatingId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Generate Custom Practice ({customCount} Questions)
            </button>
          </div>
        </div>
      )}

    </div>
  );
}



