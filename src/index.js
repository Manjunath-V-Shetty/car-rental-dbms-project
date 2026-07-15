const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes'); // 1. Import Vehicle Routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes); // 2. Use Vehicle Routes

app.get('/', (req, res) => {
  res.send('Car Rental System API is running smoothly.');
});

app.listen(PORT, () => {
  console.log(`🚀 Server successfully running on port ${PORT}`);
});