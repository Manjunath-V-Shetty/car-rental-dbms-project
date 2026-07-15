const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const bookingRoutes = require('./routes/bookingRoutes'); // 1. Import Booking Routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes); // 2. Use Booking Routes

app.get('/', (req, res) => {
  res.send('Car Rental System API is running smoothly.');
});

app.listen(PORT, () => {
  console.log(`🚀 Server successfully running on port ${PORT}`);
});