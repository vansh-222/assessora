// components/assistant/AssistantButton.tsx
'use client';

import { Sparkles } from 'lucide-react';

interface Props {
  onClick: () => void;
  isOpen: boolean;
}

export function AssistantButton({ onClick, isOpen }: Props) {
  return (
    <div className="fixed bottom-6 right-6 z-[9998]">
      <button
        onClick={onClick}
        aria-label="Assessora Assistant"
        title="Assessora Assistant"
        className={`
          w-14 h-14 rounded-full flex items-center justify-center
          transition-all duration-200 shadow-lg hover:shadow-xl
          hover:-translate-y-0.5 active:translate-y-0
          ${isOpen
            ? 'bg-slate-800 text-white rotate-0'
            : 'bg-[#046B46] text-white'
          }
        `}
      >
        {isOpen ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <Sparkles className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
