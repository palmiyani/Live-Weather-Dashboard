import React, { useState, useEffect } from 'react';
import WeatherCard from '../components/WeatherCard';
import SearchBar from '../components/SearchBar';
import AlertSystem from '../components/AlertSystem';
import useWeather from '../hooks/useWeather';
import { useHistory } from '../hooks/useHistory';


const Home = ({ currentUser, onWeatherUpdate }) => {
  const [weather, setWeather] = useState(null);
  const [currentCity, setCurrentCity] = useState(''); // Start with empty city
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { loading, error, locationLoading, fetchWeather, getCurrentLocationWeather } = useWeather();
  const { addToHistory } = useHistory();

  // Update global weather when local weather changes
  useEffect(() => {
    if (weather && onWeatherUpdate) {
      onWeatherUpdate(weather);
    }
  }, [weather, onWeatherUpdate]);

  useEffect(() => {
    // Always try to get current location weather first on page refresh
    loadCurrentLocationWeather();
  }, []);

  const loadCurrentLocationWeather = async () => {
    try {
      console.log('Attempting to get current location weather...');
      const weatherData = await getCurrentLocationWeather();
      setWeather(weatherData);
      setCurrentCity(weatherData.name);
      // Save current location as last searched city
      localStorage.setItem('lastSearchedCity', weatherData.name);
      console.log('Successfully loaded current location weather for:', weatherData.name);
    } catch (err) {
      console.error('Failed to get current location weather:', err);
      
      // Check if there's a saved city from previous search
      const savedCity = localStorage.getItem('lastSearchedCity');
      if (savedCity) {
        console.log('Falling back to saved city:', savedCity);
        await loadWeatherData(savedCity);
        setCurrentCity(savedCity);
      } else {
        // Fallback to London if no saved city
        console.log('Falling back to London weather data...');
        await loadWeatherData('London');
        setCurrentCity('London');
        localStorage.setItem('lastSearchedCity', 'London');
      }
    } finally {
      setIsInitialLoad(false);
    }
  };

  const loadWeatherData = async (city) => {
    try {
      console.log('Loading weather data for:', city);
      const weatherData = await fetchWeather(city);
      setWeather(weatherData);
      // Add to history if weatherData is valid
      if (weatherData && weatherData.name && weatherData.sys && weatherData.main && weatherData.weather && weatherData.weather[0]) {
        addToHistory({
          city: weatherData.name,
          country: weatherData.sys.country,
          temperature: weatherData.main.temp,
          description: weatherData.weather[0].description,
          icon: weatherData.weather[0].icon,
        });
      }
      console.log('Successfully loaded weather data for:', city);
    } catch (err) {
      console.error('Failed to load weather data:', err);
    } finally {
      setIsInitialLoad(false);
    }
  };

  const handleSearch = (city) => {
    console.log('Home handleSearch called with:', city);
    // For display purposes, we might want to show a more descriptive name
    // but for now, we'll use the city name as provided
    setCurrentCity(city);
    // Save the searched city
    localStorage.setItem('lastSearchedCity', city);
    loadWeatherData(city);
  };

  const handleLocationWeather = async () => {
    await loadCurrentLocationWeather();
  };

  return (
    <div className="space-y-6 relative z-10 pb-8">
      <div className="text-center py-6 relative z-30">
        <h1 className="text-4xl font-bold text-white mb-4">
          Weather Dashboard
        </h1>
        <p className="text-lg text-gray-300">
          Get real-time weather information for any city worldwide
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative z-50">
        <SearchBar
          onSearch={handleSearch}
          onCurrentLocation={handleLocationWeather}
          loading={loading}
          locationLoading={locationLoading}
        />
      </div>

      {/* Loading State */}
      {isInitialLoad && (
        <div className="text-center py-8 relative z-30">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-white shadow rounded-md bg-blue-500 hover:bg-blue-400 transition ease-in-out duration-150 cursor-not-allowed">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isInitialLoad && (
        <div className="text-center py-8 relative z-30">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      )}

      {/* Weather Display */}
      {weather && !isInitialLoad && (
        <div className="relative z-10 space-y-6">
          <WeatherCard weather={weather} />
          <AlertSystem weatherData={weather} currentUser={currentUser} currentCity={currentCity} />
        </div>
      )}
    </div>
  );
};

export default Home;
