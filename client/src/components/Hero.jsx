import React from 'react';
import { ArrowRight, Warehouse, Shield, Zap, Sparkles, Trophy } from 'lucide-react';
import { playClickSound } from '../utils/audio';

export default function Hero({ onExploreVehicles, onExploreGarages, featuredVehicle, onSelectVehicle }) {
  return (
    <div className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#1f1f2a]">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-red-600/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute -top-10 right-10 w-96 h-96 bg-red-800/10 blur-[90px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* VIP Status Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/60 border border-red-800/60 text-red-400 text-xs font-black tracking-widest uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-red-500 animate-spin" style={{ animationDuration: '6s' }} />
              <span>THE 2026 HYPERCAR & LUXURY VAULT REGISTRY</span>
            </div>

            {/* Main Headline */}
            <div>
              <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white uppercase leading-[0.95]">
                LEGENDARY <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a2a] via-[#e50914] to-[#ff7575] drop-shadow-sm">
                  MOTORS
                </span>
              </h1>
              <div className="mt-4 font-display font-extrabold text-lg sm:text-2xl text-neutral-300 tracking-wide uppercase italic">
                &ldquo;Premium Vehicles. Premium Garages. Your Collection.&rdquo;
              </div>
            </div>

            {/* Description */}
            <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Acquire the world’s most coveted hypercars, track specials, and ultra-luxury grand tourers. Every acquisition includes automated registration and guaranteed bay allocation across our 6 state-of-the-art climate vaults in Cambodia.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => {
                  playClickSound();
                  onExploreVehicles();
                }}
                className="w-full sm:w-auto px-8 py-4 bg-[#e50914] hover:bg-[#ff1f26] text-white font-display font-black text-sm uppercase tracking-widest rounded-lg shadow-red-glow hover:shadow-red-glow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Explore Vehicles</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  onExploreGarages();
                }}
                className="w-full sm:w-auto px-8 py-4 bg-[#14141c] hover:bg-[#1f1f2a] border border-[#2d2d3d] hover:border-red-600/50 text-neutral-200 hover:text-white font-display font-bold text-sm uppercase tracking-wider rounded-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Warehouse className="w-4 h-4 text-red-500" />
                <span>Cambodia Vault Map</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#1f1f2c] max-w-lg mx-auto lg:mx-0">
              <div>
                <div className="font-display font-black text-2xl text-white">14+</div>
                <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Pinnacle Models</div>
              </div>
              <div className="border-x border-[#1f1f2c] px-3">
                <div className="font-display font-black text-2xl text-[#e50914]">6 VAULTS</div>
                <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Cambodia Storage</div>
              </div>
              <div>
                <div className="font-display font-black text-2xl text-green-400">100%</div>
                <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Verified Deeds</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Vehicle Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative group cursor-pointer rounded-2xl overflow-hidden bg-gradient-to-b from-[#1c1c27] to-[#101016] border border-[#2b2b3b] shadow-2xl transition-all duration-500 hover:border-red-600/60 hover:shadow-red-glow">
              {/* Badge */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-black/75 backdrop-blur-md border border-red-600/50 px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase text-red-400">
                <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                <span>FLAGSHIP SPOTLIGHT</span>
              </div>

              {/* Price Tag */}
              <div className="absolute top-4 right-4 z-20 bg-[#e50914] text-white px-3.5 py-1 rounded-lg text-sm font-black font-display tracking-wider shadow-lg">
                ${(featuredVehicle?.price || 550000).toLocaleString()}
              </div>

              {/* Vehicle Image */}
              <div className="relative h-72 sm:h-80 overflow-hidden">
                <img
                  src={featuredVehicle?.images?.[0] || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1400&q=85'}
                  alt={featuredVehicle?.model || 'Lamborghini Revuelto'}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101016] via-transparent to-black/30" />
              </div>

              {/* Card Meta Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-widest text-red-500">
                      {featuredVehicle?.brand || 'Lamborghini'}
                    </span>
                    <h3 className="font-display font-black text-2xl text-white uppercase tracking-wide">
                      {featuredVehicle?.model || 'Revuelto V12 Hybrid'}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-neutral-400 bg-[#1e1e28] px-2.5 py-1 rounded">
                    {featuredVehicle?.category || 'Supercar'}
                  </span>
                </div>

                {/* Micro Specs */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#232332] text-center text-xs">
                  <div>
                    <div className="text-neutral-500 text-[10px] uppercase font-bold">POWER</div>
                    <div className="font-bold text-white font-mono">{featuredVehicle?.specifications?.horsepower || 1001} HP</div>
                  </div>
                  <div className="border-x border-[#232332]">
                    <div className="text-neutral-500 text-[10px] uppercase font-bold">0-100 KM/H</div>
                    <div className="font-bold text-white font-mono">{featuredVehicle?.specifications?.acceleration0to100 || '2.5s'}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500 text-[10px] uppercase font-bold">TOP SPEED</div>
                    <div className="font-bold text-white font-mono">{featuredVehicle?.specifications?.topSpeed || '350 km/h'}</div>
                  </div>
                </div>

                {/* Inspect Action */}
                <button
                  onClick={() => {
                    playClickSound();
                    if (featuredVehicle && onSelectVehicle) {
                      onSelectVehicle(featuredVehicle);
                    } else {
                      onExploreVehicles();
                    }
                  }}
                  className="w-full py-2.5 rounded-lg bg-[#20202d] hover:bg-[#e50914] text-neutral-200 hover:text-white text-xs uppercase font-extrabold tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>Inspect Specifications & Purchase</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
