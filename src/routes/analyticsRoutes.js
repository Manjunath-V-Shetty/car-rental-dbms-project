const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/metrics', analyticsController.getSystemMetrics);

module.exports = router;