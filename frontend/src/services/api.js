import axios from 'axios';

// ⭐ Use environment variable for deployed backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

// ===========================
// ⭐ REQUEST INTERCEPTOR
// ===========================
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('📤 API Request:', {
      method: config.method,
      url: config.url,
      fullURL: `${API_BASE_URL}${config.url}`,
      data: config.data
    });

    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ===========================
// ⭐ RESPONSE INTERCEPTOR
// ===========================
API.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      data: response.data,
      url: response.config.url
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });

    if (error.response?.status === 401) {
      console.log('🛑 Unauthorized — redirecting to login...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default API;
