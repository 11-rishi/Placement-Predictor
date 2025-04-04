import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
        <Link to="/statistics" className={location.pathname === '/statistics' ? 'active' : ''}>Statistics</Link>
        <Link to="/gallery" className={location.pathname === '/gallery' ? 'active' : ''}>Gallery</Link>
        <Link to="/team" className={location.pathname === '/team' ? 'active' : ''}>Team</Link>
        <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About Us</Link>
        <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact Us</Link>
        <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Login</Link>
        <Link to="/signup" className={location.pathname === '/signup' ? 'active' : ''}>Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar; 