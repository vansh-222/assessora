'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Settings2, HelpCircle, Flame, Clock, BrainCircuit, Info, Minus, Plus, AlertCircle } from 'lucide-react';
import { computeBloomDistribution, BLOOM_LABELS, BLOOM_DESCRIPTIONS } from '@/lib/bloom';
import type { MaterialAnalysis, AssessmentConfig, BloomLevel, BloomDistribution, Difficulty } from '@/types';

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
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
         <div className="flex flex-col items-center animate-pulse">
            <div className="w-16 h-16 bg-[#Edf5f0] rounded-full flex items-center justify-center mb-4">
               <svg className="animate-spin w-8 h-8 text-[#0A3D2C]" viewBox="0 0 50 50">
                  <circle cx="25" cy="25" r="23" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="100" strokeDashoffset="25" />
               </svg>
            </div>
            <p className="text-slate-500 font-bold">Loading Configuration...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in w-full max-w-7xl mx-auto py-4 px-4 sm:px-8 flex flex-col min-h-[calc(100vh-80px)]">
      
      {/* Header Section */}
      <div className="mb-10 max-w-3xl">
       
        <h1 className="text-3xl md:text-[30px] font-bold text-[#1a2b25] tracking-tight mb-3">
          Configure Assessment
        </h1>
        <p className="text-slate-500 font-medium text-[15px] leading-relaxed">
          Fine-tune the parameters of your assessment. Select the difficulty, time limits, and desired cognitive distribution before generating the blueprint.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 flex-1">
        
        {/* Left Column: Base Settings */}
        <div className="flex flex-col space-y-8">
           <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-8 relative overflow-hidden">
             
             {/* Question Count */}
             <div className="mb-10 relative z-10">
               <div className="flex items-center gap-2 mb-4">
                 <div className="w-8 h-8 rounded-lg bg-[#Edf5f0] flex items-center justify-center text-[#0A3D2C]">
                   <HelpCircle className="w-4 h-4" />
                 </div>
                 <h2 className="text-lg font-bold text-slate-900">Number of Questions</h2>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 {([5, 10] as const).map((n) => (
                   <button
                     key={n}
                     onClick={() => setQuestionCount(n)}
                     className={`relative p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center gap-1 overflow-hidden group
                       ${questionCount === n
                         ? 'border-[#0A3D2C] bg-[#F9FCFA]'
                         : 'border-slate-100 bg-white hover:border-[#c1e2d1]'
                       }`}
                   >
                     {questionCount === n && (
                        <div className="absolute top-0 inset-x-0 h-1 bg-[#0A3D2C]"></div>
                     )}
                     <span className={`text-2xl font-bold ${questionCount === n ? 'text-[#0A3D2C]' : 'text-slate-400 group-hover:text-slate-600'}`}>
                       {n}
                     </span>
                     <span className={`text-sm font-semibold ${questionCount === n ? 'text-[#0A3D2C]' : 'text-slate-400 group-hover:text-slate-500'}`}>
                       Questions
                     </span>
                   </button>
                 ))}
               </div>
             </div>

             <div className="w-full h-px bg-slate-100 mb-10"></div>

             {/* Difficulty */}
             <div className="mb-10 relative z-10">
               <div className="flex items-center gap-2 mb-4">
                 <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                   <Flame className="w-4 h-4" />
                 </div>
                 <h2 className="text-lg font-bold text-slate-900">Difficulty Level</h2>
               </div>
               
               <div className="flex p-1.5 bg-slate-50 rounded-xl border border-slate-100">
                 {(['easy', 'medium', 'hard'] as const).map((d) => (
                   <button
                     key={d}
                     onClick={() => setDifficulty(d)}
                     className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all capitalize shadow-sm
                       ${difficulty === d
                         ? 'bg-white text-slate-900 border border-slate-200 ring-1 ring-black/5'
                         : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-transparent shadow-none'
                       }`}
                   >
                     {d}
                   </button>
                 ))}
               </div>
             </div>

             <div className="w-full h-px bg-slate-100 mb-10"></div>

             {/* Duration */}
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-4">
                 <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                   <Clock className="w-4 h-4" />
                 </div>
                 <h2 className="text-lg font-bold text-slate-900">Time Limit</h2>
               </div>
               
               <div className="grid grid-cols-4 gap-3">
                 {DURATIONS.map((d) => (
                   <button
                     key={d}
                     onClick={() => setDuration(d)}
                     className={`py-3.5 rounded-xl border-2 transition-all text-sm font-bold flex flex-col items-center justify-center
                       ${duration === d
                         ? 'border-[#0A3D2C] bg-[#F9FCFA] text-[#0A3D2C]'
                         : 'border-slate-100 bg-white text-slate-500 hover:border-[#c1e2d1] hover:text-slate-700'
                       }`}
                   >
                     {d} <span className="text-[10px] uppercase tracking-wider opacity-70 mt-0.5">Min</span>
                   </button>
                 ))}
               </div>
             </div>
             
           </div>
        </div>

        {/* Right Column: Bloom's Taxonomy */}
        <div className="flex flex-col space-y-6">
           <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-8 flex flex-col h-full relative overflow-hidden">
             
             {/* Header */}
             <div className="flex items-start justify-between mb-2 relative z-10">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-fuchsia-50 flex items-center justify-center text-fuchsia-500">
                   <BrainCircuit className="w-4 h-4" />
                 </div>
                 <h2 className="text-lg font-bold text-slate-900">Cognitive Distribution</h2>
               </div>
               <div className={`px-3 py-1 rounded-md text-xs font-bold border ${distValid ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                 {totalDist} / {questionCount}
               </div>
             </div>
             
             <p className="text-sm font-medium text-slate-500 mb-8 ml-10">
               Select which cognitive levels to test based on Bloom's Taxonomy.
             </p>

             {!analysis.isProgramming && (
               <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 mb-6 text-sm font-medium text-slate-600">
                 <Info className="w-5 h-5 flex-shrink-0 text-slate-400" />
                 Code Trace level is automatically disabled for non-programming subjects.
               </div>
             )}

             {!distValid && selectedLevels.length > 0 && (
               <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 mb-6 text-sm font-bold text-red-600">
                 <AlertCircle className="w-5 h-5 flex-shrink-0" />
                 Total distribution must equal exactly {questionCount} questions.
               </div>
             )}

             {/* Bloom's Levels */}
             <div className="flex-1 space-y-3 relative z-10">
               {visibleLevels.map((level) => {
                 const isSelected = selectedLevels.includes(level);
                 const count = distribution[level] ?? 0;

                 return (
                   <div
                     key={level}
                     className={`rounded-xl border-2 transition-all overflow-hidden ${
                       isSelected 
                         ? 'border-[#0A3D2C]/20 bg-[#F9FCFA] shadow-sm' 
                         : 'border-slate-100 bg-white hover:border-slate-200'
                     }`}
                   >
                     <div className="flex items-center gap-4 p-4">
                       
                       {/* Checkbox */}
                       <button
                         onClick={() => toggleLevel(level)}
                         className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                           isSelected 
                             ? 'border-[#0A3D2C] bg-[#0A3D2C] text-white' 
                             : 'border-slate-300 text-transparent hover:border-slate-400'
                         }`}
                       >
                         <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                         </svg>
                       </button>
                       
                       {/* Text */}
                       <div className="flex-1 min-w-0 pr-4">
                         <p className={`text-[15px] font-bold ${isSelected ? 'text-[#1a2b25]' : 'text-slate-500'}`}>
                           {BLOOM_LABELS[level]}
                         </p>
                         <p className={`text-xs mt-0.5 truncate ${isSelected ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                           {BLOOM_DESCRIPTIONS[level]}
                         </p>
                       </div>
                       
                       {/* Controls */}
                       {isSelected && (
                         <div className="flex items-center gap-1.5 flex-shrink-0 bg-white border border-[#c1e2d1] rounded-lg p-1 shadow-sm">
                           <button
                             onClick={() => adjustDistribution(level, -1)}
                             disabled={count <= 1}
                             className="w-7 h-7 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                           >
                             <Minus className="w-3.5 h-3.5" />
                           </button>
                           <span className="w-6 text-center text-sm font-bold text-[#0A3D2C]">
                             {count}
                           </span>
                           <button
                             onClick={() => adjustDistribution(level, 1)}
                             disabled={totalDist >= questionCount}
                             className="w-7 h-7 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                           >
                             <Plus className="w-3.5 h-3.5" />
                           </button>
                         </div>
                       )}
                     </div>
                   </div>
                 );
               })}
             </div>
           </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
        <button 
          onClick={() => router.push('/dashboard/create/analyze')} 
          className="text-slate-500 hover:text-slate-900 font-bold text-sm flex items-center gap-2 transition-colors px-4 py-2 -ml-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Analysis
        </button>
        <button
          onClick={handleContinue}
          disabled={selectedLevels.length === 0 || !distValid}
          className="bg-[#0A3D2C] hover:bg-[#06281c] text-white disabled:bg-slate-200 disabled:text-slate-400 px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2"
        >
          Review Blueprint
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
