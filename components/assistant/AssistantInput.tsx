// components/assistant/AssistantInput.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function AssistantInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 100) + 'px';
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex items-end gap-2 p-3 border-t border-slate-100 bg-white">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Ask about your learning..."
        rows={1}
        className="flex-1 resize-none bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#046B46] focus:ring-1 focus:ring-[#046B46]/20 transition-colors disabled:opacity-50 leading-snug"
      />
      <button
        onClick={handleSubmit}
        disabled={!value.trim() || disabled}
        className="w-9 h-9 rounded-xl bg-[#046B46] hover:bg-[#035437] disabled:bg-slate-200 disabled:text-slate-400 text-white flex items-center justify-center transition-colors flex-shrink-0"
        aria-label="Send message"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
}
