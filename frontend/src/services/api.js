import axios from 'axios';

// ⭐ HARDCODED URL - NO ENV VARIABLES
const API = axios.create({
  baseURL: 'https://role-based-productivity-app.onrender.com/api',
  timeout: 10000,
});

// Request interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('🔄 API Request:', config.method?.toUpperCase(), config.url);
  return config;
});

// Response interceptor
API.interceptors.response.use(
  (response) => {
    console.log('✅ API Success:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;