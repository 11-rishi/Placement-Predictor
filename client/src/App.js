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
import AboutUs from './components/Aboutus';
import CompaniesPage from './components/CompaniesPage';
import CompanyDetailPage from './components/CompanyDetailPage';
import ResultsPage from './components/ResultsPage';
import TestPage from './components/TestPage';
import TestResultSheet from './components/TestResultSheet';

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
  const { user } = useAuth();

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginCard />} />
          <Route path="/signup" element={<SignupCard />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/companies/:companyName" element={<CompanyDetailPage />} />
          <Route 
            path="/companies/:companyName/test/:type" 
            element={
              <ProtectedRoute>
                <TestPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/companies/:companyName/results" element={<ResultsPage />} />
          <Route path="/companies/:companyName/result-sheet" element={<TestResultSheet />} />
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
console.log('API KEY:', process.env.REACT_APP_RAPIDAPI_KEY);

export default AppWrapper;
