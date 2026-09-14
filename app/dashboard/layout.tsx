// app/dashboard/layout.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import DashboardTopBar from '@/components/layout/DashboardTopBar';
import { DashboardAssistantWrapper } from '@/components/assistant/DashboardAssistantWrapper';
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
      <DashboardSidebar
        userName={session.user.name}
        userEmail={session.user.email}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardTopBar userName={session.user.name} />
        <main className="flex-1 overflow-y-auto">
          <div className="w-full h-full">
            {children}
          </div>
        </main>
      </div>
      <DashboardAssistantWrapper
        userName={session.user.name}
        userEmail={session.user.email}
      />
    </div>
  );
}
