import React, { useState, useEffect } from 'react';
import {
  Warehouse,
  ShieldCheck,
  Search,
  Car,
  Calendar,
  DollarSign,
  Award,
  ExternalLink,
  MapPin,
  RefreshCw,
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';
import { fetchCustomerGarage } from '../services/api';
import { playClickSound } from '../utils/audio';

export default function MyGarage({ customerEmail, onSwitchEmail, onBrowseShowroom, onInspectVehicle }) {
  const [emailInput, setEmailInput] = useState(customerEmail || 'collector@legendarymotors.vip');
  const [garageData, setGarageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const loadCustomerFleet = async (emailToFetch) => {
    if (!emailToFetch || !emailToFetch.trim()) return;
    setLoading(true);
    try {
      const res = await fetchCustomerGarage(emailToFetch.trim());
      if (res.success) {
        setGarageData(res);
      }
    } catch (err) {
      console.error('Error fetching garage data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerEmail) {
      setEmailInput(customerEmail);
      loadCustomerFleet(customerEmail);
    } else {
      loadCustomerFleet(emailInput);
    }
  }, [customerEmail]);

  const handleLookup = (e) => {
    e.preventDefault();
    playClickSound();
    if (onSwitchEmail) onSwitchEmail(emailInput);
    loadCustomerFleet(emailInput);
  };

  // Calculate fleet stats
  const totalFleetValue = garageData?.orders?.reduce((sum, order) => sum + (order.price || 0), 0) || 0;
  const totalHp = garageData?.orders?.reduce((sum, order) => sum + (order.vehicleSnapshot?.horsepower || 0), 0) || 0;

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#17141f] via-[#13131c] to-[#121218] border border-[#272738] rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 blur-[90px] pointer-events-none rounded-full" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-[#e50914]" />
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#e50914]">
                COLLECTOR PORTFOLIO & VAULT FLEET
              </span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight mt-1">
              MY GARAGE
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
              Inspect your stored exotic vehicles, digital acquisition deeds, and storage security status across the Kingdom of Cambodia.
            </p>
          </div>

          {/* Email Switcher / Lookup */}
          <form onSubmit={handleLookup} className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-80">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Lookup email..."
                className="w-full pl-4 pr-10 py-2.5 bg-[#0e0e14] border border-[#29293c] focus:border-[#e50914] focus:outline-none rounded-lg text-xs text-white placeholder-neutral-500 font-mono"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white"
                title="Refresh Fleet"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#e50914] hover:bg-[#ff1a24] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
            >
              Lookup
            </button>
          </form>
        </div>

        {/* Fleet Metrics Bar */}
        {garageData && garageData.totalVehicles > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#20202e]">
            <div>
              <div className="text-[10px] uppercase font-bold text-neutral-400">TOTAL VEHICLES</div>
              <div className="font-display font-black text-2xl text-white">
                {garageData.totalVehicles} Models
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-neutral-400">FLEET ASSET VALUE</div>
              <div className="font-display font-black text-2xl text-emerald-400">
                ${totalFleetValue.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-neutral-400">TOTAL OUTPUT POWER</div>
              <div className="font-display font-black text-2xl text-[#e50914]">
                {totalHp.toLocaleString()} HP
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-neutral-400">ACTIVE VAULTS</div>
              <div className="font-display font-black text-2xl text-white">
                {garageData.garagesBreakdown?.length || 1} Locations
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-80 rounded-xl bg-[#13131c] animate-pulse border border-[#222230]" />
          ))}
        </div>
      ) : garageData && garageData.orders && garageData.orders.length > 0 ? (
        <div className="space-y-8">
          {/* Garages Breakdown */}
          {garageData.garagesBreakdown && garageData.garagesBreakdown.map((garageGroup, idx) => (
            <div key={idx} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#222230]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#e50914]" />
                  <h2 className="font-display font-black text-lg text-white uppercase tracking-wide">
                    {garageGroup.garageName} &bull; <span className="text-neutral-400 font-normal">{garageGroup.city}, Cambodia</span>
                  </h2>
                </div>
                <span className="text-xs bg-[#191924] text-neutral-300 px-3 py-1 rounded-full font-bold">
                  {garageGroup.vehicles.length} {garageGroup.vehicles.length === 1 ? 'Vehicle' : 'Vehicles'} Parked
                </span>
              </div>

              {/* Vehicle Cards in this garage */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {garageGroup.vehicles.map((item, vIdx) => {
                  const v = item.vehicle || {};
                  const purchaseDateStr = new Date(item.purchaseDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  });

                  return (
                    <div
                      key={vIdx}
                      className="bg-[#121218] border border-[#242435] rounded-xl overflow-hidden shadow-lg hover:border-red-600/60 transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div>
                        {/* Vehicle Image */}
                        <div className="relative h-48 bg-[#0a0a0d] overflow-hidden">
                          <img
                            src={v.image || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=600&q=80'}
                            alt={`${v.brand} ${v.model}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded text-[10px] font-black uppercase text-[#e50914] tracking-wider">
                            #{item.orderNumber}
                          </div>
                          <div className="absolute top-3 right-3 bg-emerald-950/80 border border-emerald-800 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> {item.status || 'Stored'}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-5 space-y-3">
                          <div>
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                              {v.brand}
                            </span>
                            <h3 className="font-display font-black text-xl text-white uppercase">
                              {v.model}
                            </h3>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-[#1e1e2c]">
                            <div>
                              <span className="text-neutral-500 text-[10px] uppercase font-bold">Purchased</span>
                              <div className="text-neutral-200 font-medium">{purchaseDateStr}</div>
                            </div>
                            <div>
                              <span className="text-neutral-500 text-[10px] uppercase font-bold">Acquisition Value</span>
                              <div className="text-emerald-400 font-mono font-bold">
                                ${(item.price || v.price || 0).toLocaleString()}
                              </div>
                            </div>
                          </div>

                          <div className="text-[11px] text-neutral-400">
                            <span className="font-bold text-neutral-300">Vault:</span> {garageGroup.garageName}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="p-4 bg-[#151520] border-t border-[#20202f] flex gap-2">
                        <button
                          onClick={() => {
                            playClickSound();
                            setSelectedCertificate(item);
                          }}
                          className="w-full py-2 bg-[#20202e] hover:bg-[#e50914] text-neutral-200 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Digital Deed</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-[#101016] rounded-2xl border border-[#222230] space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 bg-red-950/40 border border-red-800/60 rounded-full flex items-center justify-center mx-auto text-red-500">
            <Car className="w-8 h-8" />
          </div>
          <h3 className="font-display font-black text-2xl text-white uppercase">
            No Vehicles Registered Under This Email
          </h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            You currently have no acquired vehicles stored under <strong className="text-white font-mono">{emailInput}</strong>. Browse the showroom to select and store your first supercar.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                playClickSound();
                if (onBrowseShowroom) onBrowseShowroom();
              }}
              className="px-6 py-3 bg-[#e50914] hover:bg-[#ff1a24] text-white text-xs uppercase font-extrabold tracking-widest rounded-lg shadow-red-glow transition-all flex items-center gap-2 mx-auto cursor-pointer"
            >
              <span>Browse Showroom Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Digital Deed / Certificate Inspection Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#12121a] border-2 border-[#e50914] max-w-lg w-full rounded-2xl p-6 sm:p-8 space-y-6 relative shadow-red-glow animate-fadeIn">
            <button
              onClick={() => setSelectedCertificate(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1"
            >
              ✕
            </button>

            {/* Certificate Header */}
            <div className="text-center border-b border-[#252538] pb-4">
              <div className="w-10 h-10 bg-[#e50914] rounded-full flex items-center justify-center mx-auto mb-2 text-white font-black font-display">
                LM
              </div>
              <h3 className="font-display font-black text-xl text-white uppercase tracking-wider">
                CERTIFICATE OF ACQUISITION & DEED
              </h3>
              <p className="text-[10px] text-neutral-400 uppercase tracking-widest mt-0.5">
                LEGENDARY MOTORS HIGH SECURITY REGISTRY &bull; CAMBODIA
              </p>
            </div>

            {/* Deed Content */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-[#20202e]">
                <span className="text-neutral-400">Order Reference:</span>
                <span className="font-mono font-bold text-white">#{selectedCertificate.orderNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#20202e]">
                <span className="text-neutral-400">Vehicle:</span>
                <span className="font-bold text-white">
                  {selectedCertificate.vehicle?.brand} {selectedCertificate.vehicle?.model}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#20202e]">
                <span className="text-neutral-400">Vault Location:</span>
                <span className="font-bold text-white">{selectedCertificate.vehicle?.garage || 'Phnom Penh Vault'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#20202e]">
                <span className="text-neutral-400">Ownership Status:</span>
                <span className="font-bold text-emerald-400 uppercase">Secured & Insured</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#20202e]">
                <span className="text-neutral-400">Valuation:</span>
                <span className="font-mono font-bold text-white">${selectedCertificate.price?.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-lg text-[10px] text-neutral-400 text-center">
              This digital deed certifies simulated legal assignment of the vehicle into our climate-controlled Cambodian facility.
            </div>

            <button
              onClick={() => setSelectedCertificate(null)}
              className="w-full py-2.5 bg-[#e50914] text-white text-xs font-bold uppercase rounded-lg tracking-wider"
            >
              Close Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
