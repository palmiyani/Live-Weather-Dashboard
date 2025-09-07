
import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge,
  Sunrise,
  Sunset
} from 'lucide-react';
import AnimatedWeatherIcon from './AnimatedWeatherIcon';


const WeatherCard = ({ weather, className = '' }) => {


  // Add defensive checks for weather data
  if (!weather || !weather.main || !weather.weather || !weather.weather[0]) {
    return (
      <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>Weather data not available</p>
        </div>
      </div>
    );
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const weatherStats = [
    {
      label: 'Feels like',
      value: `${Math.round(weather.main.feels_like)}°C`,
      icon: Thermometer,
      color: 'text-orange-500',
    },
    {
      label: 'Humidity',
      value: `${weather.main.humidity}%`,
      icon: Droplets,
      color: 'text-blue-500',
    },
    {
      label: 'Wind',
      value: `${weather.wind?.speed || 0} m/s`,
      icon: Wind,
      color: 'text-gray-500',
    },
    {
      label: 'Pressure',
      value: `${weather.main.pressure} hPa`,
      icon: Gauge,
      color: 'text-purple-500',
    },
    ...(weather.visibility ? [{
      label: 'Visibility',
      value: `${(weather.visibility / 1000).toFixed(1)} km`,
      icon: Eye,
      color: 'text-green-500',
    }] : []),
  ];

  return (
    <div className={`card-transparent rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden weather-card animate-in ${className}`}>
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {weather.name}
            </h2>
            <p className="text-blue-100">
              {weather.name}, {weather.sys?.country || ''}
            </p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-light">
              {Math.round(weather.main.temp)}°C
            </div>
            <p className="text-blue-100 capitalize">
              {weather.weather[0].description}
            </p>
            <div className="mt-2">
              <AnimatedWeatherIcon 
                condition={weather.weather[0].description} 
                size={48}
                className="text-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {weatherStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="flex items-center space-x-3 p-3 transparent-black rounded-lg">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sunrise and Sunset */}
        {weather.sys?.sunrise && weather.sys?.sunset && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3">
              <Sunrise className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sunrise</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatTime(weather.sys.sunrise)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Sunset className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sunset</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatTime(weather.sys.sunset)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;
