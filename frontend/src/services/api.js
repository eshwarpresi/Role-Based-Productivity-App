import axios from 'axios';

// Automatically choose backend URL (local vs deployed)
const API = axios.create({
  baseURL: import.meta.env.PROD
    ? "https://role-based-productivity-app.onrender.com/api"
    : "http://localhost:5000/api",
  timeout: 15000, 
});

// Add token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
