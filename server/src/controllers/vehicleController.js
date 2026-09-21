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
