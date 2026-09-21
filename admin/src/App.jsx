import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ShieldCheck, Plus, Pencil, Trash2, Search, X, Upload, Image as ImageIcon,
  Car, DollarSign, Tag, Gauge, Fuel, Settings2, ChevronDown, Star,
  Package, AlertTriangle, Check, Loader2, LogOut, LayoutDashboard, Eye
} from 'lucide-react';
import {
  fetchVehicles, fetchCategories, fetchGarages, verifyAdminKey,
  createVehicle, updateVehicle, deleteVehicle,
  createGarage, updateGarage, deleteGarage
} from './services/api';

const CATEGORIES = ['Supercars', '2 Door', '4 Door', 'SUV', 'Motorcycles', 'Special'];
const AVAILABILITY_OPTIONS = ['in_stock', 'low_stock', 'reserved', 'sold'];
const AVAILABILITY_LABELS = { in_stock: 'In Stock', low_stock: 'Low Stock', reserved: 'Reserved', sold: 'Sold' };
const AVAILABILITY_COLORS = {
  in_stock: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  low_stock: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  reserved: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  sold: 'bg-red-500/20 text-red-400 border-red-500/30'
};

// ─── Empty Form State ───
const EMPTY_FORM = {
  brand: '', model: '', year: '2026', category: 'Supercars', price: '',
  description: '', badge: 'PREMIUM STOCK', isFeatured: false,
  engine: '', horsepower: '', torque: '', topSpeed: '', acceleration0to100: '',
  transmission: '', fuelType: '', seats: '2', driveType: '', weight: '',
  features: [], availability: 'in_stock', stockCount: '1'
};

