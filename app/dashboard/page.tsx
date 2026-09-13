// app/dashboard/page.tsx
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { Assessment } from '@/lib/models/Assessment';
import { Attempt } from '@/lib/models/Attempt';
import Link from 'next/link';
import Image from 'next/image';
import {
  PlusCircle,
  FileText,
  Star,
  Target,
  Lightbulb,
  Play,
  FileBox,
  AlertTriangle,
  MousePointerClick,
  RefreshCw,
  Code,
  ArrowRight
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard' };

function formatStudyTime(seconds: number) {
  if (!seconds) return '0h 0m';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(' ')[0] || 'Student';
  const userId = session!.user!.id!;

  await connectDB();

  const [totalAssessments, attempts, recentRaw] = await Promise.all([
    Assessment.countDocuments({ userId }),
    Attempt.find({ userId }).select('percentage weaknesses topicPerformance timeTaken').lean(),
    Assessment.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  const completed = attempts.length;
  const avgScore = completed > 0
    ? Math.round(attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / completed)
    : 0;

  const totalStudyTimeSeconds = attempts.reduce((sum, a) => sum + (a.timeTaken || 0), 0);

  // Aggregate topic performance
  const topicStats: Record<string, { correct: number; total: number }> = {};
  for (const attempt of attempts) {
    if (attempt.topicPerformance) {
      for (const [topic, stats] of Object.entries(attempt.topicPerformance as Record<string, { correct: number; total: number }>)) {
        if (!topicStats[topic]) topicStats[topic] = { correct: 0, total: 0 };
        topicStats[topic].correct += stats.correct;
        topicStats[topic].total += stats.total;
      }
    }
  }

  let conceptsMastered = 0;
  const needsAttentionRaw = [];
  for (const [topic, stats] of Object.entries(topicStats)) {
    if (stats.total > 0) {
      const percentage = Math.round((stats.correct / stats.total) * 100);
      if (percentage >= 80 && stats.total >= 3) {
        conceptsMastered++;
      }
      needsAttentionRaw.push({
        topic,
        score: percentage,
        status: percentage < 60 ? 'Needs Practice' : percentage < 80 ? 'Developing' : 'Strong'
      });
    }
  }
  needsAttentionRaw.sort((a, b) => a.score - b.score);
  const needsAttention = needsAttentionRaw.slice(0, 3);

  const recentAssessments = await Promise.all(
    recentRaw.map(async (a) => {
      const latestAttempt = await Attempt.findOne({ assessmentId: a._id.toString() })
        .sort({ submittedAt: -1 })
        .select('_id percentage')
        .lean();
      return {
        id: a._id.toString(),
        title: a.title,
        subject: a.subject,
        difficulty: a.difficulty,
        questionCount: a.questionCount,
        status: a.status,
        createdAt: a.createdAt.toISOString(),
        score: latestAttempt ? latestAttempt.percentage : null,
        attemptId: latestAttempt ? latestAttempt._id.toString() : null,
      };
    })
  );

  return (
    <div className="animate-fade-in w-full max-w-7xl mx-auto py-4 px-4 sm:px-8">
      
      

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Completed */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between h-[120px]">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-[#Edf5f0] flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#0A3D2C]" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Assessments Completed</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{completed}</div>
            <div className="text-xs font-medium text-emerald-600 mt-0.5">+1 since last week</div>
          </div>
        </div>

        {/* Avg Score */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between h-[120px]">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Star className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Average Score</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{avgScore}%</div>
            <div className="text-xs font-medium text-emerald-600 mt-0.5">+12% since last week</div>
          </div>
        </div>

        {/* Study Time */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between h-[120px]">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
              <Target className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Total Study Time</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{formatStudyTime(totalStudyTimeSeconds)}</div>
            <div className="text-xs font-medium text-emerald-600 mt-0.5">+2h since last week</div>
          </div>
        </div>

        {/* Concepts Mastered */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between h-[120px]">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Concepts Mastered</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{conceptsMastered}</div>
            <div className="text-xs font-medium text-emerald-600 mt-0.5">+4 since last week</div>
          </div>
        </div>

      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Spans 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Continue Learning */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Play className="w-5 h-5 text-[#0A3D2C]" />
              <h2 className="text-lg font-bold text-slate-900">Continue Learning</h2>
            </div>
            <p className="text-sm text-slate-500 mb-4 font-medium">Pick up where you left off or create a new assessment.</p>
            
            <div className="bg-[#F6FAF8] rounded-2xl p-8 border border-slate-100 relative overflow-hidden flex flex-col h-[220px]">
              <div className="relative z-10 max-w-sm">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 text-slate-400">
                  <FileBox className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">No active assessment</h3>
                <p className="text-xs text-slate-500 font-medium mb-6">Start a new assessment to begin your learning journey.</p>
                <Link href="/dashboard/create" className="inline-block bg-[#0A3D2C] hover:bg-[#06281c] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">
                  Create Assessment
                </Link>
              </div>
              
              {/* Illustration Mock */}
              <div className="absolute right-8 bottom-0 w-48 h-32 flex items-end justify-end pointer-events-none">
                <div className="relative w-full h-full flex items-end">
                   {/* Books illustration made with CSS */}
                   <div className="absolute bottom-2 right-4 w-32 h-6 bg-[#B4D3C5] border-2 border-white rounded z-30"></div>
                   <div className="absolute bottom-8 right-8 w-28 h-5 bg-[#75A88F] border-2 border-white rounded z-20"></div>
                   <div className="absolute bottom-12 right-12 w-24 h-6 bg-[#326950] border-2 border-white rounded z-10"></div>
                   
                   {/* Plant illustration */}
                   <svg className="absolute bottom-16 right-16 w-16 h-24 text-[#326950] z-0" viewBox="0 0 100 100" fill="currentColor">
                     <path d="M50,100 Q50,50 30,30 Q50,50 50,20 Q50,50 70,30 Q50,50 50,100" />
                     <ellipse cx="30" cy="30" rx="15" ry="5" transform="rotate(-45 30 30)" />
                     <ellipse cx="70" cy="30" rx="15" ry="5" transform="rotate(45 70 30)" />
                     <ellipse cx="50" cy="15" rx="15" ry="5" transform="rotate(0 50 15)" />
                   </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Assessments Table */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-[#0A3D2C]" />
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex justify-between">
                  Recent Assessments
                </h2>
                <p className="text-sm text-slate-500 font-medium">Your latest assessments and results.</p>
              </div>
              <Link href="/dashboard/assessments" className="ml-auto text-xs font-bold text-[#0A3D2C] hover:text-[#06281c] flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-[11px] font-bold text-slate-400 uppercase px-6 py-4">Assessment Name</th>
                    <th className="text-[11px] font-bold text-slate-400 uppercase px-6 py-4 hidden md:table-cell">Subject</th>
                    <th className="text-[11px] font-bold text-slate-400 uppercase px-6 py-4 hidden sm:table-cell">Date</th>
                    <th className="text-[11px] font-bold text-slate-400 uppercase px-6 py-4">Score</th>
                    <th className="text-[11px] font-bold text-slate-400 uppercase px-6 py-4 hidden md:table-cell">Status</th>
                    <th className="text-[11px] font-bold text-slate-400 uppercase px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentAssessments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-sm text-slate-500">No assessments yet.</td>
                    </tr>
                  )}
                  {recentAssessments.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                           <Code className="w-4 h-4 text-slate-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-900 truncate max-w-[120px] md:max-w-[200px]">{a.title}</span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-sm font-medium text-slate-500">{a.subject}</td>
                      <td className="px-6 py-4 hidden sm:table-cell text-sm font-medium text-slate-500">{formatDate(a.createdAt)}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">{a.score !== null ? `${Math.round(a.score)}%` : '-'}</td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#Edf5f0] text-emerald-700">
                          Completed
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {a.attemptId ? (
                          <Link href={`/dashboard/assessment/${a.id}/results?attempt=${a.attemptId}`} className="text-xs font-bold text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50">
                            View Results
                          </Link>
                        ) : (
                          <Link href={`/dashboard/assessment/${a.id}`} className="text-xs font-bold text-white bg-[#0A3D2C] px-3 py-1.5 rounded-lg hover:bg-[#06281c]">
                            Continue
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Areas Needing Attention */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h2 className="text-base font-bold text-slate-900">Areas Needing Attention</h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mb-6">Focus on these concepts to improve your performance.</p>
            
            <div className="space-y-5">
              {needsAttention.length === 0 ? (
                <p className="text-sm text-slate-500">Not enough data yet.</p>
              ) : (
                needsAttention.map((item, i) => (
                  <div key={item.topic} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      {i === 0 && <MousePointerClick className="w-4 h-4 text-slate-600" />}
                      {i === 1 && <RefreshCw className="w-4 h-4 text-slate-600" />}
                      {i === 2 && <Code className="w-4 h-4 text-slate-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-end mb-1.5">
                        <span className="text-xs font-bold text-slate-900 truncate">{item.topic}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-red-600">{item.score}%</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            item.status === 'Needs Practice' ? 'bg-red-50 text-red-600' :
                            item.status === 'Developing' ? 'bg-amber-50 text-amber-600' :
                            'bg-emerald-50 text-emerald-600'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            item.status === 'Needs Practice' ? 'bg-red-500' :
                            item.status === 'Developing' ? 'bg-amber-500' :
                            'bg-emerald-500'
                          }`}
                          style={{ width: `${item.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Link href="/dashboard/knowledge-map" className="inline-flex items-center gap-1 text-xs font-bold text-[#0A3D2C] mt-6 hover:text-[#06281c]">
              View Knowledge Map <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Recommended Practice */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-slate-700" />
              <h2 className="text-base font-bold text-slate-900">Recommended Practice</h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mb-5">Based on your recent performance.</p>
            
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                 <FileBox className="w-5 h-5 text-slate-600" />
               </div>
               <div className="flex-1 min-w-0">
                 <h4 className="text-sm font-bold text-slate-900 truncate">
                   {needsAttention.length > 0 ? needsAttention[0].topic + ' Fundamentals' : 'General Practice'}
                 </h4>
                 <p className="text-[10px] text-slate-500 font-medium mt-0.5">5 questions • Medium</p>
               </div>
               <button className="bg-[#0A3D2C] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-[#06281c]">
                 Practice Now <ArrowRight className="w-3 h-3" />
               </button>
            </div>

            {needsAttention.length > 0 && (
              <div className="bg-[#Edf5f0] border border-[#d1e8db] rounded-xl p-3 flex gap-2">
                <Lightbulb className="w-4 h-4 text-[#0A3D2C] shrink-0 mt-0.5" />
                <p className="text-[10px] text-[#0A3D2C] font-medium leading-relaxed">
                  <strong>Focus on {needsAttention[0].topic.toLowerCase()} concepts.</strong> You've missed a number of questions in this area.
                </p>
              </div>
            )}
          </div>

        </div>
        
      </div>
    </div>
  );
}
