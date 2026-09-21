const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  garageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Garage',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Stored', 'In Transit', 'Delivered'],
    default: 'Stored'
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  customerSnapshot: {
    name: String,
    email: { type: String, required: true },
    phone: String
  },
  vehicleSnapshot: {
    brand: String,
    model: String,
    category: String,
    price: Number,
    image: String,
    engine: String,
    horsepower: Number,
    topSpeed: String
  },
  garageSnapshot: {
    name: String,
    city: String,
    locationDescription: String,
    securityInformation: String
  },
  emailDispatched: {
    type: Boolean,
    default: false
  },
  emailPreviewHtml: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
