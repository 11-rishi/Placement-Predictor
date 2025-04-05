import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user, logout } = useAuth();
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const generateATSScore = () => {
    setLoading(true);
    // Simulate API call to generate score
    setTimeout(() => {
      // Generate a random score between 70 and 95
      const randomScore = Math.floor(Math.random() * 26) + 70;
      setScore(randomScore);
      setShowScore(true);
      setLoading(false);
    }, 1500);
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
            
            <div className="action-buttons">
              <button 
                className="ats-btn" 
                onClick={generateATSScore}
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate ATS Score'}
              </button>
            </div>

            {showScore && (
              <div className="score-result">
                <h3>Your ATS Compatibility Score</h3>
                <div className="score-display">{score}%</div>
                <p className="score-explanation">
                  This score represents how well your profile matches with typical ATS requirements.
                  A higher score means better chances of passing through automated screening systems.
                </p>
              </div>
            )}
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