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
