import React from 'react';
import { Search, MailCheck, Warehouse, Award, ArrowRight } from 'lucide-react';

export default function HowItWorks({ onStartBrowsing }) {
  const steps = [
    {
      num: '01',
      title: 'Select Hypercar',
      desc: 'Browse our curated collection of supercars, grand tourers, and exotic specials with verified technical metrics.',
      icon: Search
    },
    {
      num: '02',
      title: 'Collector Verification',
      desc: 'Provide your designated contact email for real-time digital deed generation and vehicle tracking.',
      icon: MailCheck
    },
    {
      num: '03',
      title: 'Choose Cambodia Vault',
      desc: 'Select from 6 fortified, climate-controlled storage facilities in Phnom Penh, Siem Reap, Sihanoukville, and beyond.',
      icon: Warehouse
    },
    {
      num: '04',
      title: 'Instant Automated Deed',
      desc: 'Receive your simulated official deed of ownership by email and view your vehicles stored in My Garage.',
      icon: Award
    }
  ];

  return (
    <section className="py-16 bg-[#0c0c11] border-t border-[#1e1e2c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#e50914]">
            SEAMLESS SIMULATION
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
            HOW IT WORKS
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            From vehicle discovery to automated Cambodian vault assignment in four straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={i}
                className="relative bg-[#12121a] border border-[#222230] rounded-xl p-6 hover:border-red-600/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-red-950/60 border border-red-900/80 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-display font-black text-2xl text-neutral-600 group-hover:text-[#e50914] transition-colors">
                      {st.num}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-lg text-white uppercase">
                    {st.title}
                  </h3>

                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1c1c28] flex items-center text-[10px] font-bold uppercase tracking-wider text-red-400">
                  <span>Step {st.num} Protocol</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
