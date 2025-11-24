import axios from "axios";

// ❗ No VITE_BACKEND_URL needed unless you want it.
// Vercel → import.meta.env.PROD === true
const API = axios.create({
  baseURL: import.meta.env.PROD
    ? "https://role-based-productivity-app.onrender.com/api"   // Render backend
    : "http://localhost:5000/api",                             // Local backend
  timeout: 15000,
});

// Attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;
