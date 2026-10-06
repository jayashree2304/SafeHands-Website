'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle2, AlertCircle, ExternalLink, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    honeypot: '',
    consent: false,
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setResponse({ type: 'error', text: data.error || 'Failed to send message.' });
      } else {
        setResponse({ type: 'success', text: data.message });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          honeypot: '',
          consent: false,
        });
      }
    } catch (err) {
      setResponse({ type: 'error', text: 'Network connection error. Please try again.' });
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
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            Contact Safe Hands NGO
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto">
            Have a question, partnership proposal, or volunteer query? We would love to hear from you.
          </p>
        </div>
      </section>

      {/* Main Grid Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Contact Details & Map */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#f7faf6] dark:bg-slate-900 p-8 rounded-3xl border border-emerald-100 dark:border-slate-800 space-y-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Contact Information
              </h2>

              <div className="space-y-4 text-xs text-slate-700 dark:text-slate-200">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-xl shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Official Address</h3>
                    <p className="mt-1 leading-relaxed font-medium text-slate-800 dark:text-slate-200">
                      6/89, Periyar Nagar, Valavanthan Kottai, Trichy - 620015, Tamil Nadu, India.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-xl shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Phone Number</h3>
                    <a href="tel:7358005444" className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline">
                      +91 7358005444
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-xl shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Email Address</h3>
                    <a href="mailto:safehandsindia2010@gmail.com" className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline">
                      safehandsindia2010@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Follow Us On Social Media</h4>
                <div className="flex items-center gap-3">
                  <a href="https://www.facebook.com/profile.php?id=61568720233041" target="_blank" rel="noreferrer" className="p-2.5 bg-white dark:bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-xl shadow-sm text-slate-700 dark:text-slate-200 transition-colors">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="https://x.com/SafeHandsNgo" target="_blank" rel="noreferrer" className="p-2.5 bg-white dark:bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-xl shadow-sm text-slate-700 dark:text-slate-200 transition-colors">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href="https://www.instagram.com/safehands_ngo/" target="_blank" rel="noreferrer" className="p-2.5 bg-white dark:bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-xl shadow-sm text-slate-700 dark:text-slate-200 transition-colors">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href="https://www.linkedin.com/in/safe-hands-ngo-2481b7319/" target="_blank" rel="noreferrer" className="p-2.5 bg-white dark:bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-xl shadow-sm text-slate-700 dark:text-slate-200 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Fixed Google Map Embed Pinned to 6/89, Periyar Nagar, Valavanthan Kottai, Trichy - 620015 */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
              <h3 className="font-bold text-xs text-slate-900 dark:text-white px-2">Pinned Location (6/89, Periyar Nagar, Valavanthan Kottai, Trichy - 620015)</h3>
              <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-100">
                <iframe
                  title="Safe Hands NGO Pinned Google Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src="https://maps.google.com/maps?q=6%2F89%2C%20Periyar%20Nagar%2C%20Valavanthan%20Kottai%2C%20Trichy%20-%20620015&t=&z=15&ie=UTF8&iwloc=&output=embed"
                />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-600" />
                <span>Send Us a Message</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">We respond to all queries within 24 hours.</p>
            </div>

            {response && (
              <div className={`p-4 rounded-2xl text-xs flex items-center gap-3 ${
                response.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {response.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
                <span>{response.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                className="hidden"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Volunteer Inquiry / CSR Partnership"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Message Content *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="How can we assist you?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="contactConsent"
                  required
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="contactConsent" className="text-slate-600 dark:text-slate-400 text-[11px]">
                  I agree to the storing and processing of my contact details by Safe Hands NGO for response purposes.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#023613] hover:bg-emerald-950 text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm transition-colors shadow-lg disabled:opacity-50"
              >
                {loading ? 'Sending Message...' : 'Send Message Now'}
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
