// app/dashboard/settings/page.tsx
import { auth, signOut } from '@/auth';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import type { Metadata } from 'next';
import { 
  LogOut, User as UserIcon, Mail, Calendar, Key, BookOpen, 
  Bell, Globe, Sliders, Moon, Download, ShieldCheck, ChevronRight 
} from 'lucide-react';

export const metadata: Metadata = { title: 'Manage Your Account' };

export default async function SettingsPage() {
  const session = await auth();
  
  await connectDB();
  const user = await User.findById(session!.user!.id!).select('name email createdAt').lean();

  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-16 px-6 md:px-10">
      
      {/* ─── Header Section ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
         
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manage Your Account</h1>
          <p className="text-sm text-slate-500 mt-0.5">Personalize your experience, update your preferences, and keep your account secure.</p>
        </div>
      </div>

      {/* ─── Main Content Grid (Full width without right sidebar, matching user reference) ─── */}
      <div className="space-y-6">

        {/* Row 1: Profile & Account Preferences */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Profile Card */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#046B46] flex items-center justify-center font-bold">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Profile</h2>
                  <p className="text-xs text-slate-400">Update your personal information and profile details.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Name</span>
                    <span className="text-sm font-bold text-slate-800">{user?.name || 'User'}</span>
                  </div>
                  <span className="text-xs font-bold text-[#046B46] cursor-pointer hover:underline">Edit</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email</span>
                    <span className="text-sm font-bold text-slate-800">{user?.email || 'email@example.com'}</span>
                  </div>
                  <span className="text-xs font-bold text-[#046B46] cursor-pointer hover:underline">Edit</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Class / Grade</span>
                    <span className="text-sm font-bold text-slate-800">Class 10</span>
                  </div>
                  <span className="text-xs font-bold text-[#046B46] cursor-pointer hover:underline">Edit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Preferences Card */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#046B46] flex items-center justify-center font-bold">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Account Preferences</h2>
                  <p className="text-xs text-slate-400">Customize how you want to use Assessora.</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { title: 'Notification Settings', desc: 'Manage alerts and reminders', icon: Bell },
                  { title: 'Learning Preferences', desc: 'Set your subject and study goals', icon: BookOpen },
                  { title: 'Language', desc: 'Choose your preferred language', icon: Globe },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 border border-slate-100 cursor-pointer transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-[#046B46] transition-colors">{item.title}</div>
                        <div className="text-[11px] text-slate-400">{item.desc}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Row 2: Study Preferences & Appearance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Study Preferences Card */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#046B46] flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Study Preferences</h2>
                <p className="text-xs text-slate-400">Set your study goals and preferred learning style.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-900 block mb-0.5">Daily Study Goal</span>
                  <span className="text-[11px] text-slate-400">How much time do you want to study daily?</span>
                </div>
                <span className="text-xs font-bold bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">1 hour</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-900 block mb-0.5">Preferred Learning Style</span>
                  <span className="text-[11px] text-slate-400">Choose what helps you learn better.</span>
                </div>
                <span className="text-xs font-bold bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">Conceptual</span>
              </div>
            </div>
          </div>

          {/* Appearance Card */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#046B46] flex items-center justify-center font-bold">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Appearance</h2>
                <p className="text-xs text-slate-400">Choose your preferred theme and display settings.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2">Theme</span>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-2xl border-2 border-[#046B46] bg-emerald-50/50 text-center cursor-pointer">
                    <span className="text-xs font-bold text-[#046B46] block">Light</span>
                  </div>
                  <div className="p-3 rounded-2xl border border-slate-200 text-center cursor-pointer hover:bg-slate-50">
                    <span className="text-xs font-medium text-slate-600 block">Dark</span>
                  </div>
                  <div className="p-3 rounded-2xl border border-slate-200 text-center cursor-pointer hover:bg-slate-50">
                    <span className="text-xs font-medium text-slate-600 block">System</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Row 3: Data & Privacy (Replacing Delete Account with Logout Action) */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#046B46] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Data & Privacy / Account Session</h2>
              <p className="text-xs text-slate-400">Control your data and securely terminate your active session.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Download Your Data</h3>
              <p className="text-xs text-slate-500">Get a copy of your learning stats and assessment history.</p>
              <button className="inline-flex items-center gap-1.5 text-xs font-bold text-[#046B46] bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 rounded-xl transition-colors border border-emerald-100 shadow-sm mt-1">
                <Download className="w-3.5 h-3.5" /> Download Data
              </button>
            </div>

            <div className="space-y-2 md:border-l md:border-slate-100 md:pl-6">
              <h3 className="text-xs font-bold text-red-600 uppercase tracking-wider">Session Control</h3>
              <p className="text-xs text-slate-500">Sign out securely from your current device session.</p>
              
              <form
                action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/login' });
                }}
              >
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-5 py-2.5 rounded-xl transition-colors shadow-sm mt-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Log Out
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}