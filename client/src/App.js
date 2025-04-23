import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import LoginCard from './components/LoginCard';
import SignupCard from './components/SignupCard';
import Dashboard from './components/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import FileSelection from './components/FileSelection';
import Navbar from './components/Navbar';
import Profile from './components/Profile';


// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Main App
function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

function App() {
  const { user } = useAuth(); // ✅ Define user here

  return (
    <Router>
      <div className="app">
        {/* Show Navbar on all pages except login/signup */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginCard />} />
          <Route path="/signup" element={<SignupCard />} />

          <Route
            path="/dashboard"
            element={
              user ? <Dashboard /> : <Navigate to="/login" replace />
            }
          />
          <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>


          <Route
            path="/select-files"
            element={
              <ProtectedRoute>
                <FileSelection />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default AppWrapper;
