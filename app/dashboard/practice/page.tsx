'use client';

import { useState, useEffect } from 'react';
import { Dumbbell, ArrowRight, Loader2, Target, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PracticePage() {
  const router = useRouter();
  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch stats to get weak topics
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        if (data.needsAttention) {
          setWeakTopics(data.needsAttention);
        }
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load practice data.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStartPractice = async () => {
    if (weakTopics.length === 0) return;
    
    setGenerating(true);
    setError('');

    try {
      const res = await fetch('/api/practice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topics: weakTopics.slice(0, 3) })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate practice session');
      }

      router.push(`/dashboard/assessment/${data.assessmentId}`);
    } catch (err: any) {
      setError(err.message);
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
        <p className="text-slate-500 text-sm">Loading practice area...</p>
      </div>
    );
  }

  const isEmpty = weakTopics.length === 0;

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="page-header mb-8">
        <h1 className="page-title flex items-center gap-2">
          <Dumbbell className="w-6 h-6 text-green-600" />
          Targeted Practice
        </h1>
        <p className="page-subtitle">Focus your efforts on the areas that need the most improvement.</p>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {isEmpty ? (
        <div className="card p-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
            <Target className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No weak areas identified</h2>
          <p className="text-slate-500 text-sm max-w-sm mb-6">
            You don&apos;t have any topics scoring below 60% right now. Keep taking assessments to identify areas for improvement!
          </p>
          <Link href="/dashboard/create" className="btn-primary">
            Take an Assessment
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="card p-6 border-2 border-amber-200 bg-amber-50/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 mb-1">Recommended Focus Areas</h2>
                <p className="text-sm text-slate-600 mb-4">
                  Based on your recent performance, we recommend focusing on these topics:
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {weakTopics.slice(0, 3).map(topic => (
                    <span key={topic} className="badge-amber text-sm py-1 px-3">
                      {topic}
                    </span>
                  ))}
                </div>

                <button 
                  onClick={handleStartPractice}
                  disabled={generating}
                  className="btn-primary w-full sm:w-auto shadow-md shadow-green-600/20"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating Quick Practice...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Start Quick Practice (5 Questions)
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-slate-400" />
              How Quick Practice Works
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>We use AI to instantly generate 5 brand new questions focused strictly on your weakest topics.</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>The difficulty is automatically set to "Medium" to help you build foundational understanding.</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Completing practice sessions updates your Knowledge Map and helps turn weaknesses into strengths.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
