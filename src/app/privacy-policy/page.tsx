import React from 'react';

export const metadata = {
  title: 'Privacy Policy | Safe Hands NGO',
  description: 'Privacy Policy for Safe Hands Human Resources Organization, aligned with India Digital Personal Data Protection (DPDP) Act.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Privacy Policy</h1>
        <p className="text-xs text-slate-500 mt-1">Last Updated: January 2026 • Compliant with India DPDP Act 2023</p>
      </div>

      <div className="prose dark:prose-invert text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed">
        <p>
          Safe Hands Human Resources Organization ("SHHRO", "we", "us", "our") respects your privacy and is committed to protecting your personal data in accordance with the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> of India.
        </p>

        <h2 className="text-base font-bold text-slate-900 dark:text-white pt-2">1. Personal Data Collected</h2>
        <p>We collect minimal personal data strictly necessary for providing NGO services, event registrations, and 80G tax receipt generation:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Full Name, Mobile Phone Number, and Email Address</li>
          <li>PAN Number (optional, required only for 80G Tax Exemption Receipts)</li>
          <li>Postal Address and Payment Gateway Transaction Reference IDs</li>
        </ul>

        <h2 className="text-base font-bold text-slate-900 dark:text-white pt-2">2. Purpose of Collection</h2>
        <p>Your data is processed solely for sending OTP login codes, confirming event seat enrolments, dispatching volunteer communications, and issuing statutory 80G donation tax receipts.</p>

        <h2 className="text-base font-bold text-slate-900 dark:text-white pt-2">3. Data Security & Storage</h2>
        <p>All passwords, OTPs, and authentication tokens are stored in hashed format using industry-standard cryptographic algorithms (bcrypt/SHA-256). We never store raw credit card or debit card numbers.</p>

        <h2 className="text-base font-bold text-slate-900 dark:text-white pt-2">4. Your Rights & Data Deletion</h2>
        <p>Under the India DPDP Act, you have the right to request access, correction, or complete erasure of your personal data stored with us. You can submit a data deletion request anytime via our <a href="/data-deletion" className="text-emerald-600 underline">Data Deletion Request Page</a>.</p>
      </div>
    </div>
  );
}
