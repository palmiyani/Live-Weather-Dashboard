import React, { useState } from 'react';
import { User, LogOut, Settings, Bell, ChevronDown, Phone, Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { authState, logout } = useAuth();

  if (!authState.isAuthenticated || !authState.user) {
    return null;
  }

  const { user } = authState;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {user.name || 'User'}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {user.phoneNumber || user.email}
          </p>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user.name || 'User'}
                  </p>
                  <div className="space-y-1">
                    {user.phoneNumber && (
                      <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400">
                        <Phone className="w-3 h-3" />
                        <span>{user.phoneNumber}</span>
                      </div>
                    )}
                    {user.email && (
                      <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400">
                        <Mail className="w-3 h-3" />
                        <span>{user.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="py-2">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Profile Settings</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
              >
                <Bell className="w-4 h-4" />
                <span>Notification Settings</span>
              </button>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 py-2">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
