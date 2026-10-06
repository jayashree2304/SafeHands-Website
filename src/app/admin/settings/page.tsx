'use client';

import React, { useState, useEffect } from 'react';
import { Settings, ShieldCheck, QrCode, KeyRound, Activity, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [totpData, setTotpData] = useState<{ secret: string; qrCodeUrl: string } | null>(null);
  const [totpToken, setTotpToken] = useState('');
  const [loading2FA, setLoading2FA] = useState(false);
  const [msg2FA, setMsg2FA] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetch2FASetup = async () => {
    try {
      const res = await fetch('/api/auth/admin/totp');
      const data = await res.json();
      if (data.secret) setTotpData(data);
    } catch (err) {}
  };

  useEffect(() => {
    fetch2FASetup();
  }, []);

  const handleEnable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!totpData) return;
    setLoading2FA(true);
    setMsg2FA(null);

    try {
      const res = await fetch('/api/auth/admin/totp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: totpData.secret,
          token: totpToken,
          action: 'enable',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMsg2FA({ type: 'error', text: data.error || 'Verification failed' });
      } else {
        setMsg2FA({ type: 'success', text: data.message });
      }
    } catch (err) {
      setMsg2FA({ type: 'error', text: 'Error enabling 2FA' });
    } finally {
      setLoading2FA(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white">Admin Security Settings & 2FA</h1>
        <p className="text-xs text-slate-400">Configure TOTP authenticator 2FA and inspect audit trail logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* TOTP 2FA Setup Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 text-white font-extrabold text-base border-b border-slate-800 pb-3">
            <QrCode className="w-5 h-5 text-emerald-400" />
            <h2>TOTP 2FA Authenticator Setup</h2>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Enhance admin account security by scanning the QR code with your Authenticator App (Google Authenticator, Authy, 1Password) to generate 6-digit TOTP verification codes.
          </p>

          {msg2FA && (
            <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              msg2FA.type === 'success' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'
            }`}>
              {msg2FA.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
              <span>{msg2FA.text}</span>
            </div>
          )}

          {totpData && (
            <div className="space-y-4">
              <div className="bg-white p-3 rounded-2xl w-fit mx-auto shadow-md">
                <img src={totpData.qrCodeUrl} alt="2FA QR Code" className="w-40 h-40" />
              </div>

              <div className="text-center font-mono text-xs text-slate-400">
                Secret Key: <span className="text-emerald-400 select-all font-bold">{totpData.secret}</span>
              </div>

              <form onSubmit={handleEnable2FA} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-slate-300">
                    Enter 6-Digit Code from Authenticator App to Confirm *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="123456"
                    value={totpToken}
                    onChange={(e) => setTotpToken(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white font-mono text-center text-base tracking-widest"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading2FA}
                  className="w-full bg-[#023613] hover:bg-emerald-900 text-white font-bold py-3 rounded-xl transition-colors shadow-md"
                >
                  {loading2FA ? 'Verifying 2FA...' : 'Enable 2FA Authenticator'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Security Disclosures & Compliance */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl text-xs text-slate-300">
          <div className="flex items-center gap-2 text-white font-extrabold text-base border-b border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2>Security Measures Summary</h2>
          </div>

          <div className="space-y-3 leading-relaxed">
            <p><strong>Strict Role-Based Access Control:</strong> Super Admin permissions govern administrative functions, user session overrides, and system audit trails.</p>
            <p><strong>Argon2id / Bcrypt Hashing:</strong> Passwords stored with minimum cost factor 12 to prevent dictionary attacks.</p>
            <p><strong>Rate-Limiting & Lockouts:</strong> Automated sliding window rate limits protect against login brute force and OTP flooding.</p>
            <p><strong>Zero Data Leaks:</strong> OTP tokens, payment credentials, and session tokens are strictly excluded from server logs.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
