import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, DollarSign, RotateCcw, Sparkles } from 'lucide-react';
import VehicleCard from './VehicleCard';
import { playClickSound } from '../utils/audio';

export default function Marketplace({
  vehicles = [],
  loading,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  onSelectCategory,
  onSelectVehicle,
  onPurchaseVehicle
}) {
  const [sortBy, setSortBy] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(4000000);
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Filter & sort logic
  const filteredVehicles = useMemo(() => {
    let result = [...vehicles];

    // Category filter
    if (selectedCategory && selectedCategory !== 'All') {
      if (selectedCategory === 'Featured') {
        result = result.filter(v => v.isFeatured);
      } else {
        result = result.filter(v => v.category === selectedCategory);
      }
    }

    // Search filter
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        v =>
          v.brand.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q) ||
          (v.specifications?.engine && v.specifications.engine.toLowerCase().includes(q))
      );
    }

    // Price filter
    result = result.filter(v => v.price <= maxPrice);

    // Availability filter
    if (availabilityFilter !== 'All') {
      result = result.filter(v => v.availability === availabilityFilter);
    }

    // Sort
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'hp_desc') {
      result.sort((a, b) => (b.specifications?.horsepower || 0) - (a.specifications?.horsepower || 0));
    } else if (sortBy === 'speed_desc') {
      result.sort((a, b) => {
        const speedA = parseInt(a.specifications?.topSpeed) || 0;
        const speedB = parseInt(b.specifications?.topSpeed) || 0;
        return speedB - speedA;
      });
    }

    return result;
  }, [vehicles, selectedCategory, searchQuery, maxPrice, availabilityFilter, sortBy]);

  const resetFilters = () => {
    playClickSound();
    setSearchQuery('');
    setMaxPrice(4000000);
    setAvailabilityFilter('All');
    setSortBy('featured');
  };

  return (
    <section id="marketplace-section" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header & Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#20202c]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#e50914] rounded-full animate-ping" />
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#e50914]">
              LIVE INVENTORY
            </span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            {selectedCategory === 'All' ? 'ALL VEHICLE FLEET' : `${selectedCategory.toUpperCase()} COLLECTION`}
          </h2>
          <p className="text-xs text-neutral-400">
            Showing <span className="text-white font-bold">{filteredVehicles.length}</span> verified luxury models
          </p>
        </div>

        {/* Search & Filter Trigger */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Lamborghini, V12, SUV..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#14141d] border border-[#272738] focus:border-[#e50914] focus:outline-none rounded-lg text-xs text-white placeholder-neutral-500 transition-colors"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#14141d] border border-[#272738] rounded-lg px-3 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs text-neutral-200 focus:outline-none cursor-pointer uppercase font-bold"
            >
              <option value="featured" className="bg-[#14141d]">Sort: Featured</option>
              <option value="price_asc" className="bg-[#14141d]">Price: Low to High</option>
              <option value="price_desc" className="bg-[#14141d]">Price: High to Low</option>
              <option value="hp_desc" className="bg-[#14141d]">Power: Highest HP</option>
              <option value="speed_desc" className="bg-[#14141d]">Speed: Top Velocity</option>
            </select>
          </div>

          {/* Toggle Filter Panel */}
          <button
            onClick={() => {
              playClickSound();
              setShowFilters(!showFilters);
            }}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              showFilters
                ? 'bg-[#e50914] text-white shadow-sm'
                : 'bg-[#14141d] hover:bg-[#1e1e2b] border border-[#272738] text-neutral-300'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Expandable Filter Drawer */}
      {showFilters && (
        <div className="mt-4 p-5 bg-[#12121a] border border-[#242436] rounded-xl shadow-lg animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Price Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold uppercase text-neutral-300 mb-2">
                <span>Maximum Price</span>
                <span className="text-emerald-400 font-mono font-bold">
                  ${maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="35000"
                max="4000000"
                step="25000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#e50914] cursor-pointer bg-[#20202e] h-2 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-1">
                <span>$35K</span>
                <span>$2.0M</span>
                <span>$4.0M+</span>
              </div>
            </div>

            {/* Availability Filter */}
            <div>
              <div className="text-xs font-bold uppercase text-neutral-300 mb-2">
                Stock Status
              </div>
              <div className="flex gap-2">
                {['All', 'in_stock', 'low_stock'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      playClickSound();
                      setAvailabilityFilter(status);
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors ${
                      availabilityFilter === status
                        ? 'bg-[#e50914] text-white'
                        : 'bg-[#1c1c27] text-neutral-400 hover:text-white border border-[#29293a]'
                    }`}
                  >
                    {status === 'All' ? 'All' : status === 'in_stock' ? 'In Stock' : 'Low Stock'}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <div className="flex md:justify-end">
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#1b1b26] hover:bg-[#252535] border border-[#2c2c3e] rounded-lg text-xs font-bold text-neutral-300 hover:text-white uppercase tracking-wider transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-96 rounded-xl bg-[#13131b] border border-[#22222f] animate-pulse" />
          ))}
        </div>
      ) : filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle._id}
              vehicle={vehicle}
              onSelect={onSelectVehicle}
              onPurchase={onPurchaseVehicle}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#101016] rounded-2xl border border-[#222230] mt-8 space-y-4">
          <div className="w-14 h-14 bg-red-950/40 border border-red-800/50 rounded-full flex items-center justify-center mx-auto text-red-500">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-display font-black text-xl text-white uppercase">
            No Matching Vehicles Found
          </h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Try adjusting your search terms, increasing your price range, or selecting a different category.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 bg-[#e50914] text-white text-xs uppercase font-extrabold tracking-wider rounded-lg shadow-sm hover:shadow-red-glow transition-all"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </section>
  );
}
