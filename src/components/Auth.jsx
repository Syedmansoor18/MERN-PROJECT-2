// src/components/Auth.jsx
import React, { useState } from 'react';
import './Auth.css';

// Define your backend server URL
const BACKEND_URL = 'http://localhost:5000'; // Change if your backend runs on a different port/host

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';

    try {
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If response is not OK (e.g., 400, 500 status)
        throw new Error(data.message || 'Authentication failed.');
      }

      // If successful, store the token and call success callback
      localStorage.setItem('token', data.token);
      onAuthSuccess(data.token); // Pass the token to App.jsx
      console.log('Authentication successful:', data.message);

    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message || 'An unknown error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="auth-input"
          required
          aria-label="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="auth-input"
          required
          aria-label="Password"
        />
        
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? (isLogin ? 'Logging In...' : 'Signing Up...') : (isLogin ? 'Login' : 'Sign Up')}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <p className="toggle-auth-mode">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button onClick={() => setIsLogin(!isLogin)} disabled={loading}>
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default Auth;
