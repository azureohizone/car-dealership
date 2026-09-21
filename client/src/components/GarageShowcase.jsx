import React, { useState } from 'react';
import { Warehouse, ShieldCheck, MapPin, Check, Sparkles, Navigation } from 'lucide-react';
import CambodiaMap from './CambodiaMap';
import { playClickSound } from '../utils/audio';

export default function GarageShowcase({ garages = [] }) {
  const [selectedGarage, setSelectedGarage] = useState(garages[0] || null);

  return (
    <section id="garages-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-black uppercase tracking-widest text-[#e50914]">
          SECURE STORAGE NETWORK
        </span>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
          CAMBODIA LUXURY VAULT LOCATIONS
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400">
          Six fortified, climate-stabilized storage hubs strategically positioned across Cambodia for maximum security, discreet privacy, and rapid deployment.
        </p>
      </div>

      {/* Interactive Map Component */}
      <CambodiaMap
        garages={garages}
        selectedGarage={selectedGarage}
        onSelectGarage={(g) => setSelectedGarage(g)}
        height="440px"
      />

      {/* Feature Cards for 6 Garages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {garages.map((g) => {
          const isSelected = selectedGarage && selectedGarage._id === g._id;
          return (
            <div
              key={g._id || g.name}
              onClick={() => {
                playClickSound();
                setSelectedGarage(g);
              }}
              className={`bg-[#12121a] border rounded-xl overflow-hidden p-5 space-y-4 cursor-pointer transition-all duration-300 hover:shadow-red-glow ${
                isSelected
                  ? 'border-[#e50914] bg-gradient-to-b from-[#181419] to-[#12121a]'
                  : 'border-[#222230] hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#e50914]">
                  {g.city}, CAMBODIA
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/60">
                  {g.availableSlots} / {g.capacity} Free
                </span>
              </div>

              <div>
                <h3 className="font-display font-black text-lg text-white uppercase">
                  {g.name}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                  {g.locationDescription}
                </p>
              </div>

              {/* Security info */}
              <div className="p-2.5 bg-[#0e0e14] rounded-lg border border-[#1f1f2c] flex items-center gap-2 text-xs text-neutral-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-[11px]">{g.securityInformation}</span>
              </div>

              {/* Facility Perks */}
              {g.facilityPerks && g.facilityPerks.length > 0 && (
                <div className="space-y-1 text-[11px] text-neutral-400 pt-1">
                  {g.facilityPerks.slice(0, 2).map((perk, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-red-500 flex-shrink-0" />
                      <span className="truncate">{perk}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
