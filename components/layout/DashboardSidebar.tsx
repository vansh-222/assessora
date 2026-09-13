// components/layout/DashboardSidebar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
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
  Sprout
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
      <Link href="/" className="h-16 flex items-center px-5 border-b border-slate-100 flex-shrink-0">
        <Image src="/logo.png" alt="Assessora" width={120} height={30} className="object-contain" />
      </Link>

      {/* Navigation */}
      <nav className="flex-1 py-5 px-4 space-y-1 overflow-y-auto">
        
        {/* Main Links */}
        <div className="space-y-1 mb-8">
          {navItems.slice(0, 3).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-[#Edf5f0] text-[#0A3D2C]'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-[#0A3D2C]' : ''}`} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Learning Links */}
        <div className="mb-2 px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
          Learning
        </div>
        <div className="space-y-1 mb-8">
          {navItems.slice(3, 6).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-[#Edf5f0] text-[#0A3D2C]'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-[#0A3D2C]' : ''}`} />
                {item.label}
                {item.phase2 && (
                  <span className="ml-auto text-[10px] font-bold bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">
                    Coming Soon
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Settings */}
        <div className="space-y-1">
          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              isActive('/dashboard/settings')
                ? 'bg-[#Edf5f0] text-[#0A3D2C]'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            Settings
          </Link>
        </div>
      </nav>

      {/* Bottom Widget */}
      <div className="p-5 flex-shrink-0">
        <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-slate-100 shadow-sm">
          
          <h4 className="text-sm font-bold text-slate-900 mb-1 leading-tight">Keep Learning,<br/>Keep Growing</h4>
          <p className="text-[10px] text-slate-500 leading-relaxed mt-2 font-medium">Small steps every day make a big difference.</p>
        </div>
      </div>
    </aside>
  );
}
