// app/dashboard/layout.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import DashboardTopBar from '@/components/layout/DashboardTopBar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Dashboard',
    template: '%s | Assessora',
  },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F9FAFB] font-sans selection:bg-emerald-200">
      {/* Sidebar */}
      <DashboardSidebar
        userName={session.user.name}
        userEmail={session.user.email}
      />

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Navigation Bar */}
        <DashboardTopBar userName={session.user.name} />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="w-full h-full">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  );
}
