'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Download, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/volunteers?status=${statusFilter}&search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.volunteers) setVolunteers(data.volunteers);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchVolunteers();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVolunteers();
  };

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await fetch('/api/admin/volunteers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      await fetchVolunteers();
    } catch (_) {}
    setUpdatingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Volunteer Applications</h1>
          <p className="text-xs text-slate-400">Manage and export volunteer candidate applications.</p>
        </div>

        <a
          href="/api/admin/volunteers?export=true"
          download
          className="inline-flex items-center gap-2 bg-[#023613] hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </a>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800 text-xs">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by name, email, skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none w-full sm:w-64"
          />
          <button type="submit" className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl">
            Search
          </button>
        </form>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none font-bold"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table / Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Skills</th>
                <th className="p-4">Motivation</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500">Loading volunteers...</td>
                </tr>
              ) : volunteers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500">No volunteer applications found.</td>
                </tr>
              ) : (
                volunteers.map((vol) => (
                  <tr key={vol.id} className="hover:bg-slate-800/50">
                    <td className="p-4 font-bold text-white">
                      {vol.name} <br />
                      <span className="text-[10px] text-slate-500 font-normal">Age: {vol.age || 'N/A'} • {vol.occupation || 'N/A'}</span>
                    </td>
                    <td className="p-4">
                      {vol.email} <br />
                      <span className="text-slate-400">{vol.phone}</span>
                    </td>
                    <td className="p-4 text-emerald-400 font-medium">{vol.skills || 'General'}</td>
                    <td className="p-4 max-w-xs truncate">{vol.motivation}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        vol.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        vol.status === 'REJECTED' ? 'bg-red-950 text-red-400 border border-red-800' :
                        'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {vol.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {vol.status === 'APPROVED' ? (
                          <>
                            <span className="px-2.5 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 rounded text-[10px] font-bold flex items-center gap-1 cursor-default">
                              <CheckCircle className="w-3 h-3 text-emerald-400" />
                              <span>Approved</span>
                            </span>
                            <button
                              onClick={() => updateStatus(vol.id, 'REJECTED')}
                              disabled={updatingId === vol.id}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-red-900 text-slate-300 hover:text-white border border-slate-700 hover:border-red-800 rounded text-[10px] font-bold transition-all disabled:opacity-50"
                            >
                              {updatingId === vol.id ? 'Updating...' : 'Reject'}
                            </button>
                          </>
                        ) : vol.status === 'REJECTED' ? (
                          <>
                            <button
                              onClick={() => updateStatus(vol.id, 'APPROVED')}
                              disabled={updatingId === vol.id}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-900 text-slate-300 hover:text-white border border-slate-700 hover:border-emerald-800 rounded text-[10px] font-bold transition-all disabled:opacity-50"
                            >
                              {updatingId === vol.id ? 'Updating...' : 'Approve'}
                            </button>
                            <span className="px-2.5 py-1 bg-red-950/80 text-red-400 border border-red-800/80 rounded text-[10px] font-bold flex items-center gap-1 cursor-default">
                              <XCircle className="w-3 h-3 text-red-400" />
                              <span>Rejected</span>
                            </span>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => updateStatus(vol.id, 'APPROVED')}
                              disabled={updatingId === vol.id}
                              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[10px] font-bold transition-all disabled:opacity-50"
                            >
                              {updatingId === vol.id ? 'Updating...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => updateStatus(vol.id, 'REJECTED')}
                              disabled={updatingId === vol.id}
                              className="px-2.5 py-1 bg-red-700 hover:bg-red-600 text-white rounded text-[10px] font-bold transition-all disabled:opacity-50"
                            >
                              {updatingId === vol.id ? 'Updating...' : 'Reject'}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
