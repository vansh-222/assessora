'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, AlertCircle, FileText, FilePlus2, CheckCircle2, CloudUpload, ArrowRight, Info, Plus } from 'lucide-react';
import type { Metadata } from 'next';

const ACCEPTED_TYPES = ['.pdf', '.txt', '.md', '.docx', '.ppt'];
const MAX_SIZE_MB = 10;

export default function CreatePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const validateFile = (f: File): string | null => {
    const ext = '.' + f.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext)) {
      return `Unsupported file type "${ext}". Please upload a PDF, TXT, DOCX, or PPT file.`;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File is too large. Maximum size is ${MAX_SIZE_MB}MB.`;
    }
    if (f.size === 0) {
      return 'The file appears to be empty.';
    }
    return null;
  };

  const handleFileSelect = (f: File) => {
    setError('');
    const err = validateFile(f);
    if (err) { setError(err); return; }
    setFile(f);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFileSelect(f);
  }, []);

  const handleSubmit = async () => {
    setError('');

    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setProcessing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/material/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyse material.');
      }

      sessionStorage.setItem('assessora_analysis', JSON.stringify(data.analysis));
      sessionStorage.setItem('assessora_fileName', data.sourceFileName || '');

      router.push('/dashboard/create/analyze');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setError(msg);
      setProcessing(false);
    }
  };

  return (
    <div className="animate-fade-in w-full max-w-7xl mx-auto py-4 px-4 sm:px-8 flex flex-col min-h-[calc(100vh-80px)]">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8 relative">
        <div className="max-w-2xl z-10">
         
          <h1 className="text-3xl md:text-[30px] font-bold text-[#1a2b25] tracking-tight mb-4">
            Upload Study Material
          </h1>
          <p className="text-slate-500 font-medium text-[15px] leading-relaxed max-w-x">
            Upload your notes, lecture slides, or any study material and let Assessora analyze the content to create a balanced, high-quality assessment for you.
          </p>
        </div>
      </div>

      {/* Main Upload Zone */}
      <div className="flex flex-col mb-10">
        <div 
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center transition-all py-12 min-h-[300px] relative
            ${dragOver ? 'border-[#0A3D2C] bg-[#F4F9F6]' : file ? 'border-[#0A3D2C]/30 bg-[#F6FAF8]' : 'border-[#9EC6B2] hover:border-[#0A3D2C]/60 hover:bg-[#F9FCFA] bg-transparent'}`}
        >
          {error && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm border border-red-100 z-10">
              <AlertCircle className="w-4 h-4" />
              {error}
              <button onClick={() => setError('')}><X className="w-4 h-4 ml-2" /></button>
            </div>
          )}

          {processing ? (
             <div className="flex flex-col items-center text-center animate-pulse">
                <div className="w-20 h-20 bg-[#Edf5f0] rounded-full flex items-center justify-center mb-6 relative">
                  <CloudUpload className="w-8 h-8 text-[#0A3D2C] absolute" />
                  <svg className="animate-spin w-full h-full text-[#0A3D2C] opacity-20" viewBox="0 0 50 50">
                    <circle cx="25" cy="25" r="23" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="100" strokeDashoffset="25" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1a2b25] mb-2">Analyzing your material...</h3>
                <p className="text-sm text-slate-500 font-medium">This usually takes a few seconds.</p>
             </div>
          ) : file ? (
             <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-[#Edf5f0] rounded-full flex items-center justify-center mb-6 text-[#0A3D2C]">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-[#1a2b25] mb-2">File Ready</h3>
                <p className="text-sm font-bold text-[#0A3D2C] mb-1">{file.name}</p>
                <p className="text-[11px] text-slate-400 font-medium mb-6">{(file.size / 1024).toFixed(0)} KB</p>
                <button 
                  onClick={() => { setFile(null); setError(''); }}
                  className="bg-white border border-[#0A3D2C]/20 hover:border-[#0A3D2C]/40 text-slate-600 hover:text-[#0A3D2C] px-6 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shadow-sm"
                >
                  <X className="w-4 h-4" /> Change File
                </button>
             </div>
          ) : (
            <>
              {/* Sparkles around cloud */}
              <div className="relative">
                <div className="w-24 h-24 bg-[#Edf5f0] rounded-full flex items-center justify-center mb-8 relative z-10">
                  <CloudUpload className="w-10 h-10 text-[#0A3D2C]" strokeWidth={2.5} />
                  <ArrowRight className="w-4 h-4 text-[#0A3D2C] absolute top-[42%] -rotate-90 stroke-[3px]" />
                </div>
                <div className="absolute top-0 -left-6 w-2 h-0.5 bg-[#0A3D2C] rounded-full rotate-[-20deg] opacity-60"></div>
                <div className="absolute top-12 -left-8 w-3 h-0.5 bg-[#0A3D2C] rounded-full rotate-[15deg] opacity-60"></div>
                <div className="absolute top-2 -right-4 w-3 h-0.5 bg-[#0A3D2C] rounded-full rotate-[40deg] opacity-60"></div>
                <div className="absolute top-10 -right-6 w-2 h-0.5 bg-[#0A3D2C] rounded-full rotate-[-10deg] opacity-60"></div>
              </div>
              
              <h3 className="text-xl font-bold text-[#1a2b25] mb-2 tracking-tight">Drag and drop your file here</h3>
              <p className="text-sm text-slate-500 font-medium mb-8">or click to browse from your device</p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.md,.docx,.ppt"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#F9FCFA] hover:bg-white border border-[#c1e2d1] hover:border-[#0A3D2C]/40 text-[#0A3D2C] px-8 py-3.5 rounded-2xl font-bold text-sm transition-colors flex items-center gap-2 shadow-sm mb-6"
              >
                <FilePlus2 className="w-4 h-4" />
                Browse Files
              </button>
              
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Supports PDF, TXT, DOCX, PPT • Up to 10MB
              </p>
            </>
          )}
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="mt-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-[#F6FAF8] text-[#0A3D2C] px-5 py-3.5 rounded-xl text-xs font-semibold flex-1 md:max-w-xl">
          <Info className="w-4 h-4 shrink-0" />
          Your file will be securely processed and analyzed using AI. We support lecture notes, textbooks, slides, and more.
        </div>
        
        <button 
          onClick={handleSubmit}
          disabled={!file || processing}
          className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
            file && !processing 
              ? 'bg-[#0A3D2C] text-white hover:bg-[#06281c]' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          Analyse Material
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
