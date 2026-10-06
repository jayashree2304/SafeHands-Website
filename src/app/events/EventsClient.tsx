'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Users, CheckCircle, AlertCircle, X, ShieldCheck } from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: Date;
  venue: string;
  category: string;
  capacity: number;
  status: 'UPCOMING' | 'PAST' | 'CANCELLED';
  imageUrl: string | null;
  _count?: { enrolments: number };
}

export default function EventsClient({ initialEvents }: { initialEvents: any[] }) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'UPCOMING' | 'PAST'>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [userSession, setUserSession] = useState<{ id: string; identifier: string } | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/user/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUserSession(data.user);
          if (data.user.identifier?.includes('@')) setEmail(data.user.identifier);
          else if (data.user.identifier) setPhone(data.user.identifier);
        }
      })
      .catch(() => {});
  }, []);

  const filteredEvents = initialEvents.filter((ev) => {
    if (activeTab === 'UPCOMING') return ev.status === 'UPCOMING';
    if (activeTab === 'PAST') return ev.status === 'PAST';
    return true;
  });

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/events/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          name,
          email,
          phone,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to enroll' });
      } else {
        setMessage({ type: 'success', text: data.message || 'Successfully enrolled in event!' });
        setTimeout(() => {
          setSelectedEvent(null);
          setMessage(null);
        }, 2000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-[#023613] text-white py-16 px-4 sm:px-8 text-center relative">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950 px-3.5 py-1 rounded-full border border-emerald-800">
            Community Action & Gatherings
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            Safe Hands NGO Events
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto">
            Participate in tree plantation drives, single women conferences, legal workshops, and awareness rallies.
          </p>
        </div>
      </section>

      {/* Tabs Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'ALL'
                ? 'bg-[#023613] text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
            }`}
          >
            All Events ({initialEvents.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('UPCOMING')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'UPCOMING'
                ? 'bg-[#023613] text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
            }`}
          >
            Upcoming Events
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('PAST')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'PAST'
                ? 'bg-[#023613] text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
            }`}
          >
            Past Events
          </button>
        </div>
      </section>

      {/* Events Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              id={event.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-xl transition-shadow"
            >
              <div>
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={event.imageUrl || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600'}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-emerald-950/90 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-sm">
                    {event.category}
                  </span>
                  <span className={`absolute top-4 right-4 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-sm ${
                    event.status === 'UPCOMING' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-white'
                  }`}>
                    {event.status}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{event._count?.enrolments || 0}/{event.capacity} Enrolled</span>
                    </span>
                  </div>

                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white line-clamp-2">
                    {event.title}
                  </h2>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{event.venue}</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {event.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                {event.status === 'UPCOMING' ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMessage(null);
                      setSelectedEvent(event);
                    }}
                    className="w-full bg-[#023613] hover:bg-emerald-950 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-md"
                  >
                    Enroll in Event
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold py-3 rounded-xl text-xs cursor-not-allowed"
                  >
                    Event Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enroll Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative animate-slide-up">
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Event Enrollment
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                {selectedEvent.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Venue: {selectedEvent.venue}
              </p>
            </div>

            {!userSession ? (
              <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 p-4 rounded-2xl text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                  Login Required to Enroll in Events
                </p>
                <p className="text-[11px] text-amber-700 dark:text-amber-300">
                  Please log in with your mobile number or email via OTP to confirm your event seat.
                </p>
                <Link
                  href="/user/login"
                  className="inline-block w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                >
                  Log In with OTP &rarr;
                </Link>
              </div>
            ) : (
              <form onSubmit={handleEnrollSubmit} className="space-y-4 text-xs">
                {message && (
                  <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {message.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                    <span>{message.text}</span>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Phone (+91) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#023613] hover:bg-emerald-950 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-md disabled:opacity-50"
                >
                  {loading ? 'Confirming Enrollment...' : 'Confirm Enrollment'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
