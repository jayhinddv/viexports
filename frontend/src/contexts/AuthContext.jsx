// contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

// Create the Auth Context
export const AuthContext = createContext();

// AuthProvider component to wrap the app and provide context values
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Check for token in localStorage or other storage
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, [isLoggedIn,token]);

  const login = (token, role) => {
    setToken(token);
    setRole(role);
    setIsLoggedIn(true);
    localStorage.setItem("token", token);
	localStorage.setItem("role", role);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setIsLoggedIn(false);
    localStorage.removeItem("token");
	localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth custom hook to access auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
