import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../context/AuthContext';
import logo from '../images/logo.png'; 

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo-img" />
          Placement Predictor
        </Link>
      </div>

      <div className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>

        {/* Show Dashboard only if user is logged in */}
        {user && (
          <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
            Dashboard
          </Link>
        )}

        <Link to="/Aboutus" className={location.pathname === '/Aboutus' ? 'active' : ''}>About Us</Link>
        <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>

        {user ? (
          <div className="user-dropdown">
            <button className="user-dropdown-btn">
              {user.username} <span className="dropdown-arrow">▼</span>
            </button>
            <div className="user-dropdown-content">
              <Link to="/profile">Profile</Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Login</Link>
            <Link to="/signup" className={location.pathname === '/signup' ? 'active' : ''}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
