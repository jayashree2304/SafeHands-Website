import React from 'react';
import { getAdminSession } from '@/lib/security/jwt';
import { prisma } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';
import { Users, Calendar, Heart, BookOpen, ShieldCheck, Activity } from 'lucide-react';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  let volunteerCount = 0;
  let enrolmentCount = 0;
  let donationCount = 0;
  let totalDonations = { _sum: { amount: 0 } };
  let eventCount = 0;
  let recentAudits: any[] = [];

  try {
    volunteerCount = await prisma.volunteer.count();
    enrolmentCount = await prisma.eventEnrolment.count();
    donationCount = await prisma.donation.count({ where: { status: 'SUCCESS' } });
    const agg = await prisma.donation.aggregate({
      where: { status: 'SUCCESS' },
      _sum: { amount: true },
    });
    if (agg) totalDonations = agg as any;
    eventCount = await prisma.event.count({ where: { isDeleted: false } });

    recentAudits = await prisma.auditLog.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { admin: true },
    });
  } catch (_) {
    // Quiet fallback for dashboard metrics if DB query unavailable
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Admin Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Welcome back, {session.username} ({session.role})</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Volunteers</span>
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{volunteerCount}</div>
          <p className="text-[11px] text-emerald-400 font-medium">Registered applications</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Event Enrolments</span>
            <Calendar className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{enrolmentCount}</div>
          <p className="text-[11px] text-emerald-400 font-medium">Confirmed seats</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Donations</span>
            <Heart className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            ₹{(totalDonations._sum?.amount || 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">{donationCount} successful transactions</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Events</span>
            <BookOpen className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{eventCount}</div>
          <p className="text-[11px] text-slate-400">Community campaigns</p>
        </div>
      </div>

      {/* Recent Activity Audit Log Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-base border-b border-slate-800 pb-3">
          <Activity className="w-5 h-5 text-emerald-400" />
          <h2>Recent System Audit Logs</h2>
        </div>

        <div className="space-y-3 text-xs">
          {recentAudits.length === 0 ? (
            <p className="text-slate-500 py-2">No recent audit log entries.</p>
          ) : (
            recentAudits.map((log) => (
              <div key={log.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white">{log.admin?.username || 'Admin'}</span>
                  <span className="text-slate-400 ml-2 font-mono">[{log.action}]</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">{log.details || log.targetType}</p>
                </div>
                <div className="text-right text-[10px] text-slate-500 font-mono">
                  {new Date(log.createdAt).toLocaleString()} <br />
                  {log.ipAddress}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
