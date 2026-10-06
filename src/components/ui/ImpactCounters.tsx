'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TreePine, Award, ShieldCheck, GraduationCap, Gavel, Fish, BookOpen, School } from 'lucide-react';

interface ImpactMetric {
  id: string;
  count: number;
  suffix: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const METRICS: ImpactMetric[] = [
  { id: '1', count: 5000, suffix: '+', label: 'Sapling distribution for environmental awareness & sustainability', icon: TreePine },
  { id: '2', count: 3000, suffix: '+', label: 'Entitlement assistance beneficiaries securing govt support', icon: Award },
  { id: '3', count: 2500, suffix: '+', label: 'Biodiversity conservation awareness campaign participants', icon: ShieldCheck },
  { id: '4', count: 2200, suffix: '+', label: 'Youth trained free in employment skill development', icon: GraduationCap },
  { id: '5', count: 125, suffix: '+', label: 'Free legal aid & support for victims under POA act (SC/ST)', icon: Gavel },
  { id: '6', count: 65, suffix: '+', label: 'Small scale fish vendors participated & supported', icon: Fish },
  { id: '7', count: 47, suffix: '+', label: 'Legal awareness sessions conducted', icon: BookOpen },
  { id: '8', count: 15, suffix: '+', label: 'Partner schools provided with tree plantation materials', icon: School },
];

function CountUpItem({ metric }: { metric: ImpactMetric }) {
  const [current, setCurrent] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;
    let start = 0;
    const duration = 2000;
    const steps = 40;
    const increment = metric.count / steps;
    const intervalTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= metric.count) {
        setCurrent(metric.count);
        clearInterval(timer);
      } else {
        setCurrent(Math.floor(start));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [hasAnimated, metric.count]);

  const IconComponent = metric.icon;

  return (
    <div
      ref={ref}
      className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md border border-emerald-100 dark:border-slate-800 transition-all flex flex-col items-center text-center group"
    >
      <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform mb-4">
        <IconComponent className="w-8 h-8" />
      </div>
      <div className="text-3xl lg:text-4xl font-extrabold text-[#023613] dark:text-emerald-400 tracking-tight">
        {current.toLocaleString()}{metric.suffix}
      </div>
      <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
        {metric.label}
      </p>
    </div>
  );
}

export default function ImpactCounters() {
  return (
    <section className="py-16 bg-[#f7faf6] dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1 rounded-full">
            Proven NGO Track Record
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
            Our Measurable Social & Environmental Impact
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            Since 2010, Safe Hands NGO has driven transformation across Tamil Nadu through sustainable development and community empowerment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {METRICS.map((metric) => (
            <CountUpItem key={metric.id} metric={metric} />
          ))}
        </div>
      </div>
    </section>
  );
}
