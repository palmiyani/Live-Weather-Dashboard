import { useState } from 'react';
import weatherModel from '../services/weatherModel';

const API_KEY = 'b7bad41a9749627f3088181a8a4d0980';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const useWeather = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [modelStats, setModelStats] = useState(null);

  const fetchWeather = async (city) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`City "${city}" not found. Please check the spelling and try again.`);
        } else if (response.status === 401) {
          throw new Error('API key error. Please check the weather service configuration.');
        } else {
          throw new Error(`Weather service error (${response.status}). Please try again later.`);
        }
      }

      const data = await response.json();
      
      // Process data through weather model to handle duplicates and enhance predictions
      const processedData = weatherModel.deduplicateWeatherData(data);
      const enhancedData = weatherModel.enhanceWeatherData(processedData);
      
      // Update model statistics
      setModelStats(weatherModel.getModelStats());
      
      setLoading(false);
      return enhancedData;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(message);
      setLoading(false);
      throw err;
    }
  };

  const fetchForecast = async (city) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Forecast for "${city}" not found. Please check the spelling and try again.`);
        } else {
          throw new Error(`Forecast service error (${response.status}). Please try again later.`);
        }
      }

      const data = await response.json();
      
      // Enhance forecast data with model predictions
      const enhancedData = weatherModel.enhanceWeatherData(data);
      
      setLoading(false);
      return enhancedData;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch forecast data';
      setError(message);
      setLoading(false);
      throw err;
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    setLocationLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather service error (${response.status}). Please try again.`);
      }

      const data = await response.json();
      
      // Process location-based weather data
      const processedData = weatherModel.deduplicateWeatherData(data);
      const enhancedData = weatherModel.enhanceWeatherData(processedData);
      
      setLocationLoading(false);
      return enhancedData;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch location weather';
      setLocationLoading(false);
      setError(message);
      throw err;
    }
  };

  const getCurrentLocationWeather = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      setLocationLoading(true);
      setError(null);

      // Show user-friendly message about location access
      console.log('Requesting location access...');

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            console.log('Location access granted, fetching weather data...');
            const { latitude: lat, longitude: lon } = position.coords;
            const data = await fetchWeatherByCoords(lat, lon);
            resolve(data);
          } catch (err) {
            reject(err);
          }
        },
        (error) => {
          setLocationLoading(false);
          let errorMessage = 'Unable to retrieve your location';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please allow location access in your browser settings to see your current weather.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Please check your device location settings.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again or search for a city manually.';
              break;
            default:
              errorMessage = 'Unable to get your location. Please try searching for a city instead.';
          }

          console.error('Location error:', errorMessage);
          setError(errorMessage);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000, // Increased timeout to 15 seconds
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  };

  // Clean up model cache periodically
  const cleanupModelCache = () => {
    weatherModel.cleanupCache();
    setModelStats(weatherModel.getModelStats());
  };

  // Get enhanced predictions for a city
  const getEnhancedPredictions = (weatherData, hours = 24) => {
    return weatherModel.predictWeather(weatherData, hours);
  };

  // Get daily forecast with model improvements
  const getDailyForecast = (weatherData, days = 7) => {
    return weatherModel.generateDailyForecast(weatherData, days);
  };

  return {
    loading,
    locationLoading,
    error,
    fetchWeather,
    fetchForecast,
    fetchWeatherByCoords,
    getCurrentLocationWeather,
    cleanupModelCache,
    getEnhancedPredictions,
    getDailyForecast,
    modelStats,
  };
};

export default useWeather;
