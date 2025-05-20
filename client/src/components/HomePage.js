import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import FileUpload from './FileUpload';


const HomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleSelectFiles = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/dashboard');
    }
  };

  const handleFeatureClick = () => {
    if (!user) {
      navigate('/login');
    }
  };

  return (
    <div className="homepage">
      <Navbar isScrolled={isScrolled} />
      
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Maximize Your Career Potential</h1>
          <h2 className="hero-subtitle">AI-Powered Placement Prediction & ATS Optimization</h2>
          <p className="hero-description">
            Our intelligent algorithms analyze your profile, optimize your resume for ATS systems, 
            and provide personalized guidance to increase your placement success by up to 70%.
          </p>
          {!user ? (
            <div className="hero-cta">
              <Link to="/signup" className="cta-button primary">
                Get Started <span className="arrow-icon">→</span>
              </Link>
              <Link to="/login" className="cta-button secondary">
                Log In
              </Link>
            </div>
          ) : (
            <div className="hero-cta">
              <button onClick={handleSelectFiles} className="cta-button primary">
                Begin Assessment <span className="arrow-icon">→</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-icon">
              <span className="icon-placeholder">📄</span>
            </div>
            <h3>Upload Your Resume</h3>
            <p>Upload your resume and academic credentials for AI analysis</p>
            <span className="arrow-connector">→</span>
          </div>
          <div className="step">
            <div className="step-icon">
              <span className="icon-placeholder">🎯</span>
            </div>
            <h3>Get Your ATS Score</h3>
            <p>Receive a detailed ATS compatibility score and suggestions</p>
            <span className="arrow-connector">→</span>
          </div>
          <div className="step">
            <div className="step-icon">
              <span className="icon-placeholder">📈</span>
            </div>
            <h3>Skill Assessment</h3>
            <p>Complete aptitude and coding assessments to evaluate your skills</p>
            <span className="arrow-connector">→</span>
          </div>
          <div className="step">
            <div className="step-icon">
              <span className="icon-placeholder">🏆</span>
            </div>
            <h3>Placement Prediction</h3>
            <p>Get personalized placement predictions and improvement plan</p>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">Powerful Features</h2>
        <div className="features-grid">
          <div className="feature-card" onClick={handleFeatureClick} role="button" tabIndex={0}>
            <div className="feature-icon-wrapper">
              <span className="icon-placeholder">📄</span>
            </div>
            <h3>ATS Optimization</h3>
            <p>Get your resume scored against leading ATS systems and receive detailed improvement suggestions</p>
          </div>
          <div className="feature-card" onClick={handleFeatureClick} role="button" tabIndex={0}>
            <div className="feature-icon-wrapper">
              <span className="icon-placeholder">🎯</span>
            </div>
            <h3>Targeted Recommendations</h3>
            <p>Receive personalized skill development recommendations based on your profile and target roles</p>
          </div>
          <div className="feature-card" onClick={handleFeatureClick} role="button" tabIndex={0}>
            <div className="feature-icon-wrapper">
              <span className="icon-placeholder">📈</span>
            </div>
            <h3>Progress Analytics</h3>
            <p>Track your improvement over time with comprehensive dashboards and visual analytics</p>
          </div>
        </div>
      </div>

      <div className="testimonials-section">
        <h2 className="section-title">Success Stories</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-quote">"This platform improved my ATS score by 65% and helped me land interviews at top tech companies."</div>
            <div className="testimonial-author">
              <div className="author-avatar">RP</div>
              <div className="author-details">
                <h4>Rahul P.</h4>
                <p>Software Engineer at Google</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-quote">"The personalized recommendations were spot on. I focused on improving those areas and got placed within 2 months!"</div>
            <div className="testimonial-author">
              <div className="author-avatar">AP</div>
              <div className="author-details">
                <h4>Anjali P.</h4>
                <p>Data Analyst at Amazon</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-quote">"The aptitude practice and ATS optimization were game changers for my placement journey."</div>
            <div className="testimonial-author">
              <div className="author-avatar">SK</div>
              <div className="author-details">
                <h4>Sanjay K.</h4>
                <p>Product Manager at Microsoft</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Placement Predictor</h3>
            <p>Your gateway to career success with AI-powered placement predictions and personalized guidance.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/features">Features</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: XYZ@gmail.com</p>
            <p>Phone: +91 987 654 3210</p>
          </div>
          <div className="footer-section">
            <h3>MAKERS</h3>
            <p>RAGHAV DESHPANDE</p>
            <p>HARSHWARSHAN JOSHI</p>
            <p>RISHI GOYAL</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Placement Predictor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;