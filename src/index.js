const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const aiRoutes = require('./routes/aiRoutes'); // 1. Import AI Routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/ai', aiRoutes); // 2. Use AI Routes

app.get('/', (req, res) => {
  res.send('Car Rental System API is running smoothly.');
});

app.listen(PORT, () => {
  console.log(`🚀 Server successfully running on port ${PORT}`);
});