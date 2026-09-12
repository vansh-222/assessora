'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, Type, X, Loader2, AlertCircle, BookOpen } from 'lucide-react';
import StepIndicator from '@/components/ui/StepIndicator';
import ProcessingSteps from '@/components/ui/ProcessingSteps';
import type { ProcessingStep } from '@/types';
import type { Metadata } from 'next';

const STEPS = [
  { number: 1, label: 'Material' },
  { number: 2, label: 'Review' },
  { number: 3, label: 'Configure' },
  { number: 4, label: 'Blueprint' },
];

const ACCEPTED_TYPES = ['.pdf', '.txt', '.md'];
const MAX_SIZE_MB = 10;

type TabType = 'upload' | 'paste';

export default function CreatePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<TabType>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { label: 'Material received', status: 'pending' },
    { label: 'Text extracted', status: 'pending' },
    { label: 'Content cleaned', status: 'pending' },
    { label: 'Identifying topics & concepts', status: 'pending' },
    { label: 'Preparing assessment', status: 'pending' },
  ]);

  const updateStep = (index: number, status: ProcessingStep['status']) => {
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, status } : s))
    );
  };

  const validateFile = (f: File): string | null => {
    const ext = '.' + f.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext)) {
      return `Unsupported file type "${ext}". Please upload a PDF, TXT, or Markdown file.`;
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

    if (tab === 'upload' && !file) {
      setError('Please select a file to upload.');
      return;
    }
    if (tab === 'paste' && !pastedText.trim()) {
      setError('Please paste some text to analyse.');
      return;
    }
    if (tab === 'paste' && pastedText.trim().length < 100) {
      setError('Please paste at least 100 characters of content for accurate analysis.');
      return;
    }

    setProcessing(true);
    updateStep(0, 'active');

    try {
      // Step 1: material received
      await delay(400);
      updateStep(0, 'done');
      updateStep(1, 'active');

      // Build form data
      const formData = new FormData();
      if (tab === 'upload' && file) {
        formData.append('file', file);
      } else {
        formData.append('text', pastedText.trim());
      }

      // Step 2: text extraction happens on server
      await delay(500);
      updateStep(1, 'done');
      updateStep(2, 'active');

      // Step 3: cleaning
      await delay(400);
      updateStep(2, 'done');
      updateStep(3, 'active');

      // Step 4: AI analysis
      const res = await fetch('/api/material/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyse material.');
      }

      updateStep(3, 'done');
      updateStep(4, 'active');
      await delay(300);
      updateStep(4, 'done');

      // Store analysis in sessionStorage and navigate
      sessionStorage.setItem('assessora_analysis', JSON.stringify(data.analysis));
      sessionStorage.setItem('assessora_fileName', data.sourceFileName || '');

      router.push('/dashboard/create/analyze');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setError(msg);
      setProcessing(false);
      setSteps((prev) => prev.map((s) => ({ ...s, status: 'pending' })));
    }
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      {/* Step indicator */}
      <div className="mb-8">
        <StepIndicator steps={STEPS} current={1} />
      </div>

      <div className="page-header">
        <h1 className="page-title">Upload Study Material</h1>
        <p className="page-subtitle">
          Provide the material you want to be assessed on. Assessora will analyse it and extract key topics.
        </p>
      </div>

      <div className="card p-6">
        {/* Tab selector */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg mb-6">
          <button
            onClick={() => { setTab('upload'); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === 'upload' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload File
          </button>
          <button
            onClick={() => { setTab('paste'); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === 'paste' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Type className="w-4 h-4" />
            Paste Text
          </button>
        </div>

        {/* Upload tab */}
        {tab === 'upload' && (
          <div>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center text-center cursor-pointer transition-colors ${
                dragOver
                  ? 'border-green-400 bg-green-50'
                  : file
                  ? 'border-green-300 bg-green-50'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.md"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
              />

              {file ? (
                <>
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-3">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="font-medium text-slate-900 mb-1">{file.name}</p>
                  <p className="text-sm text-slate-400">
                    {(file.size / 1024).toFixed(0)} KB · Click to change
                  </p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); setError(''); }}
                    className="mt-3 flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" /> Remove
                  </button>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="font-medium text-slate-700 mb-1">
                    Drop your file here, or click to browse
                  </p>
                  <p className="text-sm text-slate-400">
                    PDF, TXT, or Markdown · up to {MAX_SIZE_MB}MB
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Paste tab */}
        {tab === 'paste' && (
          <div>
            <label className="label">Study material</label>
            <textarea
              value={pastedText}
              onChange={(e) => { setPastedText(e.target.value); setError(''); }}
              placeholder="Paste your lecture notes, textbook chapter, syllabus, or any study material here..."
              className="input resize-none h-64 font-mono text-xs leading-relaxed"
            />
            <p className="text-xs text-slate-400 mt-2">
              {pastedText.trim().length} characters
              {pastedText.trim().length > 0 && pastedText.trim().length < 100 && (
                <span className="text-amber-500"> · need at least 100</span>
              )}
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-start gap-2.5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* Processing steps */}
        {processing && (
          <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
              Analysing material
            </p>
            <ProcessingSteps steps={steps} />
          </div>
        )}

        {/* Submit */}
        {!processing && (
          <div className="mt-6 flex justify-end">
            <button onClick={handleSubmit} className="btn-primary btn-lg" disabled={processing}>
              Analyse Material
              <BookOpen className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
