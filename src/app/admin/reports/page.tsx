'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, X } from 'lucide-react';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [year, setYear] = useState('2025-2026');
  const [category, setCategory] = useState('Annual');
  const [pdfUrl, setPdfUrl] = useState('');
  const [fileSize, setFileSize] = useState('2.0 MB');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reports');
      const data = await res.json();
      if (data.reports) setReports(data.reports);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, year, category, pdfUrl, fileSize }),
    });
    setShowModal(false);
    fetchReports();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this report?')) return;
    await fetch(`/api/admin/reports?id=${id}`, { method: 'DELETE' });
    fetchReports();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Annual & Audit Reports</h1>
          <p className="text-xs text-slate-400">Manage viewable and downloadable PDF reports.</p>
        </div>
        <button
          onClick={() => {
            setTitle('');
            setPdfUrl('');
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 bg-[#023613] hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-4 text-center text-xs text-slate-500 py-8">Loading reports...</div>
        ) : reports.map((rep) => (
          <div key={rep.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-md">
            <div className="space-y-2">
              <div className="p-3 bg-emerald-950 text-emerald-400 rounded-xl w-fit">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-white">{rep.title}</h3>
              <p className="text-xs text-slate-400">Year: {rep.year} • {rep.fileSize || 'PDF'}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <a href={rep.pdfUrl} target="_blank" rel="noreferrer" className="text-emerald-400 font-bold hover:underline">View PDF</a>
              <button onClick={() => handleDelete(rep.id)} className="p-1.5 bg-red-950 hover:bg-red-900 text-red-400 rounded">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 max-w-lg w-full rounded-3xl p-6 space-y-4 text-xs text-slate-200">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white">Add PDF Report</h3>
              <button type="button" onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div>
              <label className="block font-semibold mb-1">Report Title *</label>
              <input type="text" required placeholder="e.g. Audit Report 2026" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Financial Year *</label>
                <input type="text" required value={year} onChange={(e) => setYear(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold">
                  <option value="Annual">Annual Report</option>
                  <option value="Audit">Audit Report</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">PDF File URL *</label>
              <input type="url" required placeholder="https://..." value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
            </div>

            <button type="submit" className="w-full bg-[#023613] hover:bg-emerald-900 text-white font-bold py-3 rounded-xl">Save Report</button>
          </form>
        </div>
      )}
    </div>
  );
}
