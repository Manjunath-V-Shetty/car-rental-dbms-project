const pool = require('../config/db');

// 1. Add a New Vehicle (Admin/Staff Feature)
exports.addVehicle = async (req, res) => {
  const { make, model, year, license_plate, category, daily_rate, mileage } = req.body;
  try {
    const newVehicle = await pool.query(
      `INSERT INTO Vehicles (make, model, year, license_plate, category, daily_rate, mileage, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'Available')
       RETURNING *`,
      [make, model, year, license_plate, category, daily_rate, mileage]
    );
    res.status(201).json({ message: 'Vehicle added successfully!', vehicle: newVehicle.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Get All Available Vehicles with SQL Filtering (Customer Feature)
exports.getAvailableVehicles = async (req, res) => {
  const { category, max_rate } = req.query;
  try {
    let query = `SELECT * FROM Vehicles WHERE status = 'Available'`;
    let values = [];
    let paramIndex = 1;

    // Dynamically build filtering queries
    if (category) {
      query += ` AND category = $${paramIndex}`;
      values.push(category);
      paramIndex++;
    }

    if (max_rate) {
      query += ` AND daily_rate <= $${paramIndex}`;
      values.push(max_rate);
      paramIndex++;
    }

    query += ` ORDER BY daily_rate ASC`;

    const vehicles = await pool.query(query, values);
    res.json(vehicles.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};