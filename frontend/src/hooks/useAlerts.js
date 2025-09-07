import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const { authState } = useAuth();
  const currentUser = authState.user;

  useEffect(() => {
    if (currentUser) {
      // Load user-specific alerts
      const savedAlerts = localStorage.getItem(`weatherAlerts_${currentUser.id}`);
      if (savedAlerts) {
        setAlerts(JSON.parse(savedAlerts));
      } else {
        setAlerts([]);
      }

      const savedNotifications = localStorage.getItem(`weatherNotifications_${currentUser.id}`);
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      } else {
        setNotifications([]);
      }
    } else {
      // Clear alerts when user logs out
      setAlerts([]);
      setNotifications([]);
    }
  }, [currentUser]);

  const saveAlerts = (newAlerts) => {
    setAlerts(newAlerts);
    if (currentUser) {
      localStorage.setItem(`weatherAlerts_${currentUser.id}`, JSON.stringify(newAlerts));
    }
  };

  const saveNotifications = (newNotifications) => {
    setNotifications(newNotifications);
    if (currentUser) {
      localStorage.setItem(`weatherNotifications_${currentUser.id}`, JSON.stringify(newNotifications));
    }
  };

  const addAlert = (alert) => {
    const newAlert = {
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      triggerCount: 0,
      userId: currentUser?.id,
      username: currentUser?.username,
    };

    const updatedAlerts = [...alerts, newAlert];
    saveAlerts(updatedAlerts);
    return newAlert;
  };

  const removeAlert = (alertId) => {
    const updatedAlerts = alerts.filter((alert) => alert.id !== alertId);
    saveAlerts(updatedAlerts);
  };

  const toggleAlert = (alertId) => {
    const updatedAlerts = alerts.map((alert) =>
      alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
    );
    saveAlerts(updatedAlerts);
  };

  const checkAlerts = async (weatherData) => {
    // Debounce alert checking to prevent spam
    if (checkAlerts.timeout) {
      clearTimeout(checkAlerts.timeout);
    }
    
    checkAlerts.timeout = setTimeout(() => {
      console.log('🔍 Checking alerts for weather data:', weatherData);
      console.log('📋 Current alerts:', alerts);
    
    const activeAlerts = alerts.filter(
      (alert) =>
        alert.isActive &&
        (alert.city.toLowerCase() === weatherData.name.toLowerCase() ||
         alert.city.toLowerCase().includes(weatherData.name.toLowerCase()) ||
         weatherData.name.toLowerCase().includes(alert.city.toLowerCase()))
    );

    console.log('✅ Active alerts for current city:', activeAlerts);

    const newNotifications = [];
    const updatedAlerts = alerts.map((alert) => {
      const cityMatch = alert.city.toLowerCase() === weatherData.name.toLowerCase() ||
                       alert.city.toLowerCase().includes(weatherData.name.toLowerCase()) ||
                       weatherData.name.toLowerCase().includes(alert.city.toLowerCase());
      
      if (!alert.isActive || !cityMatch) {
        return alert;
      }

      let currentValue;
      let parameterName;

      switch (alert.parameter) {
        case 'temperature':
          currentValue = weatherData.main.temp;
          parameterName = 'Temperature';
          break;
        case 'humidity':
          currentValue = weatherData.main.humidity;
          parameterName = 'Humidity';
          break;
        case 'windSpeed':
          currentValue = weatherData.wind.speed;
          parameterName = 'Wind Speed';
          break;
        case 'pressure':
          currentValue = weatherData.main.pressure;
          parameterName = 'Pressure';
          break;
        default:
          return alert;
      }

      let conditionMet = false;
      switch (alert.condition) {
        case '>':
          conditionMet = currentValue > alert.value;
          break;
        case '<':
          conditionMet = currentValue < alert.value;
          break;
        case '=':
          conditionMet = Math.abs(currentValue - alert.value) < 0.1;
          break;
        case '>=':
          conditionMet = currentValue >= alert.value;
          break;
        case '<=':
          conditionMet = currentValue <= alert.value;
          break;
      }

      // Only log when condition is met or when debugging
      if (conditionMet || process.env.NODE_ENV === 'development') {
        console.log(`🔍 Alert Check: ${alert.city} - ${parameterName} ${alert.condition} ${alert.value}${alert.unit}`);
        console.log(`📊 Current: ${currentValue}${alert.unit}, Condition Met: ${conditionMet}, Already Triggered: ${alert.triggered}`);
      }

      const updatedAlert = {
        ...alert,
        lastChecked: new Date().toISOString(),
      };

      if (conditionMet && !alert.triggered) {
        console.log(`🚨 ALERT TRIGGERED! Creating notification for ${alert.city}`);
        
        const notification = {
          id: Date.now().toString() + Math.random(),
          alertId: alert.id,
          message: `🚨 Alert: ${parameterName} in ${weatherData.name} is ${currentValue}${alert.unit}, which ${alert.condition} ${alert.value}${alert.unit}`,
          timestamp: new Date().toISOString(),
          read: false,
        };

        newNotifications.push(notification);



        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Weather Alert', {
            body: notification.message,
            icon: '/vite.svg',
          });
        }

        return {
          ...updatedAlert,
          triggered: true,
          triggerCount: alert.triggerCount + 1,
        };
      } else if (!conditionMet && alert.triggered) {
        return {
          ...updatedAlert,
          triggered: false,
        };
      }

      return updatedAlert;
    });

    if (newNotifications.length > 0) {
      const allNotifications = [...notifications, ...newNotifications];
      saveNotifications(allNotifications);
    }

    if (
      updatedAlerts.some((alert, index) => {
        const original = alerts[index];
        return original && JSON.stringify(alert) !== JSON.stringify(original);
      })
    ) {
      saveAlerts(updatedAlerts);
    }
    }, 1000); // Debounce for 1 second
  };

  const markNotificationAsRead = (notificationId) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );
    saveNotifications(updatedNotifications);
  };

  const clearNotifications = () => {
    saveNotifications([]);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
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
  };
};
