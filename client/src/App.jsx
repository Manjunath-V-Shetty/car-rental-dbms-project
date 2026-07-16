import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AIRecommendation from './pages/AIRecommendation';
import Auth from './pages/Auth';
import BookingHistory from './pages/BookingHistory';
import AdminDashboard from './pages/AdminDashboard';
import Analytics from './pages/Analytics';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: '"Segoe UI", Roboto, sans-serif' }}>
        {/* Navigation Bar */}
        <nav style={{ 
          backgroundColor: '#1e293b', 
          padding: '1.2rem 2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #334155',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
            <h1 style={{ color: '#38bdf8', margin: 0, fontSize: '1.6rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🏎️ FleetDrive
            </h1>
            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: '600', transition: '0.2s' }} onMouseEnter={(e) => e.target.style.color = '#38bdf8'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>AI Assistant</Link>
            {user && (
              <>
                <Link to="/bookings" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: '600', transition: '0.2s' }} onMouseEnter={(e) => e.target.style.color = '#38bdf8'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>My Bookings</Link>
                <Link to="/admin" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: '600', transition: '0.2s' }} onMouseEnter={(e) => e.target.style.color = '#38bdf8'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Admin Panel</Link>
                <Link to="/analytics" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: '600', transition: '0.2s' }} onMouseEnter={(e) => e.target.style.color = '#38bdf8'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Metrics</Link>
              </>
            )}
          </div>
          <div>
            {user ? (
              <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                <span style={{ color: '#e2e8f0' }}>Welcome, <strong style={{ color: '#38bdf8' }}>{user.name}</strong></span>
                <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', transition: '0.2s' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'} onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}>Logout</button>
              </div>
            ) : (
              <Link to="/auth" style={{ padding: '0.5rem 1.2rem', backgroundColor: '#0284c7', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontWeight: '700', transition: '0.2s' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#0369a1'} onMouseLeave={(e) => e.target.style.backgroundColor = '#0284c7'}>Login / Register</Link>
            )}
          </div>
        </nav>

        {/* Dynamic Route View */}
        <Routes>
          <Route path="/" element={<AIRecommendation />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/bookings" element={<BookingHistory />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;