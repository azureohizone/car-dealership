import React, { useState } from 'react';
import { X, ShoppingCart, Check, Shield, Flame, Gauge, Zap, Fuel, Sparkles, ChevronRight } from 'lucide-react';
import { playClickSound } from '../utils/audio';

export default function VehicleDetailsModal({ vehicle, onClose, onPurchase }) {
  if (!vehicle) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(vehicle.price);

  const isSold = vehicle.availability === 'sold' || (vehicle.stockCount !== undefined && vehicle.stockCount <= 0);

  const images = vehicle.images && vehicle.images.length > 0
    ? vehicle.images
    : ['https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0f0f15] border border-[#272738] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#14141d] border-b border-[#242435]">
          <div className="flex items-center gap-3">
            <span className="bg-[#e50914] text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded">
              {vehicle.category}
            </span>
            <span className="text-xs uppercase font-extrabold tracking-widest text-neutral-400">
              {vehicle.brand} &bull; {vehicle.year || 2026}
            </span>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-[#1e1e2b] hover:bg-[#2e2e42] text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-8">
          {/* Main Gallery Showcase */}
          <div className="space-y-3">
            <div className="relative h-72 sm:h-96 w-full rounded-xl overflow-hidden bg-[#08080b] border border-[#232332]">
              <img
                src={images[activeImageIndex]}
                alt={vehicle.model}
                className="w-full h-full object-cover object-center transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f15]/80 via-transparent to-black/20" />

              {/* Price Tag Overlay */}
              <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md border border-[#2d2d3f] p-3 rounded-lg shadow-xl">
                <div className="text-[10px] uppercase font-bold text-[#e50914] tracking-widest">
                  LIST PRICE (ACQUISITION)
                </div>
                <div className="font-display font-black text-2xl sm:text-3xl text-white">
                  {formattedPrice}
                </div>
              </div>

              {/* Badge */}
              {vehicle.badge && (
                <div className="absolute top-4 right-4 bg-[#e50914] text-white px-3 py-1 rounded text-xs font-black uppercase tracking-wider shadow">
                  {vehicle.badge}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      playClickSound();
                      setActiveImageIndex(idx);
                    }}
                    className={`relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#e50914] scale-105 shadow-red-glow'
                        : 'border-[#222230] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Lore Section */}
          <div className="space-y-3">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
              {vehicle.brand} {vehicle.model}
            </h2>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              {vehicle.description}
            </p>
          </div>

          {/* Technical Specifications Grid */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#222230]">
              <Gauge className="w-4 h-4 text-[#e50914]" />
              <h3 className="font-display font-black text-sm uppercase tracking-widest text-white">
                OFFICIAL TECHNICAL SPECIFICATIONS
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <div className="p-3.5 bg-[#14141e] border border-[#242436] rounded-lg">
                <div className="text-[10px] uppercase font-bold text-neutral-400">ENGINE</div>
                <div className="font-bold text-white text-xs sm:text-sm font-mono mt-0.5">
                  {vehicle.specifications?.engine || 'Bespoke V12'}
                </div>
              </div>

              <div className="p-3.5 bg-[#14141e] border border-[#242436] rounded-lg">
                <div className="text-[10px] uppercase font-bold text-neutral-400">HORSEPOWER</div>
                <div className="font-bold text-[#e50914] text-sm sm:text-base font-mono mt-0.5">
                  {vehicle.specifications?.horsepower || '---'} HP
                </div>
              </div>

              <div className="p-3.5 bg-[#14141e] border border-[#242436] rounded-lg">
                <div className="text-[10px] uppercase font-bold text-neutral-400">0-100 KM/H</div>
                <div className="font-bold text-white text-sm sm:text-base font-mono mt-0.5">
                  {vehicle.specifications?.acceleration0to100 || '---'}
                </div>
              </div>

              <div className="p-3.5 bg-[#14141e] border border-[#242436] rounded-lg">
                <div className="text-[10px] uppercase font-bold text-neutral-400">TOP VELOCITY</div>
                <div className="font-bold text-white text-sm sm:text-base font-mono mt-0.5">
                  {vehicle.specifications?.topSpeed || '---'}
                </div>
              </div>

              <div className="p-3.5 bg-[#14141e] border border-[#242436] rounded-lg">
                <div className="text-[10px] uppercase font-bold text-neutral-400">TRANSMISSION</div>
                <div className="font-bold text-white text-xs sm:text-sm font-mono mt-0.5">
                  {vehicle.specifications?.transmission || 'Dual-Clutch'}
                </div>
              </div>

              <div className="p-3.5 bg-[#14141e] border border-[#242436] rounded-lg">
                <div className="text-[10px] uppercase font-bold text-neutral-400">FUEL ARCHITECTURE</div>
                <div className="font-bold text-white text-xs sm:text-sm font-mono mt-0.5">
                  {vehicle.specifications?.fuelType || 'Hybrid'}
                </div>
              </div>

              <div className="p-3.5 bg-[#14141e] border border-[#242436] rounded-lg">
                <div className="text-[10px] uppercase font-bold text-neutral-400">DRIVE TYPE</div>
                <div className="font-bold text-white text-xs sm:text-sm font-mono mt-0.5">
                  {vehicle.specifications?.driveType || 'AWD'}
                </div>
              </div>

              <div className="p-3.5 bg-[#14141e] border border-[#242436] rounded-lg">
                <div className="text-[10px] uppercase font-bold text-neutral-400">SEATS & WEIGHT</div>
                <div className="font-bold text-white text-xs sm:text-sm font-mono mt-0.5">
                  {vehicle.specifications?.seats || 2} Seats &bull; {vehicle.specifications?.weight || 'Bespoke'}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Features */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#222230]">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <h3 className="font-display font-black text-sm uppercase tracking-widest text-white">
                  INCLUDED LUXURY & TRACK PACKAGES
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {vehicle.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2.5 bg-[#13131c] rounded-lg text-xs text-neutral-300">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vault Storage Guarantee Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#17141f] to-[#13131c] border border-red-900/30 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-red-950/80 border border-red-800/80 flex items-center justify-center text-red-400 flex-shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <div className="font-bold text-white uppercase tracking-wider">
                COMPLIMENTARY CAMBODIA VAULT STORAGE ALLOCATION
              </div>
              <p className="text-neutral-400 mt-0.5">
                Every purchase includes automated registration into your choice of 6 high-security climate vaults in Cambodia with 24/7 armed protection.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Sticky Bottom Actions */}
        <div className="p-5 bg-[#14141d] border-t border-[#242435] flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase font-bold text-neutral-400">TOTAL PRICE</div>
            <div className="text-xl sm:text-2xl font-black font-display text-white">
              {formattedPrice}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="px-5 py-3 bg-[#1e1e2b] hover:bg-[#29293a] text-neutral-300 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Back
            </button>

            <button
              disabled={isSold}
              onClick={() => {
                playClickSound();
                onClose();
                onPurchase(vehicle);
              }}
              className={`px-8 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                isSold
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                  : 'bg-[#e50914] hover:bg-[#ff1a24] text-white shadow-red-glow cursor-pointer transform hover:-translate-y-0.5'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{isSold ? 'Sold Out' : 'Purchase Vehicle'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
