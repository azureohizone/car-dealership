const mongoose = require('mongoose');

const garageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Garage name is required'],
    trim: true
  },
  code: {
    type: String,
    unique: true,
    uppercase: true,
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City/Province is required'],
    trim: true
  },
  locationDescription: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  availableSlots: {
    type: Number,
    required: true,
    min: 0
  },
  securityInformation: {
    type: String,
    default: '24/7 Armed Security & Biometric Access'
  },
  securityFeatures: [{
    type: String
  }],
  facilityPerks: [{
    type: String
  }],
  imageUrl: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Garage', garageSchema);
