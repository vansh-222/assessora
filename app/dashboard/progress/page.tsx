// app/dashboard/progress/page.tsx
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { Attempt } from '@/lib/models/Attempt';
import { 
  TrendingUp, Award, Clock, Target, Calendar, 
  ChevronRight, CheckCircle2, Star, Trophy, Sparkles, BookOpen 
} from 'lucide-react';
import { BLOOM_LABELS } from '@/lib/bloom';
import { pct } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Progress Tracker' };

export default async function ProgressPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  await connectDB();
  const attempts = await Attempt.find({ userId }).sort({ createdAt: 1 }).lean();

  const totalAssessments = attempts.length;
  let totalQuestions = 0;
  let totalTimeSeconds = 0;
  let totalCorrect = 0;

  const aggregatedBloom: Record<string, { correct: number; total: number }> = {};
  const subjectMap: Record<string, { correct: number; total: number }> = {};

  const recentScores = attempts.slice(-10).map((a: any, i) => ({
    id: i,
    score: a.percentage,
    date: new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  for (const attempt of attempts) {
    totalQuestions += attempt.totalQuestions || 0;
    totalTimeSeconds += attempt.timeTaken || 0;
    totalCorrect += attempt.score || 0;

    // Aggregate subject performance if available
    const subject = (attempt as any).subject || 'General';
    if (!subjectMap[subject]) subjectMap[subject] = { correct: 0, total: 0 };
    subjectMap[subject].correct += attempt.correct || 0;
    subjectMap[subject].total += attempt.totalQuestions || 0;

    if (attempt.bloomPerformance) {
      for (const [level, stat] of Object.entries(attempt.bloomPerformance)) {
        if (!aggregatedBloom[level]) aggregatedBloom[level] = { correct: 0, total: 0 };
        aggregatedBloom[level].correct += (stat as any).correct || 0;
        aggregatedBloom[level].total += (stat as any).total || 0;
      }
    }
  }

  const averageScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const timeHours = Math.floor(totalTimeSeconds / 3600);
  const timeMinutes = Math.floor((totalTimeSeconds % 3600) / 60);

  const bloomStats = Object.entries(BLOOM_LABELS).map(([level, label]) => {
    const stat = aggregatedBloom[level] || { correct: 0, total: 0 };
    return {
      level,
      label,
      percentage: pct(stat.correct, stat.total),
    };
  });

  const subjectsList = Object.entries(subjectMap).map(([name, stat]) => ({
    name,
    percentage: pct(stat.correct, stat.total),
    ratio: `${stat.correct}/${stat.total}`
  }));

  // Fallback default subjects if none logged yet to match the clean UI look
  const defaultSubjects = subjectsList.length > 0 ? subjectsList : [
    { name: 'Mathematics', percentage: 78, ratio: '7/9' },
    { name: 'Physics', percentage: 64, ratio: '6/9' },
    { name: 'Biology', percentage: 58, ratio: '7/12' },
    { name: 'English', percentage: 83, ratio: '5/7' },
    { name: 'History', percentage: 45, ratio: '4/9' },
    { name: 'Computer Science', percentage: 67, ratio: '6/9' },
  ];

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
          <span>Last 30 Days</span>
          <ChevronRight className="w-4 h-4 text-slate-400 rotate-90 ml-1" />
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
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-0.5">
                <span>↑ 12%</span> <span className="text-slate-400 font-normal">from last 30 days</span>
              </div>
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
            <div className="text-[11px] text-blue-600 font-semibold mt-1 flex items-center gap-0.5">
              <span>↑ 3 more</span> <span className="text-slate-400 font-normal">than last 30 days</span>
            </div>
          </div>
        </div>

        {/* Card 3: Completed */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">{totalAssessments}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
              <span>↑ 4 more</span> <span className="text-slate-400 font-normal">than last 30 days</span>
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
            <div className="text-3xl font-black text-slate-900 tracking-tight">5 days</div>
            <div className="text-[11px] text-amber-600 font-semibold mt-1 flex items-center gap-0.5">
              <span>↑ 2 more</span> <span className="text-slate-400 font-normal">than last 30 days</span>
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
              <h2 className="text-lg font-bold text-slate-900">Your Progress Over Time</h2>
              <div className="bg-slate-100 p-1 rounded-full flex items-center text-xs font-bold">
                <button className="px-4 py-1.5 rounded-full bg-[#046B46] text-white shadow-sm transition-all">Progress</button>
                <button className="px-4 py-1.5 rounded-full text-slate-500 hover:text-slate-800 transition-all">Accuracy</button>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-6">See how your performance is improving across all subjects.</p>
          </div>

          {recentScores.length === 0 ? (
            <div className="text-center py-20 text-slate-400 text-sm">No assessments completed yet. Take an assessment to view trends.</div>
          ) : (
            <div>
              {/* Visual Simulated Line Chart Area matching reference */}
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

            <h3 className="text-lg font-bold mb-1 relative z-10">You&apos;re Doing Great!</h3>
            <p className="text-xs text-emerald-100/80 mb-5 relative z-10 leading-relaxed">
              Your hard work is showing. Keep going and unlock new milestones!
            </p>

            <button className="w-full py-3 bg-white hover:bg-emerald-50 text-[#046B46] font-bold text-xs rounded-xl transition-colors shadow-md relative z-10 flex items-center justify-center gap-1.5">
              View Achievements <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Recent Achievements List Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Recent Achievements</h3>
              <span className="text-xs font-bold text-[#046B46] cursor-pointer hover:underline">View All →</span>
            </div>

            <div className="space-y-4">
              {[
                { title: 'First Assessment', desc: 'Completed your first assessment', date: 'Apr 28, 2025', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { title: 'Improved Accuracy', desc: 'Scored 80%+ in Biology', date: 'May 1, 2025', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
                { title: 'Consistency Star', desc: '5 days learning streak', date: 'May 8, 2025', icon: Trophy, color: 'text-blue-600', bg: 'bg-blue-50' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-[#046B46] transition-colors">{item.title}</div>
                      <div className="text-[10px] text-slate-400">{item.desc}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      

    </div>
  );
}