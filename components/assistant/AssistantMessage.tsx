// components/assistant/AssistantMessage.tsx
'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import type { AssistantMessage as MessageType, AssistantAction } from './assistant-types';

function ActionButton({ action }: { action: AssistantAction }) {
  const router = useRouter();

  const handleClick = () => {
    switch (action.action) {
      case 'practice':
        router.push('/dashboard/practice');
        break;
      case 'view-results':
        router.push('/dashboard/assessments');
        break;
      case 'open-knowledge-map':
        router.push('/dashboard/knowledge-map');
        break;
      case 'create-assessment':
        router.push('/dashboard/create');
        break;
      default:
        break;
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#046B46] bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg transition-colors border border-emerald-100"
    >
      {action.label}
      <ArrowRight className="w-3 h-3" />
    </button>
  );
}

export function AssistantMessageBubble({ message }: { message: MessageType }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-[#Edf5f0] text-slate-800 rounded-2xl rounded-br-md'
            : 'bg-white text-slate-700 rounded-2xl rounded-bl-md border border-slate-100'
        }`}
      >
        {/* Message text — render newlines */}
        <div className="whitespace-pre-wrap">{message.content}</div>

        {/* Insights */}
        {message.insights && message.insights.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {message.insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-[#046B46] font-bold mt-px">•</span>
                {insight}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        {message.actions && message.actions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.actions.map((action, i) => (
              <ActionButton key={i} action={action} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
