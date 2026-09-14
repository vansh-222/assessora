'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon, Mail, Calendar, Key, BookOpen,
  LogOut, Download, Trash2, ShieldCheck, CheckCircle2,
  Loader2, AlertCircle, Clock, FileText, Pencil, X, Save
} from 'lucide-react';

interface SettingsData {
  name: string;
  email: string;
  memberSince: string;
  totalAssessments: number;
  totalAttempts: number;
  totalStudyMinutes: number;
}

export function SettingsClient({ data, signOutAction }: { data: SettingsData; signOutAction: () => Promise<void> }) {
  const router = useRouter();

  // Profile edit state
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(data.name);
  const [nameSaving, setNameSaving] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Export state
  const [exporting, setExporting] = useState(false);

  // General error/status
  const [error, setError] = useState('');

  const handleSaveName = async () => {
    const trimmed = nameValue.trim();
    if (!trimmed || trimmed.length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    setNameSaving(true);
    setError('');
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update-name', name: trimmed }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed to update name.');
      setNameValue(d.name);
      setEditingName(false);
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setNameSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setError('');
    if (!currentPassword || !newPassword) {
      setError('Please fill in all password fields.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    setPasswordSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'change-password', currentPassword, newPassword }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed to change password.');
      setPasswordSuccess(true);
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleExportData = async () => {
    setExporting(true);
    setError('');
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('Failed to export data.');
      const d = await res.json();
      const blob = new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `assessora-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setError('');
    try {
      const res = await fetch('/api/settings', { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete account.');
      // Sign out after deletion
      await signOutAction();
    } catch (e: any) {
      setError(e.message);
      setDeleting(false);
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-16 px-6 md:px-10">

      {/* ─── Header ─── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manage Your Account</h1>
        <p className="text-sm text-slate-500 mt-0.5">Personalize your experience and keep your account secure.</p>
      </div>

      {/* ─── Error Banner ─── */}
      {error && (
        <div className="mb-6 flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ─── Success Banners ─── */}
      {nameSuccess && (
        <div className="mb-6 flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-sm text-emerald-700">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Name updated successfully.</span>
        </div>
      )}
      {passwordSuccess && (
        <div className="mb-6 flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-sm text-emerald-700">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Password changed successfully.</span>
        </div>
      )}

      <div className="space-y-6">

        {/* ══════ Row 1: Profile + Account Stats ══════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Profile Card */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#046B46] flex items-center justify-center">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Profile</h2>
                <p className="text-xs text-slate-400">Your personal information.</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Name</span>
                  {editingName ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={nameValue}
                        onChange={e => setNameValue(e.target.value)}
                        className="text-sm font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                        autoFocus
                        onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') { setEditingName(false); setNameValue(data.name); } }}
                      />
                      <button onClick={handleSaveName} disabled={nameSaving} className="p-1.5 rounded-lg bg-[#046B46] text-white hover:bg-[#035437] disabled:opacity-50">
                        {nameSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => { setEditingName(false); setNameValue(data.name); }} className="p-1.5 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-slate-800">{nameValue}</span>
                  )}
                </div>
                {!editingName && (
                  <button onClick={() => setEditingName(true)} className="flex items-center gap-1 text-xs font-bold text-[#046B46] hover:underline">
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                )}
              </div>

              {/* Email */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email</span>
                  <span className="text-sm font-bold text-slate-800">{data.email}</span>
                </div>
                <Mail className="w-4 h-4 text-slate-300" />
              </div>

              {/* Member Since */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Member Since</span>
                  <span className="text-sm font-bold text-slate-800">{formatDate(data.memberSince)}</span>
                </div>
                <Calendar className="w-4 h-4 text-slate-300" />
              </div>
            </div>
          </div>

          {/* Account Stats Card */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#046B46] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Account Overview</h2>
                <p className="text-xs text-slate-400">Your learning activity at a glance.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Assessments</span>
                    <span className="text-sm font-bold text-slate-800">{data.totalAssessments}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Attempts Completed</span>
                    <span className="text-sm font-bold text-slate-800">{data.totalAttempts}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Study Time</span>
                    <span className="text-sm font-bold text-slate-800">
                      {Math.floor(data.totalStudyMinutes / 60)}h {data.totalStudyMinutes % 60}m
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════ Row 2: Password + Data & Privacy ══════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Change Password Card */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#046B46] flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Security</h2>
                <p className="text-xs text-slate-400">Keep your account secure.</p>
              </div>
            </div>

            {!showPasswordForm ? (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-900 block mb-0.5">Password</span>
                  <span className="text-[11px] text-slate-400">••••••••</span>
                </div>
                <button
                  onClick={() => { setShowPasswordForm(true); setError(''); }}
                  className="text-xs font-bold text-[#046B46] hover:underline"
                >
                  Change Password
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                    placeholder="Min 6 characters"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                    placeholder="Re-enter new password"
                  />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleChangePassword}
                    disabled={passwordSaving}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#046B46] hover:bg-[#035437] px-5 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                  >
                    {passwordSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
                    Update Password
                  </button>
                  <button
                    onClick={() => { setShowPasswordForm(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); setError(''); }}
                    className="text-xs font-bold text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Data & Privacy Card */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#046B46] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Data & Privacy</h2>
                <p className="text-xs text-slate-400">Control your data and account.</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Export Data */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-900 block mb-0.5">Download Your Data</span>
                  <span className="text-[11px] text-slate-400">Export assessments and results as JSON.</span>
                </div>
                <button
                  onClick={handleExportData}
                  disabled={exporting}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#046B46] bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-colors border border-emerald-100 disabled:opacity-50"
                >
                  {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  Export
                </button>
              </div>

              {/* Sign Out */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-900 block mb-0.5">Sign Out</span>
                  <span className="text-[11px] text-slate-400">End your current session.</span>
                </div>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-slate-700 hover:bg-slate-800 px-4 py-2 rounded-xl transition-colors shadow-sm"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Log Out
                  </button>
                </form>
              </div>

              {/* Delete Account */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-red-50/50 border border-red-100">
                <div>
                  <span className="text-xs font-bold text-red-700 block mb-0.5">Delete Account</span>
                  <span className="text-[11px] text-red-400">Permanently delete your account and all data.</span>
                </div>
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-colors border border-red-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleting}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                    >
                      {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      Confirm
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-700 px-3 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
