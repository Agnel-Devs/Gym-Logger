import React, { useState } from 'react';
import api from '../api';

export default function Login({ onLoginSuccess }) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (isLoginTab) {
      // Login flow
      try {
        const response = await api.post('token/', { username, password });
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        onLoginSuccess();
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.detail || 'Invalid username or password');
      } finally {
        setLoading(false);
      }
    } else {
      // Registration flow
      try {
        await api.post('register/', { username, email, password });
        setSuccess('Registration successful! You can now log in.');
        setIsLoginTab(true);
        setPassword('');
      } catch (err) {
        console.error(err);
        const data = err.response?.data;
        let errMsg = 'Registration failed. Please check your inputs.';
        if (data) {
          if (typeof data === 'object') {
            errMsg = Object.entries(data)
              .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(' ') : val}`)
              .join(' | ');
          } else {
            errMsg = data;
          }
        }
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Gym Logger</h2>
        <p className="auth-subtitle">Track your gym sessions with ease</p>

        <div className="auth-tabs">
          <button 
            type="button" 
            className={`auth-tab ${isLoginTab ? 'active' : ''}`}
            onClick={() => { setIsLoginTab(true); setError(''); setSuccess(''); }}
          >
            Login
          </button>
          <button 
            type="button" 
            className={`auth-tab ${!isLoginTab ? 'active' : ''}`}
            onClick={() => { setIsLoginTab(false); setError(''); setSuccess(''); }}
          >
            Register
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input 
              id="username"
              type="text" 
              className="input-control"
              placeholder="Enter your username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>

          {!isLoginTab && (
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email (Optional)</label>
              <input 
                id="email"
                type="email" 
                className="input-control"
                placeholder="Enter your email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              className="input-control"
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Please wait...' : isLoginTab ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}