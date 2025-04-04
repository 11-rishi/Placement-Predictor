import React from 'react';
import './HomePage.css';
import Navbar from './Navbar';

function HomePage() {
  return (
    <div className="home-page">
      <Navbar />
      <div className="home-container">
        <h1>Welcome to Our App</h1>
        <p>This is the homepage of our application. Get started by exploring our features.</p>
        <div className="cta-buttons">
          <button className="cta-button primary">Get Started</button>
          <button className="cta-button secondary">Learn More</button>
        </div>
      </div>
    </div>
  );
}

export default HomePage; 