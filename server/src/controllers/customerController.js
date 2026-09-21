const Customer = require('../models/Customer');
const Order = require('../models/Order');

// GET /api/customers/:email/garage
exports.getCustomerGarage = async (req, res) => {
  try {
    const { email } = req.params;
    const cleanEmail = email.trim().toLowerCase();

    const customer = await Customer.findOne({ email: cleanEmail });
    const orders = await Order.find({ 'customerSnapshot.email': cleanEmail })
      .populate('vehicleId')
      .populate('garageId')
      .sort({ purchaseDate: -1 });

    // Group vehicles by garage
    const garagesMap = {};
    orders.forEach(order => {
      const gId = order.garageSnapshot.name;
      if (!garagesMap[gId]) {
        garagesMap[gId] = {
          garageName: order.garageSnapshot.name,
          city: order.garageSnapshot.city,
          locationDescription: order.garageSnapshot.locationDescription,
          vehicles: []
        };
      }
      garagesMap[gId].vehicles.push({
        orderNumber: order.orderNumber,
        purchaseDate: order.purchaseDate,
        status: order.status,
        price: order.price,
        vehicle: order.vehicleSnapshot,
        vehicleDetails: order.vehicleId
      });
    });

    res.json({
      success: true,
      customer: customer || { email: cleanEmail, name: 'Collector' },
      totalVehicles: orders.length,
      orders,
      garagesBreakdown: Object.values(garagesMap)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving garage details', error: error.message });
  }
};
