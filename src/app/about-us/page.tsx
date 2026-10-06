import React from 'react';
import BentoFocusAreas from '@/components/ui/BentoFocusAreas';
import { Target, Compass, Award, ShieldCheck, Heart, User, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'About Us | Safe Hands Human Resources Organization',
  description: 'Learn about the mission, vision, history, focus areas, and leadership team of Safe Hands NGO in Trichy.',
};

export default function AboutUsPage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="bg-[#023613] text-white py-16 px-4 sm:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-3.5 py-1 rounded-full border border-emerald-800">
            Founded 2010 • Trichy, Tamil Nadu
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            About Safe Hands NGO
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Empowers vulnerable and marginalized communities through education, skill development, healthcare advocacy, and environmental awareness.
          </p>
        </div>
      </section>

      {/* Vision & Mission Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8" id="mission_vision">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#f7faf6] dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-emerald-200/60 dark:border-slate-800 shadow-sm space-y-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-2xl w-fit">
              <Compass className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#023613] dark:text-emerald-400">
              Our Vision
            </h2>
            <blockquote className="text-sm sm:text-base text-slate-700 dark:text-slate-200 italic font-medium leading-relaxed border-l-4 border-emerald-600 pl-4 py-1">
              "We envision a future where women are self-reliant, living with dignity and enjoying a sustainable quality of life."
            </blockquote>
          </div>

          <div className="bg-[#f7faf6] dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-emerald-200/60 dark:border-slate-800 shadow-sm space-y-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-2xl w-fit">
              <Target className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#023613] dark:text-emerald-400">
              Our Mission
            </h2>
            <blockquote className="text-sm sm:text-base text-slate-700 dark:text-slate-200 italic font-medium leading-relaxed border-l-4 border-emerald-600 pl-4 py-1">
              "Safe Hands empowers communities through education, women's empowerment, career skill development, healthcare advocacy, and environmental awareness, driving lasting sustainability and independence."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Organization History & Narrative */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Our Journey & Impact
        </h2>
        <div className="prose dark:prose-invert text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-4 max-w-none">
          <p>
            Founded in <strong>2010</strong>, Safe Hands Human Resources Organization is dedicated to empowering marginalized communities, with a specialized focus on environmental sustainability and supporting single women toward financial independence and dignified livelihoods.
          </p>
          <p>
            Through our initiatives, we raise community awareness on environmental protection, sustainable organic practices, and biodiversity conservation. To date, our teams have trained over <strong>2,200+ youth for free</strong>, enhancing employability and job prospects. In addition, more than <strong>3,000+ beneficiaries</strong> have successfully secured national government entitlement support, ensuring long-term welfare and security.
          </p>
          <p>
            We also conduct free legal aid awareness sessions under the Prevention of Atrocities (POA) Act for SC/ST victims, distribute tree plantation kits to school children, and partner with institutions like Government Arts College, Thuvakudimalai and Tata Capital for specialized skills training.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          <div className="p-4 bg-[#f7faf6] dark:bg-slate-800 rounded-2xl text-center space-y-1">
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">2,200+</div>
            <div className="text-xs text-slate-600 dark:text-slate-300">Youth Trained Free</div>
          </div>
          <div className="p-4 bg-[#f7faf6] dark:bg-slate-800 rounded-2xl text-center space-y-1">
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">3,000+</div>
            <div className="text-xs text-slate-600 dark:text-slate-300">Entitlement Beneficiaries</div>
          </div>
          <div className="p-4 bg-[#f7faf6] dark:bg-slate-800 rounded-2xl text-center space-y-1">
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">5,000+</div>
            <div className="text-xs text-slate-600 dark:text-slate-300">Trees Planted & Saplings</div>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <BentoFocusAreas />

      {/* Leadership & Trustees Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12" id="our_team">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-3.5 py-1 rounded-full">
            Governance & Executive Board
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Meet the Masterminds Behind the Revolution
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Our founding members and executive trustees oversee organization integrity and community development.
          </p>
        </div>

        {/* Board Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-emerald-900 text-white flex items-center justify-center font-extrabold text-2xl border-2 border-emerald-400 shrink-0">
              MT
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
                Founder & President
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">M. Thilaga</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Pioneering single women's rights, environmental sustainability campaigns, and biodiversity preservation in Trichy district since 2010.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-emerald-900 text-white flex items-center justify-center font-extrabold text-2xl border-2 border-emerald-400 shrink-0">
              AD
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
                Treasurer
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">K. Anjali Deevi</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Managing financial audit transparency, statutory compliance, annual reporting, and 80G tax receipt issuance.
              </p>
            </div>
          </div>
        </div>

        {/* Board of Trustees Grid */}
        <div className="bg-[#f7faf6] dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-emerald-100 dark:border-slate-800 space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Executive Board of Trustees</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">All board members serve as dedicated organizational trustees</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-1">
              <User className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">M. Suthalakshmi</h4>
              <p className="text-[11px] text-emerald-600 font-semibold">Trustee</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-1">
              <User className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">K. Balachandar</h4>
              <p className="text-[11px] text-emerald-600 font-semibold">Trustee</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-1">
              <User className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">K. Nanda Kumar</h4>
              <p className="text-[11px] text-emerald-600 font-semibold">Trustee</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-1">
              <User className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">S. Karuppaiya</h4>
              <p className="text-[11px] text-emerald-600 font-semibold">Trustee</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
