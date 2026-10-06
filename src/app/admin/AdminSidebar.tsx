'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Calendar, FileText, Award, Inbox, Settings, LogOut, Shield } from 'lucide-react';
import { AdminSessionPayload } from '@/lib/security/jwt';

export default function AdminSidebar({ session }: { session: AdminSessionPayload }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return null;
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/volunteers', label: 'Volunteer Listing', icon: Users },
    { href: '/admin/events', label: 'Events & Roster', icon: Calendar },
    { href: '/admin/reports', label: 'Annual Reports', icon: FileText },
    { href: '/admin/certificates', label: 'Certificates (12A/80G)', icon: Award },
    { href: '/admin/messages', label: 'Contact Inbox', icon: Inbox },
    { href: '/admin/settings', label: 'Settings & Audit Log', icon: Settings },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-white">Safe Hands</h2>
            <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">{session.role}</p>
          </div>
        </div>

        <nav className="space-y-1 text-xs font-semibold">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-emerald-950 text-emerald-400 font-bold border border-emerald-800/60'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-slate-800 text-xs">
        <div className="text-[11px] text-slate-400 mb-2">
          Signed in as <strong className="text-white">{session.username}</strong>
        </div>
        <a
          href="/api/auth/admin/logout"
          className="flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out Admin</span>
        </a>
      </div>
    </aside>
  );
}
