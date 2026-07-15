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
        setError('Please log in to view your booking history.');
        setLoading(false);
        return;
      }

      try {
        const response = await bookingService.getUserHistory(loggedInUser.user_id);
        setBookings(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load booking history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '3rem', fontFamily: 'sans-serif' }}>Loading your bookings...</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #ecf0f1', paddingBottom: '0.5rem' }}>📋 Your Rental History</h2>
      
      {error && <p style={{ color: '#e74c3c', fontWeight: 'bold' }}>{error}</p>}

      {!error && bookings.length === 0 && (
        <p style={{ color: '#7f8c8d', marginTop: '1.5rem' }}>You haven't made any reservations yet.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
        {bookings.map((booking) => (
          <div 
            key={booking.booking_id} 
            style={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px', 
              padding: '1.5rem', 
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)', 
              backgroundColor: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#2980b9' }}>
                {booking.make} {booking.model}
              </h3>
              <p style={{ margin: '0 0 0.25rem 0', color: '#7f8c8d', fontSize: '0.9rem' }}>
                <strong>Plate:</strong> {booking.license_plate}
              </p>
              <p style={{ margin: '0 0 0.25rem 0', color: '#34495e' }}>
                <strong>Duration:</strong> {new Date(booking.start_date).toLocaleDateString()} to {new Date(booking.end_date).toLocaleDateString()}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span 
                style={{ 
                  display: 'inline-block',
                  padding: '0.3rem 0.6rem', 
                  borderRadius: '4px', 
                  backgroundColor: booking.status === 'Confirmed' || booking.status === 'Completed' ? '#2ecc71' : '#f39c12', 
                  color: '#fff', 
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  marginBottom: '0.5rem'
                }}
              >
                {booking.status}
              </span>
              <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#2c3e50' }}>
                ${booking.total_cost}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingHistory;