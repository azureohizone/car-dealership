import React from 'react';
import { ShieldCheck, Mail, Volume2, VolumeX, Warehouse, Flame, Compass } from 'lucide-react';
import { playClickSound, isSoundEnabled, toggleSound } from '../utils/audio';

export default function Navbar({ activeTab, setActiveTab, emailCount, onOpenInbox, onOpenMyGarage }) {
  const [soundOn, setSoundOn] = React.useState(isSoundEnabled());

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  const navItems = [
    { id: 'marketplace', label: 'Showroom', icon: Flame },
    { id: 'garages', label: 'Vaults', icon: Warehouse },
    { id: 'how-it-works', label: 'How It Works', icon: Compass },
    { id: 'my-garage', label: 'My Garage', icon: ShieldCheck }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-black/80 backdrop-blur-xl border-b border-white/5">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => { playClickSound(); setActiveTab('marketplace'); }}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded bg-neutral-900 border border-neutral-800 transition-colors group-hover:border-[#e50914]">
            <span className="font-display font-black text-sm text-white tracking-tighter">LM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-display font-semibold text-lg tracking-wide text-white group-hover:text-neutral-300 transition-colors">
              LEGENDARY
            </span>
            <span className="font-display font-semibold text-lg tracking-wide text-[#e50914]">
              MOTORS
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 h-full">
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
                className={`group relative flex items-center gap-2 h-full text-xs uppercase font-medium tracking-widest transition-colors ${
                  isActive ? 'text-white' : 'text-neutral-500 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#e50914]' : 'text-neutral-600 group-hover:text-neutral-400'} transition-colors`} />
                {item.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#e50914] shadow-[0_0_8px_rgba(229,9,20,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions (Sound + Email Preview Trigger) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Sound Toggle */}
          <button
            onClick={handleSoundToggle}
            title={soundOn ? 'Mute SFX' : 'Enable SFX'}
            className="p-2 text-neutral-500 hover:text-white transition-colors"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Email Inbox Preview Trigger */}
          <button
            onClick={() => {
               playClickSound();
               onOpenInbox();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-white/5 text-xs font-medium text-neutral-400 hover:text-white transition-all group"
            title="Inspect Simulated Automated Confirmation Emails"
          >
            <Mail className="w-4 h-4 group-hover:text-white transition-colors" />
            <span className="hidden sm:inline">Inbox</span>
            {emailCount > 0 && (
              <span className="bg-[#e50914] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
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
            className="md:hidden p-2 text-neutral-400 hover:text-white"
            title="My Garage"
          >
            <Warehouse className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Sub-Nav */}
      <div className="md:hidden flex items-center justify-around bg-black border-t border-white/5 py-3 px-2">
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
              className={`flex flex-col items-center gap-1 text-[10px] uppercase font-semibold tracking-wider transition-colors ${
                isActive ? 'text-white' : 'text-neutral-500'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#e50914]' : 'text-neutral-600'}`} />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
