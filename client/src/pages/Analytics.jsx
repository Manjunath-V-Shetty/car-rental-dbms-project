import React, { useEffect, useState } from 'react';
import { analyticsService } from '../services/api';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getMetrics()
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>Loading Database Metrics...</div>;
  if (!data) return <div style={{ padding: '2rem', textAlign: 'center', color: '#e74c3c', fontFamily: 'sans-serif' }}>Error connecting to analytics engine.</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #ecf0f1', paddingBottom: '0.5rem' }}>📊 Relational Database Analytics</h2>
      
      {/* Metrics Summary Blocks */}
      <div style={{ display: 'flex', gap: '1.5rem', margin: '2rem 0' }}>
        <div style={{ flex: 1, background: '#34495e', color: '#fff', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Total Registered Fleet</h3>
          <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold' }}>{data.summary.total_cars}</p>
        </div>
        <div style={{ flex: 1, background: '#2ecc71', color: '#fff', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Available Inventory</h3>
          <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold' }}>{data.summary.available_cars}</p>
        </div>
        <div style={{ flex: 1, background: '#e67e22', color: '#fff', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Active Rentals Out</h3>
          <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold' }}>{data.summary.rented_cars}</p>
        </div>
      </div>

      {/* AI Log Audit Trail */}
      <h3 style={{ color: '#2c3e50', marginTop: '3rem' }}>🕵️‍♂️ AI Query Search Audit Logs (Last 10 Actions)</h3>
      <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fff', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f6f7', borderBottom: '2px solid #e0e0e0' }}>
              <th style={{ padding: '1rem' }}>Log ID</th>
              <th style={{ padding: '1rem' }}>Natural Language Prompt</th>
              <th style={{ padding: '1rem' }}>Mapped Database IDs</th>
              <th style={{ padding: '1rem' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {data.aiLogs.map((log) => (
              <tr key={log.log_id} style={{ borderBottom: '1px solid #eef2f3' }}>
                <td style={{ padding: '1rem', fontWeight: 'bold' }}>#{log.log_id}</td>
                <td style={{ padding: '1rem', color: '#555' }}>"{log.user_prompt}"</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ fontFamily: 'monospace', background: '#f0f0f0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    [{log.recommended_vehicle_ids.join(', ') || 'None'}]
                  </span>
                </td>
                <td style={{ padding: '1rem', color: '#7f8c8d', fontSize: '0.85rem' }}>
                  {new Date(log.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics;