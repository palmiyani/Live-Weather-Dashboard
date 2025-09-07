import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const WeatherChartFixed = ({ data }) => {
  if (data.length === 0) return null;

  const maxTemp = Math.max(...data.map(d => d.temperature));
  const minTemp = Math.min(...data.map(d => d.temperature));
  const tempRange = maxTemp - minTemp || 1;

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Temperature Comparison
        </h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>High: {maxTemp}°C</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingDown className="w-4 h-4 text-blue-500" />
            <span>Low: {minTemp}°C</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900 dark:text-white">
                {item.city}
              </span>
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {item.temperature}°C
              </span>
            </div>
            
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                style={{
                  width: `${((item.temperature - minTemp) / tempRange) * 100}%`,
                }}
              />
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Humidity: {item.humidity}%</span>
              <span>Wind: {item.windSpeed} m/s</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherChartFixed;
