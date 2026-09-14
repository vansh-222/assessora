// app/dashboard/assessments/page.tsx
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { Assessment } from '@/lib/models/Assessment';
import { Attempt } from '@/lib/models/Attempt';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  PlusCircle, 
  FileText, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  MoreHorizontal,
  Code,
  Dna,
  FlaskConical,
  BookOpen,
  Calculator,
  Globe,
  Plus
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { DeleteAssessmentButton } from './DeleteAssessmentButton';

export const metadata: Metadata = { title: 'My Assessments' };

// Map subjects to specific icons
const getSubjectIcon = (subject: string) => {
  const s = subject.toLowerCase();
  if (s.includes('programming') || s.includes('computer') || s.includes('code')) return Code;
  if (s.includes('biology') || s.includes('life')) return Dna;
  if (s.includes('chemistry') || s.includes('physics') || s.includes('science')) return FlaskConical;
  if (s.includes('math') || s.includes('algebra') || s.includes('calculus')) return Calculator;
  if (s.includes('history') || s.includes('geography')) return Globe;
  return BookOpen; // Default
};

// Helper for the circular progress bar
const CircularProgress = ({ percentage, status }: { percentage: number | null, status: string }) => {
  if (percentage === null || status === 'Not Started') {
    return (
      <div className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center">
        <span className="text-slate-300 font-bold text-xs">--</span>
      </div>
    );
  }

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let color = 'text-emerald-500';
  let bgColor = 'text-emerald-50';
  if (percentage < 60) {
    color = 'text-red-500';
    bgColor = 'text-red-50';
  } else if (percentage < 80) {
    color = 'text-amber-500';
    bgColor = 'text-amber-50';
  }

  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 50 50">
        <circle
          cx="25"
          cy="25"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className={bgColor}
        />
        <circle
          cx="25"
          cy="25"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`${color} transition-all duration-1000 ease-out`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[11px] font-bold text-slate-700">{percentage}%</span>
    </div>
  );
};

