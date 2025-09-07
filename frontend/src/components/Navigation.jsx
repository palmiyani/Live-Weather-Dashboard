// src/components/Navigation.jsx
import React, { useState, useEffect } from 'react';
import { Moon, Sun, User, LogOut } from 'lucide-react';
import AuthModal from './AuthModal';
import { useAuth } from '../hooks/useAuth';

const Navigation = ({ activeTab, setActiveTab, currentUser, className = '' }) => {
  const [authModal, setAuthModal] = useState({ open: false, step: 'login' });
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    document.documentElement.classList.toggle('dark', savedDarkMode);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const handleLoginClick = () => {
    console.log('Login button clicked');
    setAuthModal({ open: true, step: 'login' });
  };

  const handleSignupClick = () => {
    setAuthModal({ open: true, step: 'signup' });
  };

  const { handleAuthSuccess: authSuccess, logout } = useAuth();

  const handleAuthSuccess = (user) => {
    authSuccess(user, false);
    setAuthModal({ open: false, step: 'login' });
  };

  const handleLogout = () => {
    console.log('Logout button clicked');
    logout();
  };

  return (
    <nav className={`transparent-black backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 px-6 py-4 ${className}`}>
      <div className="flex justify-between items-center">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <Sun size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white drop-shadow-sm">
            Live Weather Dashboard
          </span>
        </div>

        {/* Center Navigation */}
        <div className="flex gap-6 text-lg font-medium">
          {['home', 'comparison', 'charts', 'history'].map((tab) => (
            <button
              key={tab}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition nav-link ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white active' 
                  : 'text-white hover:text-blue-300'
              }`}
              onClick={() => {
                setActiveTab(tab);
                // Add Barba.js transition
                const container = document.querySelector('[data-barba="container"]');
                if (container) {
                  container.setAttribute('data-barba-namespace', tab);
                }
              }}
              data-barba-prevent="self"
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Right side - Dark mode toggle and Login/Profile */}
        <div className="flex items-center gap-3">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg transparent-black hover:bg-white/20 transition"
          >
            {darkMode ? <Sun size={18} className="text-white" /> : <Moon size={18} className="text-white" />}
          </button>
          
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{currentUser.username}</p>
                <p className="text-xs text-gray-300">{currentUser.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm flex items-center gap-1"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleLoginClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <User size={16} />
              Login
            </button>
          )}
        </div>
      </div>

      {/* Auth Modal for login/signup */}
      <AuthModal
        isOpen={authModal.open}
        onClose={() => setAuthModal({ open: false, step: 'login' })}
        initialStep={authModal.step}
        onAuthSuccess={handleAuthSuccess}
        onSwitchToSignup={handleSignupClick}
      />
    </nav>
  );
};

export default Navigation;
