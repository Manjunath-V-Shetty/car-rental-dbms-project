const pool = require('../config/db');

// 1. Create a Secure Booking Reservation using a SQL Transaction
exports.createBooking = async (req, res) => {
  const { user_id, vehicle_id, start_date, end_date, daily_rate } = req.body;

  // Calculate base cost: (End Date - Start Date) in days * daily_rate
  const days = Math.ceil((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24));
  const base_cost = days * daily_rate;

  // Get a client from the connection pool to run an explicit transaction isolation block
  const client = await pool.connect();

  try {
    // START SQL TRANSACTION
    await client.query('BEGIN');

    // 1. Check vehicle availability and lock the row to prevent race conditions
    const vehicleCheck = await client.query(
      `SELECT status FROM Vehicles WHERE vehicle_id = $1 FOR UPDATE`,
      [vehicle_id]
    );

    if (vehicleCheck.rows.length === 0) {
      throw new Error('Vehicle does not exist.');
    }

    if (vehicleCheck.rows[0].status !== 'Available') {
      throw new Error('Vehicle is currently rented or under maintenance.');
    }

    // 2. Insert the Booking Record
    const bookingResult = await client.query(
      `INSERT INTO Bookings (user_id, vehicle_id, start_date, end_date, base_cost, status)
       VALUES ($1, $2, $3, $4, $5, 'Confirmed')
       RETURNING *`,
      [user_id, vehicle_id, start_date, end_date, base_cost]
    );

    // 3. Update the Vehicle Status to 'Rented'
    await client.query(
      `UPDATE Vehicles SET status = 'Rented' WHERE vehicle_id = $1`,
      [vehicle_id]
    );

    // COMMIT TRANSACTION - both queries succeed together safely
    await client.query('COMMIT');

    res.status(201).json({
      message: 'Booking confirmed successfully!',
      booking: bookingResult.rows[0],
    });

  } catch (error) {
    // ROLLBACK TRANSACTION - Undo changes if anything fails during execution
    await client.query('ROLLBACK');
    res.status(400).json({ error: error.message });
  } finally {
    // Release the client back to the connection pool
    client.release();
  }
};

// 2. Get User Booking History (With SQL JOIN)
exports.getUserBookings = async (req, res) => {
  const { user_id } = req.params;
  try {
    const history = await pool.query(
      `SELECT b.booking_id, b.start_date, b.end_date, b.total_cost, b.status,
              v.make, v.model, v.license_plate
       FROM Bookings b
       JOIN Vehicles v ON b.vehicle_id = v.vehicle_id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [user_id]
    );
    res.json(history.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};