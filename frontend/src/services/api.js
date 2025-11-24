import axios from 'axios';

// ⭐ HARDCODED URL - NO ENVIRONMENT VARIABLES
const API_BASE_URL = 'https://role-based-productivity-app.onrender.com/api';

console.log('🔧 API Configuration:', {
  baseURL: API_BASE_URL,
  environment: 'production'
});

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
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
  console.log(`📤 Making request to: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Response interceptor
API.interceptors.response.use(
  (response) => {
    console.log(`✅ Request successful: ${response.status}`);
    return response;
  },
  (error) => {
    console.error('❌ Request failed:', {
      message: error.message,
      code: error.code,
      url: error.config?.url
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;