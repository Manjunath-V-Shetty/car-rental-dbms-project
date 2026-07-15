const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Route Mapping
router.post('/recommend', aiController.recommendCars);

module.exports = router;