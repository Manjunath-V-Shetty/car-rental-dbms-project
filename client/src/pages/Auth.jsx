import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    license_number: ''
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (isLogin) {
        // Send Login Request
        const response = await authService.login({
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setMessage('Login successful! Redirecting...');
        setTimeout(() => navigate('/'), 1500);
      } else {
        // Send Registration Request
        await authService.register(formData);
        setMessage('Registration successful! Please login.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Try again.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', backgroundColor: '#fff', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '1.5rem' }}>
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>

      {error && <p style={{ color: '#e74c3c', textAlign: 'center', fontSize: '0.9rem' }}>{error}</p>}
      {message && <p style={{ color: '#2ecc71', textAlign: 'center', fontSize: '0.9rem' }}>{message}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
          required
        />
        {!isLogin && (
          <>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
            <input
              type="text"
              name="license_number"
              placeholder="Driving License Number"
              value={formData.license_number}
              onChange={handleChange}
              style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </>
        )}
        
        <button
          type="submit"
          style={{ padding: '0.75rem', borderRadius: '4px', border: 'none', backgroundColor: '#2ecc71', color: '#fff', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}
        >
          {isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#7f8c8d' }}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <span 
          onClick={() => setIsLogin(!isLogin)} 
          style={{ color: '#3498db', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {isLogin ? 'Register Here' : 'Login Here'}
        </span>
      </p>
    </div>
  );
};

export default Auth;