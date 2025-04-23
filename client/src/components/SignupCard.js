import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignupCard.css';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import logo from '../images/logo2.png'; 


const SignupCard = () => {
  const [username, setUsername] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { register, user, error } = useAuth();

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Password validation
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return;
    }
    
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    
    try {
      const userData = {
        username,
        email,
        password
      };
      
      const success = await register(userData);
      if (success) {
        console.log('Registration successful!');
        navigate('/login');
      } else {
        setErrorMessage(error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setErrorMessage('An error occurred. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="signup-page">
      <Navbar />
      <div className="signup-card">
      <div className="login-logo">
          <img src={logo} alt="Logo" className="logo-img" />
        </div>  
        <h1>Create Account</h1>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="contactNo">Contact Number</label>
            <input
              type="text"
              id="contactNo"
              placeholder="Enter your contact number"
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
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
                placeholder="Create password"
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
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className={`toggle-password ${showConfirmPassword ? 'active' : ''}`}
                onClick={toggleConfirmPasswordVisibility}
                disabled={loading}
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
          <div className="button-group">
            <button type="submit" className="btn btn-signup" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </div>
        </form>
        <div className="login-prompt">
          <p>Already have an account?</p>
          <Link to="/login" className="btn-login-link">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupCard; 