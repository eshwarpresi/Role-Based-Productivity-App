import axios from "axios";

// Detect production automatically (Vercel)
const API_BASE_URL = import.meta.env.PROD
  ? "https://role-based-productivity-app.onrender.com/api"  // Render backend
  : "http://localhost:5000/api";                            // Local backend

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Attach token to all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Auto logout when token expired or invalid
    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;
