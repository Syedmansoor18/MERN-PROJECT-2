// src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StockCard from './components/StockCard';
import Auth from './components/Auth'; // Import the Auth component
import './App.css';

// It is a security best practice to store API keys in environment variables.
// Create a .env.local file in your project's root and add:
// VITE_RAPIDAPI_KEY=your_actual_api_key
const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;

const App = () => {
  const [stock, setStock] = useState(null);
  const [symbol, setSymbol] = useState('AAPL');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication status

  // Function to check authentication status (e.g., by checking for a token)
  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); // Set true if token exists, false otherwise
  };

  // Check authentication status on initial load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const fetchStock = async (e) => {
    // Prevent form submission from reloading the page
    if (e) e.preventDefault();
    
    // Do not fetch if the symbol is empty or a fetch is in progress
    if (!symbol.trim() || loading) return;

    setLoading(true);
    setError(null);
    setStock(null);

    const options = {
      method: 'GET',
      url: `https://yahoo-finance15.p.rapidapi.com/api/yahoo/qu/quote/${symbol}`,
      headers: {
        'X-RapidAPI-Key': 'fd814e72c9msh7ff5850e3ad326fp1a8370jsnc533ed1e2267', // Replace with your actual RapidAPI Key
        'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com',
      },
    };

    try {
      const res = await axios.request(options);
      // The API wraps the result in `body`, which is an array.
      const data = res.data?.body?.[0];

      if (!data || !data.symbol) {
        throw new Error(`No data found for symbol "${symbol}". Please check the symbol and try again.`);
      }

      setStock({
        symbol: data.symbol,
        name: data.shortName || data.displayName || symbol,
        price: parseFloat(data.regularMarketPrice),
        changePercent: parseFloat(data.regularMarketChangePercent),
        exchange: data.fullExchangeName || 'N/A',
      });

      // In a real app, you might send this data to your backend
      // to save it to MongoDB for the authenticated user.
      // Example (conceptual, requires backend endpoint):
      /*
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('http://localhost:5000/api/user/saved-stocks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token // Send token for authentication
          },
          body: JSON.stringify({
            symbol: data.symbol,
            name: data.shortName || data.displayName || symbol,
            price: data.regularMarketPrice,
            timestamp: new Date().toISOString()
          })
        });
        console.log('Stock saved to user profile in MongoDB (via backend).');
      }
      */

    } catch (err) {
      console.error('Fetch error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'An unknown error occurred.';
      setError(errorMessage);
    } finally {
      // Ensure loading is set to false after the API call completes
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    setIsAuthenticated(false); // Update authentication state
    setStock(null); // Clear stock data on logout
    setError(null); // Clear errors
    setSymbol('AAPL'); // Reset symbol
    console.log('User logged out.');
  };

  // If user is not authenticated, show Auth component
  if (!isAuthenticated) {
    return <Auth onAuthSuccess={checkAuthStatus} />; // Pass checkAuthStatus as callback
  }

  // If user is authenticated, show the main stock tracker app
  return (
    <div className="app-container">
      <h1>Stock Price Tracker</h1>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">You are logged in.</p> {/* Can't display email without decoding JWT */}
        <button onClick={handleLogout} className="search-button bg-red-500 hover:bg-red-700">
          Logout
        </button>
      </div>
      
      <form onSubmit={fetchStock} className="search-form">
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="Enter stock symbol (e.g., GOOGL)"
          className="search-input"
          aria-label="Stock Symbol Input"
        />
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      
      {loading && !stock && <p className="loading-message">Fetching data...</p>}
      
      {stock && <StockCard stock={stock} />}
    </div>
  );
};

export default App;
