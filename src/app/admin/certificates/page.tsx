'use client';

import React, { useState, useEffect } from 'react';
import { Award, Plus, Trash2, X } from 'lucide-react';

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('12A');
  const [issuingBody, setIssuingBody] = useState('Income Tax Dept, Govt of India');
  const [year, setYear] = useState('Statutory');

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/certificates');
      const data = await res.json();
      if (data.certificates) setCertificates(data.certificates);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/certificates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category, issuingBody, year }),
    });
    setShowModal(false);
    fetchCertificates();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete certificate?')) return;
    await fetch(`/api/admin/certificates?id=${id}`, { method: 'DELETE' });
    fetchCertificates();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Certified Organisation (12A, 80G, CSR, FCRA)</h1>
          <p className="text-xs text-slate-400">Manage statutory non-profit registration certificates.</p>
        </div>
        <button
          onClick={() => {
            setName('');
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 bg-[#023613] hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certificate</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-4 text-center text-xs text-slate-500 py-8">Loading certificates...</div>
        ) : certificates.map((cert) => (
          <div key={cert.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-md">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
                {cert.category}
              </span>
              <h3 className="font-extrabold text-base text-white">{cert.name}</h3>
              <p className="text-xs text-slate-400">{cert.issuingBody} • {cert.year}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end text-xs">
              <button onClick={() => handleDelete(cert.id)} className="p-1.5 bg-red-950 hover:bg-red-900 text-red-400 rounded">
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
              <h3 className="font-extrabold text-base text-white">Add Certificate</h3>
              <button type="button" onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div>
              <label className="block font-semibold mb-1">Certificate Name *</label>
              <input type="text" required placeholder="e.g. 80-G Registration" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Category *</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold">
                  <option value="12A">12A</option>
                  <option value="80G">80G</option>
                  <option value="CSR">CSR</option>
                  <option value="FCRA">FCRA</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Status / Year</label>
                <input type="text" value={year} onChange={(e) => setYear(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Issuing Body</label>
              <input type="text" value={issuingBody} onChange={(e) => setIssuingBody(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
            </div>

            <button type="submit" className="w-full bg-[#023613] hover:bg-emerald-900 text-white font-bold py-3 rounded-xl">Save Certificate</button>
          </form>
        </div>
      )}
    </div>
  );
}
