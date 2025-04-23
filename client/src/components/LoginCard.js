import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginCard.css';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import logo from '../images/logo2.png'; 


const LoginCard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login, user, error } = useAuth();

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    
    try {
      const success = await login(email, password);
      if (success) {
        console.log('Login successful!');
        navigate('/dashboard');
      } else {
        setErrorMessage(error || 'Invalid email or password');
      }
    } catch (err) {
      setErrorMessage('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <Navbar />
      <div className="login-card">
        <div className="login-logo">
          <img src={logo} alt="Logo" className="logo-img" />
        </div>
        <h1>Welcome Back</h1>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">User ID</label>
            <input
              type="email"
              id="email"
              placeholder="E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className={`toggle-password ${showPassword ? 'active' : ''}`}
                onClick={togglePasswordVisibility}
                disabled={loading}
              >
                👁
              </button>
            </div>
          </div>
          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                disabled={loading}
              />
              Remember Me
            </label>
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>
          <div className="button-group">
            <button type="submit" className="btn login" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        <div className="register-prompt">
          <p>Don't have an account?</p>
          <Link to="/signup" className="btn register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginCard; 