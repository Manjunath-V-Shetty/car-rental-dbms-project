import React, { useState } from 'react';
import { aiService, bookingService } from '../services/api';

const AIRecommendation = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loggedInUser = JSON.parse(localStorage.getItem('user'));

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    setSuccessMsg('');
    setCars([]);
    
    try {
      const response = await aiService.getRecommendations({ prompt });
      setCars(response.data.recommended_vehicles);
      setCategories(response.data.ai_extracted_categories);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch recommendations.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookCar = async (vehicle) => {
    if (!loggedInUser) {
      setError('Authentication required: You must log in to reserve a vehicle!');
      return;
    }

    setBookingLoading(true);
    setError('');
    setSuccessMsg('');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 4);

    const bookingPayload = {
      user_id: loggedInUser.user_id,
      vehicle_id: vehicle.vehicle_id,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      daily_rate: parseFloat(vehicle.daily_rate)
    };

    try {
      const response = await bookingService.create(bookingPayload);
      setSuccessMsg(`🎉 ${response.data.message} Booking ID: ${response.data.booking.booking_id}`);
      setCars(cars.filter(c => c.vehicle_id !== vehicle.vehicle_id));
    } catch (err) {
      setError(err.response?.data?.error || 'Booking transaction failed.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#f8fafc', margin: '0 0 0.5rem 0' }}>🤖 AI Smart Assistant</h2>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Enter your travel pipeline plans, and our AI agent will pull the perfect machine matching asset.</p>
      </div>

      {/* Modern Neon Search Bar */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', backgroundColor: '#1e293b', padding: '0.6rem', borderRadius: '12px', border: '1px solid #334155', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Going on a mountain road trip with 4 friends and lots of luggage..."
          style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem', outline: 'none' }}
          disabled={loading || bookingLoading}
        />
        <button
          type="submit"
          style={{ padding: '1rem 2rem', borderRadius: '8px', border: 'none', backgroundColor: '#38bdf8', color: '#0f172a', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', transition: '0.2s' }}
          disabled={loading || bookingLoading}
        >
          {loading ? 'Analyzing...' : 'Ask AI'}
        </button>
      </form>

      {error && <p style={{ color: '#f87171', textAlign: 'center', fontWeight: '600', backgroundColor: 'rgba(248,113,113,0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>{error}</p>}
      {successMsg && <p style={{ color: '#4ade80', textAlign: 'center', fontWeight: '600', backgroundColor: 'rgba(74,222,128,0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>{successMsg}</p>}

      {/* AI Extraction Badges */}
      {categories.length > 0 && (
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span style={{ color: '#94a3b8', fontWeight: '600' }}>Extracted Categories:</span>
          {categories.map((cat, idx) => (
            <span key={idx} style={{ backgroundColor: 'rgba(56,189,248,0.15)', color: '#38bdf8', padding: '0.4rem 0.8rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: '700', border: '1px solid rgba(56,189,248,0.3)' }}>
              {cat}
            </span>
          ))}
        </div>
      )}

      {/* Cyberpunk Style Fleet Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {cars.map((car) => (
          <div key={car.vehicle_id} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column' }}>
            
            {/* Styled Header Visual Segment */}
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '2rem 1.5rem', textAlign: 'center', position: 'relative', borderBottom: '1px solid #334155' }}>
              <span style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '0.75rem', fontWeight: '800', backgroundColor: '#38bdf8', color: '#0f172a', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                {car.category}
              </span>
              <div style={{ fontSize: '4.5rem', margin: '0 0 0.5rem 0' }}>🚗</div>
              <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#f8fafc', fontWeight: '700' }}>{car.make} {car.model}</h3>
            </div>

            {/* Spec Matrix Block */}
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Year</span>
                  <span style={{ color: '#cbd5e1', fontWeight: '600' }}>{car.year}</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>License Plate</span>
                  <span style={{ color: '#cbd5e1', fontWeight: '600', fontFamily: 'monospace' }}>{car.license_plate}</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Milage</span>
                  <span style={{ color: '#cbd5e1', fontWeight: '600' }}>{car.mileage} km</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Status</span>
                  <span style={{ color: '#4ade80', fontWeight: '700' }}>● Available</span>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Daily Rent</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#38bdf8' }}>${car.daily_rate}<span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 'normal' }}>/day</span></span>
                </div>
                <button
                  onClick={() => handleBookCar(car)}
                  style={{ width: '100%', padding: '0.8rem', border: 'none', borderRadius: '8px', backgroundColor: '#0284c7', color: '#fff', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', transition: '0.2s' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#0369a1'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#0284c7'}
                  disabled={bookingLoading}
                >
                  {bookingLoading ? 'Processing...' : 'Reserve Vehicle'}
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendation;