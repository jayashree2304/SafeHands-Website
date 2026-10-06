'use client';

import React from 'react';
import { Users, GraduationCap, Leaf, HeartPulse, Wrench, UserCheck, Users2, Megaphone, Globe2 } from 'lucide-react';

interface FocusArea {
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const FOCUS_AREAS: FocusArea[] = [
  {
    title: 'COMMUNITY DEVELOPMENT',
    desc: 'Empowering local panchayats and rural families with essential civic resources and financial independence support.',
    icon: Users,
    color: 'from-emerald-500 to-teal-700',
  },
  {
    title: 'EDUCATION',
    desc: 'Supporting school children with learning materials, vermicomposting kits, and environmental education workshops.',
    icon: GraduationCap,
    color: 'from-blue-500 to-indigo-700',
  },
  {
    title: 'ENVIRONMENT',
    desc: 'Mass sapling distribution, tree plantation drives, and biodiversity conservation campaigns across 15+ villages.',
    icon: Leaf,
    color: 'from-green-600 to-[#023613]',
  },
  {
    title: 'HEALTH',
    desc: 'Healthcare advocacy, wellness awareness, and medical support initiatives for marginalized communities.',
    icon: HeartPulse,
    color: 'from-rose-500 to-pink-700',
  },
  {
    title: 'SKILL DEVELOPMENT',
    desc: 'Free vocational training in tailoring, banking, computer literacy, and entrepreneurship in partnership with Tata Capital.',
    icon: Wrench,
    color: 'from-amber-500 to-orange-700',
  },
  {
    title: 'WOMEN EMPOWERMENT',
    desc: 'Fostering dignified livelihoods, financial independence, and entitlement access for single women across Tamil Nadu.',
    icon: UserCheck,
    color: 'from-purple-500 to-violet-700',
  },
  {
    title: 'YOUTH',
    desc: 'Mobilizing youth clubs for eco-protection, sports, career guidance, and social leadership opportunities.',
    icon: Users2,
    color: 'from-cyan-500 to-blue-700',
  },
  {
    title: 'ADVOCACY',
    desc: 'Free legal aid, awareness sessions on POA Act (SC/ST), POSH Act, and human rights empowerment.',
    icon: Megaphone,
    color: 'from-red-500 to-rose-700',
  },
  {
    title: 'SUSTAINABLE DEVELOPMENT',
    desc: 'Integrating green practices, biodiversity preservation, and renewable initiatives for long-term ecological balance.',
    icon: Globe2,
    color: 'from-emerald-600 to-emerald-900',
  },
];

export default function BentoFocusAreas() {
  return (
    <section className="py-16 bg-white dark:bg-slate-900" id="focus_area">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">
            Our Core Mission Pillars
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
            Our Focus Areas
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            Comprehensive social development programs designed to drive lasting independence and sustainability.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FOCUS_AREAS.map((area, idx) => {
            const Icon = area.icon;
            return (
              <div
                key={idx}
                className="group relative p-6 bg-[#f7faf6] dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-4 relative z-10">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${area.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-wide">
                    {area.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {area.desc}
                  </p>
                </div>

                <div className="mt-6 flex items-center text-xs font-semibold text-emerald-700 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore Initiative &rarr;</span>
                </div>

                {/* Glassmorphism Background Accent */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