export default async function AssessmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const session = await auth();
  const userId = session!.user!.id!;

  await connectDB();

  const assessmentsRaw = await Assessment.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  const attemptsRaw = await Attempt.find({ userId })
    .select('assessmentId percentage')
    .sort({ submittedAt: -1 })
    .lean();

  // Map attempts by assessmentId to get the latest attempt easily
  const attemptMap = new Map();
  for (const attempt of attemptsRaw) {
    if (!attemptMap.has(attempt.assessmentId)) {
      attemptMap.set(attempt.assessmentId, attempt);
    }
  }

  const allAssessments = assessmentsRaw.map((a) => {
    const attempt = attemptMap.get(a._id.toString());
    let mappedStatus = 'Not Started';
    // Any assessment with an attempt is considered Completed for now, as we don't have a strict in-progress attempt state.
    if (a.status === 'completed' || attempt) mappedStatus = 'Completed';

    return {
      id: a._id.toString(),
      title: a.title,
      subject: a.subject,
      questionCount: a.questionCount,
      mappedStatus, // 'Completed', 'In Progress', 'Not Started'
      createdAt: a.createdAt,
      score: attempt ? attempt.percentage : null,
      attemptId: attempt ? attempt._id.toString() : null,
    };
  });

  // Calculate top stats
  const totalAssessments = allAssessments.length;
  const completedAssessments = allAssessments.filter(a => a.mappedStatus === 'Completed');
  const completedCount = completedAssessments.length;
  const completionRate = totalAssessments > 0 ? Math.round((completedCount / totalAssessments) * 100) : 0;
  
  const avgScore = completedCount > 0 
    ? Math.round(completedAssessments.reduce((acc, curr) => acc + (curr.score || 0), 0) / completedCount) 
    : 0;
    
  const bestPerformance = completedCount > 0 
    ? Math.max(...completedAssessments.map(a => a.score || 0)) 
    : 0;

  // Apply Filter
  const resolvedParams = await searchParams;
  const activeFilter = resolvedParams.filter || 'all';
  const filteredAssessments = allAssessments.filter(a => {
    if (activeFilter === 'completed') return a.mappedStatus === 'Completed';
    if (activeFilter === 'in_progress') return a.mappedStatus === 'In Progress';
    if (activeFilter === 'not_started') return a.mappedStatus === 'Not Started';
    return true; // 'all'
  });

  return (
    <div className="animate-fade-in w-full max-w-7xl mx-auto py-4 px-4 sm:px-8">
     

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Assessments */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between h-[120px]">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-[#Edf5f0] flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#0A3D2C]" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Total Assessments</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{totalAssessments}</div>
            <div className="text-xs font-medium text-slate-400 mt-0.5">Created by you</div>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between h-[120px]">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Completed</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{completedCount}</div>
            <div className="text-xs font-medium text-slate-400 mt-0.5">{completionRate}% completion rate</div>
          </div>
        </div>

        {/* Average Score */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between h-[120px]">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Average Score</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{avgScore}%</div>
            <div className="text-xs font-medium text-slate-400 mt-0.5">Across all assessments</div>
          </div>
        </div>

        {/* Best Performance */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between h-[120px]">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Best Performance</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{bestPerformance}%</div>
            <div className="text-xs font-medium text-slate-400 mt-0.5">Highest score achieved</div>
          </div>
        </div>
      </div>

      {/* Filter and Sort Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/dashboard/assessments?filter=all" className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${activeFilter === 'all' ? 'bg-[#0A3D2C] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            All
          </Link>
          <Link href="/dashboard/assessments?filter=completed" className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${activeFilter === 'completed' ? 'bg-[#0A3D2C] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            Completed
          </Link>
          <Link href="/dashboard/assessments?filter=in_progress" className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${activeFilter === 'in_progress' ? 'bg-[#0A3D2C] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            In Progress
          </Link>
          <Link href="/dashboard/assessments?filter=not_started" className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${activeFilter === 'not_started' ? 'bg-[#0A3D2C] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            Not Started
          </Link>
        </div>
        <div className="flex items-center border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-xs font-bold text-slate-600 cursor-pointer shadow-sm">
          Sort by: Newest <span className="ml-2">â–¼</span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredAssessments.map(a => {
          const Icon = getSubjectIcon(a.subject);
          
          return (
            <div key={a.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col h-full hover:shadow-md transition-shadow relative">
              {/* Top Row: Icon & Menu */}
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-emerald-500" />
                </div>
                <DeleteAssessmentButton id={a.id} />
              </div>

              {/* Title & Subject */}
              <div className="mb-4 flex-1">
                <h3 className="text-[15px] font-bold text-slate-900 leading-tight mb-1 line-clamp-2">{a.title}</h3>
                <p className="text-xs font-medium text-slate-500">{a.subject}</p>
              </div>

              {/* Meta Row & Progress */}
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                    <div className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> {a.questionCount} Questions</div>
                    <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {Math.ceil(a.questionCount * 1.5)} mins</div>
                  </div>
                  <div>
                    {a.mappedStatus === 'Completed' ? (
                      <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700">Completed</span>
                    ) : a.mappedStatus === 'In Progress' ? (
                      <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700">In Progress</span>
                    ) : (
                      <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">Not Started</span>
                    )}
                  </div>
                </div>
                <div className="shrink-0">
                  <CircularProgress percentage={a.score} status={a.mappedStatus} />
                </div>
              </div>

              {/* Bottom Row: Date & Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  {formatDate(a.createdAt.toISOString())}
                </div>
                {a.mappedStatus === 'Completed' ? (
                  <Link href={`/dashboard/assessment/${a.id}/results?attempt=${a.attemptId}`} className="text-xs font-bold text-slate-600 border border-slate-200 px-4 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                    View Results
                  </Link>
                ) : a.mappedStatus === 'In Progress' ? (
                  <Link href={`/dashboard/assessment/${a.id}`} className="text-xs font-bold text-emerald-700 border border-emerald-200 bg-emerald-50 px-4 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors">
                    Continue
                  </Link>
                ) : (
                  <Link href={`/dashboard/assessment/${a.id}`} className="text-xs font-bold text-[#0A3D2C] border border-[#0A3D2C] px-4 py-1.5 rounded-lg hover:bg-[#Edf5f0] transition-colors">
                    Start
                  </Link>
                )}
              </div>
            </div>
          );
        })}

        {/* CTA Card */}
        <div className="bg-gradient-to-br from-[#Edf5f0] to-[#d6ece0] rounded-2xl border border-[#c1e2d1] shadow-sm p-8 flex flex-col justify-center items-center text-center h-full min-h-[300px]">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 relative">
             <FileText className="w-8 h-8 text-[#0A3D2C]" />
             <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-[#0A3D2C] rounded-full flex items-center justify-center text-white border-2 border-[#Edf5f0]">
               <Plus className="w-4 h-4" />
             </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Ready for a new challenge?</h3>
          <p className="text-xs text-slate-600 font-medium mb-8 max-w-[200px] leading-relaxed">
            Create a new assessment from your study material and start learning smarter.
          </p>
          <Link href="/dashboard/create" className="flex items-center gap-2 bg-[#0A3D2C] hover:bg-[#06281c] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm w-full justify-center">
            <PlusCircle className="w-4 h-4" />
            Create Assessment
          </Link>
        </div>
      </div>

      {/* Footer Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 pt-6 mt-8">
        <p className="text-xs font-medium text-slate-500 mb-4 sm:mb-0">
          Showing {filteredAssessments.length} of {allAssessments.length} assessments
        </p>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors" disabled>
            &lt;
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0A3D2C] text-white font-bold text-xs transition-colors">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors" disabled>
            &gt;
          </button>
        </div>
      </div>

    </div>
  );
}

