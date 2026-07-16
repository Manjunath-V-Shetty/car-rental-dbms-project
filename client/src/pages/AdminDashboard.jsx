import React, { useState } from 'react';
import { vehicleService } from '../services/api';

const AdminDashboard = () => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    license_plate: '',
    category: 'SUV',
    daily_rate: '',
    mileage: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // Quick conversion formatting to match PostgreSQL expectations
    const payload = {
      ...formData,
      year: parseInt(formData.year),
      daily_rate: parseFloat(formData.daily_rate),
      mileage: parseInt(formData.mileage)
    };

    try {
      const response = await vehicleService.add(payload);
      setMessage(`🎉 Success: ${response.data.message}`);
      setFormData({
        make: '',
        model: '',
        year: '',
        license_plate: '',
        category: 'SUV',
        daily_rate: '',
        mileage: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to insert the vehicle into inventory.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '2rem', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', backgroundColor: '#fff', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #ecf0f1', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>🏎️ Fleet Management System</h2>
      <p style={{ color: '#7f8c8d', fontSize: '0.95rem', marginBottom: '1.5rem' }}>Use this portal to register new vehicles directly into the database fleet network.</p>

      {message && <p style={{ color: '#2ecc71', fontWeight: 'bold' }}>{message}</p>}
      {error && <p style={{ color: '#e74c3c', fontWeight: 'bold' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            name="make"
            placeholder="Manufacturer (e.g., Toyota)"
            value={formData.make}
            onChange={handleChange}
            style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            name="model"
            placeholder="Model (e.g., Corolla)"
            value={formData.model}
            onChange={handleChange}
            style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="number"
            name="year"
            placeholder="Year (>= 2010)"
            value={formData.year}
            onChange={handleChange}
            min="2010"
            style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            name="license_plate"
            placeholder="License Plate"
            value={formData.license_plate}
            onChange={handleChange}
            style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.4rem', color: '#34495e', fontWeight: 'bold' }}>Vehicle Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff' }}
          >
            <option value="SUV">SUV</option>
            <option value="Sedan">Sedan</option>
            <option value="Hatchback">Hatchback</option>
            <option value="EV">EV</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="number"
            name="daily_rate"
            placeholder="Daily Rental Rate ($)"
            value={formData.daily_rate}
            onChange={handleChange}
            min="1"
            step="0.01"
            style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="number"
            name="mileage"
            placeholder="Current Mileage (km)"
            value={formData.mileage}
            onChange={handleChange}
            min="0"
            style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: '0.8rem', borderRadius: '4px', border: 'none', backgroundColor: '#34495e', color: '#fff', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', marginTop: '0.5rem' }}
        >
          {loading ? 'Saving Vehicle...' : 'Add Vehicle to Fleet'}
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;