import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AIRecommendation from './pages/AIRecommendation';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
        {/* Navigation Bar */}
        <nav style={{ backgroundColor: '#2c3e50', padding: '1rem 2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <h1 style={{ color: '#fff', margin: 0, fontSize: '1.5rem' }}>🚗 FleetDrive</h1>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}>AI Assistant</Link>
        </nav>

        {/* Dynamic Route View */}
        <Routes>
          <Route path="/" element={<AIRecommendation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;