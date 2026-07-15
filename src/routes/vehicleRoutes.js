const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// Route Mappings
router.post('/add', vehicleController.addVehicle);
router.get('/available', vehicleController.getAvailableVehicles);

module.exports = router;