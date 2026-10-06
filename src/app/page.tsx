import React from 'react';
import Link from 'next/link';
import HeroSlider from '@/components/ui/HeroSlider';
import ImpactCounters from '@/components/ui/ImpactCounters';
import BentoFocusAreas from '@/components/ui/BentoFocusAreas';
import { prisma } from '@/lib/db/prisma';
import { ShieldCheck, Heart, UserPlus, ArrowRight, Calendar, MapPin, Award, CheckCircle2 } from 'lucide-react';

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  let events: any[] = [];

  try {
    events = await prisma.event.findMany({
      where: { isDeleted: false },
      take: 3,
      orderBy: { date: 'desc' },
    });
  } catch (_) {
    // Fallback to default events if DB query unavailable
  }

  if (events.length === 0) {
    events = [
      {
        id: 'e1',
        title: 'Environmental Awareness Program & 500 Sapling Distribution',
        description: 'Insightful awareness program at Valavanthan Kottai Panchayat featuring speeches by horticulture directors and environmental social activists.',
        date: new Date('2024-11-29'),
        venue: 'Valavanthan Kottai Panchayat, Trichy',
        status: 'PAST',
      },
      {
        id: 'e2',
        title: 'Empowering Schools with Tree Plantation Material',
        description: 'Distributed tree plantation materials to 15 schools across Trichy block to encourage youth greening projects.',
        date: new Date('2024-10-16'),
        venue: '15 Partner Schools, Trichy Block',
        status: 'PAST',
      },
      {
        id: 'e3',
        title: 'Upcoming National Single Women Livelihood Summit 2026',
        description: 'Statewide empowerment conference bringing together single women, legal experts, and social welfare leaders.',
        date: new Date('2026-11-15'),
        venue: 'Arun Hotel Conference Hall, Trichy',
        status: 'UPCOMING',
      },
    ];
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <HeroSlider />

      {/* Impact Counters Section */}
      <ImpactCounters />

      {/* About Section Summary */}
      <section className="py-12 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>About Our Organization</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Safe Hands Human Resources Organization
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Founded in <strong>2010</strong>, our organization is dedicated to empowering marginalized communities, with a strong focus on environmental sustainability and supporting single women. Our mission is to provide these communities with opportunities for self-reliance and dignified livelihoods while contributing to environmental development and biodiversity conservation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-700 dark:text-slate-200">
              <div className="flex items-start gap-2.5 bg-[#f7faf6] dark:bg-slate-800 p-3.5 rounded-xl border border-emerald-100 dark:border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>2,200+ youth trained free for improved career opportunities</span>
              </div>
              <div className="flex items-start gap-2.5 bg-[#f7faf6] dark:bg-slate-800 p-3.5 rounded-xl border border-emerald-100 dark:border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>3,000+ beneficiaries secured government entitlement support</span>
              </div>
              <div className="flex items-start gap-2.5 bg-[#f7faf6] dark:bg-slate-800 p-3.5 rounded-xl border border-emerald-100 dark:border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>5,000+ saplings distributed for ecological conservation</span>
              </div>
              <div className="flex items-start gap-2.5 bg-[#f7faf6] dark:bg-slate-800 p-3.5 rounded-xl border border-emerald-100 dark:border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>125+ SC/ST legal aid victim support under POA Act</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about-us"
                className="inline-flex items-center gap-2 bg-[#023613] hover:bg-emerald-950 text-white px-6 py-3 rounded-full text-xs font-bold shadow-md transition-colors"
              >
                <span>Learn More About Us</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <img
              src="https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/opo.jpg"
              alt="Community Program"
              className="rounded-2xl shadow-lg object-cover h-56 w-full"
            />
            <img
              src="https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/single%20women%20state%20level%20conference_rZkh6tW.jpg"
              alt="Single Women Conference"
              className="rounded-2xl shadow-lg object-cover h-56 w-full mt-6"
            />
            <img
              src="https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/WhatsApp%20Image%202025-01-31%20at%2016.33.41.jpeg"
              alt="Tree Plantation Drive"
              className="rounded-2xl shadow-lg object-cover h-56 w-full"
            />
            <img
              src="https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/studen.jpg"
              alt="Student Skill Workshop"
              className="rounded-2xl shadow-lg object-cover h-56 w-full mt-6"
            />
          </div>
        </div>
      </section>

      {/* Focus Areas Bento Grid */}
      <BentoFocusAreas />

      {/* Events Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Community Gathering & Action
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Recent & Upcoming Events
              </h2>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              <span>Explore All Events &rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-[#f7faf6] dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      event.status === 'UPCOMING' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {event.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2">
                    {event.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{event.venue}</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <Link
                    href={`/events#${event.id}`}
                    className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    View Details
                  </Link>
                  {event.status === 'UPCOMING' && (
                    <Link
                      href={`/events?enroll=${event.id}`}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-sm"
                    >
                      Enroll Now
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Masterminds Team Section Preview */}
      <section className="py-16 bg-[#023613] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center space-y-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-900/80 px-3.5 py-1 rounded-full">
              Leadership & Governance
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
              Meet the Masterminds Behind the Revolution
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto mt-2">
              Dedicated social leaders and trustees driving transparent governance and community welfare since 2010.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-emerald-950/60 p-6 rounded-2xl border border-emerald-800 text-center space-y-3">
              <div className="w-24 h-24 mx-auto rounded-full bg-emerald-800 flex items-center justify-center font-bold text-2xl text-emerald-200 border-2 border-emerald-400">
                MT
              </div>
              <h3 className="font-extrabold text-lg text-white">M. Thilaga</h3>
              <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Founder and President</p>
              <p className="text-xs text-emerald-100/80">Leading strategic initiatives, single women empowerment, and biodiversity conservation across Tamil Nadu.</p>
            </div>

            <div className="bg-emerald-950/60 p-6 rounded-2xl border border-emerald-800 text-center space-y-3">
              <div className="w-24 h-24 mx-auto rounded-full bg-emerald-800 flex items-center justify-center font-bold text-2xl text-emerald-200 border-2 border-emerald-400">
                AD
              </div>
              <h3 className="font-extrabold text-lg text-white">K. Anjali Deevi</h3>
              <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Treasurer</p>
              <p className="text-xs text-emerald-100/80">Overseeing financial compliance, audit reporting, 80G statutory transparency, and resource allocation.</p>
            </div>

            <div className="bg-emerald-950/60 p-6 rounded-2xl border border-emerald-800 text-center space-y-3 sm:col-span-2 lg:col-span-1">
              <div className="w-24 h-24 mx-auto rounded-full bg-emerald-800 flex items-center justify-center font-bold text-2xl text-emerald-200 border-2 border-emerald-400">
                TR
              </div>
              <h3 className="font-extrabold text-lg text-white">Board of Trustees</h3>
              <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Executive Trustees</p>
              <p className="text-xs text-emerald-100/80">
                M. Suthalakshmi • K. Balachandar <br />
                K. Nanda Kumar • S. Karuppaiya
              </p>
            </div>
          </div>

          <div>
            <Link
              href="/about-us#our_team"
              className="inline-flex items-center gap-2 bg-[#66a23f] hover:bg-emerald-600 text-white text-xs font-bold px-6 py-3 rounded-full shadow-lg"
            >
              <span>View Full Leadership Profile</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Dual CTA Section: Donate & Volunteer */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#f7faf6] dark:bg-slate-800 p-8 sm:p-10 rounded-3xl border border-emerald-100 dark:border-slate-700 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-xl w-fit">
                <UserPlus className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Become a Volunteer
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Join our team of dedicated change-makers in Trichy. Help us conduct tree planting campaigns, legal awareness sessions, and skill workshops.
              </p>
            </div>
            <Link
              href="/volunteer"
              className="inline-flex items-center justify-center gap-2 bg-[#023613] hover:bg-emerald-950 text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition-colors w-fit"
            >
              <span>Apply as a Volunteer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-[#023613] text-white p-8 sm:p-10 rounded-3xl flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
            <div className="space-y-3 relative z-10">
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl w-fit">
                <Heart className="w-6 h-6 fill-current text-red-500" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">
                Make a Lasting Change
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                Your contributions directly fund free youth training, sapling distribution, and legal aid. All donations are eligible for 80G tax savings.
              </p>

              <div className="pt-2 text-xs text-emerald-200 bg-emerald-950/80 p-4 rounded-xl border border-emerald-800 space-y-1 font-mono">
                <p><strong>Bank:</strong> Indian Bank</p>
                <p><strong>Branch:</strong> SME Branch, Thuvakudi, Trichy</p>
                <p><strong>IFSC Code:</strong> IDIB000S175</p>
              </div>
            </div>

            <Link
              href="/donate"
              className="relative z-10 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold py-3 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-lg w-fit"
            >
              <Heart className="w-4 h-4 fill-current text-red-700" />
              <span>Donate Online Now</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
