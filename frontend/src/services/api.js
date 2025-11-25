import axios from 'axios';

// ⭐ USE ENVIRONMENT VARIABLE
const API_BASE_URL = import.meta.env.VITE_API_URL;

console.log('🚀 API Configuration:', {
  baseURL: API_BASE_URL,
  environment: import.meta.env.MODE
});

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`📤 Making request to: ${config.url}`);
  return config;
});

export default API;