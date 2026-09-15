// app/api/settings/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { Attempt } from '@/lib/models/Attempt';
import { Assessment } from '@/lib/models/Assessment';
import bcrypt from 'bcryptjs';

/**
 * PUT /api/settings
 *
 * Update profile or change password.
 *
 * Body:
 * { action: 'update-name', name: string }
 *
 * OR
 *
 * {
 *   action: 'change-password',
 *   currentPassword: string,
 *   newPassword: string
 * }
 */
export async function PUT(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    await connectDB();

    // --------------------------------------------------
    // UPDATE NAME
    // --------------------------------------------------
    if (body.action === 'update-name') {
      const name =
        typeof body.name === 'string'
          ? body.name.trim()
          : '';

      if (!name || name.length < 2) {
        return NextResponse.json(
          { error: 'Name must be at least 2 characters.' },
          { status: 400 }
        );
      }

      if (name.length > 50) {
        return NextResponse.json(
          { error: 'Name must be at most 50 characters.' },
          { status: 400 }
        );
      }

      await User.findByIdAndUpdate(
        session.user.id,
        { name }
      );

      return NextResponse.json({
        success: true,
        name,
      });
    }

    // --------------------------------------------------
    // CHANGE PASSWORD
    // --------------------------------------------------
    if (body.action === 'change-password') {
      const { currentPassword, newPassword } = body;

      // Make sure both values are actually strings
      if (
        typeof currentPassword !== 'string' ||
        typeof newPassword !== 'string' ||
        !currentPassword ||
        !newPassword
      ) {
        return NextResponse.json(
          {
            error:
              'Both current and new password are required.',
          },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          {
            error:
              'New password must be at least 6 characters.',
          },
          { status: 400 }
        );
      }

      // Find the current user
      const user = await User.findById(
        session.user.id
      ).select('password');

      if (!user) {
        return NextResponse.json(
          { error: 'User not found.' },
          { status: 404 }
        );
      }

      // Google/OAuth users may not have a password
      if (
        typeof user.password !== 'string' ||
        !user.password
      ) {
        return NextResponse.json(
          {
            error:
              'This account does not have a password set.',
          },
          { status: 400 }
        );
      }

      // Compare current password with stored hash
      const valid = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!valid) {
        return NextResponse.json(
          {
            error:
              'Current password is incorrect.',
          },
          { status: 403 }
        );
      }

      // Hash new password
      const hash = await bcrypt.hash(
        newPassword,
        10
      );

      // Save new password
      await User.findByIdAndUpdate(
        session.user.id,
        { password: hash }
      );

      return NextResponse.json({
        success: true,
      });
    }

    // --------------------------------------------------
    // INVALID ACTION
    // --------------------------------------------------
    return NextResponse.json(
      { error: 'Invalid action.' },
      { status: 400 }
    );
  } catch (err) {
    console.error('[settings/put]', err);

    return NextResponse.json(
      { error: 'Server error.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/settings
 *
 * Export all user data as JSON.
 */
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const userId = session.user.id;

    const [user, assessments, attempts] =
      await Promise.all([
        User.findById(userId)
          .select('name email createdAt')
          .lean(),

        Assessment.find({ userId })
          .select('-analysis.rawText')
          .lean(),

        Attempt.find({ userId }).lean(),
      ]);

    const data = {
      exportedAt: new Date().toISOString(),

      user: {
        name: user?.name,
        email: user?.email,
        memberSince: user?.createdAt,
      },

      assessments: assessments.map((a) => ({
        id: a._id.toString(),
        title: a.title,
        subject: a.subject,
        difficulty: a.difficulty,
        questionCount: a.questionCount,
        createdAt: a.createdAt,
      })),

      attempts: attempts.map((a) => ({
        id: a._id.toString(),
        assessmentId: a.assessmentId,
        score: a.score,
        percentage: a.percentage,
        correct: a.correct,
        incorrect: a.incorrect,
        unanswered: a.unanswered,
        totalQuestions: a.totalQuestions,
        timeTaken: a.timeTaken,
        strengths: a.strengths,
        weaknesses: a.weaknesses,
        bloomPerformance: a.bloomPerformance,
        topicPerformance: a.topicPerformance,
        submittedAt: a.submittedAt,
      })),
    };

    return NextResponse.json(data);
  } catch (err) {
    console.error('[settings/export]', err);

    return NextResponse.json(
      { error: 'Server error.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/settings
 *
 * Delete user account and all associated data.
 */
export async function DELETE() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const userId = session.user.id;

    // Delete all user data
    await Promise.all([
      Attempt.deleteMany({ userId }),
      Assessment.deleteMany({ userId }),
      User.findByIdAndDelete(userId),
    ]);

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error('[settings/delete]', err);

    return NextResponse.json(
      { error: 'Server error.' },
      { status: 500 }
    );
  }
}