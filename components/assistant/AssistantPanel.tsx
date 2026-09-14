// components/assistant/AssistantPanel.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { AssistantMessageBubble } from './AssistantMessage';
import { AssistantInput } from './AssistantInput';
import { PAGE_GREETINGS, QUICK_ACTIONS } from './assistant-config';
import type { AssistantMessage, AssistantContext, AssistantAPIResponse } from './assistant-types';

interface Props {
  context: AssistantContext;
  onClose: () => void;
}

let msgIdCounter = 0;
function nextId() { return `msg-${++msgIdCounter}-${Date.now()}`; }

export function AssistantPanel({ context, onClose }: Props) {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasGreeted = useRef(false);

  // Build greeting on first open
  useEffect(() => {
    if (hasGreeted.current) return;
    hasGreeted.current = true;

    const hour = new Date().getHours();
    const timeGreet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const name = context.user?.name?.split(' ')[0] || '';
    const greeting = name ? `${timeGreet}, ${name}.` : `${timeGreet}.`;

    let insightText = PAGE_GREETINGS[context.page] || PAGE_GREETINGS.dashboard;

    // Add a data-driven insight for dashboard
    if (context.page === 'dashboard' && context.averageScore !== undefined && context.totalAssessments) {
      if (context.weakConcepts && context.weakConcepts.length > 0) {
        insightText += `\n\nYour current focus area is "${context.weakConcepts[0]}" — it could use some extra practice.`;
      } else if (context.averageScore >= 80) {
        insightText += `\n\nYou're performing well with an average score of ${context.averageScore}%. Keep it up!`;
      }
    }

    if (context.totalAssessments === 0) {
      insightText = "Complete an assessment and I'll help you understand your results and plan your learning.";
    }

    setMessages([{
      id: nextId(),
      role: 'assistant',
      content: `${greeting}\n\n${insightText}`,
      timestamp: new Date(),
    }]);
  }, [context]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const sendMessage = useCallback(async (text: string) => {
    const userMsg: AssistantMessage = {
      id: nextId(), role: 'user', content: text, timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const history = messages.slice(-8).map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, context, history }),
      });

      if (!res.ok) throw new Error('Request failed');
      const data: AssistantAPIResponse = await res.json();

      setMessages(prev => [...prev, {
        id: nextId(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        actions: data.actions,
        insights: data.insights,
      }]);
    } catch {
      setError('Something went wrong while analyzing your learning data.');
    } finally {
      setIsLoading(false);
    }
  }, [messages, context]);

  const quickActions = QUICK_ACTIONS[context.page] || QUICK_ACTIONS.dashboard;

  return (
    <div
      className="fixed bottom-24 right-6 z-[9999] w-[390px] max-w-[calc(100vw-24px)] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
      style={{ height: 'min(620px, calc(100vh - 110px))' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#046B46] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">Assessora Assistant</h3>
            <p className="text-[11px] text-slate-400 font-medium">Your learning companion</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close assistant"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-1 bg-[#FAFBFC]">
        {messages.map(msg => (
          <AssistantMessageBubble key={msg.id} message={msg} />
        ))}

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-start mb-3">
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-md px-4 py-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex justify-start mb-3">
            <div className="bg-red-50 border border-red-100 rounded-2xl rounded-bl-md px-4 py-3 text-sm text-red-600 max-w-[85%]">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => { setError(null); if (messages.length > 0) { const last = messages[messages.length - 1]; if (last.role === 'user') sendMessage(last.content); } }}
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-red-700 hover:text-red-900"
              >
                <RefreshCw className="w-3 h-3" /> Try again
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions — only show if no user messages yet */}
        {messages.length <= 1 && !isLoading && (
          <div className="pt-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Quick Actions</p>
            <div className="flex flex-wrap gap-1.5">
              {quickActions.map((qa, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(qa.message)}
                  className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:border-[#046B46] hover:text-[#046B46] px-3 py-1.5 rounded-lg transition-colors"
                >
                  {qa.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <AssistantInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
