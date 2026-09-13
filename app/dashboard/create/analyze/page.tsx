'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, ArrowRight, ArrowLeft, BookOpen, Layers, Tag, CheckCircle2, Sparkles, BookMarked, AlignLeft } from 'lucide-react';
import type { MaterialAnalysis, Topic, Unit } from '@/types';

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
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
         <div className="flex flex-col items-center animate-pulse">
            <div className="w-16 h-16 bg-[#Edf5f0] rounded-full flex items-center justify-center mb-4">
               <svg className="animate-spin w-8 h-8 text-[#0A3D2C]" viewBox="0 0 50 50">
                  <circle cx="25" cy="25" r="23" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="100" strokeDashoffset="25" />
               </svg>
            </div>
            <p className="text-slate-500 font-bold">Loading Analysis...</p>
         </div>
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
    <div className="animate-fade-in w-full max-w-7xl mx-auto py-4 px-4 sm:px-8 flex flex-col min-h-[calc(100vh-80px)]">
      
      <div className="mb-10 max-w-3xl">
        
        <h1 className="text-3xl md:text-[30px] font-bold text-[#1a2b25] tracking-tight mb-3">
          Review Detected Content
        </h1>
        <p className="text-slate-500 font-medium text-[15px] leading-relaxed">
          Assessora has thoroughly analysed your material. Review and edit the detected topics below before we generate your assessment blueprint.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        
        {/* Left Column: Extracted Units (Span 2) */}
        <div className="lg:col-span-2 flex flex-col h-full space-y-6">
           
           {/* Subject Card moved here or keep on right? Let's keep subject on right and just have Units here */}
           <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-8 flex flex-col h-full relative overflow-hidden">
             
             {/* Header */}
             <div className="flex items-center justify-between mb-8 relative z-10">
               <div>
                 <h2 className="text-xl font-bold text-[#1a2b25] mb-1">Extracted Units</h2>
                 <p className="text-sm font-medium text-slate-500">
                   The core structure detected from your uploaded material.
                 </p>
               </div>
               <div className="bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
                  <span className="text-sm font-bold text-slate-700">{analysis.units.length}</span>
                  <span className="text-xs font-semibold text-slate-400 ml-1.5 uppercase tracking-wider">Units</span>
               </div>
             </div>

             {/* Units Container */}
             <div className="flex-1 space-y-6 relative z-10">
               {analysis.units.length > 0 ? (
                 analysis.units.map((unit: Unit) => (
                   <div key={unit.id} className="group pb-6 border-b border-slate-100 last:border-0">
                     <p className="text-base font-bold text-slate-900 mb-1 flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0 shadow-sm"></span>
                        {unit.title}
                     </p>
                     {unit.description && (
                        <p className="text-[13px] text-slate-600 font-medium pl-4 mb-2.5 leading-relaxed">
                          {unit.description}
                        </p>
                     )}
                     {unit.topics.length > 0 && (
                       <p className="text-[13px] text-slate-400 font-medium pl-4 leading-relaxed">
                         {unit.topics.join(' · ')}
                       </p>
                     )}
                   </div>
                 ))
               ) : (
                 <div className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                    <Layers className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="text-sm font-bold text-slate-400">No units detected</p>
                 </div>
               )}
             </div>

             {/* Subtle Background Watermark */}
             <div className="absolute -bottom-10 -right-10 opacity-[0.03] pointer-events-none">
                <Layers className="w-64 h-64" />
             </div>
          </div>
        </div>

        {/* Right Column: Topics Editor & Metadata (Span 1) */}
        <div className="lg:col-span-1 flex flex-col space-y-6">
           
           {/* Subject Card */}
           <div className="bg-gradient-to-br from-[#Edf5f0] to-[#E2F1E8] rounded-2xl p-6 border border-[#c1e2d1]/50 shadow-sm relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-20 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="flex items-start gap-4 relative z-10">
                 <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-[#c1e2d1] flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-[#0A3D2C]" />
                 </div>
                 <div>
                    <h3 className="text-xs font-bold text-[#0A3D2C]/60 uppercase tracking-wider mb-1">Detected Subject</h3>
                    <h2 className="text-lg font-bold text-[#0A3D2C] leading-tight mb-3">{analysis.subject}</h2>
                    
                    <div className="flex flex-wrap gap-2">
                       <span className="bg-white/80 border border-white text-[#0A3D2C] text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                         {areaLabel[analysis.subjectArea] || analysis.subjectArea}
                       </span>
                       {analysis.isProgramming && (
                         <span className="bg-[#0A3D2C] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                           Programming
                         </span>
                       )}
                    </div>
                 </div>
              </div>
           </div>

           {/* Topics Editor Card */}
           <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col flex-1">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Topics Editor</h3>
                <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-md border border-slate-100">
                   {topics.length} TOPICS
                </span>
             </div>
             
             <div className="flex flex-wrap gap-1.5 mb-6 max-h-[300px] overflow-y-auto pr-1">
               {topics.map((topic) => (
                 <div
                   key={topic.id}
                   className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F9FCFA] border border-[#c1e2d1] text-[11px] font-bold text-[#0A3D2C] group shadow-sm transition-all hover:border-[#0A3D2C]/40"
                 >
                   <span className="truncate max-w-[150px]">{topic.title}</span>
                   <button
                     onClick={() => removeTopic(topic.id)}
                     className="shrink-0 text-slate-400 hover:text-red-500 transition-colors"
                     title="Remove topic"
                   >
                     <X className="w-3 h-3" />
                   </button>
                 </div>
               ))}
               {topics.length === 0 && (
                 <p className="text-[11px] text-slate-400 italic w-full text-center py-4">No topics found</p>
               )}
             </div>

             {/* Add Topic Input */}
             <div className="mt-auto border-t border-slate-100 pt-4">
               <div className="flex gap-2">
                 <input
                   type="text"
                   value={newTopic}
                   onChange={(e) => setNewTopic(e.target.value)}
                   onKeyDown={(e) => { if (e.key === 'Enter') addTopic(); }}
                   placeholder="Add a topic..."
                   className="w-full bg-[#F9FCFA] border border-[#c1e2d1] rounded-xl px-3 py-2 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#Edf5f0] focus:border-[#0A3D2C] transition-all"
                 />
                 <button 
                   onClick={addTopic} 
                   disabled={!newTopic.trim()}
                   className="bg-[#0A3D2C] text-white hover:bg-[#06281c] disabled:bg-slate-200 disabled:text-slate-400 px-3 py-2 rounded-xl font-bold text-xs transition-colors shrink-0"
                 >
                   <Plus className="w-4 h-4" />
                 </button>
               </div>
             </div>
           </div>

           {/* Key Concepts Card */}
           {analysis.concepts.length > 0 && (
             <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 shrink-0">
                <div className="flex items-center gap-2 mb-4">
                  <AlignLeft className="w-4 h-4 text-slate-400" />
                  <h3 className="text-sm font-bold text-slate-900">Key Concepts</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.concepts.map((c, i) => (
                    <span key={i} className="bg-slate-50 border border-slate-100 text-slate-600 text-[11px] font-bold px-2.5 py-1.5 rounded-lg">
                      {c}
                    </span>
                  ))}
                </div>
             </div>
           )}
           
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
        <button 
          onClick={() => router.push('/dashboard/create')} 
          className="text-slate-500 hover:text-slate-900 font-bold text-sm flex items-center gap-2 transition-colors px-4 py-2 -ml-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Upload
        </button>
        <button
          onClick={handleContinue}
          disabled={topics.length === 0}
          className="bg-[#0A3D2C] hover:bg-[#06281c] text-white disabled:bg-slate-200 disabled:text-slate-400 px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2"
        >
          Configure Assessment
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
