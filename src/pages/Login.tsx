import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // In your existing login handler, after successful login:
  const handleLogin = async (/* your existing parameters */) => {
    try {
      // Your existing login logic
      // After successful login:
      login(userData); // Add this line
      navigate('/select-files');
    } catch (error) {
      // Your existing error handling
    }
  };
  
  // ... rest of your existing component
} 