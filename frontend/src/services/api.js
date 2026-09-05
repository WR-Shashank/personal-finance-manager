import axios from 'axios';

// Create a configured axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://personal-finance-manager-jbh1.onrender.com/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle unauthorized access and automatically redirect or clear states
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If a request returns 401 Unauthorized (except login/register endpoints), it indicates session expired
    if (error.response && error.response.status === 401) {
      const isAuthUrl = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthUrl) {
        // We can handle global session expiration if needed
        console.warn('Session expired or unauthorized request.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
