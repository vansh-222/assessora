// components/ui/ProcessingSteps.tsx
'use client';

import { Check, Loader2 } from 'lucide-react';
import { ProcessingStep } from '@/types';

interface Props {
  steps: ProcessingStep[];
}

export default function ProcessingSteps({ steps }: Props) {
  return (
    <div className="space-y-1">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-3 py-2.5">
          <div className="flex-shrink-0">
            {step.status === 'done' && (
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            )}
            {step.status === 'active' && (
              <div className="w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center">
                <Loader2 className="w-3 h-3 text-green-500 animate-spin" />
              </div>
            )}
            {step.status === 'pending' && (
              <div className="w-5 h-5 rounded-full border-2 border-slate-200" />
            )}
          </div>
          <span
            className={`text-sm ${
              step.status === 'done'
                ? 'text-slate-600 line-through decoration-slate-300'
                : step.status === 'active'
                ? 'text-slate-900 font-medium'
                : 'text-slate-400'
            }`}
          >
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}
