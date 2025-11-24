import axios from "axios";

// Use the direct Render URL - no environment checks
const API_BASE_URL = "https://role-based-productivity-app.onrender.com/api";

console.log('🚀 API Base URL:', API_BASE_URL);

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`📤 Making API request to: ${config.url}`);
  return config;
});

// Response interceptor
API.interceptors.response.use(
  (response) => {
    console.log(`✅ API Success: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ API Error:`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default API;