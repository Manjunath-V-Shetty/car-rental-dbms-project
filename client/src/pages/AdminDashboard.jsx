import React, { useState } from 'react';
import { vehicleService } from '../services/api';

const AdminDashboard = () => {
  const [formData, setFormData] = useState({ make: '', model: '', year: '', license_plate: '', category: 'SUV', daily_rate: '', mileage: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const payload = { ...formData, year: parseInt(formData.year), daily_rate: parseFloat(formData.daily_rate), mileage: parseInt(formData.mileage) };

    try {
      const response = await vehicleService.add(payload);
      setMessage(`🎉 System Fleet updated: ${response.data.message}`);
      setFormData({ make: '', model: '', year: '', license_plate: '', category: 'SUV', daily_rate: '', mileage: '' });
    } catch (err) {
      setError('Relational framework insert error validation drop.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2.5rem', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
      <h2 style={{ color: '#f8fafc', fontSize: '1.8rem', fontWeight: '800', borderBottom: '1px solid #334155', paddingBottom: '0.8rem', marginBottom: '2rem' }}>🏎️ Inventory Control Panel</h2>
      
      {message && <p style={{ color: '#4ade80', backgroundColor: 'rgba(74,222,128,0.1)', padding: '0.8rem', borderRadius: '6px' }}>{message}</p>}
      {error && <p style={{ color: '#f87171', backgroundColor: 'rgba(248,113,113,0.1)', padding: '0.8rem', borderRadius: '6px' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input type="text" name="make" placeholder="Make" value={formData.make} onChange={handleChange} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} required />
          <input type="text" name="model" placeholder="Model" value={formData.model} onChange={handleChange} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} required />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input type="number" name="year" placeholder="Year" value={formData.year} onChange={handleChange} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} required />
          <input type="text" name="license_plate" placeholder="License Plate" value={formData.license_plate} onChange={handleChange} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontWeight: '600' }}>Asset Allocation Slot</label>
          <select name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}>
            <option value="SUV">SUV</option>
            <option value="Sedan">Sedan</option>
            <option value="Hatchback">Hatchback</option>
            <option value="EV">EV</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input type="number" name="daily_rate" placeholder="Cost per Day ($)" value={formData.daily_rate} onChange={handleChange} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} required />
          <input type="number" name="mileage" placeholder="Mileage (km)" value={formData.mileage} onChange={handleChange} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} required />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '0.8rem', borderRadius: '8px', border: 'none', backgroundColor: '#38bdf8', color: '#0f172a', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', marginTop: '1rem' }}>
          {loading ? 'Executing Data Push...' : 'Register Vehicle Assets'}
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;