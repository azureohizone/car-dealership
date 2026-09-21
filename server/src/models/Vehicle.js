const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Model name is required'],
    trim: true
  },
  year: {
    type: Number,
    default: 2026
  },
  category: {
    type: String,
    required: true,
    enum: ['Supercars', '2 Door', '4 Door', 'SUV', 'Motorcycles', 'Special'],
    default: 'Supercars'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  description: {
    type: String,
    required: true
  },
  badge: {
    type: String,
    default: 'PREMIUM STOCK'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  specifications: {
    engine: { type: String, required: true },
    horsepower: { type: Number, required: true },
    torque: { type: String, default: 'N/A' },
    topSpeed: { type: String, required: true },
    acceleration0to100: { type: String, required: true },
    transmission: { type: String, required: true },
    fuelType: { type: String, required: true },
    seats: { type: Number, required: true },
    driveType: { type: String, required: true },
    weight: { type: String, default: 'N/A' }
  },
  features: [{
    type: String
  }],
  images: [{
    type: String,
    required: true
  }],
  availability: {
    type: String,
    enum: ['in_stock', 'low_stock', 'reserved', 'sold'],
    default: 'in_stock'
  },
  stockCount: {
    type: Number,
    default: 1,
    min: 0
  }
}, {
  timestamps: true
});

vehicleSchema.index({ brand: 'text', model: 'text', category: 'text' });

module.exports = mongoose.model('Vehicle', vehicleSchema);
