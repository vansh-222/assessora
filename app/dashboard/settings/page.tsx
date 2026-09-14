// app/dashboard/settings/page.tsx
import { auth, signOut } from '@/auth';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { Assessment } from '@/lib/models/Assessment';
import { Attempt } from '@/lib/models/Attempt';
import { SettingsClient } from './SettingsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Manage Your Account' };

export default async function SettingsPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  await connectDB();

  const [user, totalAssessments, attempts] = await Promise.all([
    User.findById(userId).select('name email createdAt').lean(),
    Assessment.countDocuments({ userId }),
    Attempt.find({ userId }).select('timeTaken').lean(),
  ]);

  const totalAttempts = attempts.length;
  const totalStudySeconds = attempts.reduce((sum, a) => sum + (a.timeTaken || 0), 0);
  const totalStudyMinutes = Math.round(totalStudySeconds / 60);

  const data = {
    name: user?.name || 'User',
    email: user?.email || '',
    memberSince: user?.createdAt ? user.createdAt.toISOString() : new Date().toISOString(),
    totalAssessments,
    totalAttempts,
    totalStudyMinutes,
  };

  async function handleSignOut() {
    'use server';
    await signOut({ redirectTo: '/login' });
  }

  return <SettingsClient data={data} signOutAction={handleSignOut} />;
}