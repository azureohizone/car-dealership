const Garage = require('../models/Garage');
const Order = require('../models/Order');

// GET /api/garages
exports.getGarages = async (req, res) => {
  try {
    const garages = await Garage.find().sort({ availableSlots: -1 });
    res.json({
      success: true,
      count: garages.length,
      data: garages
    });
  } catch (error) {
    console.error('Error fetching garages:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving garages', error: error.message });
  }
};

// GET /api/garages/:id
exports.getGarageById = async (req, res) => {
  try {
    const garage = await Garage.findById(req.params.id);
    if (!garage) {
      return res.status(404).json({ success: false, message: 'Garage not found' });
    }

    // Get all orders/vehicles currently stored in this garage
    const storedOrders = await Order.find({ garageId: garage._id })
      .populate('vehicleId', 'brand model category price images specifications')
      .populate('customerId', 'name email')
      .sort({ purchaseDate: -1 });

    res.json({
      success: true,
      data: {
        ...garage.toObject(),
        storedVehiclesCount: storedOrders.length,
        storedOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving garage details', error: error.message });
  }
};

// POST /api/garages
exports.createGarage = async (req, res) => {
  try {
    const { name, code, city, locationDescription, latitude, longitude, capacity, securityInformation, securityFeatures, facilityPerks, imageUrl } = req.body;
    
    let finalImageUrl = imageUrl;
    
    if (req.files && req.files.length > 0) {
      finalImageUrl = `/uploads/garages/${req.files[0].filename}`;
    }

    if (!finalImageUrl) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    const garage = await Garage.create({
      name,
      code: code ? code.toUpperCase() : undefined,
      city,
      locationDescription,
      latitude: Number(latitude),
      longitude: Number(longitude),
      capacity: Number(capacity),
      availableSlots: Number(capacity), // new garage has all slots available
      securityInformation,
      securityFeatures: securityFeatures ? JSON.parse(securityFeatures) : [],
      facilityPerks: facilityPerks ? JSON.parse(facilityPerks) : [],
      imageUrl: finalImageUrl
    });

    res.status(201).json({ success: true, message: 'Garage created successfully', data: garage });
  } catch (error) {
    console.error('Error creating garage:', error);
    res.status(500).json({ success: false, message: 'Error creating garage', error: error.message });
  }
};

// PUT /api/garages/:id
exports.updateGarage = async (req, res) => {
  try {
    const garage = await Garage.findById(req.params.id);
    if (!garage) {
      return res.status(404).json({ success: false, message: 'Garage not found' });
    }

    const { name, code, city, locationDescription, latitude, longitude, capacity, availableSlots, securityInformation, securityFeatures, facilityPerks, imageUrl } = req.body;

    if (name !== undefined) garage.name = name;
    if (code !== undefined) garage.code = code.toUpperCase();
    if (city !== undefined) garage.city = city;
    if (locationDescription !== undefined) garage.locationDescription = locationDescription;
    if (latitude !== undefined) garage.latitude = Number(latitude);
    if (longitude !== undefined) garage.longitude = Number(longitude);
    if (capacity !== undefined) garage.capacity = Number(capacity);
    if (availableSlots !== undefined) garage.availableSlots = Number(availableSlots);
    if (securityInformation !== undefined) garage.securityInformation = securityInformation;
    if (securityFeatures !== undefined) garage.securityFeatures = typeof securityFeatures === 'string' ? JSON.parse(securityFeatures) : securityFeatures;
    if (facilityPerks !== undefined) garage.facilityPerks = typeof facilityPerks === 'string' ? JSON.parse(facilityPerks) : facilityPerks;

    if (req.files && req.files.length > 0) {
      // Clean up old image if it was local
      if (garage.imageUrl && garage.imageUrl.startsWith('/uploads/')) {
        const fs = require('fs');
        const path = require('path');
        const fullPath = path.join(__dirname, '../..', garage.imageUrl);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }
      garage.imageUrl = `/uploads/garages/${req.files[0].filename}`;
    } else if (imageUrl !== undefined) {
      garage.imageUrl = imageUrl;
    }

    await garage.save();
    res.json({ success: true, message: 'Garage updated successfully', data: garage });
  } catch (error) {
    console.error('Error updating garage:', error);
    res.status(500).json({ success: false, message: 'Error updating garage', error: error.message });
  }
};

// DELETE /api/garages/:id
exports.deleteGarage = async (req, res) => {
  try {
    const garage = await Garage.findById(req.params.id);
    if (!garage) {
      return res.status(404).json({ success: false, message: 'Garage not found' });
    }

    // Check if garage has stored vehicles
    const storedOrders = await Order.countDocuments({ garageId: garage._id });
    if (storedOrders > 0) {
      return res.status(400).json({ success: false, message: 'Cannot delete garage with stored vehicles. Move vehicles first.' });
    }

    // Clean up image file
    if (garage.imageUrl && garage.imageUrl.startsWith('/uploads/')) {
      const fs = require('fs');
      const path = require('path');
      const fullPath = path.join(__dirname, '../..', garage.imageUrl);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    await Garage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: `Garage "${garage.name}" deleted successfully` });
  } catch (error) {
    console.error('Error deleting garage:', error);
    res.status(500).json({ success: false, message: 'Error deleting garage', error: error.message });
  }
};
