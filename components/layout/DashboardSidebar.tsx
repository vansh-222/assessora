// components/layout/DashboardSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  BookOpen,
  LayoutDashboard,
  FileText,
  PlusCircle,
  Map,
  Dumbbell,
  TrendingUp,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  phase2?: boolean;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/assessments', label: 'My Assessments', icon: FileText },
  { href: '/dashboard/create', label: 'Create Assessment', icon: PlusCircle },
  { href: '/dashboard/knowledge-map', label: 'Knowledge Map', icon: Map },
  { href: '/dashboard/practice', label: 'Practice', icon: Dumbbell },
  { href: '/dashboard/progress', label: 'Progress', icon: TrendingUp },
];

interface Props {
  userName?: string | null;
  userEmail?: string | null;
}

export default function DashboardSidebar({ userName, userEmail }: Props) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-60 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col overflow-y-auto">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2 px-5 border-b border-slate-100 flex-shrink-0">
        <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center">
          <BookOpen className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-bold text-slate-900 text-[15px] tracking-tight">Assessora</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-5 px-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          if (item.phase2) {
            return (
              <div
                key={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 cursor-not-allowed"
                title="Coming in Phase 2"
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
                <span className="ml-auto text-[10px] font-medium bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-full">
                  Soon
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-green-50 text-green-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-green-600' : ''}`} />
              {item.label}
            </Link>
          );
        })}

        <div className="pt-2 border-t border-slate-100 mt-2">
          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive('/dashboard/settings')
                ? 'bg-green-50 text-green-700 font-medium'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            Settings
          </Link>
        </div>
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-semibold">
              {(userName || userEmail || 'U')[0].toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{userName || 'Student'}</p>
            <p className="text-xs text-slate-400 truncate">{userEmail}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex-shrink-0 p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
