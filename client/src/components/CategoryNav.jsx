import React from 'react';
import { Flame, Star, Compass, Shield, Bike, Car, Gauge, Sparkles } from 'lucide-react';
import { playClickSound } from '../utils/audio';

const categoryIcons = {
  All: Compass,
  Featured: Star,
  Supercars: Flame,
  '2 Door': Gauge,
  '4 Door': Car,
  SUV: Shield,
  Motorcycles: Bike,
  Special: Sparkles
};

export default function CategoryNav({ categories = [], activeCategory, onSelectCategory }) {
  return (
    <div className="w-full bg-[#0d0d12] border-y border-[#22222e] py-4 sticky top-20 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {categories.map((cat) => {
            const name = typeof cat === 'string' ? cat : cat.name;
            const count = typeof cat === 'object' ? cat.count : null;
            const Icon = categoryIcons[name] || Car;
            const isActive = activeCategory === name;

            return (
              <button
                key={name}
                onClick={() => {
                  playClickSound();
                  onSelectCategory(name);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#e50914] text-white shadow-red-glow'
                    : 'bg-[#15151e] text-neutral-300 hover:text-white hover:bg-[#20202b] border border-[#272736]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-red-500'}`} />
                <span>{name}</span>
                {count !== null && count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isActive ? 'bg-black/40 text-white' : 'bg-[#272736] text-neutral-400'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
