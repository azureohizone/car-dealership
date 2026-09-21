const express = require('express');
const router = express.Router();

const vehicleController = require('../controllers/vehicleController');
const garageController = require('../controllers/garageController');
const orderController = require('../controllers/orderController');
const customerController = require('../controllers/customerController');
const { getRecentEmails } = require('../services/emailService');
const adminAuth = require('../middleware/adminAuth');
const upload = require('../middleware/upload');
const uploadGarage = require('../middleware/uploadGarage');

// --- Vehicles (Public) ---
router.get('/vehicles', vehicleController.getVehicles);
router.get('/vehicles/categories', vehicleController.getCategories);
router.get('/vehicles/:id', vehicleController.getVehicleById);

// --- Vehicles (Admin Protected) ---
router.post('/vehicles', adminAuth, upload.array('images', 6), vehicleController.createVehicle);
router.put('/vehicles/:id', adminAuth, upload.array('images', 6), vehicleController.updateVehicle);
router.delete('/vehicles/:id', adminAuth, vehicleController.deleteVehicle);

// --- Admin Verify ---
router.post('/admin/verify', adminAuth, (req, res) => {
  res.json({ success: true, message: 'Admin key is valid' });
});

// --- Garages ---
router.get('/garages', garageController.getGarages);
router.get('/garages/:id', garageController.getGarageById);
router.post('/garages', adminAuth, uploadGarage.array('image', 1), garageController.createGarage);
router.put('/garages/:id', adminAuth, uploadGarage.array('image', 1), garageController.updateGarage);
router.delete('/garages/:id', adminAuth, garageController.deleteGarage);

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

