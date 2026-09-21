import React from 'react';
import { Zap, Gauge, Eye, ShoppingCart, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { playClickSound } from '../utils/audio';

export default function VehicleCard({ vehicle, onSelect, onPurchase }) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(vehicle.price);

  const getAvailabilityBadge = () => {
    switch (vehicle.availability) {
      case 'in_stock':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
            <CheckCircle className="w-3 h-3" /> In Stock ({vehicle.stockCount || 1})
          </span>
        );
      case 'low_stock':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-950/80 text-amber-400 border border-amber-800/80 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded animate-pulse">
            <AlertTriangle className="w-3 h-3" /> Low Stock (1 left)
          </span>
        );
      case 'sold':
        return (
          <span className="inline-flex items-center gap-1 bg-neutral-900 text-neutral-400 border border-neutral-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
            <XCircle className="w-3 h-3" /> Sold Out
          </span>
        );
      default:
        return null;
    }
  };

  const isSold = vehicle.availability === 'sold' || (vehicle.stockCount !== undefined && vehicle.stockCount <= 0);

  return (
    <div className="group relative bg-[#121218] hover:bg-[#161620] border border-[#22222f] hover:border-[#e50914]/70 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-red-glow flex flex-col">
      {/* Top Banner Tag / Stock Badge */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
        {vehicle.badge && (
          <span className="bg-black/80 backdrop-blur-md text-red-400 border border-red-900/80 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow">
            {vehicle.badge}
          </span>
        )}
      </div>

      <div className="absolute top-3 right-3 z-20">
        {getAvailabilityBadge()}
      </div>

      {/* Vehicle Image with zoom */}
      <div 
        onClick={() => {
          playClickSound();
          onSelect(vehicle);
        }}
        className="relative h-56 w-full overflow-hidden cursor-pointer bg-[#0e0e14]"
      >
        <img
          src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80'}
          alt={`${vehicle.brand} ${vehicle.model}`}
          loading="lazy"
          className={`w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out ${isSold ? 'grayscale opacity-60' : ''}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121218] via-transparent to-black/20" />
      </div>

      {/* Vehicle Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
            <span className="uppercase font-extrabold tracking-widest text-[#e50914]">
              {vehicle.brand}
            </span>
            <span className="font-semibold text-neutral-400 text-[11px] bg-[#1a1a24] px-2 py-0.5 rounded">
              {vehicle.category}
            </span>
          </div>

          <h3 
            onClick={() => {
              playClickSound();
              onSelect(vehicle);
            }}
            className="font-display font-black text-xl text-white uppercase tracking-wide cursor-pointer hover:text-red-400 transition-colors line-clamp-1"
          >
            {vehicle.model}
          </h3>

          <div className="mt-2 text-2xl font-black font-display text-white">
            {formattedPrice}
          </div>
        </div>

        {/* Micro Specification Bar */}
        <div className="grid grid-cols-3 gap-1 py-2 px-2 bg-[#0c0c11] rounded-lg border border-[#1e1e28] text-center text-[11px]">
          <div>
            <div className="text-neutral-500 font-bold text-[9px] uppercase">POWER</div>
            <div className="font-bold text-neutral-200 font-mono">
              {vehicle.specifications?.horsepower || '---'} HP
            </div>
          </div>
          <div className="border-x border-[#1e1e28]">
            <div className="text-neutral-500 font-bold text-[9px] uppercase">0-100</div>
            <div className="font-bold text-neutral-200 font-mono">
              {vehicle.specifications?.acceleration0to100 || '---'}
            </div>
          </div>
          <div>
            <div className="text-neutral-500 font-bold text-[9px] uppercase">SPEED</div>
            <div className="font-bold text-neutral-200 font-mono truncate">
              {vehicle.specifications?.topSpeed ? vehicle.specifications.topSpeed.split(' ')[0] : '---'}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => {
              playClickSound();
              onSelect(vehicle);
            }}
            className="w-full py-2.5 px-3 bg-[#1c1c27] hover:bg-[#252533] border border-[#2c2c3d] text-neutral-300 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-neutral-400" />
            <span>Details</span>
          </button>

          <button
            disabled={isSold}
            onClick={() => {
              playClickSound();
              onPurchase(vehicle);
            }}
            className={`w-full py-2.5 px-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              isSold
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                : 'bg-[#e50914] hover:bg-[#ff1a24] text-white shadow-md hover:shadow-red-glow cursor-pointer'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{isSold ? 'Sold' : 'Purchase'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
