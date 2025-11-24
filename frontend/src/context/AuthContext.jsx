import React, { createContext, useState, useContext, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      console.log("Attempting login with:", { username, API_URL: API.defaults.baseURL });
      
      const response = await API.post("/auth/login", { 
        username, 
        password 
      });
      
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
      
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (username, password) => {
    try {
      const response = await API.post("/auth/register", { 
        username, 
        password 
      });
      
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
      
      return response.data;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete API.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};