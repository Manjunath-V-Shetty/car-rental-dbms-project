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

  // Get active session user details from local storage
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
      setError('You must log in to reserve a vehicle!');
      return;
    }

    setBookingLoading(true);
    setError('');
    setSuccessMsg('');

    // Setup dummy rental schedule: Starting tomorrow for a 3-day duration
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
      
      // Instantly remove the rented car from the screen fleet view layout
      setCars(cars.filter(c => c.vehicle_id !== vehicle.vehicle_id));
    } catch (err) {
      setError(err.response?.data?.error || 'Booking transaction execution crashed.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>🤖 AI Smart Rental Assistant</h2>
      <p style={{ textAlign: 'center', color: '#7f8c8d', marginBottom: '2rem' }}>
        Tell us about your upcoming trip plans, and our AI will search the fleet to find the absolute best match.
      </p>

      {/* Input Form */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Going on a 3-day weekend camping trip with 4 friends and lots of luggage..."
          style={{ flex: 1, padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem' }}
          disabled={loading || bookingLoading}
        />
        <button
          type="submit"
          style={{ padding: '0.8rem 1.5rem', borderRadius: '6px', border: 'none', backgroundColor: '#3498db', color: '#fff', fontSize: '1rem', cursor: 'pointer' }}
          disabled={loading || bookingLoading}
        >
          {loading ? 'Analyzing...' : 'Ask AI'}
        </button>
      </form>

      {error && <p style={{ color: '#e74c3c', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}
      {successMsg && <p style={{ color: '#2ecc71', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>{successMsg}</p>}

      {/* Display Extracted Tags */}
      {categories.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <strong>AI Extracted Categories: </strong>
          {categories.map((cat, idx) => (
            <span key={idx} style={{ backgroundColor: '#e8f4fd', color: '#2b6cb0', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.85rem', marginRight: '0.5rem', fontWeight: 'bold' }}>
              {cat}
            </span>
          ))}
        </div>
      )}

      {/* Recommended Cars Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {cars.map((car) => (
          <div key={car.vehicle_id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>{car.make} {car.model}</h3>
              <p style={{ margin: '0 0 0.25rem 0', color: '#7f8c8d' }}><strong>Category:</strong> {car.category}</p>
              <p style={{ margin: '0 0 0.25rem 0', color: '#7f8c8d' }}><strong>Year:</strong> {car.year}</p>
              <p style={{ margin: '0 0 0.5rem 0', color: '#7f8c8d' }}><strong>Mileage:</strong> {car.mileage} km</p>
            </div>
            
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2ecc71' }}>${car.daily_rate}/day</span>
                <span style={{ fontSize: '0.85rem', padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: '#2ecc71', color: '#fff', fontWeight: 'bold' }}>
                  {car.status}
                </span>
              </div>
              
              <button
                onClick={() => handleBookCar(car)}
                style={{ width: '100%', padding: '0.6rem', border: 'none', borderRadius: '4px', backgroundColor: '#e67e22', color: '#fff', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
                disabled={bookingLoading}
              >
                {bookingLoading ? 'Processing...' : 'Book Now (3 Days)'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendation;