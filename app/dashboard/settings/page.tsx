import { auth, signOut } from '@/auth';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import type { Metadata } from 'next';
import { LogOut } from 'lucide-react';

export const metadata: Metadata = { title: 'Settings' };

export default async function SettingsPage() {
  const session = await auth();
  
  await connectDB();
  const user = await User.findById(session!.user!.id!).select('name email createdAt').lean();

  return (
    <div className="animate-fade-in max-w-lg">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account information.</p>
      </div>

      <div className="card p-6 space-y-5">
        <div>
          <label className="label">Full Name</label>
          <input
            type="text"
            defaultValue={user?.name || ''}
            className="input"
            readOnly
          />
        </div>
        <div>
          <label className="label">Email Address</label>
          <input
            type="email"
            defaultValue={user?.email || ''}
            className="input"
            readOnly
          />
        </div>
        <div className="divider" />
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
          <p className="text-xs text-slate-500">
            Member since{' '}
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
          <p className="text-xs text-amber-700 font-medium mb-1">Groq API Key</p>
          <p className="text-xs text-amber-600">
            Configure your key in <code className="font-mono bg-amber-100 px-1 rounded">.env.local</code> as{' '}
            <code className="font-mono bg-amber-100 px-1 rounded">GROQ_API_KEY=your_key</code>
          </p>
        </div>

        <div className="divider" />
        
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/login' });
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-colors shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
