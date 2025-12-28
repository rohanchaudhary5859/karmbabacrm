import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import axios from 'axios';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
// Configure axios base URL for API calls (use Vite env or fallback to localhost)
axios.defaults.baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
// If a token exists, set default Authorization header
const existingToken = localStorage.getItem('token');
if (existingToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${existingToken}`;
}