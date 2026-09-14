// components/assistant/AssessoraAssistant.tsx
'use client';

import { useState, lazy, Suspense } from 'react';
import { AssistantButton } from './AssistantButton';
import type { AssistantContext } from './assistant-types';

const AssistantPanel = lazy(() =>
  import('./AssistantPanel').then(mod => ({ default: mod.AssistantPanel }))
);

interface Props {
  context: AssistantContext;
}

export function AssessoraAssistant({ context }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AssistantButton onClick={() => setIsOpen(prev => !prev)} isOpen={isOpen} />

      {isOpen && (
        <Suspense fallback={null}>
          <AssistantPanel context={context} onClose={() => setIsOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
