// app/dashboard/progress/page.tsx
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { Attempt } from '@/lib/models/Attempt';
import { Assessment } from '@/lib/models/Assessment';
import {
  TrendingUp, TrendingDown, Award, Clock, Target, Calendar,
  ChevronRight, CheckCircle2, Star, Trophy, Sparkles, BookOpen,
  Minus, Zap, Brain
} from 'lucide-react';
import { BLOOM_LABELS } from '@/lib/bloom';
import { pct } from '@/lib/utils';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Progress Tracker' };

/* ────────────────────────── helpers ────────────────────────── */

/** Compute consecutive days with ≥1 attempt counting backwards from today */
function computeStreak(attempts: { createdAt: Date | string }[]): number {
  if (attempts.length === 0) return 0;

  const daySet = new Set<string>();
  for (const a of attempts) {
    const d = new Date(a.createdAt);
    daySet.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
  }

  let streak = 0;
  const cursor = new Date();
  // Check today first
  const todayKey = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
  if (!daySet.has(todayKey)) {
    // If no activity today, start checking from yesterday
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    if (daySet.has(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

/** Format a delta as "+N" or "−N" or "0" */
function formatDelta(value: number): string {
  if (value > 0) return `+${value}`;
  if (value < 0) return `${value}`;
  return '0';
}

/* ────────────────────────── page ────────────────────────── */

export default async function ProgressPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  await connectDB();

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Fetch ALL user attempts (sorted chronologically) + assessments for subject lookup
  const [allAttempts, assessments] = await Promise.all([
    Attempt.find({ userId }).sort({ createdAt: 1 }).lean(),
    Assessment.find({ userId }).select('_id subject').lean(),
  ]);

  // Build assessment subject lookup
  const subjectByAssessmentId: Record<string, string> = {};
  for (const a of assessments) {
    subjectByAssessmentId[a._id.toString()] = a.subject || 'General';
  }

  // ─── Split into time periods ───
  const recentAttempts = allAttempts.filter(a => new Date(a.createdAt) >= thirtyDaysAgo);
  const priorAttempts = allAttempts.filter(a => {
    const d = new Date(a.createdAt);
    return d >= sixtyDaysAgo && d < thirtyDaysAgo;
  });

  // ─── Aggregate totals ───
  const totalAssessments = allAttempts.length;
  let totalQuestions = 0;
  let totalCorrect = 0;
  let totalTimeSeconds = 0;

  const aggregatedBloom: Record<string, { correct: number; total: number }> = {};
  const topicMap: Record<string, { correct: number; total: number }> = {};

  for (const attempt of allAttempts) {
    totalQuestions += attempt.totalQuestions || 0;
    totalCorrect += attempt.correct || 0;
    totalTimeSeconds += attempt.timeTaken || 0;

    // Aggregate bloom performance
    if (attempt.bloomPerformance) {
      for (const [level, stat] of Object.entries(attempt.bloomPerformance)) {
        if (!aggregatedBloom[level]) aggregatedBloom[level] = { correct: 0, total: 0 };
        aggregatedBloom[level].correct += (stat as any).correct || 0;
        aggregatedBloom[level].total += (stat as any).total || 0;
      }
    }

    // Aggregate topic performance
    if (attempt.topicPerformance) {
      for (const [topic, stat] of Object.entries(attempt.topicPerformance)) {
        if (!topicMap[topic]) topicMap[topic] = { correct: 0, total: 0 };
        topicMap[topic].correct += (stat as any).correct || 0;
        topicMap[topic].total += (stat as any).total || 0;
      }
    }
  }

  const averageScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // ─── 30-day comparison stats ───
  const recentAvg = recentAttempts.length > 0
    ? Math.round(recentAttempts.reduce((s, a) => s + (a.percentage || 0), 0) / recentAttempts.length)
    : 0;
  const priorAvg = priorAttempts.length > 0
    ? Math.round(priorAttempts.reduce((s, a) => s + (a.percentage || 0), 0) / priorAttempts.length)
    : 0;
  const scoreDelta = recentAttempts.length > 0 && priorAttempts.length > 0
    ? recentAvg - priorAvg
    : 0;

  const assessmentDelta = recentAttempts.length - priorAttempts.length;

  // ─── Study streak ───
  const streak = computeStreak(allAttempts as any);

  // ─── Study time ───
  const timeHours = Math.floor(totalTimeSeconds / 3600);
  const timeMinutes = Math.floor((totalTimeSeconds % 3600) / 60);

  // ─── Bloom stats ───
  const bloomStats = Object.entries(BLOOM_LABELS).map(([level, label]) => {
    const stat = aggregatedBloom[level] || { correct: 0, total: 0 };
    return {
      level,
      label,
      correct: stat.correct,
      total: stat.total,
      percentage: pct(stat.correct, stat.total),
    };
  }).filter(b => b.total > 0); // Only show levels with data

  // ─── Topic stats (from topicPerformance, NOT from subject) ───
  const topicStats = Object.entries(topicMap)
    .map(([name, stat]) => ({
      name,
      percentage: pct(stat.correct, stat.total),
      ratio: `${stat.correct}/${stat.total}`,
      correct: stat.correct,
      total: stat.total,
    }))
    .sort((a, b) => b.total - a.total); // Sort by most questions attempted

  // ─── Recent scores for chart ───
  const recentScores = allAttempts.slice(-10).map((a: any, i) => ({
    id: i,
    score: Math.round(a.percentage || 0),
    date: new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  // ─── Dynamic achievements ───
  interface Achievement {
    title: string;
    desc: string;
    date: string;
    icon: typeof CheckCircle2;
    color: string;
    bg: string;
  }

  const achievements: Achievement[] = [];

  // First Assessment
  if (allAttempts.length >= 1) {
    achievements.push({
      title: 'First Assessment',
      desc: 'Completed your first assessment',
      date: new Date(allAttempts[0].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    });
  }

  // High Scorer — first attempt with ≥80%
  const highScoreAttempt = allAttempts.find(a => (a.percentage || 0) >= 80);
  if (highScoreAttempt) {
    achievements.push({
      title: 'High Scorer',
      desc: 'Scored 80%+ on an assessment',
      date: new Date(highScoreAttempt.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      icon: Star,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    });
  }

  // Consistency Star — streak ≥ 3
  if (streak >= 3) {
    achievements.push({
      title: 'Consistency Star',
      desc: `${streak}-day learning streak`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      icon: Trophy,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    });
  }

  // Topic Master — any topic with ≥90% and ≥3 questions
  const masteredTopic = topicStats.find(t => t.percentage >= 90 && t.total >= 3);
  if (masteredTopic) {
    achievements.push({
      title: 'Topic Master',
      desc: `${masteredTopic.percentage}% accuracy in ${masteredTopic.name}`,
      date: 'Ongoing',
      icon: Brain,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    });
  }

  // Quick Learner — completed ≥5 assessments
  if (allAttempts.length >= 5) {
    achievements.push({
      title: 'Quick Learner',
      desc: `Completed ${allAttempts.length} assessments`,
      date: new Date(allAttempts[4].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      icon: Zap,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    });
  }

  // ─── Bloom color map for bars ───
  const bloomBarColors: Record<string, string> = {
    recall: '#0ea5e9',
    understand: '#8b5cf6',
    apply: '#10b981',
    codeTrace: '#f97316',
    analyze: '#f43f5e',
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto pb-10 px-5 md:px-8">

      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] font-bold text-[#046B46] uppercase tracking-[0.2em] mb-1 before:content-[''] before:block before:w-6 before:h-[1px] before:bg-[#046B46]">
            Progress
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Learning Progress</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track your growth, celebrate milestones, and see where to focus next.</p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200/80 px-4 py-2 rounded-xl shadow-sm text-xs font-bold text-slate-700">
          <Calendar className="w-4 h-4 text-[#046B46]" />
          <span>{totalAssessments} Total Assessments</span>
        </div>
      </div>

      {/* ─── 4 Top Stat Cards Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        {/* Card 1: Overall Progress */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Progress</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#046B46] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Circular Progress Gauge */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-100" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-[#046B46]" strokeDasharray={`${averageScore}, 100`} strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <span className="absolute text-xs font-black text-slate-900">{averageScore}%</span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">{averageScore}%</div>
              {scoreDelta !== 0 ? (
                <div className={`text-[11px] font-semibold mt-0.5 flex items-center gap-0.5 ${scoreDelta > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {scoreDelta > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{formatDelta(scoreDelta)}%</span> <span className="text-slate-400 font-normal">vs prior 30 days</span>
                </div>
              ) : (
                <div className="text-[11px] text-slate-400 font-normal mt-0.5 flex items-center gap-0.5">
                  <Minus className="w-3 h-3" /> Avg accuracy
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Total Assessments */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Assessments</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">{totalAssessments}</div>
            {assessmentDelta !== 0 ? (
              <div className={`text-[11px] font-semibold mt-1 flex items-center gap-0.5 ${assessmentDelta > 0 ? 'text-blue-600' : 'text-red-500'}`}>
                {assessmentDelta > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{formatDelta(assessmentDelta)}</span> <span className="text-slate-400 font-normal">vs prior 30 days</span>
              </div>
            ) : (
              <div className="text-[11px] text-slate-400 font-normal mt-1 flex items-center gap-0.5">
                <Minus className="w-3 h-3" /> All time
              </div>
            )}
          </div>
        </div>

        {/* Card 3: Questions Answered */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Questions Answered</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">{totalQuestions}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
              <span>{totalCorrect} correct</span> <span className="text-slate-400 font-normal">({totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0}% accuracy)</span>
            </div>
          </div>
        </div>

        {/* Card 4: Study Streak */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Study Streak</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">{streak} day{streak !== 1 ? 's' : ''}</div>
            <div className="text-[11px] text-amber-600 font-semibold mt-1 flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              <span>{timeHours}h {timeMinutes}m</span> <span className="text-slate-400 font-normal">total study time</span>
            </div>
          </div>
        </div>

      </div>

      {/* ─── Main Content Grid (Chart + Right Side Achievements) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

        {/* Left 2 Cols: Progress Over Time Chart */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
              <h2 className="text-lg font-bold text-slate-900">Score Trend</h2>
              <span className="text-xs font-bold text-slate-400">Last {recentScores.length} assessment{recentScores.length !== 1 ? 's' : ''}</span>
            </div>
            <p className="text-xs text-slate-400 mb-6">See how your performance is improving across assessments.</p>
          </div>

          {recentScores.length === 0 ? (
            <div className="text-center py-20 text-slate-400 text-sm">No assessments completed yet. Take an assessment to view trends.</div>
          ) : (
            <div>
              {/* Visual Simulated Line Chart Area */}
              <div className="h-64 relative flex items-end pt-6 pb-2 border-b border-slate-100">

                {/* Horizontal Grid lines */}
                <div className="absolute inset-x-0 top-6 bottom-2 flex flex-col justify-between pointer-events-none opacity-40">
                  <div className="border-b border-dashed border-slate-200 w-full text-[10px] text-slate-400 flex justify-between"><span>100%</span></div>
                  <div className="border-b border-dashed border-slate-200 w-full text-[10px] text-slate-400 flex justify-between"><span>75%</span></div>
                  <div className="border-b border-dashed border-slate-200 w-full text-[10px] text-slate-400 flex justify-between"><span>50%</span></div>
                  <div className="border-b border-dashed border-slate-200 w-full text-[10px] text-slate-400 flex justify-between"><span>25%</span></div>
                  <div className="border-b border-slate-200 w-full text-[10px] text-slate-400"><span>0%</span></div>
                </div>

                {/* SVG Curve Connecting Points */}
                <div className="absolute inset-x-8 top-10 bottom-6 pointer-events-none">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#046B46" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#046B46" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d={`M ${recentScores.map((s, i) => `${(i / (Math.max(recentScores.length - 1, 1))) * 100}, ${100 - s.score}`).join(' L ')} L 100 100 L 0 100 Z`}
                      fill="url(#chartGradient)"
                    />
                    <path
                      d={`M ${recentScores.map((s, i) => `${(i / (Math.max(recentScores.length - 1, 1))) * 100}, ${100 - s.score}`).join(' L ')}`}
                      fill="none"
                      stroke="#046B46"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Data Points / Nodes */}
                <div className="w-full flex justify-between relative z-10 px-4">
                  {recentScores.map((score, i) => (
                    <div key={i} className="flex flex-col items-center group relative cursor-pointer" style={{ bottom: `${score.score * 1.6}px` }}>
                      {/* Tooltip on hover */}
                      <div className="absolute -top-10 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
                        {score.score}% ({score.date})
                      </div>
                      <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-[#046B46] shadow-sm group-hover:scale-125 transition-transform" />
                    </div>
                  ))}
                </div>
              </div>

              {/* X-Axis Labels */}
              <div className="flex justify-between text-[11px] font-bold text-slate-400 pt-3">
                {recentScores.map((score, i) => (
                  <span key={i}>{score.date}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Banner + Recent Achievements */}
        <div className="space-y-6 flex flex-col">

          {/* Motivational Banner Card */}
          <div className="rounded-3xl bg-gradient-to-br from-[#046B46] to-[#023522] text-white p-6 relative overflow-hidden shadow-lg">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-emerald-300">
                <Trophy className="w-5 h-5" />
              </div>
              <Sparkles className="w-5 h-5 text-emerald-300 animate-pulse" />
            </div>

            <h3 className="text-lg font-bold mb-1 relative z-10">
              {averageScore >= 80 ? 'Outstanding Work!' : averageScore >= 60 ? 'You\'re Doing Great!' : averageScore >= 40 ? 'Keep Pushing!' : totalAssessments > 0 ? 'Every Step Counts!' : 'Start Your Journey!'}
            </h3>
            <p className="text-xs text-emerald-100/80 mb-5 relative z-10 leading-relaxed">
              {totalAssessments > 0
                ? `You've completed ${totalAssessments} assessment${totalAssessments > 1 ? 's' : ''} with an average score of ${averageScore}%. ${streak > 0 ? `${streak}-day streak going strong!` : 'Start a streak by practicing daily!'}`
                : 'Take your first assessment to start tracking your learning progress!'}
            </p>

            <Link href="/dashboard/create" className="w-full py-3 bg-white hover:bg-emerald-50 text-[#046B46] font-bold text-xs rounded-xl transition-colors shadow-md relative z-10 flex items-center justify-center gap-1.5">
              {totalAssessments > 0 ? 'Create New Assessment' : 'Get Started'} <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Recent Achievements List Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Achievements</h3>
              <span className="text-[10px] font-bold text-slate-400">{achievements.length} earned</span>
            </div>

            {achievements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center mb-3">
                  <Trophy className="w-5 h-5 text-slate-300" />
                </div>
                <p className="text-xs text-slate-400">Complete assessments to earn achievements</p>
              </div>
            ) : (
              <div className="space-y-4">
                {achievements.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{item.title}</div>
                        <div className="text-[10px] text-slate-400">{item.desc}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-300 font-medium shrink-0">{item.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* ─── Bottom Section: Topics + Bloom Performance ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Topic Performance */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Topic Performance</h2>
              <p className="text-xs text-slate-400 mt-0.5">Accuracy across all topics you&apos;ve been assessed on.</p>
            </div>
            <Target className="w-5 h-5 text-slate-300" />
          </div>

          {topicStats.length === 0 ? (
            <div className="text-center py-10 text-sm text-slate-400">
              No topic data yet. Complete an assessment to see your topic breakdown.
            </div>
          ) : (
            <div className="space-y-4">
              {topicStats.slice(0, 8).map((topic) => (
                <div key={topic.name} className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-slate-700 truncate max-w-[200px]">{topic.name}</span>
                    <span className="text-xs font-bold text-slate-500">
                      {topic.ratio} <span className="text-slate-300 font-normal">({topic.percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${topic.percentage}%`,
                        backgroundColor: topic.percentage >= 80 ? '#10b981' : topic.percentage >= 60 ? '#046B46' : topic.percentage >= 40 ? '#f59e0b' : '#ef4444',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bloom's Taxonomy Breakdown */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Bloom&apos;s Taxonomy</h2>
              <p className="text-xs text-slate-400 mt-0.5">Performance by cognitive skill level.</p>
            </div>
            <Brain className="w-5 h-5 text-slate-300" />
          </div>

          {bloomStats.length === 0 ? (
            <div className="text-center py-10 text-sm text-slate-400">
              No bloom data yet. Complete an assessment to see your cognitive skills breakdown.
            </div>
          ) : (
            <div className="space-y-4">
              {bloomStats.map((bloom) => (
                <div key={bloom.level} className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-slate-700">{bloom.label}</span>
                    <span className="text-xs font-bold text-slate-500">
                      {bloom.correct}/{bloom.total} <span className="text-slate-300 font-normal">({bloom.percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${bloom.percentage}%`,
                        backgroundColor: bloomBarColors[bloom.level] || '#046B46',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}