'use client';

import { useMemo, useState } from 'react';
import { Brain, Sparkles, BookOpen, CheckCircle2, XCircle, Loader2, ChevronRight, AlertCircle } from 'lucide-react';

interface Topic {
  name: string;
  completedTopics: number;
  totalTopics: number;
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

export function KnowledgeMapVisual({ subjects }: { subjects: Topic[] }) {
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<NodeTopic | null>(null);
  const [insight, setInsight] = useState<TopicInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

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

  return (
    <div className="flex flex-col gap-8 w-full">

      {/* ── Map Canvas ── */}
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
              stroke={node.completedTopics > 0 ? '#10b981' : '#a7f3d0'}
              strokeWidth={node.completedTopics > 0 ? 2 : 1.5}
              strokeDasharray={node.completedTopics > 0 ? undefined : '4 4'}
            />
          ))}
        </svg>

        {/* Center Hub */}
        <div
          className="absolute z-20 flex flex-col items-center justify-center bg-[#0A3D2C] text-white rounded-full border-4 border-emerald-100 shadow-xl"
          style={{ width: 120, height: 120, left: 'calc(50% - 60px)', top: 'calc(50% - 60px)' }}
        >
          <Brain className="w-8 h-8 mb-1 text-emerald-400" />
          <span className="font-bold text-sm text-center px-2">All Subjects</span>
          <span className="text-[10px] text-emerald-200 mt-1">{subjects.length} topics</span>
        </div>

        {/* Number Nodes */}
        {nodes.map((node) => {
          const isCompleted = node.completedTopics > 0;
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
                    : isCompleted
                      ? 'bg-white border-2 border-emerald-500 text-emerald-700 hover:scale-110'
                      : 'bg-slate-50 border-2 border-slate-200 text-slate-400 hover:scale-110 hover:border-emerald-300',
                ].join(' ')}
              >
                {node.index}
              </div>

              {/* Hover Tooltip */}
              {hoveredTopic === node.name && !isSelected && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 w-max max-w-[200px] bg-slate-900 text-white text-xs font-medium py-1.5 px-3 rounded-lg shadow-xl z-50 pointer-events-none">
                  {node.name}
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-900 rotate-45 rounded-sm" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── AI Insight Panel ── */}
      {selectedTopic && (
        <div className="w-full rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          {/* Panel Header */}
          <div className="flex items-center gap-4 px-8 py-5 bg-gradient-to-r from-[#0A3D2C] to-emerald-600">
            <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{selectedTopic.name}</h3>
              <p className="text-emerald-100 text-sm">Topic #{selectedTopic.index} · AI-generated insight</p>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="py-14 flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
              <p className="text-slate-500 text-sm animate-pulse">
                Generating insight for &ldquo;{selectedTopic.name}&rdquo;&hellip;
              </p>
            </div>
          )}

          {/* Error State */}
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

          {/* Content */}
          {insight && !isLoading && (
            <div className="p-8 space-y-8">

              {/* Theory */}
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

              {/* Practice Questions */}
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
    </div>
  );
}
