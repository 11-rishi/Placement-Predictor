import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginCard.css';
import Navbar from './Navbar';

const LoginCard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password: '********', rememberMe });
    alert('Login successful! This is a demo.');
    // Redirect to homepage after login
    navigate('/');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <Navbar />
      <div className="login-card">
        <div className="user-icon">
          <svg viewBox="0 0 24 24" width="50" height="50">
            <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M4 20.5c0-4 3.5-8 8-8s8 4 8 8" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <h1>Welcome Back</h1>
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
              />
              <button
                type="button"
                className={`toggle-password ${showPassword ? 'active' : ''}`}
                onClick={togglePasswordVisibility}
              >
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                    fill="currentColor"
                  />
                </svg>
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
              />
              <span>Remember Me</span>
            </label>
            <a href="#" className="forgot-password">Forgot Password</a>
          </div>
          <div className="button-group">
            <button type="reset" className="btn btn-clear">Clear</button>
            <button type="submit" className="btn btn-login">Login</button>
          </div>
        </form>
        <div className="register-prompt">
          <p>Don't have an account?</p>
          <Link to="/signup" className="btn btn-register">Register</Link>
        </div>
        <div className="home-link">
          <Link to="/">Back to Homepage</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginCard; 