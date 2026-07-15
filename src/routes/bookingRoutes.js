const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Route Mappings
router.post('/reserve', bookingController.createBooking);
router.get('/user/:user_id', bookingController.getUserBookings);

module.exports = router;