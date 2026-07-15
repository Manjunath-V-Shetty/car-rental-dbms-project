import React, { useState } from 'react';
import { aiService } from '../services/api';

const AIRecommendation = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    setCars([]);
    
    try {
      // Make the API call to our backend AI route
      const response = await aiService.getRecommendations({ prompt });
      setCars(response.data.recommended_vehicles);
      setCategories(response.data.ai_extracted_categories);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch recommendations. Ensure backend is running.');
    } finally {
      setLoading(false);
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
          disabled={loading}
        />
        <button
          type="submit"
          style={{ padding: '0.8rem 1.5rem', borderRadius: '6px', border: 'none', backgroundColor: '#3498db', color: '#fff', fontSize: '1rem', cursor: 'pointer' }}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Ask AI'}
        </button>
      </form>

      {error && <p style={{ color: '#e74c3c', textAlign: 'center' }}>{error}</p>}

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
          <div key={car.vehicle_id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>{car.make} {car.model}</h3>
            <p style={{ margin: '0 0 0.25rem 0', color: '#7f8c8d' }}><strong>Category:</strong> {car.category}</p>
            <p style={{ margin: '0 0 0.25rem 0', color: '#7f8c8d' }}><strong>Year:</strong> {car.year}</p>
            <p style={{ margin: '0 0 0.5rem 0', color: '#7f8c8d' }}><strong>Mileage:</strong> {car.mileage} miles</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2ecc71' }}>${car.daily_rate}/day</span>
              <span style={{ fontSize: '0.85rem', padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: '#2ecc71', color: '#fff', fontWeight: 'bold' }}>
                {car.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {!loading && cars.length === 0 && categories.length > 0 && (
        <p style={{ textAlign: 'center', color: '#95a5a6', marginTop: '2rem' }}>No available matching vehicles found in the fleet right now.</p>
      )}
    </div>
  );
};

export default AIRecommendation;