import React, { useEffect, useState } from 'react';
import { bookingService } from '../services/api';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const loggedInUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchHistory = async () => {
      if (!loggedInUser) {
        setError('Session missing: Please login to poll booking logs.');
        setLoading(false);
        return;
      }
      try {
        const response = await bookingService.getUserHistory(loggedInUser.user_id);
        setBookings(response.data);
      } catch (err) {
        setError('Failed to resolve transaction statement tree.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem', color: '#94a3b8' }}>Polling active transaction statements...</div>;

  return (
    <div style={{ padding: '3rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ color: '#f8fafc', fontSize: '2rem', fontWeight: '800', borderBottom: '1px solid #334155', paddingBottom: '0.8rem', marginBottom: '2rem' }}>📋 Rental History Record Matrix</h2>
      
      {error && <p style={{ color: '#f87171', fontWeight: '600' }}>{error}</p>}
      {bookings.length === 0 && !error && <p style={{ color: '#64748b' }}>No verified query histories matching user ID allocation.</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        {bookings.map((booking) => (
          <div key={booking.booking_id} style={{ border: '1px solid #334155', borderRadius: '12px', padding: '1.5rem', backgroundColor: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#38bdf8', fontSize: '1.3rem' }}>{booking.make} {booking.model}</h3>
              <p style={{ margin: '0 0 0.25rem 0', color: '#94a3b8', fontSize: '0.9rem' }}><strong>Registration Tag:</strong> <span style={{ fontFamily: 'monospace' }}>{booking.license_plate}</span></p>
              <p style={{ margin: 0, color: '#cbd5e1' }}><strong>Active Schedule Window:</strong> {new Date(booking.start_date).toLocaleDateString()} — {new Date(booking.end_date).toLocaleDateString()}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'inline-block', padding: '0.3rem 0.6rem', borderRadius: '6px', backgroundColor: 'rgba(74,222,128,0.15)', color: '#4ade80', fontWeight: '700', fontSize: '0.8rem', border: '1px solid rgba(74,222,128,0.3)', marginBottom: '0.6rem' }}>
                {booking.status}
              </span>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f8fafc' }}>${booking.total_cost}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingHistory;