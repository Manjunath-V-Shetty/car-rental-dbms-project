import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AIRecommendation from './pages/AIRecommendation';
import Auth from './pages/Auth';
import BookingHistory from './pages/BookingHistory';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
        {/* Navigation Bar */}
        <nav style={{ backgroundColor: '#2c3e50', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <h1 style={{ color: '#fff', margin: 0, fontSize: '1.5rem' }}>🚗 FleetDrive</h1>
            <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}>AI Assistant</Link>
            {user && (
              <Link to="/bookings" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}>My Bookings</Link>
            )}
          </div>
          <div>
            {user ? (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ color: '#fff' }}>Hello, <strong>{user.name}</strong></span>
                <button onClick={handleLogout} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
              </div>
            ) : (
              <Link to="/auth" style={{ padding: '0.4rem 1rem', backgroundColor: '#3498db', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Login / Register</Link>
            )}
          </div>
        </nav>

        {/* Dynamic Route View */}
        <Routes>
          <Route path="/" element={<AIRecommendation />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/bookings" element={<BookingHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;