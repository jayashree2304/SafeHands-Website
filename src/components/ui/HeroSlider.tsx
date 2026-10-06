'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../providers/LanguageContext';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  headline: string;
  imageUrl: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    title: "Safe Hands Human Resources Organization",
    headline: "Sapling Distribution for Environmental Awareness & Sustainability",
    imageUrl: "https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/page.jpg",
  },
  {
    id: 2,
    title: "Safe Hands Human Resources Organization",
    headline: "Capacity Building Training & Career Skill Workshops for Youth",
    imageUrl: "https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/WhatsApp%20Image%202024-11-30%20at%2017.12.57%20(1)%20(1).jpeg",
  },
  {
    id: 3,
    title: "Safe Hands Human Resources Organization",
    headline: "Biodiversity Conservation & Environmental Celebration",
    imageUrl: "https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/WhatsApp%20Image%202024-12-31%20at%2019.12.39_cuH1UE1.jpeg",
  },
  {
    id: 4,
    title: "Safe Hands Human Resources Organization",
    headline: "Empowering Single Women Towards Financial Independence & Dignity",
    imageUrl: "https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/WhatsApp%20Image%202025-03-15%20at%2007.35.04_6c459809.jpg",
  },
];

export default function HeroSlider() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  return (
    <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[640px] overflow-hidden bg-slate-950">
      {SLIDES.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image with Dark Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-10000"
            style={{ backgroundImage: `url('${slide.imageUrl}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
          </div>

          {/* Slide Content Box */}
          <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-8 flex flex-col justify-center items-start text-left z-20">
            <div className="max-w-2xl bg-black/40 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 border border-emerald-400/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>NGO Founded 2010 • Trichy, Tamil Nadu</span>
              </span>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {slide.headline}
              </h1>

              <p className="text-xs sm:text-sm text-slate-200 mt-3 leading-relaxed line-clamp-3">
                {t.heroSub}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/donate"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 px-6 py-3 rounded-full text-xs sm:text-sm font-extrabold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5"
                >
                  <Heart className="w-4 h-4 text-red-700 fill-current" />
                  <span>{t.donate}</span>
                </Link>

                <Link
                  href="/about-us"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-full text-xs sm:text-sm font-semibold border border-white/20 transition-all"
                >
                  <span>{t.learnMore}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slider Controls */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-sm transition-all"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-sm transition-all"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentSlide ? 'w-8 bg-amber-400' : 'w-2 bg-white/40'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
