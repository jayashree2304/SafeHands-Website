import React from 'react';

export const metadata = {
  title: 'Terms of Service | Safe Hands NGO',
  description: 'Terms of Service for Safe Hands Human Resources Organization.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Terms of Service</h1>
        <p className="text-xs text-slate-500 mt-1">Last Updated: January 2026</p>
      </div>

      <div className="prose dark:prose-invert text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed">
        <p>
          Welcome to Safe Hands Human Resources Organization (SHHRO). By accessing or using our website, programs, or donation portals, you agree to comply with these terms.
        </p>

        <h2 className="text-base font-bold text-slate-900 dark:text-white pt-2">1. Use of Website</h2>
        <p>This website is provided for informational, educational, volunteer application, and charitable donation purposes. Unauthorized attempt to disrupt system operations or bypass security checks is strictly prohibited.</p>

        <h2 className="text-base font-bold text-slate-900 dark:text-white pt-2">2. Charitable Donations & 80G Receipts</h2>
        <p>All online donations made to Safe Hands NGO are voluntary contributions supporting our social welfare projects. Donations are eligible for tax savings under Section 80G of the Indian Income Tax Act. Refund requests must be submitted within 7 days of payment.</p>

        <h2 className="text-base font-bold text-slate-900 dark:text-white pt-2">3. Event Enrollment & Volunteer Responsibilities</h2>
        <p>Event participants and volunteers must maintain respectful conduct during NGO activities and adhere to local safety guidelines.</p>
      </div>
    </div>
  );
}
