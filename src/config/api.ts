import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error status codes
      switch (error.response.status) {
        case 400:
          console.error('Bad Request:', error.response.data.message);
          break;
        case 401:
          // Clear token and redirect to login on unauthorized
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 404:
          console.error('Not Found:', error.response.data.message);
          break;
        case 409:
          console.error('Conflict:', error.response.data.message);
          break;
        case 500:
          console.error('Server Error:', error.response.data.message);
          break;
        default:
          console.error('Error:', error.response.data.message);
      }
    }
    return Promise.reject(error);
  }
);

export default api; 