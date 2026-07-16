const pool = require('../config/db');

exports.getSystemMetrics = async (req, res) => {
  try {
    // 1. Fetch system fleet overview counts
    const countsQuery = await pool.query(`
      SELECT 
        COUNT(*) as total_cars,
        COUNT(CASE WHEN status = 'Available' THEN 1 END) as available_cars,
        COUNT(CASE WHEN status = 'Rented' THEN 1 END) as rented_cars
      FROM Vehicles
    `);

    // 2. Fetch recent AI interaction logs
    const logsQuery = await pool.query(`
      SELECT log_id, user_prompt, recommended_vehicle_ids, created_at 
      FROM AI_Recommendation_Logs 
      ORDER BY created_at DESC 
      LIMIT 10
    `);

    res.json({
      summary: countsQuery.rows[0],
      aiLogs: logsQuery.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};