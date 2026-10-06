'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Calendar, Heart, UserCheck, LogOut, FileText, CheckCircle2 } from 'lucide-react';

export default function UserProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/user/status')
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push('/user/login');
        } else {
          setUser(data.user);
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/user/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-xs text-slate-500">
        Loading user account profile...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-10">
      {/* Header Profile Summary */}
      <div className="bg-[#023613] text-white p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-emerald-800 text-white rounded-2xl flex items-center justify-center font-extrabold text-2xl border-2 border-emerald-400">
            {user.name ? user.name.slice(0, 2).toUpperCase() : 'SH'}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">{user.name || 'Safe Hands Beneficiary / Member'}</h1>
            <p className="text-xs text-emerald-200 mt-1">Identifier: {user.identifier}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 bg-emerald-900 hover:bg-emerald-950 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors border border-emerald-700"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Grid: Enrolments, Volunteer Applications, Donations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* My Event Enrolments */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <h2 className="font-extrabold text-base">My Event Enrolments</h2>
          </div>

          {!user.enrolments || user.enrolments.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">No event enrolments yet.</p>
          ) : (
            <div className="space-y-3">
              {user.enrolments.map((en: any) => (
                <div key={en.id} className="p-3.5 bg-[#f7faf6] dark:bg-slate-800 rounded-2xl border border-emerald-100 dark:border-slate-700 text-xs space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white">{en.event?.title || 'NGO Event'}</div>
                  <div className="text-[11px] text-slate-500">Date: {new Date(en.event?.date).toLocaleDateString('en-IN')}</div>
                  <div className="text-[10px] font-bold text-emerald-600 uppercase">{en.status}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Volunteer Applications */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="font-extrabold text-base">Volunteer Applications</h2>
          </div>

          {!user.volunteers || user.volunteers.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">No volunteer applications submitted.</p>
          ) : (
            <div className="space-y-3">
              {user.volunteers.map((vol: any) => (
                <div key={vol.id} className="p-3.5 bg-[#f7faf6] dark:bg-slate-800 rounded-2xl border border-emerald-100 dark:border-slate-700 text-xs space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white">{vol.skills || 'General Volunteering'}</div>
                  <div className="text-[11px] text-slate-500">Submitted: {new Date(vol.createdAt).toLocaleDateString('en-IN')}</div>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    vol.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {vol.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Donation History */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            <Heart className="w-5 h-5 text-red-600" />
            <h2 className="font-extrabold text-base">Donation History & Receipts</h2>
          </div>

          {!user.donations || user.donations.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">No donation history recorded.</p>
          ) : (
            <div className="space-y-3">
              {user.donations.map((don: any) => (
                <div key={don.id} className="p-3.5 bg-[#f7faf6] dark:bg-slate-800 rounded-2xl border border-emerald-100 dark:border-slate-700 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                    <span>Receipt: {don.receiptNo || 'SH-80G'}</span>
                    <span className="text-emerald-600">₹{don.amount}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Date: {new Date(don.createdAt).toLocaleDateString('en-IN')}</div>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    don.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {don.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
