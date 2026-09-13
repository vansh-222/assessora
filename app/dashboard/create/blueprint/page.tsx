'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Sparkles, BookOpen, Clock, Target, BarChart3, FileText, CheckCircle2 } from 'lucide-react';
import { BLOOM_LABELS } from '@/lib/bloom';
import type { MaterialAnalysis, AssessmentConfig, BloomLevel, ProcessingStep } from '@/types';

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
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
         <div className="flex flex-col items-center animate-pulse">
            <div className="w-16 h-16 bg-[#Edf5f0] rounded-full flex items-center justify-center mb-4">
               <svg className="animate-spin w-8 h-8 text-[#0A3D2C]" viewBox="0 0 50 50">
                  <circle cx="25" cy="25" r="23" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="100" strokeDashoffset="25" />
               </svg>
            </div>
            <p className="text-slate-500 font-bold">Loading Blueprint...</p>
         </div>
      </div>
    );
  }

  const bloomEntries = Object.entries(config.bloomDistribution) as [BloomLevel, number][];

  return (
    <div className="animate-fade-in w-full max-w-7xl mx-auto py-4 px-4 sm:px-8 flex flex-col min-h-[calc(100vh-80px)]">
      
      {/* Header Section */}
      <div className="mb-10 max-w-3xl">
        
        <h1 className="text-3xl md:text-[30px] font-bold text-[#1a2b25] tracking-tight mb-3">
          Assessment Blueprint
        </h1>
        <p className="text-slate-500 font-medium text-[15px] leading-relaxed">
          Review your final assessment structure. Give it a descriptive name and generate your questions when ready.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 flex-1">
        
        {/* Left Column: Core Details */}
        <div className="flex flex-col space-y-6">
           
           {/* Title Input */}
           <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-8">
             <label className="block text-sm font-bold text-slate-900 mb-3">Assessment Name</label>
             <input
               type="text"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               className="w-full bg-[#F9FCFA] border border-[#c1e2d1] rounded-2xl px-5 py-4 text-[15px] font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#Edf5f0] focus:border-[#0A3D2C] transition-all shadow-sm"
               placeholder="e.g. Operating Systems Final Exam"
             />
           </div>

           {/* Configuration Summary */}
           <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-8">
             <h2 className="text-sm font-bold text-slate-900 mb-6">Configuration Summary</h2>
             <div className="grid grid-cols-2 gap-4">
               
               <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                 <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center flex-shrink-0">
                   <BookOpen className="w-5 h-5 text-[#0A3D2C]" />
                 </div>
                 <div>
                   <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Subject</p>
                   <p className="text-[13px] font-bold text-slate-900 truncate max-w-[120px]" title={analysis.subject}>{analysis.subject}</p>
                 </div>
               </div>

               <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                 <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center flex-shrink-0">
                   <BarChart3 className="w-5 h-5 text-[#0A3D2C]" />
                 </div>
                 <div>
                   <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Questions</p>
                   <p className="text-[13px] font-bold text-slate-900">{config.questionCount}</p>
                 </div>
               </div>

               <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                 <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center flex-shrink-0">
                   <Target className="w-5 h-5 text-[#0A3D2C]" />
                 </div>
                 <div>
                   <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Difficulty</p>
                   <p className="text-[13px] font-bold text-slate-900 capitalize">{config.difficulty}</p>
                 </div>
               </div>

               <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                 <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center flex-shrink-0">
                   <Clock className="w-5 h-5 text-[#0A3D2C]" />
                 </div>
                 <div>
                   <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Time Limit</p>
                   <p className="text-[13px] font-bold text-slate-900">{config.duration} min</p>
                 </div>
               </div>

             </div>
           </div>

           {/* Topic Coverage */}
           <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-8">
             <div className="flex items-center justify-between mb-4">
               <h2 className="text-sm font-bold text-slate-900">Topic Coverage</h2>
               <span className="text-[10px] font-bold text-slate-400 uppercase">{analysis.topics.length} Total</span>
             </div>
             <div className="flex flex-wrap gap-2">
               {analysis.topics.slice(0, 10).map((t) => (
                 <span key={t.id} className="px-3 py-1.5 rounded-lg bg-[#F9FCFA] border border-[#c1e2d1] text-[11px] font-bold text-[#0A3D2C]">
                   {t.title}
                 </span>
               ))}
               {analysis.topics.length > 10 && (
                 <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-500">
                   +{analysis.topics.length - 10} more
                 </span>
               )}
             </div>
           </div>
        </div>

        {/* Right Column: Distribution & Generation */}
        <div className="flex flex-col space-y-6">
           
           {/* Bloom distribution */}
           <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-8">
             <h2 className="text-sm font-bold text-slate-900 mb-6">Cognitive Distribution</h2>
             <div className="space-y-4">
               {bloomEntries.map(([level, count]) => {
                 if (!count) return null;
                 const pct = Math.round((count / config.questionCount) * 100);
                 
                 // Generate a custom monochromatic green scale based on pct or index
                 // We'll just use the primary color with varying opacity for a sleek look
                 return (
                   <div key={level} className="flex items-center gap-4">
                     <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider w-20 flex-shrink-0">
                       {BLOOM_LABELS[level]}
                     </span>
                     <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden flex">
                       <div
                         className="h-full rounded-full bg-[#0A3D2C] transition-all"
                         style={{ width: `${pct}%`, opacity: 0.6 + (pct / 100) * 0.4 }}
                       />
                     </div>
                     <span className="text-sm font-bold text-[#0A3D2C] w-12 text-right flex-shrink-0 bg-[#Edf5f0] px-2 py-1 rounded-md">
                       {count}
                     </span>
                   </div>
                 );
               })}
             </div>
           </div>

           {/* Generating State */}
           {generating && (
             <div className="bg-[#0A3D2C] rounded-[24px] shadow-sm p-8 text-white relative overflow-hidden">
               {/* Background Glow */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
               
               <h2 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-6 flex items-center gap-2">
                 <Sparkles className="w-4 h-4" />
                 Generating Assessment
               </h2>
               
               <div className="space-y-4 relative z-10">
                 {processingSteps.map((step, i) => (
                   <div key={i} className={`flex items-center gap-3 transition-opacity duration-300 ${step.status === 'pending' ? 'opacity-40' : 'opacity-100'}`}>
                     <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                       step.status === 'done' ? 'bg-emerald-400 text-[#0A3D2C]' :
                       step.status === 'active' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/40'
                     }`}>
                       {step.status === 'done' ? <CheckCircle2 className="w-4 h-4" /> : 
                        step.status === 'active' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 
                        <div className="w-1.5 h-1.5 rounded-full bg-current"></div>}
                     </div>
                     <span className={`text-sm font-medium ${step.status === 'done' ? 'text-emerald-300' : 'text-white'}`}>
                       {step.label}
                     </span>
                   </div>
                 ))}
               </div>
             </div>
           )}

           {/* Error */}
           {error && (
             <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700">
               <div className="w-5 h-5 mt-0.5 shrink-0 bg-red-100 rounded-full flex items-center justify-center">!</div>
               <p className="text-sm font-bold">{error}</p>
             </div>
           )}

        </div>
      </div>

      {/* Footer Navigation */}
      {!generating && (
        <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
          <button 
            onClick={() => router.push('/dashboard/create/configure')} 
            className="text-slate-500 hover:text-slate-900 font-bold text-sm flex items-center gap-2 transition-colors px-4 py-2 -ml-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Settings
          </button>
          <button
            onClick={handleGenerate}
            className="bg-[#0A3D2C] hover:bg-[#06281c] text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md flex items-center gap-2 hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
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
