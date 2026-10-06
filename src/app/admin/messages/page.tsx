'use client';

import React, { useState, useEffect } from 'react';
import { Inbox, CheckCircle, Mail, Phone, Calendar } from 'lucide-react';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/messages');
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markStatus = async (id: string, newStatus: string) => {
    await fetch('/api/admin/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
    fetchMessages();
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white">Contact Messages Inbox</h1>
        <p className="text-xs text-slate-400">View and respond to incoming visitor queries and partnership requests.</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-xs text-slate-500 py-8">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-xs text-slate-500 py-8">Inbox is empty.</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="font-extrabold text-base text-white">{msg.subject}</h3>
                  <p className="text-xs text-emerald-400 font-semibold mt-0.5">From: {msg.name} ({msg.email}) {msg.phone ? `• ${msg.phone}` : ''}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    msg.status === 'REPLIED' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                  }`}>
                    {msg.status}
                  </span>
                  <button
                    onClick={() => markStatus(msg.id, msg.status === 'REPLIED' ? 'READ' : 'REPLIED')}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs rounded text-slate-200 font-semibold"
                  >
                    Toggle Status
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                {msg.message}
              </p>

              <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{new Date(msg.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
