// app/dashboard/knowledge-map/page.tsx
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { Attempt } from '@/lib/models/Attempt';
import { Map, ShieldCheck, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { pct } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Knowledge Map' };

interface TopicStat {
  topic: string;
  correct: number;
  total: number;
  percentage: number;
  tier: 'mastered' | 'developing' | 'review';
}

export default async function KnowledgeMapPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  await connectDB();
  const attempts = await Attempt.find({ userId }).select('topicPerformance').lean();

  // Aggregate all topic performances
  const aggregated: Record<string, { correct: number; total: number }> = {};
  for (const attempt of attempts) {
    const tp = attempt.topicPerformance || {};
    for (const [topic, stat] of Object.entries(tp)) {
      if (!aggregated[topic]) {
        aggregated[topic] = { correct: 0, total: 0 };
      }
      aggregated[topic].correct += (stat as any).correct || 0;
      aggregated[topic].total += (stat as any).total || 0;
    }
  }

  // Calculate percentages and tiers
  const allTopics: TopicStat[] = Object.entries(aggregated).map(([topic, stat]) => {
    const percentage = pct(stat.correct, stat.total);
    let tier: 'mastered' | 'developing' | 'review' = 'review';
    if (percentage >= 80) tier = 'mastered';
    else if (percentage >= 60) tier = 'developing';

    return { topic, correct: stat.correct, total: stat.total, percentage, tier };
  });

  // Sort: Needs review first, then developing, then mastered.
  // Within tiers, sort alphabetically.
  allTopics.sort((a, b) => {
    const tierWeight = { review: 1, developing: 2, mastered: 3 };
    if (tierWeight[a.tier] !== tierWeight[b.tier]) {
      return tierWeight[a.tier] - tierWeight[b.tier];
    }
    return a.topic.localeCompare(b.topic);
  });

  const mastered = allTopics.filter(t => t.tier === 'mastered');
  const developing = allTopics.filter(t => t.tier === 'developing');
  const review = allTopics.filter(t => t.tier === 'review');

  const isEmpty = allTopics.length === 0;

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="page-header mb-8 flex items-start justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Map className="w-6 h-6 text-green-600" />
            Knowledge Map
          </h1>
          <p className="page-subtitle">A global overview of your proficiency across all topics tested.</p>
        </div>
      </div>

      {isEmpty ? (
        <div className="card p-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
            <Sparkles className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No data yet</h2>
          <p className="text-slate-500 text-sm max-w-sm">
            Complete your first assessment to start building your Knowledge Map.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Summary Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card p-5 border-l-4 border-l-emerald-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{mastered.length}</p>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Mastered</p>
                </div>
              </div>
            </div>
            <div className="card p-5 border-l-4 border-l-amber-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{developing.length}</p>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Developing</p>
                </div>
              </div>
            </div>
            <div className="card p-5 border-l-4 border-l-red-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{review.length}</p>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Needs Review</p>
                </div>
              </div>
            </div>
          </div>

          {/* Topics Grid */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-sm font-semibold text-slate-900">All Topics</h2>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {allTopics.map(stat => (
                <TopicCard key={stat.topic} stat={stat} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TopicCard({ stat }: { stat: TopicStat }) {
  const isMastered = stat.tier === 'mastered';
  const isDeveloping = stat.tier === 'developing';
  
  const barColor = isMastered ? 'bg-emerald-500' : isDeveloping ? 'bg-amber-400' : 'bg-red-500';
  const badgeClass = isMastered ? 'badge-green' : isDeveloping ? 'badge-amber' : 'badge-red';
  const badgeLabel = isMastered ? 'Mastered' : isDeveloping ? 'Developing' : 'Review';

  return (
    <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors bg-white">
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-medium text-slate-900 text-sm leading-tight flex-1">{stat.topic}</h3>
        <span className={`${badgeClass} text-[10px] uppercase font-bold tracking-wider px-2`}>
          {badgeLabel}
        </span>
      </div>
      
      <div className="flex items-end justify-between mb-1.5">
        <span className="text-2xl font-bold text-slate-700 leading-none">{stat.percentage}%</span>
        <span className="text-xs text-slate-400 font-medium">
          {stat.correct}/{stat.total} correct
        </span>
      </div>

      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${barColor}`} 
          style={{ width: `${stat.percentage}%` }}
        />
      </div>
    </div>
  );
}
