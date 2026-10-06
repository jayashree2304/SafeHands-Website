'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';

export default function DataDeletionPage() {
  const [identifier, setIdentifier] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-950 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
          <Trash2 className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Data Deletion Request (India DPDP Act)
        </h1>
        <p className="text-xs text-slate-500">
          In accordance with the Digital Personal Data Protection Act 2023, you may request complete erasure of your registered data.
        </p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 p-6 rounded-3xl text-center space-y-3 text-xs">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h2 className="font-bold text-slate-900 dark:text-white text-base">Request Submitted Successfully</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Our Data Protection Officer will process your request for <strong>{identifier}</strong> and purge all non-statutory records within 7 business days.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Registered Phone (+91) or Email Address *
            </label>
            <input
              type="text"
              required
              placeholder="Enter your registered mobile or email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Reason for Erasure Request (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Provide any additional details..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl text-xs transition-colors shadow-md"
          >
            Submit Data Erasure Request
          </button>
        </form>
      )}
    </div>
  );
}
