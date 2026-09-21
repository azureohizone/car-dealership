import React from 'react';
import { ShieldCheck, Mail, Volume2, VolumeX, Warehouse, Flame, Compass, Sparkles, Settings2 } from 'lucide-react';
import { playClickSound, isSoundEnabled, toggleSound } from '../utils/audio';

export default function Navbar({ activeTab, setActiveTab, emailCount, onOpenInbox, onOpenMyGarage }) {
  const [soundOn, setSoundOn] = React.useState(isSoundEnabled());

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  const navItems = [
    { id: 'marketplace', label: 'Showroom', icon: Flame },
    { id: 'garages', label: 'Cambodia Vaults', icon: Warehouse },
    { id: 'how-it-works', label: 'How It Works', icon: Compass },
    { id: 'my-garage', label: 'My Garage', icon: ShieldCheck, highlight: true },
    { id: 'admin', label: 'Admin', icon: Settings2, admin: true }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0a0d]/90 backdrop-blur-md border-b border-[#22222d]">
      {/* Top Motorsport Ticker */}
      <div className="bg-[#b91c1c] text-white text-[11px] font-bold tracking-widest uppercase py-1 px-4 overflow-hidden shadow-inner flex items-center justify-between">
        <div className="flex items-center space-x-6 animate-pulse-subtle">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" /> OFFICIAL 2026 FLEET
          </span>
          <span className="hidden md:inline text-red-200">
            • 6 HIGH-SECURITY PRIVATE VAULTS IN CAMBODIA • INSTANT SIMULATED DIGITAL DEED •
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-black/30 px-2 py-0.5 rounded text-[10px] tracking-wider text-red-100 font-mono">
            PORTFOLIO DEMO
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => { playClickSound(); setActiveTab('marketplace'); }}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 bg-gradient-to-br from-[#e50914] to-[#990000] rounded-lg p-0.5 flex items-center justify-center shadow-red-glow transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1">
            <div className="w-full h-full bg-[#0d0d12] rounded-[6px] flex items-center justify-center">
              <span className="font-display font-black text-xl text-white tracking-tighter">LM</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-xl sm:text-2xl tracking-wider text-white group-hover:text-red-500 transition-colors">
                LEGENDARY
              </span>
              <span className="font-display font-black text-xl sm:text-2xl tracking-wider text-[#e50914]">
                MOTORS
              </span>
            </div>
            <p className="text-[10px] uppercase font-bold tracking-[0.25em] text-neutral-400">
              Motorsport &bull; Vaults
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  playClickSound();
                  setActiveTab(item.id);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs uppercase font-bold tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-[#e50914] text-white shadow-red-glow'
                    : item.highlight
                    ? 'text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30'
                    : item.admin
                    ? 'text-neutral-400 bg-white/5 hover:bg-white/10 border border-white/10'
                    : 'text-neutral-300 hover:text-white hover:bg-[#1c1c24]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-yellow-400' : item.admin ? 'text-neutral-400' : 'text-red-500'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Actions (Sound + Email Preview Trigger) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            onClick={handleSoundToggle}
            title={soundOn ? 'Mute SFX' : 'Enable SFX'}
            className="p-2.5 rounded-lg bg-[#14141c] hover:bg-[#1f1f2a] border border-[#272736] text-neutral-300 hover:text-white transition-colors"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-red-500" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
          </button>

          {/* Email Inbox Preview Trigger */}
          <button
            onClick={() => {
              playClickSound();
              onOpenInbox();
            }}
            className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-[#14141c] hover:bg-[#1f1f2a] border border-[#272736] text-xs font-semibold text-neutral-300 hover:text-white transition-all group"
            title="Inspect Simulated Automated Confirmation Emails"
          >
            <Mail className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Dispatched Deeds</span>
            {emailCount > 0 && (
              <span className="bg-[#e50914] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                {emailCount}
              </span>
            )}
          </button>

          {/* Mobile Garage shortcut button */}
          <button
            onClick={() => {
              playClickSound();
              onOpenMyGarage();
            }}
            className="md:hidden p-2 rounded-lg bg-[#e50914] text-white font-bold"
            title="My Garage"
          >
            <Warehouse className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Sub-Nav */}
      <div className="md:hidden flex items-center justify-around bg-[#0e0e14] border-t border-[#1e1e28] py-2 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                playClickSound();
                setActiveTab(item.id);
              }}
              className={`flex flex-col items-center py-1 px-3 text-[10px] uppercase font-bold tracking-wider ${
                isActive ? 'text-[#e50914]' : 'text-neutral-400'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