// ═══════════════════════════════════════════════════════════════
// PASSWORD GATE SCREEN
// ═══════════════════════════════════════════════════════════════
function PasswordGate({ onUnlock }) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!key.trim()) return;
    setLoading(true);
    setError('');
    try {
      await verifyAdminKey(key.trim());
      sessionStorage.setItem('lm_admin_key', key.trim());
      onUnlock(key.trim());
    } catch (err) {
      setError(err.message || 'Invalid admin key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Glowing emblem */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#e50914] to-[#7f1d1d] p-[2px] shadow-red-glow animate-pulse-subtle">
            <div className="w-full h-full rounded-2xl bg-[#0d0d12] flex items-center justify-center">
              <ShieldCheck className="w-9 h-9 text-[#e50914]" />
            </div>
          </div>
        </div>

        <h1 className="text-center text-2xl font-display font-black tracking-wider text-white mb-1">
          ADMIN ACCESS
        </h1>
        <p className="text-center text-sm text-neutral-500 mb-8">
          Enter your admin key to manage the fleet inventory
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="password"
              value={key}
              onChange={(e) => { setKey(e.target.value); setError(''); }}
              placeholder="Enter admin key..."
              className="w-full px-4 py-3.5 bg-[#121217] border border-[#272736] rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914]/40 transition-all font-mono text-sm tracking-wider"
            />
            <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !key.trim()}
            className="w-full py-3.5 bg-gradient-to-r from-[#e50914] to-[#b91c1c] hover:from-[#f40612] hover:to-[#dc2626] text-white font-bold text-sm uppercase tracking-widest rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-red-glow"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            {loading ? 'Verifying...' : 'Unlock Dashboard'}
          </button>
        </form>

        <p className="text-center text-[11px] text-neutral-600 mt-6">
          Protected area • Legendary Motors Fleet Management
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// IMAGE UPLOAD DROP ZONE
// ═══════════════════════════════════════════════════════════════
function ImageDropZone({ files, setFiles, existingImages, setExistingImages }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    setFiles(prev => [...prev, ...dropped].slice(0, 6));
  }, [setFiles]);

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    setFiles(prev => [...prev, ...selected].slice(0, 6));
    e.target.value = '';
  };

  const removeNewFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const totalImages = (existingImages?.length || 0) + files.length;

  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
        <ImageIcon className="w-3.5 h-3.5 text-[#e50914]" />
        Vehicle Images ({totalImages}/6)
      </label>

      {/* Existing images */}
      {existingImages && existingImages.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {existingImages.map((src, i) => (
            <div key={`existing-${i}`} className="relative group rounded-lg overflow-hidden border border-[#272736] aspect-video bg-[#0d0d12]">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeExistingImage(i)}
                className="absolute top-1 right-1 p-1 bg-black/70 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-3 h-3 text-white" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[9px] text-neutral-300 px-1.5 py-0.5 text-center truncate">
                Current
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New file previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {files.map((file, i) => (
            <div key={`new-${i}`} className="relative group rounded-lg overflow-hidden border border-emerald-500/30 aspect-video bg-[#0d0d12]">
              <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeNewFile(i)}
                className="absolute top-1 right-1 p-1 bg-black/70 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-3 h-3 text-white" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-emerald-900/60 text-[9px] text-emerald-300 px-1.5 py-0.5 text-center truncate">
                New • {file.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {totalImages < 6 && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#e50914] bg-[#e50914]/5'
              : 'border-[#272736] hover:border-[#e50914]/50 hover:bg-[#14141c]'
          }`}
        >
          <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragging ? 'text-[#e50914]' : 'text-neutral-600'}`} />
          <p className="text-sm text-neutral-400">
            {isDragging ? 'Drop images here' : 'Drag & drop images or click to browse'}
          </p>
          <p className="text-[11px] text-neutral-600 mt-1">
            JPG, PNG, WebP, GIF • Max 5MB each • Up to {6 - totalImages} more
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FEATURE TAG INPUT
// ═══════════════════════════════════════════════════════════════
function FeatureTagInput({ features, setFeatures }) {
  const [input, setInput] = useState('');

  const addFeature = () => {
    const trimmed = input.trim();
    if (trimmed && !features.includes(trimmed)) {
      setFeatures([...features, trimmed]);
      setInput('');
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Features</label>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
          placeholder="Type a feature and press Enter..."
          className="flex-1 px-3 py-2 bg-[#0d0d12] border border-[#272736] rounded-lg text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#e50914]/50"
        />
        <button
          type="button"
          onClick={addFeature}
          className="px-3 py-2 bg-[#1c1c24] border border-[#272736] rounded-lg text-xs text-neutral-300 hover:text-white hover:border-[#e50914]/50 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {features.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {features.map((f, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1c1c24] border border-[#272736] rounded-md text-xs text-neutral-300">
              {f}
              <button type="button" onClick={() => setFeatures(features.filter((_, idx) => idx !== i))} className="hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// VEHICLE FORM MODAL
// ═══════════════════════════════════════════════════════════════
function VehicleFormModal({ vehicle, onClose, onSave, adminKey }) {
  const isEdit = !!vehicle;
  const [form, setForm] = useState(() => {
    if (vehicle) {
      return {
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        year: String(vehicle.year || 2026),
        category: vehicle.category || 'Supercars',
        price: String(vehicle.price || ''),
        description: vehicle.description || '',
        badge: vehicle.badge || 'PREMIUM STOCK',
        isFeatured: vehicle.isFeatured || false,
        engine: vehicle.specifications?.engine || '',
        horsepower: String(vehicle.specifications?.horsepower || ''),
        torque: vehicle.specifications?.torque || '',
        topSpeed: vehicle.specifications?.topSpeed || '',
        acceleration0to100: vehicle.specifications?.acceleration0to100 || '',
        transmission: vehicle.specifications?.transmission || '',
        fuelType: vehicle.specifications?.fuelType || '',
        seats: String(vehicle.specifications?.seats || 2),
        driveType: vehicle.specifications?.driveType || '',
        weight: vehicle.specifications?.weight || '',
        features: vehicle.features || [],
        availability: vehicle.availability || 'in_stock',
        stockCount: String(vehicle.stockCount || 1)
      };
    }
    return { ...EMPTY_FORM };
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState(vehicle?.images || []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const setField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!form.brand || !form.model || !form.price || !form.description) {
      setError('Brand, Model, Price, and Description are required.');
      return;
    }
    if (!form.engine || !form.horsepower || !form.topSpeed || !form.acceleration0to100 || !form.transmission || !form.fuelType || !form.driveType) {
      setError('All specification fields (except torque and weight) are required.');
      return;
    }
    if (!isEdit && imageFiles.length === 0) {
      setError('At least one image is required.');
      return;
    }
    if (isEdit && existingImages.length === 0 && imageFiles.length === 0) {
      setError('At least one image is required.');
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();

      // Append basic fields
      Object.entries(form).forEach(([key, val]) => {
        if (key === 'features') {
          fd.append('features', JSON.stringify(val));
        } else if (key === 'isFeatured') {
          fd.append('isFeatured', String(val));
        } else {
          fd.append(key, val);
        }
      });

      // Append image files
      imageFiles.forEach(file => {
        fd.append('images', file);
      });

      // For edit: track existing images to keep
      if (isEdit) {
        fd.append('existingImages', JSON.stringify(existingImages));
        // Find removed images (ones in original but not in existingImages)
        const originalImages = vehicle.images || [];
        const removedImages = originalImages.filter(img => !existingImages.includes(img));
        if (removedImages.length > 0) {
          fd.append('removeImages', JSON.stringify(removedImages));
        }
      }

      if (isEdit) {
        await updateVehicle(vehicle._id, fd, adminKey);
      } else {
        await createVehicle(fd, adminKey);
      }

      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const InputField = ({ label, field, type = 'text', placeholder, icon: Icon, required }) => (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
        {Icon && <Icon className="w-3 h-3 text-[#e50914]" />}
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={form[field]}
        onChange={(e) => setField(field, e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 bg-[#0d0d12] border border-[#272736] rounded-lg text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#e50914]/50 focus:ring-1 focus:ring-[#e50914]/20 transition-all"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm overflow-y-auto py-8 px-4">
      <div className="w-full max-w-3xl bg-[#121217] border border-[#272736] rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#272736]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#e50914] to-[#7f1d1d] flex items-center justify-center">
              {isEdit ? <Pencil className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4 text-white" />}
            </div>
            <div>
              <h2 className="text-lg font-display font-black text-white tracking-wide">
                {isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h2>
              <p className="text-[11px] text-neutral-500">
                {isEdit ? `Editing ${vehicle.brand} ${vehicle.model}` : 'Add a new vehicle to the fleet'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#1c1c24] text-neutral-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div>
            <h3 className="text-xs font-bold text-[#e50914] uppercase tracking-widest mb-3 flex items-center gap-2">
              <Car className="w-3.5 h-3.5" /> Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Brand" field="brand" placeholder="e.g. Lamborghini" icon={Car} required />
              <InputField label="Model" field="model" placeholder="e.g. Revuelto" required />
              <InputField label="Year" field="year" type="number" placeholder="2026" />
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-[#e50914]" /> Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setField('category', e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#0d0d12] border border-[#272736] rounded-lg text-sm text-white focus:outline-none focus:border-[#e50914]/50 appearance-none cursor-pointer"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <InputField label="Price (USD)" field="price" type="number" placeholder="450000" icon={DollarSign} required />
              <InputField label="Badge" field="badge" placeholder="PREMIUM STOCK" icon={Tag} />
            </div>
            <div className="mt-4">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
                placeholder="Enter a compelling description for this vehicle..."
                rows={3}
                className="w-full mt-1.5 px-3 py-2.5 bg-[#0d0d12] border border-[#272736] rounded-lg text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#e50914]/50 resize-none"
              />
            </div>
          </div>

          {/* Specifications */}
          <div>
            <h3 className="text-xs font-bold text-[#e50914] uppercase tracking-widest mb-3 flex items-center gap-2">
              <Gauge className="w-3.5 h-3.5" /> Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField label="Engine" field="engine" placeholder="6.5L V12" icon={Settings2} required />
              <InputField label="Horsepower" field="horsepower" type="number" placeholder="1015" icon={Gauge} required />
              <InputField label="Torque" field="torque" placeholder="740 Nm" />
              <InputField label="Top Speed" field="topSpeed" placeholder="350 km/h" required />
              <InputField label="0-100 km/h" field="acceleration0to100" placeholder="2.5s" required />
              <InputField label="Transmission" field="transmission" placeholder="7-Speed DCT" required />
              <InputField label="Fuel Type" field="fuelType" placeholder="Hybrid" icon={Fuel} required />
              <InputField label="Seats" field="seats" type="number" placeholder="2" required />
              <InputField label="Drive Type" field="driveType" placeholder="AWD" required />
              <InputField label="Weight" field="weight" placeholder="1,772 kg" />
            </div>
          </div>

          {/* Images */}
          <ImageDropZone
            files={imageFiles}
            setFiles={setImageFiles}
            existingImages={isEdit ? existingImages : undefined}
            setExistingImages={setExistingImages}
          />

          {/* Features */}
          <FeatureTagInput features={form.features} setFeatures={(f) => setField('features', f)} />

          {/* Stock & Status */}
          <div>
            <h3 className="text-xs font-bold text-[#e50914] uppercase tracking-widest mb-3 flex items-center gap-2">
              <Package className="w-3.5 h-3.5" /> Stock & Status
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Availability</label>
                <select
                  value={form.availability}
                  onChange={(e) => setField('availability', e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#0d0d12] border border-[#272736] rounded-lg text-sm text-white focus:outline-none focus:border-[#e50914]/50 appearance-none cursor-pointer"
                >
                  {AVAILABILITY_OPTIONS.map(a => <option key={a} value={a}>{AVAILABILITY_LABELS[a]}</option>)}
                </select>
              </div>
              <InputField label="Stock Count" field="stockCount" type="number" placeholder="1" />
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Featured</label>
                <button
                  type="button"
                  onClick={() => setField('isFeatured', !form.isFeatured)}
                  className={`w-full px-3 py-2.5 rounded-lg text-sm font-semibold border transition-all flex items-center justify-center gap-2 ${
                    form.isFeatured
                      ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-400'
                      : 'bg-[#0d0d12] border-[#272736] text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  <Star className={`w-4 h-4 ${form.isFeatured ? 'fill-yellow-400' : ''}`} />
                  {form.isFeatured ? 'Featured' : 'Not Featured'}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#272736]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-[#272736] text-sm text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2.5 bg-gradient-to-r from-[#e50914] to-[#b91c1c] hover:from-[#f40612] hover:to-[#dc2626] text-white font-bold text-sm uppercase tracking-wider rounded-lg transition-all disabled:opacity-40 flex items-center gap-2 shadow-red-glow"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {saving ? 'Saving...' : isEdit ? 'Update Vehicle' : 'Create Vehicle'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DELETE CONFIRMATION MODAL
// ═══════════════════════════════════════════════════════════════
function DeleteConfirmModal({ vehicle, onClose, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-[#121217] border border-[#272736] rounded-2xl shadow-2xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#272736] flex-shrink-0 bg-[#0d0d12]">
            {vehicle.images?.[0] ? (
              <img src={vehicle.images[0]} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Car className="w-6 h-6 text-neutral-600" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{vehicle.brand} {vehicle.model}</h3>
            <p className="text-sm text-neutral-500">{vehicle.category} • ${Number(vehicle.price).toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-5">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-400">Delete this vehicle?</p>
              <p className="text-xs text-red-400/70 mt-0.5">
                This action cannot be undone. The vehicle and all uploaded images will be permanently removed.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-[#272736] text-sm text-neutral-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg transition-all disabled:opacity-40 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {loading ? 'Deleting...' : 'Delete Vehicle'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// VAULT/GARAGE FORM MODAL
// ═══════════════════════════════════════════════════════════════
const EMPTY_VAULT = {
  name: '', code: '', city: '', locationDescription: '',
  latitude: '12.5657', longitude: '104.9910', capacity: '10',
  securityInformation: '24/7 Armed Security & Biometric Access',
  securityFeatures: ['Armed Guards', 'CCTV 4K', 'Biometric Entry'],
  facilityPerks: ['Climate Control', 'Detailing Bay', 'Battery Tenders']
};

function VaultFormModal({ vault, onClose, onSave, adminKey }) {
  const isEdit = !!vault;
  const [form, setForm] = useState(() => {
    if (vault) {
      return {
        name: vault.name || '',
        code: vault.code || '',
        city: vault.city || '',
        locationDescription: vault.locationDescription || '',
        latitude: String(vault.latitude || '12.5657'),
        longitude: String(vault.longitude || '104.9910'),
        capacity: String(vault.capacity || '10'),
        availableSlots: String(vault.availableSlots ?? vault.capacity ?? '10'),
        securityInformation: vault.securityInformation || '',
        securityFeatures: vault.securityFeatures || [],
        facilityPerks: vault.facilityPerks || []
      };
    }
    return { ...EMPTY_VAULT };
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState(vault?.imageUrl ? [vault.imageUrl] : []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const setField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.city || !form.locationDescription || !form.latitude || !form.longitude || !form.capacity) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!isEdit && imageFiles.length === 0) {
      setError('A vault image is required.');
      return;
    }
    if (isEdit && existingImages.length === 0 && imageFiles.length === 0) {
      setError('A vault image is required.');
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key === 'securityFeatures' || key === 'facilityPerks') {
          fd.append(key, JSON.stringify(val));
        } else {
          fd.append(key, val);
        }
      });

      if (imageFiles.length > 0) {
        fd.append('image', imageFiles[0]); // uploadGarage expects 'image'
      } else if (isEdit && existingImages.length > 0) {
        fd.append('imageUrl', existingImages[0]);
      }

      if (isEdit) {
        await updateGarage(vault._id, fd, adminKey);
      } else {
        await createGarage(fd, adminKey);
      }
      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const InputField = ({ label, field, type = 'text', placeholder, required }) => (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={form[field]}
        onChange={(e) => setField(field, e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 bg-[#0d0d12] border border-[#272736] rounded-lg text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#e50914]/50 focus:ring-1 focus:ring-[#e50914]/20 transition-all"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm overflow-y-auto py-8 px-4">
      <div className="w-full max-w-3xl bg-[#121217] border border-[#272736] rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#272736]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#e50914] to-[#7f1d1d] flex items-center justify-center">
              {isEdit ? <Pencil className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4 text-white" />}
            </div>
            <div>
              <h2 className="text-lg font-display font-black text-white tracking-wide">
                {isEdit ? 'Edit Vault' : 'Add New Vault'}
              </h2>
              <p className="text-[11px] text-neutral-500">
                {isEdit ? `Editing ${form.name}` : 'Establish a new secure location in Cambodia'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#1c1c24] text-neutral-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Vault Name" field="name" placeholder="e.g. The Imperial Vault" required />
              <InputField label="City/Province" field="city" placeholder="e.g. Phnom Penh" required />
              <InputField label="Vault Code" field="code" placeholder="e.g. PHN-01" />
              <InputField label="Capacity (Slots)" field="capacity" type="number" required />
              <InputField label="Latitude" field="latitude" type="number" placeholder="12.5657" required />
              <InputField label="Longitude" field="longitude" type="number" placeholder="104.9910" required />
            </div>
            
            {isEdit && (
              <div className="mt-4">
                <InputField label="Available Slots" field="availableSlots" type="number" required />
                <p className="text-[10px] text-amber-500 mt-1">Warning: Changing this manually may fall out of sync with actual stored vehicles.</p>
              </div>
            )}

            <div className="mt-4">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Location Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.locationDescription}
                onChange={(e) => setField('locationDescription', e.target.value)}
                rows={2}
                className="w-full mt-1.5 px-3 py-2.5 bg-[#0d0d12] border border-[#272736] rounded-lg text-sm text-white focus:outline-none focus:border-[#e50914]/50 resize-none"
              />
            </div>
            <div className="mt-4">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Security Information
              </label>
              <textarea
                value={form.securityInformation}
                onChange={(e) => setField('securityInformation', e.target.value)}
                rows={2}
                className="w-full mt-1.5 px-3 py-2.5 bg-[#0d0d12] border border-[#272736] rounded-lg text-sm text-white focus:outline-none focus:border-[#e50914]/50 resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FeatureTagInput features={form.securityFeatures} setFeatures={(f) => setField('securityFeatures', f)} />
            <FeatureTagInput features={form.facilityPerks} setFeatures={(f) => setField('facilityPerks', f)} />
          </div>

          <ImageDropZone
            files={imageFiles}
            setFiles={(f) => setImageFiles(typeof f === 'function' ? f(imageFiles).slice(0,1) : f.slice(0,1))}
            existingImages={isEdit ? existingImages : undefined}
            setExistingImages={setExistingImages}
          />
        </form>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#272736]">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg border border-[#272736] text-sm text-neutral-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving} className="px-6 py-2.5 bg-gradient-to-r from-[#e50914] to-[#b91c1c] text-white font-bold text-sm uppercase tracking-wider rounded-lg flex items-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {saving ? 'Saving...' : isEdit ? 'Update Vault' : 'Create Vault'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DELETE VAULT MODAL
// ═══════════════════════════════════════════════════════════════
function DeleteVaultConfirmModal({ vault, onClose, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-[#121217] border border-[#272736] rounded-2xl shadow-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-2">{vault.name}</h3>
        <p className="text-sm text-neutral-500 mb-4">{vault.city} • Capacity: {vault.capacity}</p>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-5">
          <p className="text-sm font-semibold text-red-400">Delete this vault?</p>
          <p className="text-xs text-red-400/70 mt-1">
            This action cannot be undone. If vehicles are currently stored here, deletion will be rejected by the server.
          </p>
        </div>
        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg border border-[#272736] text-sm text-neutral-400 hover:text-white transition-colors">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete Vault
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN ADMIN PANEL
// ═══════════════════════════════════════════════════════════════
export default function AdminPanel({ onRefreshData }) {
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem('lm_admin_key') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Tabs: 'vehicles' | 'vaults'
  const [activeTab, setActiveTab] = useState('vehicles');

  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Modals for Vehicles
  const [formModalVehicle, setFormModalVehicle] = useState(null); // null = closed, {} = add, {vehicle} = edit
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  
  // Modals for Vaults
  const [formModalVault, setFormModalVault] = useState(null);
  const [isVaultFormOpen, setIsVaultFormOpen] = useState(false);
  const [deleteVaultTarget, setDeleteVaultTarget] = useState(null);

  const [deleting, setDeleting] = useState(false);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Check stored admin key on mount
  useEffect(() => {
    const storedKey = sessionStorage.getItem('lm_admin_key');
    if (storedKey) {
      verifyAdminKey(storedKey)
        .then(() => {
          setAdminKey(storedKey);
          setIsAuthenticated(true);
        })
        .catch(() => {
          sessionStorage.removeItem('lm_admin_key');
        });
    }
  }, []);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [vRes, cRes, gRes] = await Promise.all([
        fetchVehicles({ limit: 500 }), 
        fetchCategories(),
        fetchGarages()
      ]);
      if (vRes.success) setVehicles(vRes.data);
      if (cRes.success) setCategories(cRes.data);
      if (gRes.success) setGarages(gRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = (key) => {
    setAdminKey(key);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('lm_admin_key');
    setAdminKey('');
    setIsAuthenticated(false);
  };

  const handleSaveVehicle = async () => {
    setIsFormOpen(false);
    setFormModalVehicle(null);
    showToast(formModalVehicle?._id ? 'Vehicle updated successfully!' : 'Vehicle created successfully!');
    await loadData();
    onRefreshData?.();
  };

  const handleDeleteVehicle = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteVehicle(deleteTarget._id, adminKey);
      showToast(`"${deleteTarget.brand} ${deleteTarget.model}" deleted successfully`);
      setDeleteTarget(null);
      await loadData();
      onRefreshData?.();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveVault = async () => {
    setIsVaultFormOpen(false);
    setFormModalVault(null);
    showToast(formModalVault?._id ? 'Vault updated successfully!' : 'Vault created successfully!');
    await loadData();
    onRefreshData?.();
  };

  const handleDeleteVault = async () => {
    if (!deleteVaultTarget) return;
    setDeleting(true);
    try {
      await deleteGarage(deleteVaultTarget._id, adminKey);
      showToast(`Vault "${deleteVaultTarget.name}" deleted successfully`);
      setDeleteVaultTarget(null);
      await loadData();
      onRefreshData?.();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Filter vehicles
  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = !searchQuery ||
      `${v.brand} ${v.model} ${v.category}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || v.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Stats
  const totalVehicles = vehicles.length;
  const inStockCount = vehicles.filter(v => v.availability === 'in_stock').length;
  const featuredCount = vehicles.filter(v => v.isFeatured).length;
  const totalValue = vehicles.reduce((sum, v) => sum + (v.price || 0), 0);

  if (!isAuthenticated) {
    return <PasswordGate onUnlock={handleUnlock} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0d] text-[#e5e7eb] font-sans selection:bg-[#e50914] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toast */}
      {toast && (
        <div className={`fixed top-24 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold animate-[slideIn_0.3s_ease-out] ${
          toast.type === 'error'
            ? 'bg-red-900/90 border-red-500/40 text-red-200'
            : 'bg-emerald-900/90 border-emerald-500/40 text-emerald-200'
        }`}>
          {toast.type === 'error' ? <AlertTriangle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e50914] to-[#7f1d1d] p-[2px] shadow-red-glow">
            <div className="w-full h-full rounded-[10px] bg-[#0d0d12] flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-[#e50914]" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-display font-black tracking-wider text-white">FLEET COMMAND</h1>
            <p className="text-xs text-neutral-500 uppercase tracking-widest">Global Asset Management</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-[#121217] p-1 rounded-lg border border-[#272736]">
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'vehicles' ? 'bg-[#e50914] text-white shadow-red-glow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Vehicles
            </button>
            <button
              onClick={() => setActiveTab('vaults')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'vaults' ? 'bg-[#e50914] text-white shadow-red-glow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Vaults
            </button>
          </div>

          {activeTab === 'vehicles' ? (
            <button
              onClick={() => { setFormModalVehicle(null); setIsFormOpen(true); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#e50914] to-[#b91c1c] hover:from-[#f40612] hover:to-[#dc2626] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-red-glow ml-2"
            >
              <Plus className="w-4 h-4" /> Add Vehicle
            </button>
          ) : (
            <button
              onClick={() => { setFormModalVault(null); setIsVaultFormOpen(true); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#e50914] to-[#b91c1c] hover:from-[#f40612] hover:to-[#dc2626] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-red-glow ml-2"
            >
              <Plus className="w-4 h-4" /> Add Vault
            </button>
          )}
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2.5 rounded-lg bg-[#14141c] hover:bg-[#1c1c24] border border-[#272736] text-neutral-400 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {activeTab === 'vehicles' ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Vehicles', value: totalVehicles, icon: Car, color: 'text-white' },
              { label: 'In Stock', value: inStockCount, icon: Package, color: 'text-emerald-400' },
              { label: 'Featured', value: featuredCount, icon: Star, color: 'text-yellow-400' },
              { label: 'Total Value', value: `$${(totalValue / 1000000).toFixed(1)}M`, icon: DollarSign, color: 'text-[#e50914]' }
            ].map((stat, i) => (
              <div key={i} className="bg-[#121217] border border-[#272736] rounded-xl p-4 hover:border-[#e50914]/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider">{stat.label}</span>
                </div>
                <p className={`text-2xl font-display font-black ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vehicles..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#121217] border border-[#272736] rounded-lg text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#e50914]/50 transition-colors"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2.5 bg-[#121217] border border-[#272736] rounded-lg text-sm text-white focus:outline-none focus:border-[#e50914]/50 appearance-none cursor-pointer pr-10 min-w-[140px]"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
            </div>
          </div>

          {/* Vehicle Table */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#e50914] animate-spin" />
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center py-20">
              <Car className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
              <p className="text-neutral-500 text-sm">No vehicles found</p>
            </div>
          ) : (
            <div className="bg-[#121217] border border-[#272736] rounded-xl overflow-hidden">
              <div className="hidden md:grid grid-cols-[auto_1fr_120px_120px_120px_100px] gap-4 px-4 py-3 bg-[#0d0d12] border-b border-[#272736] text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                <div className="w-16">Image</div>
                <div>Vehicle</div>
                <div>Category</div>
                <div>Price</div>
                <div>Status</div>
                <div className="text-right">Actions</div>
              </div>

              {filteredVehicles.map((vehicle) => (
                <div key={vehicle._id} className="grid grid-cols-1 md:grid-cols-[auto_1fr_120px_120px_120px_100px] gap-3 md:gap-4 px-4 py-3 border-b border-[#1e1e28] hover:bg-[#16161e] transition-colors items-center">
                  <div className="w-16 h-10 rounded-lg overflow-hidden border border-[#272736] bg-[#0d0d12] flex-shrink-0">
                    {vehicle.images?.[0] ? <img src={vehicle.images[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Car className="w-4 h-4 text-neutral-600" /></div>}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white truncate">{vehicle.brand} {vehicle.model}</p>
                      {vehicle.isFeatured && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 flex-shrink-0" />}
                    </div>
                    <p className="text-[11px] text-neutral-500 truncate">{vehicle.year} • {vehicle.specifications?.engine} • {vehicle.specifications?.horsepower}hp</p>
                  </div>
                  <div className="hidden md:block"><span className="text-xs text-neutral-400">{vehicle.category}</span></div>
                  <div className="hidden md:block"><span className="text-sm font-bold text-white">${Number(vehicle.price).toLocaleString()}</span></div>
                  <div className="hidden md:block">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${AVAILABILITY_COLORS[vehicle.availability] || 'text-neutral-400'}`}>
                      {AVAILABILITY_LABELS[vehicle.availability] || vehicle.availability}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-1.5">
                    <button onClick={() => { setFormModalVehicle(vehicle); setIsFormOpen(true); }} className="p-2 rounded-lg bg-[#1c1c24] hover:bg-blue-500/20 border border-[#272736] hover:border-blue-500/40 text-neutral-400 hover:text-blue-400 transition-all"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeleteTarget(vehicle)} className="p-2 rounded-lg bg-[#1c1c24] hover:bg-red-500/20 border border-[#272736] hover:border-red-500/40 text-neutral-400 hover:text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
              <div className="px-4 py-3 bg-[#0d0d12] text-[11px] text-neutral-500">Showing {filteredVehicles.length} of {vehicles.length} vehicles</div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Vaults Tab */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#e50914] animate-spin" />
            </div>
          ) : garages.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
              <p className="text-neutral-500 text-sm">No vaults found</p>
            </div>
          ) : (
            <div className="bg-[#121217] border border-[#272736] rounded-xl overflow-hidden">
              <div className="hidden md:grid grid-cols-[auto_1fr_1fr_100px_100px] gap-4 px-4 py-3 bg-[#0d0d12] border-b border-[#272736] text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                <div className="w-16">Image</div>
                <div>Vault</div>
                <div>City</div>
                <div className="text-center">Capacity</div>
                <div className="text-right">Actions</div>
              </div>

              {garages.map((garage) => (
                <div key={garage._id} className="grid grid-cols-1 md:grid-cols-[auto_1fr_1fr_100px_100px] gap-3 md:gap-4 px-4 py-3 border-b border-[#1e1e28] hover:bg-[#16161e] transition-colors items-center">
                  <div className="w-16 h-10 rounded-lg overflow-hidden border border-[#272736] bg-[#0d0d12] flex-shrink-0">
                    {garage.imageUrl ? <img src={garage.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-neutral-600" /></div>}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{garage.name}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{garage.code || 'NO-CODE'} • Lat: {garage.latitude}</p>
                  </div>
                  <div className="hidden md:block"><span className="text-xs text-neutral-400">{garage.city}</span></div>
                  <div className="hidden md:flex justify-center">
                    <span className="text-xs font-bold text-emerald-400">{garage.availableSlots} / {garage.capacity}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1.5">
                    <button onClick={() => { setFormModalVault(garage); setIsVaultFormOpen(true); }} className="p-2 rounded-lg bg-[#1c1c24] hover:bg-blue-500/20 border border-[#272736] hover:border-blue-500/40 text-neutral-400 hover:text-blue-400 transition-all"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeleteVaultTarget(garage)} className="p-2 rounded-lg bg-[#1c1c24] hover:bg-red-500/20 border border-[#272736] hover:border-red-500/40 text-neutral-400 hover:text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Form Modals */}
      {isFormOpen && (
        <VehicleFormModal
          vehicle={formModalVehicle}
          onClose={() => { setIsFormOpen(false); setFormModalVehicle(null); }}
          onSave={handleSaveVehicle}
          adminKey={adminKey}
        />
      )}

      {isVaultFormOpen && (
        <VaultFormModal
          vault={formModalVault}
          onClose={() => { setIsVaultFormOpen(false); setFormModalVault(null); }}
          onSave={handleSaveVault}
          adminKey={adminKey}
        />
      )}

      {/* Delete Modals */}
      {deleteTarget && (
        <DeleteConfirmModal
          vehicle={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteVehicle}
          loading={deleting}
        />
      )}
      
      {deleteVaultTarget && (
        <DeleteVaultConfirmModal
          vault={deleteVaultTarget}
          onClose={() => setDeleteVaultTarget(null)}
          onConfirm={handleDeleteVault}
          loading={deleting}
        />
      )}
      </div>
    </div>
  );
}
