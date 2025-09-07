import { useState, useEffect, createContext, useContext } from 'react';
import { authAPI } from '../services/authAPI.js';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      // Check if there's a stored token
      const token = localStorage.getItem('authToken');
      if (!token) {
        setAuthState(prev => ({ ...prev, loading: false }));
        return;
      }

      // Try to get user profile to verify token is valid
      const user = await authAPI.getProfile();
      
      if (user) {
        setAuthState({
          user,
          isAuthenticated: true,
          loading: false,
        });
      } else {
        // Clear invalid token
        localStorage.removeItem('authToken');
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Error checking session:', error);
      // Clear invalid token
      localStorage.removeItem('authToken');
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleAuthSuccess = (user, isNewUser = false) => {
    setAuthState({
      user,
      isAuthenticated: true,
      loading: false,
    });

    // Store the token if provided
    if (user.token) {
      localStorage.setItem('authToken', user.token);
    }

    if (isNewUser) {
      toast.success(`Welcome ${user.username || user.name}! Your account has been created.`);
    } else {
      toast.success(`Welcome back, ${user.username || user.name}!`);
    }
  };

  const logout = async () => {
    console.log('Logout function called');
    try {
      console.log('Calling authAPI.logout()');
      await authAPI.logout();

      console.log('Setting auth state to null');
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
      });

      // Clear stored token
      localStorage.removeItem('authToken');

      console.log('Showing success toast');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      
      // Fallback: Clear auth state even if service fails
      console.log('Fallback: Clearing auth state');
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
      
      // Clear localStorage as fallback
      localStorage.removeItem('authToken');
      
      toast.success('Logged out successfully');
    }
  };

  const value = {
    authState,
    handleAuthSuccess,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
