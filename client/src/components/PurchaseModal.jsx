import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Mail,
  User,
  Phone,
  Warehouse,
  FileText,
  Sparkles,
  Loader2,
  ExternalLink,
  Eye
} from 'lucide-react';
import CambodiaMap from './CambodiaMap';
import { createOrder } from '../services/api';
import { playClickSound, playPurchaseSuccessSound } from '../utils/audio';

export default function PurchaseModal({
  vehicle,
  garages = [],
  onClose,
  onOrderSuccess,
  onViewGarage,
  onOpenInbox
}) {
  const [step, setStep] = useState(1); // 1: Email/Info, 2: Garage, 3: Summary, 4: Confirmed
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedGarage, setSelectedGarage] = useState(null);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);

  if (!vehicle) return null;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(vehicle.price);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#e50914', '#ffffff', '#ffd700', '#ff4d4d']
      });
    } catch (e) {
      // safe fallback
    }
  };

  // Step 1: Validate Email
  const handleEmailContinue = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    playClickSound();
    // Default to first available garage if none chosen yet
    if (!selectedGarage && garages.length > 0) {
      const firstAvailable = garages.find(g => g.availableSlots > 0) || garages[0];
      setSelectedGarage(firstAvailable);
    }
    setStep(2);
  };

  // Step 2: Validate Garage Selection
  const handleGarageContinue = () => {
    setErrorMessage('');
    if (!selectedGarage) {
      setErrorMessage('Please select a garage location in Cambodia.');
      return;
    }
    if (selectedGarage.availableSlots <= 0) {
      setErrorMessage('The selected garage has reached full capacity. Please choose another location.');
      return;
    }
    playClickSound();
    setStep(3);
  };

  // Step 3: Execute Purchase Transaction
  const handleConfirmPurchase = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      const response = await createOrder({
        vehicleId: vehicle._id,
        garageId: selectedGarage._id,
        email: email.trim(),
        name: name.trim() || 'Valued Collector',
        phone: phone.trim()
      });

      if (response.success && response.data?.order) {
        setCompletedOrder(response.data.order);
        setStep(4);
        playPurchaseSuccessSound();
        triggerConfetti();
        if (onOrderSuccess) {
          onOrderSuccess(response.data.order, email.trim());
        }
      } else {
        throw new Error(response.message || 'Purchase could not be completed.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Transaction failed. Please verify availability and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0e0e15] border border-[#252538] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header with Step Progress */}
        <div className="p-5 sm:px-8 bg-[#13131c] border-b border-[#222233] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#e50914] text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                STEP {step} OF 4
              </span>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                {step === 1 && 'Customer Identification'}
                {step === 2 && 'Cambodia Garage Selection'}
                {step === 3 && 'Order Review & Deed Authorization'}
                {step === 4 && 'Acquisition Confirmed'}
              </span>
            </div>
            <h2 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-tight mt-1">
              ACQUIRE {vehicle.brand} {vehicle.model}
            </h2>
          </div>

          {step !== 4 && (
            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-[#1a1a26] hover:bg-[#28283a] text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-[#181824] h-1.5">
          <div
            className="bg-gradient-to-r from-[#e50914] to-[#ff4d4d] h-full transition-all duration-500 shadow-red-glow"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-lg flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider">Error:</span> {errorMessage}
          </div>
        )}

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
          {/* STEP 1: EMAIL & CUSTOMER INFO */}
          {step === 1 && (
            <form onSubmit={handleEmailContinue} className="space-y-6 max-w-xl mx-auto">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-800/80 text-red-500 flex items-center justify-center mx-auto">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="font-display font-black text-2xl text-white uppercase">
                  Collector Identification
                </h3>
                <p className="text-xs text-neutral-400">
                  Please enter your email address where the automated deed and storage coordinates will be sent.
                </p>
              </div>

              {/* Vehicle Preview Card */}
              <div className="flex items-center gap-4 p-3.5 bg-[#14141f] border border-[#242436] rounded-xl">
                <img
                  src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=600&q=80'}
                  alt={vehicle.model}
                  className="w-20 h-16 object-cover rounded-lg border border-[#222233]"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase font-bold text-[#e50914]">{vehicle.brand}</div>
                  <div className="font-bold text-white text-sm truncate">{vehicle.model}</div>
                  <div className="text-xs text-neutral-400 font-mono font-bold mt-0.5">{formattedPrice}</div>
                </div>
              </div>

              {/* Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. collector@legendarymotors.vip"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#13131c] border border-[#28283a] focus:border-[#e50914] focus:outline-none rounded-lg text-sm text-white placeholder-neutral-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                      Collector Name (Optional)
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="e.g. Sir Alexander"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-[#13131c] border border-[#28283a] focus:border-[#e50914] focus:outline-none rounded-lg text-sm text-white placeholder-neutral-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        placeholder="e.g. +855 12 345 678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-[#13131c] border border-[#28283a] focus:border-[#e50914] focus:outline-none rounded-lg text-sm text-white placeholder-neutral-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#e50914] hover:bg-[#ff1a24] text-white font-display font-black text-xs uppercase tracking-widest rounded-lg shadow-red-glow transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Garage Selection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: CAMBODIA GARAGE MAP & SELECTION */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-display font-black text-xl text-white uppercase">
                    Select Cambodia Storage Vault
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Click any predefined garage marker or select from the list below.
                  </p>
                </div>

                {selectedGarage && (
                  <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    <span>Allocated: {selectedGarage.name}</span>
                  </div>
                )}
              </div>

              {/* Leaflet Map & Predefined Selector */}
              <CambodiaMap
                garages={garages}
                selectedGarage={selectedGarage}
                onSelectGarage={(g) => setSelectedGarage(g)}
                height="380px"
              />

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#222232]">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setStep(1);
                  }}
                  className="px-5 py-2.5 bg-[#171722] hover:bg-[#232333] text-neutral-300 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Email</span>
                </button>

                <button
                  type="button"
                  onClick={handleGarageContinue}
                  className="px-8 py-3 bg-[#e50914] hover:bg-[#ff1a24] text-white font-display font-black text-xs uppercase tracking-widest rounded-lg shadow-red-glow transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Order Summary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ORDER SUMMARY */}
          {step === 3 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-800/80 text-red-500 flex items-center justify-center mx-auto mb-2">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-display font-black text-2xl text-white uppercase">
                  Order Summary & Verification
                </h3>
                <p className="text-xs text-neutral-400">
                  Please review the acquisition details before authorizing simulated digital deed creation.
                </p>
              </div>

              {/* Order Breakdown Card */}
              <div className="bg-[#12121c] border border-[#272738] rounded-xl p-5 space-y-4">
                {/* Vehicle Row */}
                <div className="flex items-center gap-4 pb-4 border-b border-[#20202e]">
                  <img
                    src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=600&q=80'}
                    alt={vehicle.model}
                    className="w-24 h-16 object-cover rounded-lg border border-[#232332]"
                  />
                  <div className="flex-1">
                    <span className="text-[10px] uppercase font-bold text-[#e50914]">{vehicle.brand}</span>
                    <h4 className="font-display font-black text-lg text-white">{vehicle.model}</h4>
                    <span className="text-xs text-neutral-400 font-mono">{vehicle.specifications?.engine}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-neutral-500 uppercase font-bold">VEHICLE PRICE</div>
                    <div className="text-lg font-black font-display text-white">{formattedPrice}</div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-4 py-2 text-xs border-b border-[#20202e]">
                  <div>
                    <div className="text-neutral-500 uppercase font-bold text-[10px]">BUYER IDENTITY</div>
                    <div className="font-bold text-white mt-0.5">{name || 'Valued Collector'}</div>
                    <div className="text-neutral-400 font-mono">{email}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500 uppercase font-bold text-[10px]">STORAGE VAULT</div>
                    <div className="font-bold text-white mt-0.5">{selectedGarage?.name}</div>
                    <div className="text-neutral-400">{selectedGarage?.city}, Cambodia</div>
                  </div>
                </div>

                {/* Pricing Table */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Base Vehicle Cost</span>
                    <span className="font-mono text-white">{formattedPrice}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Cambodia Armored Vault Allocation</span>
                    <span className="font-mono text-emerald-400 font-bold">COMPLIMENTARY</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Digital Authenticity Deed Registration</span>
                    <span className="font-mono text-emerald-400 font-bold">INCLUDED</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-[#232332] text-base font-black">
                    <span className="text-white uppercase font-display">Total Amount</span>
                    <span className="text-[#e50914] font-mono text-xl">{formattedPrice}</span>
                  </div>
                </div>
              </div>

              {/* Agreement Checkbox */}
              <label className="flex items-start gap-3 p-3 bg-[#13131c] border border-[#232333] rounded-lg cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 accent-[#e50914] w-4 h-4 rounded cursor-pointer"
                />
                <span>
                  I authorize Legendary Motors to assign this vehicle to the designated Cambodian storage vault and dispatch the automated deed to <strong>{email}</strong>.
                </span>
              </label>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setStep(2);
                  }}
                  className="px-5 py-3 bg-[#171722] hover:bg-[#232333] text-neutral-300 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Modify Garage / Email</span>
                </button>

                <button
                  type="button"
                  disabled={loading || !agreeTerms}
                  onClick={handleConfirmPurchase}
                  className={`px-8 py-3.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                    loading || !agreeTerms
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                      : 'bg-[#e50914] hover:bg-[#ff1a24] text-white shadow-red-glow cursor-pointer transform hover:-translate-y-0.5'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Transaction...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirm Purchase</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PURCHASE CONFIRMED */}
          {step === 4 && completedOrder && (
            <div className="space-y-6 max-w-2xl mx-auto text-center animate-fadeIn">
              {/* Checkmark Stamp */}
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div>
                <div className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
                  TRANSACTION AUTHORIZED & REGISTERED
                </div>
                <h3 className="font-display font-black text-3xl text-white uppercase mt-1">
                  ✓ PURCHASE CONFIRMED
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Thank you for your purchase! Your vehicle has been officially logged into the registry.
                </p>
              </div>

              {/* Order Credentials Box */}
              <div className="bg-[#12121c] border border-red-900/40 rounded-xl p-6 text-left space-y-4 shadow-red-glow">
                <div className="flex justify-between items-center pb-3 border-b border-[#222232]">
                  <div>
                    <span className="text-[10px] text-neutral-500 font-bold uppercase">ORDER IDENTIFIER</span>
                    <div className="font-display font-black text-lg text-white tracking-widest">
                      #{completedOrder.orderNumber}
                    </div>
                  </div>
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider">
                    STORED IN VAULT
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase font-bold">VEHICLE</span>
                    <div className="font-bold text-white mt-0.5">
                      {completedOrder.vehicleSnapshot?.brand} {completedOrder.vehicleSnapshot?.model}
                    </div>
                    <div className="text-neutral-400 font-mono mt-0.5 font-bold text-emerald-400">
                      ${completedOrder.price?.toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase font-bold">GARAGE ALLOCATION</span>
                    <div className="font-bold text-white mt-0.5">
                      {completedOrder.garageSnapshot?.name}
                    </div>
                    <div className="text-neutral-400">
                      {completedOrder.garageSnapshot?.city}, Cambodia
                    </div>
                  </div>
                </div>

                {/* Email Notice */}
                <div className="p-3.5 bg-[#17141f] border border-red-800/40 rounded-lg flex items-center gap-3">
                  <Mail className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <div className="text-xs text-neutral-300">
                    A luxury acquisition certificate and confirmation email has been dispatched to: <br />
                    <span className="font-bold text-white font-mono">{completedOrder.customerSnapshot?.email || email}</span>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    playClickSound();
                    onClose();
                    if (onViewGarage) onViewGarage(email);
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#e50914] hover:bg-[#ff1a24] text-white font-display font-black text-xs uppercase tracking-widest rounded-lg shadow-red-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Warehouse className="w-4 h-4" />
                  <span>View in My Garage</span>
                </button>

                <button
                  onClick={() => {
                    playClickSound();
                    onClose();
                    if (onOpenInbox) onOpenInbox();
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#171722] hover:bg-[#232333] border border-[#2e2e42] text-neutral-200 hover:text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-red-500" />
                  <span>Preview Generated Confirmation Email</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
