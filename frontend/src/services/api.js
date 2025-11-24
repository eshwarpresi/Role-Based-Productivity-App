import axios from 'axios';

// ⭐ WILL BE SET IN VERCEL ENVIRONMENT VARIABLES
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔧 API URL:', API_BASE_URL);

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;