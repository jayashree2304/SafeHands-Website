'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Edit, Download, Users, CheckCircle, X } from 'lucide-react';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [category, setCategory] = useState('Community');
  const [capacity, setCapacity] = useState('100');
  const [status, setStatus] = useState('UPCOMING');
  const [imageUrl, setImageUrl] = useState('');

  // Enrolments list modal
  const [enrolmentModalEvent, setEnrolmentModalEvent] = useState<any | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/events');
      const data = await res.json();
      if (data.events) setEvents(data.events);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setVenue('');
    setCategory('Community');
    setCapacity('100');
    setStatus('UPCOMING');
    setImageUrl('');
    setShowModal(true);
  };

  const handleOpenEdit = (ev: any) => {
    setEditingId(ev.id);
    setTitle(ev.title);
    setDescription(ev.description);
    setDate(new Date(ev.date).toISOString().split('T')[0]);
    setVenue(ev.venue);
    setCategory(ev.category);
    setCapacity(ev.capacity.toString());
    setStatus(ev.status);
    setImageUrl(ev.imageUrl || '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: editingId,
      title,
      description,
      date,
      venue,
      category,
      capacity,
      status,
      imageUrl,
    };

    const method = editingId ? 'PUT' : 'POST';
    await fetch('/api/admin/events', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setShowModal(false);
    fetchEvents();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    await fetch(`/api/admin/events?id=${id}`, { method: 'DELETE' });
    fetchEvents();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Events Management</h1>
          <p className="text-xs text-slate-400">Add, edit, or delete NGO events and view attendee enrolments.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-[#023613] hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center text-xs text-slate-500 py-8">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="col-span-3 text-center text-xs text-slate-500 py-8">No events found.</div>
        ) : (
          events.map((ev) => (
            <div key={ev.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-md">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
                    {ev.category}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    ev.status === 'UPCOMING' ? 'bg-amber-950 text-amber-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {ev.status}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-white line-clamp-1">{ev.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{ev.description}</p>
                <div className="text-xs text-slate-400 space-y-0.5">
                  <p>📅 {new Date(ev.date).toLocaleDateString('en-IN')}</p>
                  <p>📍 {ev.venue}</p>
                  <p>👥 Enrolled: {ev._count?.enrolments || 0}/{ev.capacity}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                <button
                  onClick={() => setEnrolmentModalEvent(ev)}
                  className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Enrolments ({ev._count?.enrolments || 0})</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(ev)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded"
                    title="Edit"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(ev.id)}
                    className="p-1.5 bg-red-950 hover:bg-red-900 text-red-400 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Event Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 max-w-lg w-full rounded-3xl p-6 space-y-4 text-xs text-slate-200">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white">{editingId ? 'Edit Event' : 'Create New Event'}</h3>
              <button type="button" onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div>
              <label className="block font-semibold mb-1">Event Title *</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
            </div>

            <div>
              <label className="block font-semibold mb-1">Description *</label>
              <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Date *</label>
                <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Capacity *</label>
                <input type="number" required value={capacity} onChange={(e) => setCapacity(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Venue *</label>
              <input type="text" required value={venue} onChange={(e) => setVenue(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Category</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold">
                  <option value="UPCOMING">UPCOMING</option>
                  <option value="PAST">PAST</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Image URL</label>
              <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
            </div>

            <button type="submit" className="w-full bg-[#023613] hover:bg-emerald-900 text-white font-bold py-3 rounded-xl">Save Event</button>
          </form>
        </div>
      )}

      {/* Enrolments View Modal */}
      {enrolmentModalEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 max-w-2xl w-full rounded-3xl p-6 space-y-4 text-xs text-slate-200">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-white">Event Enrolments</h3>
                <p className="text-slate-400">{enrolmentModalEvent.title}</p>
              </div>
              <div className="flex gap-2 items-center">
                <a
                  href={`/api/admin/events?eventId=${enrolmentModalEvent.id}&exportEnrolments=true`}
                  download
                  className="px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white font-bold rounded-lg flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </a>
                <button type="button" onClick={() => setEnrolmentModalEvent(null)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2">
              {!enrolmentModalEvent.enrolments || enrolmentModalEvent.enrolments.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No enrolments for this event yet.</p>
              ) : (
                enrolmentModalEvent.enrolments.map((en: any) => (
                  <div key={en.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">{en.name}</div>
                      <div className="text-[11px] text-slate-400">{en.email} • {en.phone}</div>
                    </div>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">{en.status}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
