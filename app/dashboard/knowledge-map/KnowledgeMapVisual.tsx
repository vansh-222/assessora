'use client';

import { useMemo, useState } from 'react';
import {
  Brain, Sparkles, BookOpen, CheckCircle2, XCircle, Loader2,
  ChevronRight, AlertCircle, List, ArrowLeft, FileText, Calendar,
  GitBranch, ChevronDown
} from 'lucide-react';
import type { AssessmentEntry } from './page';

/* ────────────── Types ────────────── */

interface Topic {
  name: string;
  correct: number;
  total: number;
}

interface NodeTopic extends Topic {
  x: number;
  y: number;
  index: number;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface TopicInsight {
  theory: string;
  keyPoints: string[];
  questions: Question[];
}

type ViewMode = 'list' | 'map' | 'diagram';

/* ────────────── Helpers ────────────── */

function getStatus(correct: number, total: number): 'mastered' | 'in-progress' | 'not-started' {
  if (total === 0) return 'not-started';
  const pct = (correct / total) * 100;
  if (pct >= 70) return 'mastered';
  return 'in-progress';
}

function getStatusLabel(s: 'mastered' | 'in-progress' | 'not-started') {
  if (s === 'mastered') return 'Mastered';
  if (s === 'in-progress') return 'In Progress';
  return 'Not Started';
}

function getStatusColor(s: 'mastered' | 'in-progress' | 'not-started') {
  if (s === 'mastered') return { dot: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
  if (s === 'in-progress') return { dot: 'bg-blue-500', text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
  return { dot: 'bg-slate-300', text: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-200' };
}

function pct(correct: number, total: number) {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/* ────────────── Component ────────────── */

export function KnowledgeMapVisual({ assessments }: { assessments: AssessmentEntry[] }) {
  const [view, setView] = useState<ViewMode>('list');
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentEntry | null>(null);

  // Map interaction state
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<NodeTopic | null>(null);
  const [insight, setInsight] = useState<TopicInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const subjects = selectedAssessment?.topics || [];

  const nodes = useMemo((): NodeTopic[] => {
    return subjects.map((subject, index) => {
      const totalNodes = subjects.length;
      const cX = 400, cY = 300;
      let x: number, y: number;

      if (totalNodes > 20) {
        const innerCount = Math.min(12, Math.floor(totalNodes / 2));
        if (index < innerCount) {
          const angle = (index * (360 / innerCount) - 90) * (Math.PI / 180);
          x = cX + 190 * Math.cos(angle);
          y = cY + 130 * Math.sin(angle);
        } else {
          const outerCount = totalNodes - innerCount;
          const outerIndex = index - innerCount;
          const angle = (outerIndex * (360 / outerCount) - 45) * (Math.PI / 180);
          x = cX + 330 * Math.cos(angle);
          y = cY + 230 * Math.sin(angle);
        }
      } else {
        const angle = (index * (360 / totalNodes) - 90) * (Math.PI / 180);
        x = cX + 260 * Math.cos(angle);
        y = cY + 180 * Math.sin(angle);
      }
      return { ...subject, x, y, index: index + 1 };
    });
  }, [subjects]);

  const handleSelectAssessment = (assessment: AssessmentEntry) => {
    setSelectedAssessment(assessment);
    setView('map');
    setSelectedTopic(null);
    setInsight(null);
    setError(null);
    setSelectedAnswers({});
    setRevealed({});
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedAssessment(null);
    setSelectedTopic(null);
    setInsight(null);
    setError(null);
  };

  const handleTopicClick = async (node: NodeTopic) => {
    setSelectedTopic(node);
    setInsight(null);
    setError(null);
    setSelectedAnswers({});
    setRevealed({});
    setIsLoading(true);

    try {
      const res = await fetch('/api/topic-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: node.name }),
      });
      if (!res.ok) throw new Error('Failed');
      const data: TopicInsight = await res.json();
      setInsight(data);
    } catch {
      setError('Could not generate insight. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (qIndex: number, option: string) => {
    if (revealed[qIndex]) return;
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: option }));
  };

  const handleReveal = (qIndex: number) => {
    if (!selectedAnswers[qIndex]) return;
    setRevealed(prev => ({ ...prev, [qIndex]: true }));
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Build topic performance lookup from current assessment
  const topicPerfMap = useMemo(() => {
    const map: Record<string, { correct: number; total: number }> = {};
    for (const t of subjects) {
      map[t.name] = { correct: t.correct, total: t.total };
    }
    return map;
  }, [subjects]);

  // Diagram data: use units from analysis, fall back to flat topics
  const diagramUnits = useMemo(() => {
    if (!selectedAssessment) return [];
    const units = selectedAssessment.units || [];
    if (units.length > 0) return units;
    // Fallback: group all topics under a single unit
    return [{
      title: selectedAssessment.subject,
      topics: subjects.map(t => t.name),
    }];
  }, [selectedAssessment, subjects]);

  // Overall assessment performance
  const overallPerf = useMemo(() => {
    let correct = 0, total = 0;
    for (const t of subjects) {
      correct += t.correct;
      total += t.total;
    }
    return { correct, total, pct: pct(correct, total) };
  }, [subjects]);

  return (
    <div className="flex flex-col gap-8 w-full">

      {/* ── Header ── */}
      <div className="flex justify-between items-start px-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {view === 'diagram' ? 'Learning Blueprint' : 'Your Learning Journey'}
          </h1>
          <p className="text-slate-500 max-w-xl text-sm">
            {view === 'list'
              ? 'Select an assessment to explore its topics on the knowledge map.'
              : view === 'diagram'
                ? 'Explore how concepts are connected and build your understanding step by step.'
                : 'Click any topic number to see its theory and practice questions below.'}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full mt-1">
          <button
            onClick={() => { if (selectedAssessment) setView('map'); }}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
              view === 'map'
                ? 'bg-[#0A3D2C] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Map View
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
              view === 'list'
                ? 'bg-[#0A3D2C] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <List className="w-4 h-4" />
            List View
          </button>
        </div>
      </div>

      {/* ══════════════ LIST VIEW ══════════════ */}
      {view === 'list' && (
        <div className="px-10">
          {assessments.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No Assessments Yet</h3>
              <p className="text-sm text-slate-400">Create an assessment from your uploaded materials to see your knowledge map.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assessments.map((a) => {
                const topicCount = a.topics.length;
                const answeredTopics = a.topics.filter(t => t.total > 0).length;

                return (
                  <button
                    key={a.id}
                    onClick={() => handleSelectAssessment(a)}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-left hover:border-emerald-200 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-[#0A3D2C]" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                        {a.subject}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-[#0A3D2C] transition-colors line-clamp-2">
                      {a.title}
                    </h3>

                    {a.sourceFileName && (
                      <p className="text-[11px] text-slate-400 mb-3 truncate">
                        From: {a.sourceFileName}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-50">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <Brain className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="font-bold">{topicCount}</span> topic{topicCount !== 1 ? 's' : ''}
                      </div>
                      {answeredTopics > 0 && (
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="font-bold">{answeredTopics}</span> practiced
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 ml-auto">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(a.createdAt)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-[#0A3D2C] mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore Topics <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ══════════════ MAP VIEW ══════════════ */}
      {view === 'map' && selectedAssessment && (
        <>
          {/* Diagram button + assessment info */}
          <div className="px-10 flex items-center gap-4">
            <button
              onClick={() => setView('diagram')}
              className="flex items-center gap-1.5 text-sm font-bold text-[#0A3D2C] hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-colors border border-emerald-100"
            >
              <GitBranch className="w-4 h-4" />
              Diagram
            </button>
            <div className="h-5 w-px bg-slate-200" />
            <span className="text-sm font-bold text-slate-900 truncate max-w-[300px]">{selectedAssessment.title}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              {selectedAssessment.subject}
            </span>
            <button
              onClick={handleBackToList}
              className="ml-auto flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All Assessments
            </button>
          </div>

          {/* Map Canvas */}
          {subjects.length === 0 ? (
            <div className="mx-10 bg-white rounded-3xl border border-slate-100 shadow-sm p-16 text-center">
              <p className="text-sm text-slate-400">No topics found in this assessment.</p>
            </div>
          ) : (
            <div className="relative w-full h-[600px] flex-shrink-0 flex items-center justify-center bg-white/50 rounded-3xl border border-emerald-50 overflow-hidden">
              {/* SVG Lines */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 800 600"
                preserveAspectRatio="xMidYMid meet"
              >
                {nodes.map((node) => (
                  <line
                    key={`${node.name}-line`}
                    x1={400} y1={300} x2={node.x} y2={node.y}
                    stroke={node.total > 0 ? '#10b981' : '#a7f3d0'}
                    strokeWidth={node.total > 0 ? 2 : 1.5}
                    strokeDasharray={node.total > 0 ? undefined : '4 4'}
                  />
                ))}
              </svg>

              {/* Center Hub */}
              <div
                className="absolute z-20 flex flex-col items-center justify-center bg-[#0A3D2C] text-white rounded-full border-4 border-emerald-100 shadow-xl"
                style={{ width: 120, height: 120, left: 'calc(50% - 60px)', top: 'calc(50% - 60px)' }}
              >
                <Brain className="w-8 h-8 mb-1 text-emerald-400" />
                <span className="font-bold text-[11px] text-center px-2 leading-tight">{selectedAssessment.subject}</span>
                <span className="text-[10px] text-emerald-200 mt-0.5">{subjects.length} topics</span>
              </div>

              {/* Number Nodes */}
              {nodes.map((node) => {
                const hasData = node.total > 0;
                const isSelected = selectedTopic?.name === node.name;
                return (
                  <div
                    key={node.name}
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `calc(50% + ${node.x - 400}px)`,
                      top: `calc(50% + ${node.y - 300}px)`,
                    }}
                    onMouseEnter={() => setHoveredTopic(node.name)}
                    onMouseLeave={() => setHoveredTopic(null)}
                    onClick={() => handleTopicClick(node)}
                  >
                    <div
                      className={[
                        'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer transition-all duration-300 select-none',
                        isSelected
                          ? 'scale-125 ring-4 ring-emerald-200 bg-emerald-600 text-white shadow-lg'
                          : hasData
                            ? 'bg-white border-2 border-emerald-500 text-emerald-700 hover:scale-110'
                            : 'bg-slate-50 border-2 border-slate-200 text-slate-400 hover:scale-110 hover:border-emerald-300',
                      ].join(' ')}
                    >
                      {node.index}
                    </div>

                    {hoveredTopic === node.name && !isSelected && (
                      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-max max-w-[200px] bg-slate-900 text-white text-xs font-medium py-1.5 px-3 rounded-lg shadow-xl z-50 pointer-events-none">
                        {node.name}
                        {hasData && (
                          <span className="text-emerald-300 ml-1">({node.correct}/{node.total})</span>
                        )}
                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-900 rotate-45 rounded-sm" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── AI Insight Panel ── */}
          {selectedTopic && (
            <div className="w-full rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center gap-4 px-8 py-5 bg-gradient-to-r from-[#0A3D2C] to-emerald-600">
                <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedTopic.name}</h3>
                  <p className="text-emerald-100 text-sm">Topic #{selectedTopic.index} · AI-generated insight</p>
                </div>
              </div>

              {isLoading && (
                <div className="py-14 flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                  <p className="text-slate-500 text-sm animate-pulse">
                    Generating insight for &ldquo;{selectedTopic.name}&rdquo;&hellip;
                  </p>
                </div>
              )}

              {error && !isLoading && (
                <div className="py-10 flex flex-col items-center gap-3 text-center px-8">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                  <p className="text-slate-600 text-sm">{error}</p>
                  <button
                    onClick={() => handleTopicClick(selectedTopic)}
                    className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}

              {insight && !isLoading && (
                <div className="p-8 space-y-8">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-5 h-5 text-emerald-600" />
                      <h4 className="font-bold text-slate-900 text-base">Theory</h4>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 rounded-2xl p-5 border border-slate-100">
                      {insight.theory}
                    </p>
                    {insight.keyPoints?.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {insight.keyPoints.map((kp, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                            <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            {kp}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {insight.questions?.length > 0 && (
                    <div>
                      <h4 className="font-bold text-slate-900 text-base mb-5">Practice Questions</h4>
                      <div className="space-y-6">
                        {insight.questions.map((q, qIndex) => {
                          const chosenAnswer = selectedAnswers[qIndex];
                          const isRevealed = revealed[qIndex];
                          const isCorrect = chosenAnswer === q.correctAnswer;

                          return (
                            <div key={qIndex} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                              <p className="font-semibold text-slate-800 text-sm mb-4">
                                <span className="text-emerald-600 font-bold mr-2">Q{qIndex + 1}.</span>
                                {q.question}
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                                {q.options.map((option, oIndex) => {
                                  let cls = 'bg-white border-slate-200 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50';
                                  if (chosenAnswer === option && !isRevealed) cls = 'bg-emerald-50 border-emerald-500 text-emerald-800';
                                  if (isRevealed && option === q.correctAnswer) cls = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold';
                                  if (isRevealed && chosenAnswer === option && option !== q.correctAnswer) cls = 'bg-red-50 border-red-400 text-red-700';

                                  return (
                                    <button
                                      key={oIndex}
                                      onClick={() => handleAnswerSelect(qIndex, option)}
                                      disabled={isRevealed}
                                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 ${cls}`}
                                    >
                                      <span className="font-semibold mr-2 text-slate-400">{String.fromCharCode(65 + oIndex)}.</span>
                                      {option}
                                    </button>
                                  );
                                })}
                              </div>

                              {!isRevealed ? (
                                <button
                                  onClick={() => handleReveal(qIndex)}
                                  disabled={!chosenAnswer}
                                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-bold rounded-xl transition-colors"
                                >
                                  Check Answer
                                </button>
                              ) : (
                                <div className={`flex items-start gap-3 mt-2 p-4 rounded-xl ${isCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
                                  {isCorrect
                                    ? <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                    : <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                  }
                                  <div>
                                    <p className={`font-bold text-sm mb-1 ${isCorrect ? 'text-emerald-700' : 'text-red-600'}`}>
                                      {isCorrect ? 'Correct!' : `Incorrect — Answer: ${q.correctAnswer}`}
                                    </p>
                                    <p className="text-slate-600 text-xs leading-relaxed">{q.explanation}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ══════════════ DIAGRAM VIEW ══════════════ */}
      {view === 'diagram' && selectedAssessment && (
        <div className="px-10">

          {/* Nav bar */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setView('map')}
              className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Map
            </button>
            <div className="h-5 w-px bg-slate-200" />
            <span className="text-sm font-bold text-slate-900">{selectedAssessment.title}</span>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Mastered
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" /> In Progress
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Not Started
            </div>
          </div>

          {/* ── Root Subject Node ── */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-white rounded-2xl border-2 border-emerald-200 shadow-md px-8 py-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#0A3D2C] flex items-center justify-center">
                <Brain className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedAssessment.subject}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                      style={{ width: `${overallPerf.pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-600">{overallPerf.pct}%</span>
                </div>
              </div>
            </div>

            {/* Vertical connector from root */}
            {diagramUnits.length > 0 && (
              <div className="w-0.5 h-8 bg-emerald-200" />
            )}
          </div>

          {/* ── Horizontal connector line ── */}
          {diagramUnits.length > 1 && (
            <div className="flex justify-center mb-0">
              <div className="h-0.5 bg-emerald-200" style={{ width: `${Math.min(90, diagramUnits.length * 22)}%` }} />
            </div>
          )}

          {/* ── Unit Cards Grid ── */}
          <div className={`grid gap-6 ${diagramUnits.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : diagramUnits.length === 2 ? 'grid-cols-2 max-w-3xl mx-auto' : diagramUnits.length === 3 ? 'grid-cols-3 max-w-5xl mx-auto' : 'grid-cols-2 lg:grid-cols-4'}`}>
            {diagramUnits.map((unit, uIdx) => {
              // Calculate unit-level performance
              let unitCorrect = 0, unitTotal = 0;
              for (const topicName of unit.topics) {
                const perf = topicPerfMap[topicName];
                if (perf) {
                  unitCorrect += perf.correct;
                  unitTotal += perf.total;
                }
              }
              const unitPct = pct(unitCorrect, unitTotal);
              const unitStatus = getStatus(unitCorrect, unitTotal);
              const unitColors = getStatusColor(unitStatus);

              // Icons for unit cards
              const unitIcons = [BookOpen, Brain, GitBranch, Sparkles, FileText];
              const UnitIcon = unitIcons[uIdx % unitIcons.length];

              return (
                <div key={uIdx} className="flex flex-col items-center">
                  {/* Vertical connector from horizontal line */}
                  {diagramUnits.length > 1 && (
                    <div className="w-0.5 h-6 bg-emerald-200" />
                  )}

                  {/* Unit Header Card */}
                  <div className={`w-full rounded-2xl border ${unitColors.border} ${unitColors.bg} p-4 shadow-sm`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg ${unitStatus === 'mastered' ? 'bg-emerald-100' : unitStatus === 'in-progress' ? 'bg-blue-100' : 'bg-slate-100'} flex items-center justify-center`}>
                        <UnitIcon className={`w-4 h-4 ${unitColors.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate">{unit.title}</h4>
                        <span className="text-[11px] font-bold text-slate-500">{unitPct}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${unitColors.dot}`} />
                      <span className={`text-[10px] font-bold ${unitColors.text}`}>{getStatusLabel(unitStatus)}</span>
                    </div>
                  </div>

                  {/* Vertical connector to topics */}
                  {unit.topics.length > 0 && (
                    <div className="w-0.5 h-4 bg-slate-200" />
                  )}

                  {/* Topic list under this unit */}
                  <div className={`w-full rounded-2xl border border-slate-100 bg-white overflow-hidden divide-y divide-slate-50 shadow-sm`}>
                    {unit.topics.map((topicName, tIdx) => {
                      const perf = topicPerfMap[topicName] || { correct: 0, total: 0 };
                      const topicPctVal = pct(perf.correct, perf.total);
                      const topicStatus = getStatus(perf.correct, perf.total);
                      const tColors = getStatusColor(topicStatus);

                      return (
                        <div key={tIdx} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                          <div className={`w-5 h-5 rounded-full ${tColors.bg} ${tColors.border} border flex items-center justify-center flex-shrink-0`}>
                            {topicStatus === 'mastered' && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                            {topicStatus === 'in-progress' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                            {topicStatus === 'not-started' && <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-semibold text-slate-700 truncate block">{topicName}</span>
                          </div>
                          <span className={`text-[11px] font-bold ${tColors.text} flex-shrink-0`}>
                            {topicPctVal}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Bottom Summary Bar ── */}
          <div className="mt-10 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#0A3D2C]" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {overallPerf.pct >= 70
                    ? 'Great progress! Keep mastering new topics.'
                    : overallPerf.total > 0
                      ? 'Build a strong foundation. Complete the basics and beyond.'
                      : 'Start practicing to see your progress here.'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {subjects.filter(t => getStatus(t.correct, t.total) === 'mastered').length} mastered · {subjects.filter(t => getStatus(t.correct, t.total) === 'in-progress').length} in progress · {subjects.filter(t => getStatus(t.correct, t.total) === 'not-started').length} not started
                </p>
              </div>
            </div>
            <button
              onClick={() => setView('map')}
              className="flex items-center gap-2 text-sm font-bold text-[#0A3D2C] bg-emerald-50 hover:bg-emerald-100 px-5 py-2.5 rounded-xl transition-colors border border-emerald-100"
            >
              Back to Map <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
