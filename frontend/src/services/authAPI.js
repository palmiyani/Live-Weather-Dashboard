import axios from 'axios';
import { API_BASE_URL } from '../config.js';

class AuthAPI {
  constructor() {
    axios.defaults.baseURL = API_BASE_URL;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.defaults.withCredentials = true;
    console.log('AuthAPI initialized with baseURL:', API_BASE_URL);
  }

  async login(username, password) {
    try {
      console.log('Attempting login with:', { username, password: '***' });
      console.log('Full URL will be:', `${axios.defaults.baseURL}/login/`);
      const response = await axios.post('/login/', { username, password });
      console.log('Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      if (error.response) {
        throw new Error(error.response.data?.detail || error.response.data?.message || 'Login failed');
      } else if (error.request) {
        throw new Error('No response from server. Is the backend running?');
      } else {
        throw new Error('Network error: ' + error.message);
      }
    }
  }

  async signup(userData) {
    try {
      const response = await axios.post('/signup/', userData);
      return response.data;
    } catch (error) {
      if (error.response) {
      let errorMessage = 'Signup failed';
        if (error.response.data?.errors) {
          errorMessage = error.response.data.errors.join(', ');
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('No response from server. Is the backend running?');
      } else {
        throw new Error('Network error: ' + error.message);
      }
    }
  }

  async logout() {
    try {
      const response = await axios.post('/logout/');
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data?.detail || 'Logout failed');
      } else if (error.request) {
        throw new Error('No response from server. Is the backend running?');
      } else {
        throw new Error('Network error: ' + error.message);
      }
    }
  }

  async getProfile() {
    try {
      const response = await axios.get('/profile/');
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data?.detail || 'Failed to get profile');
      } else if (error.request) {
        throw new Error('No response from server. Is the backend running?');
      } else {
        throw new Error('Network error: ' + error.message);
      }
    }
  }

  async updateProfile(updates) {
    try {
      const response = await axios.put('/profile/', updates);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data?.detail || 'Failed to update profile');
      } else if (error.request) {
        throw new Error('No response from server. Is the backend running?');
      } else {
        throw new Error('Network error: ' + error.message);
      }
    }
  }

  async sendAlertEmail(data) {
    try {
      const response = await axios.post('/send-alert-email/', data);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data?.detail || 'Failed to send alert email');
      } else if (error.request) {
        throw new Error('No response from server. Is the backend running?');
      } else {
        throw new Error('Network error: ' + error.message);
      }
    }
  }

  async sendTestEmail(data) {
    try {
      const response = await axios.post('/send-test-email/', data);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data?.detail || 'Failed to send test email');
      } else if (error.request) {
        throw new Error('No response from server. Is the backend running?');
      } else {
        throw new Error('Network error: ' + error.message);
      }
    }
  }

  async getWeatherSearchHistory() {
    try {
      const response = await axios.get('/weather-search/');
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data?.detail || 'Failed to get weather search history');
      } else if (error.request) {
        throw new Error('No response from server. Is the backend running?');
      } else {
        throw new Error('Network error: ' + error.message);
      }
    }
  }

  async saveWeatherSearch(weatherData) {
    try {
      const response = await axios.post('/weather-search/', weatherData);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data?.detail || 'Failed to save weather search');
      } else if (error.request) {
        throw new Error('No response from server. Is the backend running?');
      } else {
        throw new Error('Network error: ' + error.message);
      }
    }
  }

  async getWeatherAlerts() {
    try {
      const response = await axios.get('/weather-alerts/');
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data?.detail || 'Failed to get weather alerts');
      } else if (error.request) {
        throw new Error('No response from server. Is the backend running?');
      } else {
        throw new Error('Network error: ' + error.message);
      }
    }
  }

  async createWeatherAlert(alertData) {
    try {
      const response = await axios.post('/weather-alerts/', alertData);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data?.detail || 'Failed to create weather alert');
      } else if (error.request) {
        throw new Error('No response from server. Is the backend running?');
      } else {
        throw new Error('Network error: ' + error.message);
      }
    }
  }

  async updateWeatherAlert(alertId, alertData) {
    try {
      const response = await axios.put(`/weather-alerts/${alertId}/`, alertData);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data?.detail || 'Failed to update weather alert');
      } else if (error.request) {
        throw new Error('No response from server. Is the backend running?');
      } else {
        throw new Error('Network error: ' + error.message);
      }
    }
  }

  async deleteWeatherAlert(alertId) {
    try {
      const response = await axios.delete(`/weather-alerts/${alertId}/`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data?.detail || 'Failed to delete weather alert');
      } else if (error.request) {
        throw new Error('No response from server. Is the backend running?');
      } else {
        throw new Error('Network error: ' + error.message);
      }
    }
  }
}

export const authAPI = new AuthAPI();
