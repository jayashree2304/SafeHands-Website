import React from 'react';
import { prisma } from '@/lib/db/prisma';
import { FileText, Download, Eye, Award, ShieldCheck } from 'lucide-react';

export const revalidate = 0;

export const metadata = {
  title: 'Resources & Reports | Safe Hands NGO',
  description: 'Download annual financial reports, audit reports, and view statutory 12A, 80G, CSR, FCRA certificates.',
};

export default async function ResourcesPage() {
  let reports: any[] = [];
  let certificates: any[] = [];

  try {
    reports = await prisma.report.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });
    certificates = await prisma.certificate.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });
  } catch (_) {
    // Fallback to default resources if DB query unavailable
  }

  if (reports.length === 0) {
    reports = [
      {
        id: 'r1',
        title: 'Annual Report 2025-2026',
        year: '2025-2026',
        category: 'Annual',
        pdfUrl: 'https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/2d9acb2ca6.pdf',
        fileSize: '2.4 MB',
      },
      {
        id: 'r2',
        title: 'Audit Report 2025',
        year: '2025',
        category: 'Audit',
        pdfUrl: 'https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/c439129fef.pdf',
        fileSize: '1.8 MB',
      },
      {
        id: 'r3',
        title: 'Audit Report 2024',
        year: '2024',
        category: 'Audit',
        pdfUrl: 'https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/9cb777dc9b.pdf',
        fileSize: '1.5 MB',
      },
      {
        id: 'r4',
        title: 'Audit Report 2023',
        year: '2023',
        category: 'Audit',
        pdfUrl: 'https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/b9069d9a66.pdf',
        fileSize: '1.6 MB',
      },
    ];
  }

  if (certificates.length === 0) {
    certificates = [
      {
        id: 'c1',
        name: '12A Registration Certificate',
        category: '12A',
        issuingBody: 'Income Tax Department, Govt of India',
        year: 'Statutory Active',
      },
      {
        id: 'c2',
        name: '80-G Tax Exemption Certificate',
        category: '80G',
        issuingBody: 'Income Tax Department, Govt of India',
        year: 'Statutory Active',
      },
      {
        id: 'c3',
        name: 'CSR Registration Certificate (Form CSR-1)',
        category: 'CSR',
        issuingBody: 'Ministry of Corporate Affairs',
        year: 'Statutory Active',
      },
      {
        id: 'c4',
        name: 'FCRA Registration Certificate',
        category: 'FCRA',
        issuingBody: 'Ministry of Home Affairs, Govt of India',
        year: 'Statutory Active',
      },
    ];
  }

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="bg-[#023613] text-white py-16 px-4 sm:px-8 text-center relative">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950 px-3.5 py-1 rounded-full border border-emerald-800">
            Transparency & Governance
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            Legals, Reports & Certificates
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto">
            View and download our audited financial reports, annual impact summaries, and statutory non-profit accreditations.
          </p>
        </div>
      </section>

      {/* Reports Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            <span>Annual & Audit Reports</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Official annual disclosures submitted to the Superintendent of Police and Income Tax Department.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {rep.title}
                </h3>
                <p className="text-xs text-slate-500">Year: {rep.year} • {rep.fileSize || 'PDF Document'}</p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={rep.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#023613] hover:bg-emerald-950 text-white py-2 rounded-xl text-xs font-bold transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View PDF</span>
                </a>
                <a
                  href={rep.pdfUrl}
                  download
                  className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl transition-colors"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certified Organisation Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-600" />
            <span>Certified Organisation & Accreditations</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Official government registrations and statutory tax exemption recognitions.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-[#f7faf6] dark:bg-slate-900 p-6 rounded-2xl border border-emerald-100 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-xl w-fit">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {cert.name}
              </h3>
              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p><strong>Category:</strong> <span className="bg-emerald-200 dark:bg-emerald-900 px-2 py-0.5 rounded text-[10px] font-bold">{cert.category}</span></p>
                <p><strong>Issuing Body:</strong> {cert.issuingBody || 'Govt of India'}</p>
                <p><strong>Status:</strong> {cert.year || 'Statutory Active'}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
