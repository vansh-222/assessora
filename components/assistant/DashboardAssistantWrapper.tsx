// components/assistant/DashboardAssistantWrapper.tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AssessoraAssistant } from './AssessoraAssistant';
import type { AssistantContext, AssistantPage } from './assistant-types';

interface Props {
  userName?: string | null;
  userEmail?: string | null;
}

function getPageFromPath(pathname: string): AssistantPage {
  if (pathname.includes('/knowledge-map')) return 'knowledge-map';
  if (pathname.includes('/practice')) return 'practice';
  if (pathname.includes('/progress')) return 'progress';
  if (pathname.includes('/settings')) return 'settings';
  if (pathname.includes('/results')) return 'results';
  if (pathname.match(/\/assessment\/[^/]+$/)) return 'assessment';
  return 'dashboard';
}

export function DashboardAssistantWrapper({ userName, userEmail }: Props) {
  const pathname = usePathname();
  const [stats, setStats] = useState<any>(null);

  // Fetch stats lazily — only when component mounts (i.e., layout renders)
  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(r => r.ok ? r.json() : null)
      .then(setStats)
      .catch(() => {});
  }, []);

  const page = getPageFromPath(pathname);

  // Map API response keys to context shape
  const weakConcepts = stats?.needsAttention
    ?.filter((n: any) => n.status === 'Needs Practice')
    ?.map((n: any) => n.topic) || [];
  const strongConcepts = stats?.needsAttention
    ?.filter((n: any) => n.status === 'Strong')
    ?.map((n: any) => n.topic) || [];

  const recentForContext = stats?.recentAssessments?.map((a: any) => ({
    title: a.title,
    subject: a.subject,
    score: a.score ?? 0,
    date: a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '',
  })) || [];

  const context: AssistantContext = {
    page,
    user: userName ? { name: userName, email: userEmail || '' } : undefined,
    averageScore: stats?.avgScore,
    totalAssessments: stats?.totalAssessments ?? 0,
    completedAssessments: stats?.completed ?? 0,
    conceptsMastered: stats?.conceptsMastered,
    totalStudyTime: stats?.totalStudyTimeSeconds,
    weakConcepts,
    strongConcepts,
    recentAssessments: recentForContext,
  };

  return <AssessoraAssistant context={context} />;
}
