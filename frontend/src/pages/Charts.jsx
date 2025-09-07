import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';
import SearchBar from '../components/SearchBar';
import useWeather from '../hooks/useWeather';
import { useHistory } from '../hooks/useHistory';
import { 
  TrendingUp, Thermometer, Droplets, Gauge, Wind,
  Eye, AlertCircle, Loader2, BarChart3, Activity,
  PieChart as PieChartIcon, MapPin
} from 'lucide-react';

const Charts = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [activeChart, setActiveChart] = useState('line');
  const { loading, locationLoading, error, fetchWeather, getCurrentLocationWeather } = useWeather();
  const { addToHistory } = useHistory();

  const generateHistoricalData = (weather) => {
    const data = [];
    const now = new Date();

    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const tempVariation = (Math.random() - 0.5) * 4;
      const humidityVariation = (Math.random() - 0.5) * 10;
      const pressureVariation = (Math.random() - 0.5) * 20;
      const windVariation = (Math.random() - 0.5) * 2;
      const visibilityVariation = (Math.random() - 0.5) * 2;

      data.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temperature: Math.round((weather.main.temp + tempVariation) * 10) / 10,
        humidity: Math.max(0, Math.min(100, weather.main.humidity + humidityVariation)),
        pressure: Math.round(weather.main.pressure + pressureVariation),
        windSpeed: Math.max(0, weather.wind.speed + windVariation),
        visibility: Math.max(0, (weather.visibility / 1000) + visibilityVariation),
      });
    }

    return data;
  };

  const handleSearch = async (city) => {
    try {
      const data = await fetchWeather(city);
      setWeatherData([data]);
      setSelectedCity(data.name);
      setChartData(generateHistoricalData(data));

      addToHistory({
        city: data.areaName || data.name,
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
      setWeatherData([data]);
      setSelectedCity(data.name);
      setChartData(generateHistoricalData(data));

      addToHistory({
        city: data.areaName || data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      });
    } catch (err) {
      console.error('Failed to get current location weather:', err);
    }
  };

  const chartTypes = [
    { id: 'line', label: 'Line Chart', icon: TrendingUp },
    { id: 'area', label: 'Area Chart', icon: Activity },
    { id: 'bar', label: 'Bar Chart', icon: BarChart3 },
    { id: 'pie', label: 'Pie Chart', icon: PieChartIcon },
  ];

  const pieData = chartData.length > 0 ? [
    { name: 'Temperature', value: chartData[chartData.length - 1]?.temperature || 0, color: '#ef4444' },
    { name: 'Humidity', value: chartData[chartData.length - 1]?.humidity || 0, color: '#3b82f6' },
    { name: 'Pressure/10', value: Math.round((chartData[chartData.length - 1]?.pressure || 0) / 10), color: '#8b5cf6' },
    { name: 'Wind Speed', value: chartData[chartData.length - 1]?.windSpeed || 0, color: '#10b981' },
  ] : [];

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-96 text-gray-500">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Search for a city to view weather charts</p>
          </div>
        </div>
      );
    }

    const commonProps = {
      width: '100%',
      height: 400,
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    try {
      switch (activeChart) {
        case 'line':
          return (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="time" 
                  stroke="#6b7280"
                  fontSize={12}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#ef4444" 
                  strokeWidth={3} 
                  name="Temperature (°C)" 
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  name="Humidity (%)" 
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="pressure" 
                  stroke="#8b5cf6" 
                  strokeWidth={3} 
                  name="Pressure (hPa)" 
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="windSpeed" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  name="Wind Speed (m/s)" 
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          );

        case 'area':
          return (
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="time" 
                  stroke="#6b7280"
                  fontSize={12}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="temperature" 
                  stackId="1" 
                  stroke="#ef4444" 
                  fill="#ef4444" 
                  fillOpacity={0.6} 
                  name="Temperature (°C)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="humidity" 
                  stackId="2" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6} 
                  name="Humidity (%)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          );

        case 'bar':
          return (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData.slice(-8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="time" 
                  stroke="#6b7280"
                  fontSize={12}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="temperature" fill="#ef4444" name="Temperature (°C)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="humidity" fill="#3b82f6" name="Humidity (%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          );

        case 'pie':
          return (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          );

        default:
          return null;
      }
    } catch (error) {
      console.error('Chart rendering error:', error);
      return (
        <div className="flex items-center justify-center h-96 text-red-500">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4" />
            <p>Error rendering chart. Please try again.</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6 relative z-10 pb-8">
      <div className="text-center py-6 relative z-30">
        <h1 className="text-4xl font-bold text-white mb-4">
          Interactive Weather Charts
        </h1>
        <p className="text-lg text-gray-300">
          Visualize weather trends with interactive charts and graphs
        </p>
      </div>

      <div className="relative z-30">
        <SearchBar
          onSearch={handleSearch}
          onCurrentLocation={handleCurrentLocation}
          loading={loading}
          locationLoading={locationLoading}
          placeholder="Search for a city to view charts..."
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

      {(loading || locationLoading) && (
        <div className="text-center py-8 relative z-30">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-white shadow rounded-md bg-blue-500 hover:bg-blue-400 transition ease-in-out duration-150 cursor-not-allowed">
            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            {locationLoading ? 'Getting your location...' : 'Loading weather data...'}
          </div>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="relative z-30">
          <div className="card-transparent rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Weather Data for {selectedCity}
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                {chartTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setActiveChart(type.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                        activeChart === type.id
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'transparent-black text-white hover:bg-white/20'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="transparent-black rounded-lg p-4 min-h-[400px]">
              {renderChart()}
            </div>
          </div>
        </div>
      )}

      {!loading && !locationLoading && chartData.length === 0 && (
        <div className="text-center py-12 relative z-30">
          <div className="card-transparent rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Chart Data Available
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Search for a city above to start viewing weather charts
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Charts;
