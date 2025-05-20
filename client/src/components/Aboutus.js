
import React from 'react';
import Navbar from './Navbar';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-container">
      <Navbar />
      <div className="about-content">
        <section className="about-hero">
          <h1>About Placement Predictor</h1>
          <p className="about-subtitle">
            Your AI-Powered Career Success Platform
          </p>
        </section>

        <section className="about-mission">
          <h2>Our Mission</h2>
          <p>
            At Placement Predictor, we're revolutionizing the job search process by combining 
            artificial intelligence with career guidance. Our platform helps students and 
            professionals optimize their resumes for Applicant Tracking Systems (ATS), 
            predict their placement success, and receive personalized recommendations for 
            career growth.
          </p>
        </section>

        <section className="about-features">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>ATS Score Analysis</h3>
              <p>
                Get your resume scored against leading ATS systems with detailed 
                feedback and improvement suggestions. Our AI analyzes your resume's 
                compatibility with modern recruitment software.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Placement Prediction</h3>
              <p>
                Receive accurate predictions about your placement success based on 
                your profile, skills, and experience. Our algorithm considers multiple 
                factors to provide realistic expectations.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Skill Assessment</h3>
              <p>
                Take comprehensive aptitude and coding assessments to evaluate your 
                technical skills. Get detailed feedback and areas for improvement.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>Personalized Recommendations</h3>
              <p>
                Receive tailored suggestions for skill development, resume optimization, 
                and career growth based on your profile and target roles.
              </p>
            </div>
          </div>
        </section>

        <section className="about-how-it-works">
          <h2>How It Works</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Upload Your Resume</h3>
              <p>Upload your resume in PDF format for AI analysis</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Get Your ATS Score</h3>
              <p>Receive a detailed ATS compatibility score and suggestions</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Complete Assessments</h3>
              <p>Take aptitude and coding tests to evaluate your skills</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Get Predictions</h3>
              <p>Receive personalized placement predictions and improvement plan</p>
            </div>
          </div>
        </section>

        <section className="about-team">
          <h2>Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">RD</div>
              <h3>Raghav Deshpande</h3>
              <p>Lead Developer</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">HJ</div>
              <h3>Harshwarshan Joshi</h3>
              <p>Backend Developer</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">RG</div>
              <h3>Rishi Goyal</h3>
              <p>Frontend Developer</p>
            </div>
          </div>
        </section>

        <section className="about-contact">
          <h2>Get in Touch</h2>
          <p>
            Have questions or feedback? We'd love to hear from you!
          </p>
          <div className="contact-info">
            <p>Email: XYZ@gmail.com</p>
            <p>Phone: +91 987 654 3210</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
