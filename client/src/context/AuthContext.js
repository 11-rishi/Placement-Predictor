import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Set default base URL for axios
axios.defaults.baseURL = 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user on app load if token exists
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await fetchUser(token);
          // Always reset ATS score to null on page load/refresh
          setAtsScore(null);
        } catch (err) {
          console.error('Error during auth initialization:', err);
          localStorage.removeItem('token');
          setUser(null);
          setAtsScore(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const fetchUser = async (token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.get('/api/auth/user', config);

      if (res.data) {
        setUser({
          id: res.data._id,
          username: res.data.username,
          email: res.data.email,
          atsScore: res.data.atsScore
        });
        // Don't set ATS score from user data - we want to show upload form
        // setAtsScore(res.data.atsScore);
        return true;
      } else {
        throw new Error('Invalid user data received');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        setUser(null);
        setAtsScore(null);
      }
      throw err;
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await axios.post('/api/auth/login', { email, password });

      if (res.data && res.data.token && res.data.user) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        // Don't set ATS score - we want to show upload form
        // setAtsScore(res.data.user.atsScore);

        // Set axios default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

        return true;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return false;
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const res = await axios.post('/api/auth/register', userData);
      if (res.data && res.data.success) {
        return true;
      } else {
        throw new Error('Registration failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setAtsScore(null);
    // Remove axios default authorization header
    delete axios.defaults.headers.common['Authorization'];
  };

  // Add token to all axios requests
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add token refresh functionality
  const refreshToken = async () => {
    try {
      const res = await axios.post('/api/auth/refresh-token');
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        return res.data.token;
      }
      return null;
    } catch (err) {
      console.error('Error refreshing token:', err);
      return null;
    }
  };

  // Modify axios interceptors to handle token refresh
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If the error is 401 and we haven't tried to refresh the token yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newToken = await refreshToken();
          if (newToken) {
            // Update the authorization header
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            // Retry the original request
            return axios(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }

        // If refresh failed, logout
        logout();
      }

      return Promise.reject(error);
    }
  );

  const resetAnalysis = () => {
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
    refreshToken,
    resetAnalysis,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
