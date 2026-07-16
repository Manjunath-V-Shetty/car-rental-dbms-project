import React, { useEffect, useState } from 'react';
import { analyticsService } from '../services/api';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getMetrics()
      .then(res => { setData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Polling transaction log summaries...</div>;

  return (
    <div style={{ padding: '3rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ color: '#f8fafc', fontSize: '2rem', fontWeight: '800', borderBottom: '1px solid #334155', paddingBottom: '0.8rem', marginBottom: '2rem' }}>📊 Database Engine Dashboard Matrix</h2>
      
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
          <h3 style={{ color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase', margin: '0 0 0.5rem 0' }}>Total Fleet Assets</h3>
          <p style={{ fontSize: '2.5rem', margin: 0, fontWeight: '800', color: '#f8fafc' }}>{data.summary.total_cars}</p>
        </div>
        <div style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
          <h3 style={{ color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase', margin: '0 0 0.5rem 0' }}>Available Pool</h3>
          <p style={{ fontSize: '2.5rem', margin: 0, fontWeight: '800', color: '#4ade80' }}>{data.summary.available_cars}</p>
        </div>
        <div style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
          <h3 style={{ color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase', margin: '0 0 0.5rem 0' }}>Rented Active Nodes</h3>
          <p style={{ fontSize: '2.5rem', margin: 0, fontWeight: '800', color: '#fb923c' }}>{data.summary.rented_cars}</p>
        </div>
      </div>

      <h3 style={{ color: '#f8fafc', marginBottom: '1rem', fontSize: '1.3rem' }}>🕵️‍♂️ Gemini Context Log Parser Audit History</h3>
      <div style={{ border: '1px solid #334155', borderRadius: '12px', backgroundColor: '#1e293b', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#cbd5e1' }}>
          <thead>
            <tr style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #334155' }}>
              <th style={{ padding: '1rem', color: '#94a3b8' }}>Log Hash ID</th>
              <th style={{ padding: '1rem', color: '#94a3b8' }}>Natural Request Prompt</th>
              <th style={{ padding: '1rem', color: '#94a3b8' }}>Mapped Key Output Array</th>
            </tr>
          </thead>
          <tbody>
            {data.aiLogs.map((log) => (
              <tr key={log.log_id} style={{ borderBottom: '1px solid #334155' }}>
                <td style={{ padding: '1rem', fontWeight: 'bold', color: '#38bdf8' }}>#{log.log_id}</td>
                <td style={{ padding: '1rem' }}>"{log.user_prompt}"</td>
                <td style={{ padding: '1rem' }}><span style={{ fontFamily: 'monospace', background: '#0f172a', padding: '0.3rem 0.6rem', borderRadius: '4px', color: '#cbd5e1', border: '1px solid #334155' }}>[{log.recommended_vehicle_ids.join(', ')}]</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics;