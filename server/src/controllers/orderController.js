const mongoose = require('mongoose');
const Order = require('../models/Order');
const Vehicle = require('../models/Vehicle');
const Garage = require('../models/Garage');
const Customer = require('../models/Customer');
const { sendOrderConfirmationEmail } = require('../services/emailService');

// POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { vehicleId, garageId, email, name, phone } = req.body;

    // 1. Validation
    if (!vehicleId || !garageId || !email) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle ID, Garage ID, and Customer Email are required.'
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 2. Verify Vehicle availability
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    }

    if (vehicle.availability === 'sold' || vehicle.stockCount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'This vehicle is currently sold out and not available for purchase.'
      });
    }

    // 3. Verify Garage capacity
    const garage = await Garage.findById(garageId);
    if (!garage) {
      return res.status(404).json({ success: false, message: 'Selected garage not found.' });
    }

    if (garage.availableSlots <= 0) {
      return res.status(400).json({
        success: false,
        message: `Selected garage "${garage.name}" has reached full capacity (0 spaces available). Please select another garage location.`
      });
    }

    // 4. Find or Create Customer
    let customer = await Customer.findOne({ email: cleanEmail });
    if (!customer) {
      customer = await Customer.create({
        email: cleanEmail,
        name: (name && name.trim()) ? name.trim() : 'Valued Collector',
        phone: (phone && phone.trim()) ? phone.trim() : ''
      });
    } else if (name && name.trim()) {
      customer.name = name.trim();
      if (phone) customer.phone = phone.trim();
      await customer.save();
    }

    // 5. Generate Order ID: LM-YYYYMMDD-XXXX
    const dateSegment = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `LM-${dateSegment}-${randomSuffix}`;

    // 6. Create Order Document
    const order = new Order({
      orderNumber,
      customerId: customer._id,
      vehicleId: vehicle._id,
      garageId: garage._id,
      price: vehicle.price,
      status: 'Stored',
      purchaseDate: new Date(),
      customerSnapshot: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone
      },
      vehicleSnapshot: {
        brand: vehicle.brand,
        model: vehicle.model,
        category: vehicle.category,
        price: vehicle.price,
        image: vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : '',
        engine: vehicle.specifications ? vehicle.specifications.engine : '',
        horsepower: vehicle.specifications ? vehicle.specifications.horsepower : 0,
        topSpeed: vehicle.specifications ? vehicle.specifications.topSpeed : ''
      },
      garageSnapshot: {
        name: garage.name,
        city: garage.city,
        locationDescription: garage.locationDescription,
        securityInformation: garage.securityInformation
      }
    });

    await order.save();

    // 7. Update Garage Slots atomically (decrement)
    await Garage.findByIdAndUpdate(garage._id, {
      $inc: { availableSlots: -1 }
    });

    // 8. Update Vehicle stock count & status
    const updatedStock = vehicle.stockCount - 1;
    vehicle.stockCount = Math.max(0, updatedStock);
    if (vehicle.stockCount === 0) {
      vehicle.availability = 'sold';
    } else if (vehicle.stockCount === 1) {
      vehicle.availability = 'low_stock';
    }
    await vehicle.save();

    // 9. Send Confirmation Email
    const emailResult = await sendOrderConfirmationEmail({
      order,
      customer,
      vehicle,
      garage
    });

    if (emailResult && emailResult.success) {
      order.emailDispatched = true;
      order.emailPreviewHtml = emailResult.htmlContent;
      await order.save();
    }

    // 10. Return Response
    res.status(201).json({
      success: true,
      message: 'Purchase completed successfully!',
      data: {
        order,
        emailSent: emailResult.success,
        emailPreviewUrl: emailResult.previewUrl || null,
        htmlPreview: emailResult.htmlContent || null
      }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process purchase.',
      error: error.message
    });
  }
};

// GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name email phone')
      .populate('vehicleId')
      .populate('garageId');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving order', error: error.message });
  }
};

// GET /api/orders/by-number/:orderNumber
exports.getOrderByNumber = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate('customerId', 'name email phone')
      .populate('vehicleId')
      .populate('garageId');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving order', error: error.message });
  }
};

// GET /api/orders/email/:email
exports.getOrdersByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const orders = await Order.find({ 'customerSnapshot.email': cleanEmail })
      .populate('vehicleId')
      .populate('garageId')
      .sort({ purchaseDate: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving customer orders', error: error.message });
  }
};

// GET /api/orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customerId', 'name email')
      .populate('vehicleId', 'brand model price images')
      .populate('garageId', 'name city')
      .sort({ purchaseDate: -1 })
      .limit(100);

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving orders', error: error.message });
  }
};
