import React from 'react';
import { Warehouse, Shield, Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import { playClickSound } from '../utils/audio';

export default function Footer({ onNavigate, onOpenInbox }) {
  return (
    <footer className="bg-[#08080b] border-t border-[#1e1e28] text-neutral-400 text-xs">
      {/* Top Banner */}
      <div className="border-b border-[#181822] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#e50914] rounded-lg flex items-center justify-center text-white font-display font-black text-base shadow-red-glow">
                LM
              </div>
              <span className="font-display font-black text-lg text-white tracking-wider">
                LEGENDARY <span className="text-[#e50914]">MOTORS</span>
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              &ldquo;Premium Vehicles. Premium Garages. Your Collection.&rdquo;
            </p>
            <p className="text-[11px] text-neutral-500">
              Inspired by GTA V Legendary Motorsport. Designed as an advanced full-stack portfolio experience.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-display font-black text-xs uppercase tracking-widest text-white">
              NAVIGATION
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => { playClickSound(); onNavigate('marketplace'); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Showroom & Fleet
                </button>
              </li>
              <li>
                <button
                  onClick={() => { playClickSound(); onNavigate('garages'); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Cambodia Vault Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => { playClickSound(); onNavigate('how-it-works'); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => { playClickSound(); onNavigate('my-garage'); }}
                  className="hover:text-white transition-colors cursor-pointer text-yellow-400"
                >
                  My Garage
                </button>
              </li>
              <li>
                <button
                  onClick={() => { playClickSound(); onOpenInbox(); }}
                  className="hover:text-white transition-colors cursor-pointer text-red-400"
                >
                  Dispatched Email Deeds
                </button>
              </li>
            </ul>
          </div>

          {/* Cambodia Hubs */}
          <div className="space-y-3">
            <h4 className="font-display font-black text-xs uppercase tracking-widest text-white">
              CAMBODIAN STORAGE HUBS
            </h4>
            <ul className="space-y-1.5 text-[11px] text-neutral-400">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#e50914]" /> Phnom Penh VIP Vault (Koh Pich)
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#e50914]" /> Siem Reap Heritage Depot
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#e50914]" /> Sihanoukville Coastal Harbor
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#e50914]" /> Battambang Colonial Reserve
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#e50914]" /> Kampot Riverfront Haven
              </li>
            </ul>
          </div>

          {/* VIP Concierge */}
          <div className="space-y-3">
            <h4 className="font-display font-black text-xs uppercase tracking-widest text-white">
              VIP CONCIERGE (SIMULATED)
            </h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              24/7 Monitored collector operations across Cambodia. Automated receipt generation & instant digital deed validation.
            </p>
            <div className="text-[11px] font-mono text-neutral-300 space-y-1">
              <div>Email: concierge@legendarymotors.vip</div>
              <div>Direct: +855 (23) 999-VAULT</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal / Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-neutral-500">
        <div>
          &copy; 2026 LEGENDARY MOTORS INC. ALL RIGHTS RESERVED.
        </div>
        <div className="text-center sm:text-right">
          PORTFOLIO PROJECT &bull; NO REAL MONEY REQUIRED &bull; SIMULATED TRANSACTIONS
        </div>
      </div>
    </footer>
  );
}
