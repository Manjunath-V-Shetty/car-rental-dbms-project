const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. User Registration (Sign Up)
exports.register = async (req, res) => {
  const { name, email, password, phone, license_number } = req.body;
  try {
    // Check if user already exists
    const userExists = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert new user into PostgreSQL database
    const newUser = await pool.query(
      `INSERT INTO Users (name, email, password_hash, phone, license_number, role) 
       VALUES ($1, $2, $3, $4, $5, 'Customer') RETURNING user_id, name, email, role`,
      [name, email, passwordHash, phone, license_number]
    );

    res.status(201).json({ message: 'User registered successfully!', user: newUser.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid Email or Password.' });
    }

    const user = userResult.rows[0];

    // Verify password matching
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Email or Password.' });
    }

    // Generate JWT Secret Session Token
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful!',
      token,
      user: { user_id: user.user_id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};