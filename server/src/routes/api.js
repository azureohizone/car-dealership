const express = require('express');
const router = express.Router();

const vehicleController = require('../controllers/vehicleController');
const garageController = require('../controllers/garageController');
const orderController = require('../controllers/orderController');
const customerController = require('../controllers/customerController');
const { getRecentEmails } = require('../services/emailService');

// --- Vehicles ---
router.get('/vehicles', vehicleController.getVehicles);
router.get('/vehicles/categories', vehicleController.getCategories);
router.get('/vehicles/:id', vehicleController.getVehicleById);

// --- Garages ---
router.get('/garages', garageController.getGarages);
router.get('/garages/:id', garageController.getGarageById);

// --- Orders ---
router.post('/orders', orderController.createOrder);
router.get('/orders', orderController.getAllOrders);
router.get('/orders/:id', orderController.getOrderById);
router.get('/orders/by-number/:orderNumber', orderController.getOrderByNumber);
router.get('/orders/email/:email', orderController.getOrdersByEmail);

// --- Customer Garage Fleet ---
router.get('/customers/:email/garage', customerController.getCustomerGarage);

// --- Email Preview (Portfolio Inspector) ---
router.get('/emails/recent', (req, res) => {
  const emails = getRecentEmails();
  res.json({
    success: true,
    count: emails.length,
    data: emails
  });
});

module.exports = router;
