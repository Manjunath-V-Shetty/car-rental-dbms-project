import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', license_number: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (isLogin) {
        const response = await authService.login({ email: formData.email, password: formData.password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setMessage('🔓 Login successful! Syncing session context...');
        setTimeout(() => { navigate('/'); window.location.reload(); }, 1200);
      } else {
        await authService.register(formData);
        setMessage('✅ Registration complete! Proceed to sign in.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication framework rejection.');
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '5rem auto', padding: '2.5rem', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.4)' }}>
      <h2 style={{ textAlign: 'center', color: '#f8fafc', fontSize: '1.8rem', fontWeight: '800', margin: '0 0 2rem 0' }}>
        {isLogin ? 'Sign In to Account' : 'Register Profile'}
      </h2>

      {error && <p style={{ color: '#f87171', fontSize: '0.9rem', backgroundColor: 'rgba(248,113,113,0.1)', padding: '0.6rem', borderRadius: '6px', textAlign: 'center' }}>{error}</p>}
      {message && <p style={{ color: '#4ade80', fontSize: '0.9rem', backgroundColor: 'rgba(74,222,128,0.1)', padding: '0.6rem', borderRadius: '6px', textAlign: 'center' }}>{message}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '1rem' }}>
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', outline: 'none' }}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', outline: 'none' }}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Secure Password"
          value={formData.password}
          onChange={handleChange}
          style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', outline: 'none' }}
          required
        />
        {!isLogin && (
          <>
            <input
              type="text"
              name="phone"
              placeholder="Phone Contact Connection"
              value={formData.phone}
              onChange={handleChange}
              style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', outline: 'none' }}
              required
            />
            <input
              type="text"
              name="license_number"
              placeholder="Driving License Serial"
              value={formData.license_number}
              onChange={handleChange}
              style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', outline: 'none' }}
              required
            />
          </>
        )}
        
        <button
          type="submit"
          style={{ padding: '0.8rem', borderRadius: '8px', border: 'none', backgroundColor: '#38bdf8', color: '#0f172a', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', marginTop: '0.5rem' }}
        >
          {isLogin ? 'Access Console' : 'Complete Setup'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#94a3b8' }}>
        {isLogin ? "New user parameter? " : "Already verified? "}
        <span onClick={() => setIsLogin(!isLogin)} style={{ color: '#38bdf8', cursor: 'pointer', fontWeight: '700' }}>
          {isLogin ? 'Create Account' : 'Sign In'}
        </span>
      </p>
    </div>
  );
};

export default Auth;