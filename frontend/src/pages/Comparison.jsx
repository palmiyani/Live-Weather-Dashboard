import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import ComparisonCharts from '../components/ComparisonCharts';
import useWeather from '../hooks/useWeather';
import { useHistory } from '../hooks/useHistory';
import { X, Plus, AlertCircle, MapPin, BarChart3 } from 'lucide-react';

const Comparison = () => {
  const [cities, setCities] = useState([]);
  const [searchCity, setSearchCity] = useState('');
  const [showCharts, setShowCharts] = useState(true);
  const { loading, locationLoading, error, fetchWeather, getCurrentLocationWeather } = useWeather();
  const { addToHistory } = useHistory();

  const handleSearch = async (city) => {
    if (cities.some(c => c.name.toLowerCase() === city.toLowerCase())) {
      return;
    }

    try {
      const data = await fetchWeather(city);
      setCities(prev => [...prev, data]);
      setSearchCity('');

      addToHistory({
        city: data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      });
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleCurrentLocation = async () => {
    try {
      const data = await getCurrentLocationWeather();
      if (!cities.some(c => c.name.toLowerCase() === data.name.toLowerCase())) {
        setCities(prev => [...prev, data]);

        addToHistory({
          city: data.name,
          country: data.sys.country,
          temperature: data.main.temp,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
        });
      }
    } catch (err) {
      console.error('Failed to get current location weather:', err);
    }
  };

  const removeCity = (cityName) => {
    setCities(prev => prev.filter(c => c.name !== cityName));
  };

  const clearAll = () => {
    setCities([]);
  };

  const chartData = cities.map(city => ({
    city: city.name,
    temperature: city.main.temp,
    humidity: city.main.humidity,
    windSpeed: city.wind.speed,
    pressure: city.main.pressure,
    feels_like: city.main.feels_like,
    visibility: city.visibility,
  }));

  return (
    <div className="space-y-6 relative z-10 pb-8">
      <div className="text-center py-6 relative z-30">
        <h1 className="text-4xl font-bold text-white mb-4">
          Weather Comparison
        </h1>
        <p className="text-lg text-gray-300">
          Compare weather conditions across multiple cities
        </p>
      </div>

      <div className="relative z-30">
        <SearchBar
          onSearch={handleSearch}
          onCurrentLocation={handleCurrentLocation}
          loading={loading}
          locationLoading={locationLoading}
          placeholder="Add a city to compare..."
        />
      </div>

      {error && (
        <div className="text-center py-8 relative z-30">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      )}

      {cities.length > 0 && (
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-30">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-white">
              Comparing {cities.length} {cities.length === 1 ? 'city' : 'cities'}
            </h2>
            {cities.length > 1 && (
              <button
                onClick={() => setShowCharts(!showCharts)}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                  showCharts 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>{showCharts ? 'Hide Charts' : 'Show Charts'}</span>
              </button>
            )}
          </div>
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        </div>
      )}

      {cities.length > 1 && showCharts && (
        <div className="mb-8 relative z-30">
          <ComparisonCharts data={chartData} />
        </div>
      )}

      {cities.length > 1 && !showCharts && (
        <div className="mb-8 relative z-30">
          <div className="card-transparent rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Quick Comparison Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Temperature Range</h4>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {Math.min(...cities.map(c => c.main.temp)).toFixed(1)}°C - {Math.max(...cities.map(c => c.main.temp)).toFixed(1)}°C
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Humidity Range</h4>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.min(...cities.map(c => c.main.humidity))}% - {Math.max(...cities.map(c => c.main.humidity))}%
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Wind Speed Range</h4>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {Math.min(...cities.map(c => c.wind.speed)).toFixed(1)} - {Math.max(...cities.map(c => c.wind.speed)).toFixed(1)} m/s
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {cities.length === 0 ? (
        <div className="text-center py-12 relative z-30">
          <div className="card-transparent rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Start Comparing Cities
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Add cities using the search bar or current location button above to compare their weather conditions
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="transparent-black p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">
                  Side-by-Side Comparison
                </h3>
                <p className="text-gray-200">
                  View detailed weather information for multiple cities at once
                </p>
              </div>
              <div className="transparent-black p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">
                  Interactive Charts
                </h3>
                <p className="text-gray-200">
                  Compare temperatures, humidity, pressure, and wind speeds with beautiful charts
                </p>
              </div>
              <div className="transparent-black p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">
                  Current Location
                </h3>
                <p className="text-gray-200">
                  Add your current location to compare with other cities
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 relative z-30">
          {cities.map((city) => (
            <div key={city.name} className="relative group">
              <WeatherCard weather={city} />
              <button
                onClick={() => removeCity(city.name)}
                className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comparison;
