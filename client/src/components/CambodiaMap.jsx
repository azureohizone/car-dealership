import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Warehouse, ShieldCheck, Check, AlertTriangle, Users, Key, Sparkles } from 'lucide-react';
import { playSelectSound } from '../utils/audio';

// Custom Map center changer component
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  return null;
}

// Custom Glowing Red Neon DivIcon for Leaflet
function createGarageIcon(isSelected, isFull) {
  const color = isFull ? '#6b7280' : isSelected ? '#ffffff' : '#e50914';
  const bg = isFull ? '#374151' : isSelected ? '#e50914' : '#14141d';
  const border = isFull ? '#4b5563' : isSelected ? '#ffffff' : '#e50914';
  const shadow = isFull ? 'none' : isSelected ? '0 0 20px #e50914' : '0 0 10px rgba(229,9,20,0.5)';

  return L.divIcon({
    className: 'custom-garage-pin',
    html: `
      <div style="
        position: relative;
        width: 38px;
        height: 38px;
        background: ${bg};
        border: 2px solid ${border};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: ${shadow};
        transition: all 0.3s ease;
      ">
        <div style="
          transform: rotate(45deg);
          color: ${color};
          font-weight: 900;
          font-size: 13px;
        ">
          ★
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  });
}

export default function CambodiaMap({
  garages = [],
  selectedGarage,
  onSelectGarage,
  interactive = true,
  height = '500px'
}) {
  const cambodiaCenter = [12.5657, 104.9910];

  const handleSelect = (garage) => {
    if (garage.availableSlots <= 0) return;
    playSelectSound();
    onSelectGarage(garage);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4 bg-[#0d0d14] p-3 sm:p-4 rounded-xl border border-[#222232]">
      {/* Interactive Map Container */}
      <div className="flex-1 rounded-xl overflow-hidden border border-[#27273a] relative" style={{ height }}>
        <MapContainer
          center={selectedGarage ? [selectedGarage.latitude, selectedGarage.longitude] : cambodiaCenter}
          zoom={7.4}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          {/* Esri Dark Gray Base Tiles */}
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          />

          {selectedGarage && (
            <ChangeView center={[selectedGarage.latitude, selectedGarage.longitude]} zoom={8.5} />
          )}

          {garages.map((garage) => {
            const isSelected = selectedGarage && (selectedGarage._id === garage._id || selectedGarage.name === garage.name);
            const isFull = garage.availableSlots <= 0;

            return (
              <Marker
                key={garage._id || garage.name}
                position={[garage.latitude, garage.longitude]}
                icon={createGarageIcon(isSelected, isFull)}
                eventHandlers={{
                  click: () => {
                    handleSelect(garage);
                  }
                }}
              >
                <Popup className="custom-dark-popup">
                  <div className="p-1 space-y-1.5 min-w-[200px]">
                    <div className="text-[10px] font-black uppercase text-[#e50914] tracking-wider">
                      {garage.city} Vault
                    </div>
                    <div className="font-bold text-white text-sm">
                      {garage.name}
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {garage.locationDescription}
                    </div>
                    <div className="flex justify-between items-center text-xs pt-1 border-t border-[#29293a] font-mono">
                      <span className="text-neutral-400">Capacity:</span>
                      <span className="text-emerald-400 font-bold">{garage.availableSlots} / {garage.capacity} free</span>
                    </div>
                    {isFull ? (
                      <div className="text-[10px] font-bold text-red-500 uppercase">
                        Vault Full - No Slots
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSelect(garage)}
                        className="w-full mt-1.5 py-1 px-2 bg-[#e50914] hover:bg-[#ff1a24] text-white text-[10px] font-bold uppercase tracking-wider rounded transition-colors"
                      >
                        {isSelected ? 'Currently Selected' : 'Select Vault'}
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Map Legend */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-black/85 backdrop-blur-md border border-[#272738] px-3 py-2 rounded-lg text-[11px] text-neutral-300 space-y-1 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e50914] inline-block shadow-sm" />
            <span className="font-bold">Available Vaults</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-600 inline-block" />
            <span className="text-neutral-400">Full (0 Spaces)</span>
          </div>
        </div>
      </div>

      {/* Predefined Garages Selection List */}
      <div className="w-full lg:w-96 flex flex-col space-y-3 overflow-y-auto max-h-[500px] pr-1">
        <div className="flex items-center justify-between pb-2 border-b border-[#20202c]">
          <div className="flex items-center gap-2">
            <Warehouse className="w-4 h-4 text-[#e50914]" />
            <h4 className="font-display font-black text-xs uppercase tracking-widest text-white">
              SELECT VAULT LOCATION
            </h4>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">
            {garages.length} LOCATIONS
          </span>
        </div>

        {garages.map((garage) => {
          const isSelected = selectedGarage && (selectedGarage._id === garage._id || selectedGarage.name === garage.name);
          const isFull = garage.availableSlots <= 0;
          const capacityPercent = Math.round(((garage.capacity - garage.availableSlots) / garage.capacity) * 100);

          return (
            <div
              key={garage._id || garage.name}
              onClick={() => handleSelect(garage)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                isFull
                  ? 'bg-[#101016] border-[#22222c] opacity-50 cursor-not-allowed'
                  : isSelected
                  ? 'bg-gradient-to-br from-[#1c1418] to-[#161622] border-[#e50914] shadow-red-glow'
                  : 'bg-[#13131c] hover:bg-[#181824] border-[#222230]'
              }`}
            >
              {/* Selected Tag */}
              {isSelected && (
                <div className="absolute top-0 right-0 bg-[#e50914] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-bl">
                  Selected
                </div>
              )}

              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#e50914]">
                    {garage.city}, CAMBODIA
                  </span>
                  <h5 className="font-display font-bold text-sm text-white">
                    {garage.name}
                  </h5>
                </div>
              </div>

              <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1">
                {garage.locationDescription}
              </p>

              {/* Capacity Bar */}
              <div className="mt-2.5 pt-2 border-t border-[#1e1e2c]">
                <div className="flex justify-between text-[10px] text-neutral-400 font-mono mb-1">
                  <span>Available Spaces</span>
                  <span className={isFull ? 'text-red-500 font-bold' : 'text-emerald-400 font-bold'}>
                    {garage.availableSlots} / {garage.capacity} slots
                  </span>
                </div>
                <div className="w-full bg-[#20202e] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isFull ? 'bg-red-600' : isSelected ? 'bg-[#e50914]' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, 100 - (garage.availableSlots / garage.capacity) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Security info */}
              <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="truncate">{garage.securityInformation || '24/7 Armed Security'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
