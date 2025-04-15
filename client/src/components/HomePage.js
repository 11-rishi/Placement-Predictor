import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import FileUpload from './FileUpload';

const HomePage = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="homepage">
      <Navbar />
      <div className="homepage-content">
        <h1>Welcome to Placement Predictor</h1>
        {user && (
          <div className="user-info">
            <h2>Hello, {user.username}!</h2>
            <p>You are successfully logged in.</p>

            <div className="resume-upload-section">
              <h3>Upload Your Resume</h3>
              <FileUpload />
            </div>
          </div>
        )}
        <p>This application helps predict your placement opportunities based on your profile and performance.</p>
        <p>Explore our features to see your placement chances and improve your skills.</p>
        <div className="cta-buttons">
          {!user && (
            <>
              <Link to="/login" className="cta-button login">Login</Link>
              <Link to="/signup" className="cta-button signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;