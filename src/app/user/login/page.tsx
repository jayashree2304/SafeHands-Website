'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, RefreshCw, CheckCircle, AlertCircle, KeyRound, Phone, Mail } from 'lucide-react';

export default function UserLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'SEND' | 'VERIFY'>('SEND');
  
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [devOtp, setDevOtp] = useState<string | null>(null);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || identifier.trim().length < 5) {
      setMessage({ type: 'error', text: 'Please enter a valid mobile number (+91) or email address' });
      return;
    }

    setLoading(true);
    setMessage(null);
    setDevOtp(null);

    try {
      const res = await fetch('/api/auth/user/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to send OTP.' });
        if (data.cooldownSeconds) setCooldown(data.cooldownSeconds);
      } else {
        setMessage({ type: 'success', text: data.message });
        setStep('VERIFY');
        setCooldown(data.cooldownSeconds || 60);
        if (data.devOtp) setDevOtp(data.devOtp);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network connection error.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      setMessage({ type: 'error', text: 'Please enter the 6-digit OTP code' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/user/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          otp: otp.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Invalid OTP code.' });
      } else {
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
        setTimeout(() => {
          router.push('/user/profile');
          router.refresh();
        }, 1000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Verification error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-8">
      <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Visitor Login
          </h1>
          <p className="text-xs text-slate-500">
            Passwordless authentication via 6-digit OTP to manage enrolments & receipts.
          </p>
        </div>

        {message && (
          <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {devOtp && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 rounded-xl text-xs text-center font-mono font-bold">
            [Dev Mode Code]: {devOtp}
          </div>
        )}

        {step === 'SEND' ? (
          <form onSubmit={handleSendOTP} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mobile Number (+91) OR Email Address *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. +91 9876543210 or user@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading || cooldown > 0}
              className="w-full bg-[#023613] hover:bg-emerald-950 text-white font-bold py-3.5 rounded-xl text-xs transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Sending OTP...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Send OTP Code'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Enter 6-Digit OTP Code *
                </label>
                <button
                  type="button"
                  onClick={() => setStep('SEND')}
                  className="text-[11px] text-emerald-600 hover:underline"
                >
                  Change identifier
                </button>
              </div>
              <input
                type="text"
                maxLength={6}
                required
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center text-lg tracking-widest font-mono font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#023613] hover:bg-emerald-950 text-white font-bold py-3.5 rounded-xl text-xs transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP & Login'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                disabled={cooldown > 0 || loading}
                onClick={handleSendOTP}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline disabled:opacity-50"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP Code'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
