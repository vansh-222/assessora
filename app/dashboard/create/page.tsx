'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { X, AlertCircle, FilePlus2, CheckCircle2, CloudUpload, ArrowRight, Info, FileText, AlignLeft } from 'lucide-react';

const ACCEPTED_TYPES = ['.pdf', '.txt', '.md', '.docx', '.ppt'];
const MAX_SIZE_MB = 10;

export default function CreatePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mode: 'file' | 'text'
  const [mode, setMode] = useState<'file' | 'text'>('file');

  // File mode state
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Text mode state
  const [textContent, setTextContent] = useState('');

  // Shared state
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const validateFile = (f: File): string | null => {
    const ext = '.' + f.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext)) return `Unsupported type "${ext}". Use PDF, TXT, DOCX, or PPT.`;
    if (f.size > MAX_SIZE_MB * 1024 * 1024) return `File too large. Max is ${MAX_SIZE_MB}MB.`;
    if (f.size === 0) return 'The file appears to be empty.';
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

  const handleModeSwitch = (newMode: 'file' | 'text') => {
    setMode(newMode);
    setError('');
    setFile(null);
    setTextContent('');
  };

  const handleSubmit = async () => {
    setError('');

    if (mode === 'file' && !file) { setError('Please select a file to upload.'); return; }
    if (mode === 'text' && textContent.trim().length < 50) { setError('Please paste at least 50 characters of study material.'); return; }

    setProcessing(true);

    try {
      let res: Response;

      if (mode === 'file') {
        const formData = new FormData();
        formData.append('file', file!);
        res = await fetch('/api/material/upload', { method: 'POST', body: formData });
      } else {
        res = await fetch('/api/material/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textContent }),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to analyse material.');

      sessionStorage.setItem('assessora_analysis', JSON.stringify(data.analysis));
      sessionStorage.setItem('assessora_fileName', data.sourceFileName || 'Pasted Text');

      router.push('/dashboard/create/analyze');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setProcessing(false);
    }
  };

  const canSubmit = mode === 'file' ? !!file : textContent.trim().length >= 50;

  return (
    <div className="animate-fade-in w-full max-w-7xl mx-auto py-4 px-4 sm:px-8 flex flex-col min-h-[calc(100vh-80px)]">

      {/* Header + Toggle */}
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-10 gap-6">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-[#1a2b25] tracking-tight mb-3">
            {mode === 'file' ? 'Upload Study Material' : 'Paste Study Material'}
          </h1>
          <p className="text-slate-500 font-medium text-[15px] leading-relaxed">
            {mode === 'file'
              ? 'Upload your notes, slides, or any study material and let Assessora analyze the content.'
              : 'Paste your syllabus, lecture notes, or any text and let Assessora analyze it for you.'}
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl flex-shrink-0 self-start mt-1">
          <button
            onClick={() => handleModeSwitch('file')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              mode === 'file'
                ? 'bg-[#0A3D2C] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <FilePlus2 className="w-4 h-4" />
            Upload File
          </button>
          <button
            onClick={() => handleModeSwitch('text')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              mode === 'text'
                ? 'bg-[#0A3D2C] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <AlignLeft className="w-4 h-4" />
            Paste Text
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold border border-red-100 mb-6">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
          <button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* ── File Upload Mode ── */}
      {mode === 'file' && (
        <div className="flex flex-col mb-10">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center transition-all py-16 min-h-[320px] relative
              ${dragOver ? 'border-[#0A3D2C] bg-[#F4F9F6]' : file ? 'border-[#0A3D2C]/30 bg-[#F6FAF8]' : 'border-[#9EC6B2] hover:border-[#0A3D2C]/60 hover:bg-[#F9FCFA] bg-transparent'}`}
          >
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
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-[#Edf5f0] rounded-full flex items-center justify-center relative z-10">
                    <CloudUpload className="w-10 h-10 text-[#0A3D2C]" strokeWidth={2.5} />
                  </div>
                  <div className="absolute top-0 -left-6 w-2 h-0.5 bg-[#0A3D2C] rounded-full rotate-[-20deg] opacity-60" />
                  <div className="absolute top-12 -left-8 w-3 h-0.5 bg-[#0A3D2C] rounded-full rotate-[15deg] opacity-60" />
                  <div className="absolute top-2 -right-4 w-3 h-0.5 bg-[#0A3D2C] rounded-full rotate-[40deg] opacity-60" />
                  <div className="absolute top-10 -right-6 w-2 h-0.5 bg-[#0A3D2C] rounded-full rotate-[-10deg] opacity-60" />
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
                  Supports PDF, TXT, DOCX, PPT · Up to 10MB
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Text Paste Mode ── */}
      {mode === 'text' && (
        <div className="flex flex-col mb-10">
          {processing ? (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-pulse bg-[#F6FAF8] rounded-[32px] border-2 border-dashed border-[#9EC6B2]">
              <div className="w-20 h-20 bg-[#Edf5f0] rounded-full flex items-center justify-center mb-6 relative">
                <FileText className="w-8 h-8 text-[#0A3D2C] absolute" />
                <svg className="animate-spin w-full h-full text-[#0A3D2C] opacity-20" viewBox="0 0 50 50">
                  <circle cx="25" cy="25" r="23" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="100" strokeDashoffset="25" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1a2b25] mb-2">Analyzing your text...</h3>
              <p className="text-sm text-slate-500 font-medium">This usually takes a few seconds.</p>
            </div>
          ) : (
            <div className="relative rounded-[32px] border-2 border-dashed border-[#9EC6B2] bg-transparent hover:border-[#0A3D2C]/60 hover:bg-[#F9FCFA] transition-all overflow-hidden">
              {/* Placeholder icon when empty */}
              {!textContent && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none opacity-40">
                  <div className="w-14 h-14 bg-[#Edf5f0] rounded-full flex items-center justify-center">
                    <AlignLeft className="w-7 h-7 text-[#0A3D2C]" />
                  </div>
                  <p className="text-sm font-semibold text-slate-500 mt-2">Paste your syllabus or notes here...</p>
                  <p className="text-xs text-slate-400">Minimum 50 characters</p>
                </div>
              )}
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder=""
                className="w-full min-h-[360px] bg-transparent resize-none outline-none p-8 pt-10 text-sm text-slate-700 leading-relaxed font-medium"
                spellCheck={false}
              />
              {/* Character count */}
              <div className="flex justify-between items-center px-8 py-3 border-t border-[#9EC6B2]/40 bg-[#F6FAF8]/50">
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">
                  {textContent.length} characters {textContent.length < 50 ? `· ${50 - textContent.length} more to go` : '· Ready!'}
                </p>
                {textContent.length >= 50 && (
                  <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Ready to Analyze
                  </div>
                )}
                {textContent.length > 0 && (
                  <button
                    onClick={() => setTextContent('')}
                    className="text-slate-400 hover:text-red-500 text-xs font-semibold transition-colors flex items-center gap-1 ml-4"
                  >
                    <X className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Bar */}
      <div className="mt-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-[#F6FAF8] text-[#0A3D2C] px-5 py-3.5 rounded-xl text-xs font-semibold flex-1 md:max-w-xl">
          <Info className="w-4 h-4 shrink-0" />
          {mode === 'file'
            ? 'Your file will be securely processed and analyzed using AI. We support lecture notes, textbooks, slides, and more.'
            : 'Your pasted text will be analyzed by AI to extract key topics and generate a high-quality assessment.'}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit || processing}
          className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
            canSubmit && !processing
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
