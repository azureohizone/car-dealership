const Vehicle = require('../models/Vehicle');

// GET /api/vehicles
exports.getVehicles = async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      availability,
      sort,
      featured,
      page = 1,
      limit = 50
    } = req.query;

    const query = {};

    if (category && category !== 'All' && category !== 'Featured') {
      query.category = category;
    }

    if (category === 'Featured' || featured === 'true') {
      query.isFeatured = true;
    }

    if (availability && availability !== 'All') {
      query.availability = availability;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { brand: searchRegex },
        { model: searchRegex },
        { category: searchRegex },
        { description: searchRegex },
        { 'specifications.engine': searchRegex }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'hp_desc') sortOption = { 'specifications.horsepower': -1 };
    else if (sort === 'speed_desc') sortOption = { 'specifications.topSpeed': -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const total = await Vehicle.countDocuments(query);
    const vehicles = await Vehicle.find(query)
      .sort(sortOption)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: vehicles
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving vehicles', error: error.message });
  }
};

// GET /api/vehicles/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = ['Supercars', '2 Door', '4 Door', 'SUV', 'Motorcycles', 'Special'];
    const counts = await Promise.all(
      categories.map(async (cat) => {
        const count = await Vehicle.countDocuments({ category: cat });
        return { name: cat, count };
      })
    );

    const totalCount = await Vehicle.countDocuments();
    const featuredCount = await Vehicle.countDocuments({ isFeatured: true });

    res.json({
      success: true,
      data: [
        { name: 'All', count: totalCount },
        { name: 'Featured', count: featuredCount },
        ...counts
      ]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving categories', error: error.message });
  }
};

// GET /api/vehicles/:id
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving vehicle details', error: error.message });
  }
};

// POST /api/vehicles
exports.createVehicle = async (req, res) => {
  try {
    const {
      brand, model, year, category, price, description, badge,
      engine, horsepower, torque, topSpeed, acceleration0to100,
      transmission, fuelType, seats, driveType, weight,
      features, availability, stockCount, isFeatured,
      imageUrls // Optional: comma-separated external image URLs
    } = req.body;

    // Build images array from uploaded files + any external URLs
    const images = [];

    // Add uploaded file paths
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        images.push(`/uploads/vehicles/${file.filename}`);
      });
    }

    // Add external URLs if provided
    if (imageUrls) {
      const urls = typeof imageUrls === 'string' ? imageUrls.split(',').map(u => u.trim()).filter(Boolean) : imageUrls;
      images.push(...urls);
    }

    if (images.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one image is required.' });
    }

    // Parse features array
    let parsedFeatures = [];
    if (features) {
      parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;
    }

    const vehicle = await Vehicle.create({
      brand,
      model,
      year: year ? Number(year) : 2026,
      category,
      price: Number(price),
      description,
      badge: badge || 'PREMIUM STOCK',
      isFeatured: isFeatured === 'true' || isFeatured === true,
      specifications: {
        engine,
        horsepower: Number(horsepower),
        torque: torque || 'N/A',
        topSpeed,
        acceleration0to100,
        transmission,
        fuelType,
        seats: Number(seats),
        driveType,
        weight: weight || 'N/A'
      },
      features: parsedFeatures,
      images,
      availability: availability || 'in_stock',
      stockCount: stockCount ? Number(stockCount) : 1
    });

    res.status(201).json({ success: true, message: 'Vehicle created successfully', data: vehicle });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(500).json({ success: false, message: 'Error creating vehicle', error: error.message });
  }
};

// PUT /api/vehicles/:id
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const {
      brand, model, year, category, price, description, badge,
      engine, horsepower, torque, topSpeed, acceleration0to100,
      transmission, fuelType, seats, driveType, weight,
      features, availability, stockCount, isFeatured,
      imageUrls, removeImages, existingImages
    } = req.body;

    // Update basic fields if provided
    if (brand !== undefined) vehicle.brand = brand;
    if (model !== undefined) vehicle.model = model;
    if (year !== undefined) vehicle.year = Number(year);
    if (category !== undefined) vehicle.category = category;
    if (price !== undefined) vehicle.price = Number(price);
    if (description !== undefined) vehicle.description = description;
    if (badge !== undefined) vehicle.badge = badge;
    if (isFeatured !== undefined) vehicle.isFeatured = isFeatured === 'true' || isFeatured === true;
    if (availability !== undefined) vehicle.availability = availability;
    if (stockCount !== undefined) vehicle.stockCount = Number(stockCount);

    // Update specifications if any provided
    if (engine !== undefined) vehicle.specifications.engine = engine;
    if (horsepower !== undefined) vehicle.specifications.horsepower = Number(horsepower);
    if (torque !== undefined) vehicle.specifications.torque = torque;
    if (topSpeed !== undefined) vehicle.specifications.topSpeed = topSpeed;
    if (acceleration0to100 !== undefined) vehicle.specifications.acceleration0to100 = acceleration0to100;
    if (transmission !== undefined) vehicle.specifications.transmission = transmission;
    if (fuelType !== undefined) vehicle.specifications.fuelType = fuelType;
    if (seats !== undefined) vehicle.specifications.seats = Number(seats);
    if (driveType !== undefined) vehicle.specifications.driveType = driveType;
    if (weight !== undefined) vehicle.specifications.weight = weight;

    // Update features
    if (features) {
      vehicle.features = typeof features === 'string' ? JSON.parse(features) : features;
    }

    // Handle images: start with existing images the user kept
    let updatedImages = [];
    if (existingImages) {
      updatedImages = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
    } else {
      // If existingImages not provided, keep current images (minus any removed ones)
      updatedImages = [...vehicle.images];
    }

    // Remove specified images
    if (removeImages) {
      const toRemove = typeof removeImages === 'string' ? JSON.parse(removeImages) : removeImages;
      updatedImages = updatedImages.filter(img => !toRemove.includes(img));

      // Clean up files from disk for local uploads
      const fs = require('fs');
      const path = require('path');
      toRemove.forEach(imgPath => {
        if (imgPath.startsWith('/uploads/')) {
          const fullPath = path.join(__dirname, '../..', imgPath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }
      });
    }

    // Add newly uploaded files
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        updatedImages.push(`/uploads/vehicles/${file.filename}`);
      });
    }

    // Add external URLs
    if (imageUrls) {
      const urls = typeof imageUrls === 'string' ? imageUrls.split(',').map(u => u.trim()).filter(Boolean) : imageUrls;
      updatedImages.push(...urls);
    }

    vehicle.images = updatedImages;

    await vehicle.save();

    res.json({ success: true, message: 'Vehicle updated successfully', data: vehicle });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({ success: false, message: 'Error updating vehicle', error: error.message });
  }
};

// DELETE /api/vehicles/:id
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Clean up uploaded image files from disk
    const fs = require('fs');
    const path = require('path');
    vehicle.images.forEach(imgPath => {
      if (imgPath.startsWith('/uploads/')) {
        const fullPath = path.join(__dirname, '../..', imgPath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
    });

    await Vehicle.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: `Vehicle "${vehicle.brand} ${vehicle.model}" deleted successfully` });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ success: false, message: 'Error deleting vehicle', error: error.message });
  }
};

