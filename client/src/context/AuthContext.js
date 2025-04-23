import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user on app load if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.get('/api/auth/profile', config);
      setUser(res.data.user);
      setAtsScore(res.data.user.atsScore); // Optional: if you return ATS from backend
    } catch (err) {
      console.error('Error fetching user:', err);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      setUser(res.data.user);
      setAtsScore(res.data.user.atsScore); // Optional
      localStorage.setItem('token', res.data.token);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const res = await axios.post('/api/auth/register', userData);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setAtsScore(null);
  };

  const value = {
    user,
    setUser,
    atsScore,
    setAtsScore,
    loading,
    error,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
