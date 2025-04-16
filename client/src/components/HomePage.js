import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import FileUpload from './FileUpload';

const HomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleSelectFiles = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/select-files');
    }
  };

  const handleFeatureClick = () => {
    if (!user) {
      navigate('/login');
    }
  };

  return (
    <div className="homepage">
      <Navbar />
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Placement Predictor</h1>
          <p className="hero-subtitle">Your Gateway to Career Success</p>
          <p className="hero-description">
            Get personalized placement predictions and improve your chances of landing your dream job.
          </p>
          {!user && (
            <div className="hero-cta">
              <Link to="/login" className="cta-button login">Login</Link>
              <Link to="/signup" className="cta-button signup">Sign Up</Link>
            </div>
          )}
        </div>
      </div>

      <div className="features-section">
        <div className="feature-card" onClick={handleFeatureClick} role="button" tabIndex={0}>
          <div className="feature-icon">📊</div>
          <h3>Smart Analysis</h3>
          <p>Get detailed insights into your placement chances based on your profile</p>
        </div>
        <div className="feature-card" onClick={handleFeatureClick} role="button" tabIndex={0}>
          <div className="feature-icon">🎯</div>
          <h3>Targeted Suggestions</h3>
          <p>Receive personalized recommendations to improve your employability</p>
        </div>
        <div className="feature-card" onClick={handleFeatureClick} role="button" tabIndex={0}>
          <div className="feature-icon">📈</div>
          <h3>Progress Tracking</h3>
          <p>Monitor your improvement over time with detailed analytics</p>
        </div>
      </div>

      {user && (
        <div className="user-section">
          <div className="user-card">
            <h2>Hello, {user.username}!</h2>
            <p className="welcome-message">You're all set to start your placement journey</p>
            <div className="resume-upload-section">
              <h3>Upload Your Resume</h3>
              <FileUpload />
            </div>
            <button onClick={handleSelectFiles} className="cta-button select-files">
              Select Files
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;