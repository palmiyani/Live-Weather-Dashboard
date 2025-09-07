import React, { useState, useEffect } from 'react';
import {
  Bell,
  Plus,
  X,
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  AlertTriangle,
  Check,
  Trash2,
  Settings,
  BellRing,
  BellOff,
} from 'lucide-react';
import { useAlerts } from '../hooks/useAlerts.js';

const AlertSystem = ({ currentCity, currentUser, weatherData }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [formData, setFormData] = useState({
    city: currentCity || '',
    parameter: 'temperature',
    condition: '>',
    value: '',
  });

  const {
    alerts,
    notifications,
    unreadCount,
    addAlert,
    removeAlert,
    toggleAlert,
    checkAlerts,
    markNotificationAsRead,
    clearNotifications,
    requestNotificationPermission,
  } = useAlerts();

  // Check alerts when weather data changes
  useEffect(() => {
    if (weatherData && alerts.length > 0) {
      checkAlerts(weatherData);
    }
  }, [weatherData, alerts, checkAlerts]);

  const parameterOptions = [
    { value: 'temperature', label: 'Temperature', icon: Thermometer, unit: '°C' },
    { value: 'humidity', label: 'Humidity', icon: Droplets, unit: '%' },
    { value: 'windSpeed', label: 'Wind Speed', icon: Wind, unit: ' m/s' },
    { value: 'pressure', label: 'Pressure', icon: Gauge, unit: ' hPa' },
  ];

  const conditionOptions = [
    { value: '>', label: 'Greater than (>)' },
    { value: '<', label: 'Less than (<)' },
    { value: '>=', label: 'Greater than or equal (≥)' },
    { value: '<=', label: 'Less than or equal (≤)' },
    { value: '=', label: 'Equal to (=)' },
  ];

  const handleCreateAlert = (e) => {
    e.preventDefault();

    if (!formData.city || !formData.value) return;

    const selectedParameter = parameterOptions.find(p => p.value === formData.parameter);

    addAlert({
      city: formData.city,
      parameter: formData.parameter,
      condition: formData.condition,
      value: parseFloat(formData.value),
      unit: selectedParameter?.unit || '',
      isActive: true,
    });

    setFormData({
      city: currentCity || '',
      parameter: 'temperature',
      condition: '>',
      value: '',
    });
    setShowCreateForm(false);
    requestNotificationPermission();
  };

  const formatAlertDescription = (alert) => {
    const parameter = parameterOptions.find(p => p.value === alert.parameter);
    return `${parameter?.label} ${alert.condition} ${alert.value}${alert.unit}`;
  };

  return (
    <div className="card-transparent rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Weather Alert System</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
            >
              <BellRing className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-orange-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              disabled={!currentUser}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                currentUser 
                  ? 'bg-white/20 hover:bg-white/30' 
                  : 'bg-white/10 cursor-not-allowed opacity-50'
              }`}
              title={!currentUser ? 'Please login to create alerts' : 'Create new alert'}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-orange-100 text-sm mt-1">
          Get notified when weather conditions meet your criteria
        </p>
      </div>

      <div className="p-6">
        {showNotifications && (
          <div className="mb-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Notifications ({notifications.length})
              </h4>
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Clear All
                </button>
              )}
            </div>
            {notifications.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                No notifications yet. Create alerts to get notified!
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {notifications.slice().reverse().map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${
                      notification.read
                        ? 'bg-gray-100 dark:bg-gray-600 border-gray-200 dark:border-gray-500'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`text-sm ${
                          notification.read 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-red-900 dark:text-red-100'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => markNotificationAsRead(notification.id)}
                          className="ml-2 p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {showCreateForm && (
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Create New Alert</h4>
            <form onSubmit={handleCreateAlert} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Enter city name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Parameter
                  </label>
                  <select
                    value={formData.parameter}
                    onChange={(e) => setFormData({ ...formData, parameter: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {parameterOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Condition
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {conditionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Value
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="Enter value"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Alert</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
            Active Alerts ({alerts.filter(a => a.isActive).length})
          </h4>

          {!currentUser ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">Please login to create and manage alerts</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Your alerts will be saved to your account</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">No alerts created yet</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Alert</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => {
                const parameter = parameterOptions.find(p => p.value === alert.parameter);
                const ParameterIcon = parameter?.icon || AlertTriangle;

                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${
                      alert.isActive
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <ParameterIcon
                          className={`w-5 h-5 ${
                            alert.isActive
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-gray-500'
                          }`}
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {alert.city}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatAlertDescription(alert)}
                          </p>
                          {alert.triggerCount > 0 && (
                            <p className="text-xs text-orange-600 dark:text-orange-400">
                              Triggered {alert.triggerCount} time{alert.triggerCount !== 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleAlert(alert.id)}
                          className={`p-2 rounded-lg transition-colors duration-200 ${
                            alert.isActive
                              ? 'bg-green-100 hover:bg-green-200 dark:bg-green-800 dark:hover:bg-green-700 text-green-700 dark:text-green-300'
                              : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-500 dark:text-gray-400'
                          }`}
                          title={alert.isActive ? 'Disable alert' : 'Enable alert'}
                        >
                          {alert.isActive ? (
                            <BellRing className="w-4 h-4" />
                          ) : (
                            <BellOff className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => removeAlert(alert.id)}
                          className="p-2 bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 text-red-700 dark:text-red-300 rounded-lg transition-colors duration-200"
                          title="Delete alert"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Settings className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                How Weather Alerts Work
              </h4>
              <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                <li>• Alerts are checked automatically when you search for weather</li>
                <li>• Browser notifications appear when conditions are met</li>
                <li>• Alerts reset when conditions return to normal</li>
                <li>• All data is stored locally on your device</li>
              </ul>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default AlertSystem;
