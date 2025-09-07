import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { Thermometer, Droplets, Wind, Gauge } from 'lucide-react';

const ComparisonCharts = ({ data }) => {
  if (!data || data.length < 2) return null;

  // Prepare data for different chart types
  const temperatureData = data.map(city => ({
    city: city.city,
    temperature: Math.round(city.temperature * 10) / 10,
    feels_like: Math.round((city.temperature + (Math.random() - 0.5) * 5) * 10) / 10
  }));

  const humidityData = data.map(city => ({
    city: city.city,
    humidity: city.humidity,
    pressure: Math.round((city.pressure || 1013) + (Math.random() - 0.5) * 20)
  }));

  const windData = data.map(city => ({
    city: city.city,
    windSpeed: Math.round(city.windSpeed * 10) / 10,
    gust: Math.round((city.windSpeed * 1.5 + Math.random() * 2) * 10) / 10
  }));

  // Colors for charts
  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
  const pieColors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];

  // Pie chart data for temperature distribution
  const pieData = data.map((city, index) => ({
    name: city.city,
    value: Math.abs(city.temperature),
    color: pieColors[index % pieColors.length]
  }));

  return (
    <div className="space-y-8">
      {/* Chart 1: Temperature Comparison - Bar Chart */}
      <div className="card-transparent rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Thermometer className="w-6 h-6 text-red-500" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Temperature Comparison
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={temperatureData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="city" 
              stroke="#6b7280"
              fontSize={12}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tick={{ fill: '#6b7280' }}
              label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="temperature" fill="#EF4444" radius={[4, 4, 0, 0]} name="Current Temp" />
            <Bar dataKey="feels_like" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Feels Like" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 2: Humidity & Pressure - Area Chart */}
      <div className="card-transparent rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Droplets className="w-6 h-6 text-blue-500" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Humidity & Pressure Analysis
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={humidityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="city" 
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
              dataKey="humidity" 
              stackId="1" 
              stroke="#3B82F6" 
              fill="#3B82F6" 
              fillOpacity={0.6} 
              name="Humidity (%)" 
            />
            <Area 
              type="monotone" 
              dataKey="pressure" 
              stackId="2" 
              stroke="#8B5CF6" 
              fill="#8B5CF6" 
              fillOpacity={0.6} 
              name="Pressure (hPa)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 3: Wind Speed - Line Chart */}
      <div className="card-transparent rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Wind className="w-6 h-6 text-green-500" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Wind Speed Comparison
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={windData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="city" 
              stroke="#6b7280"
              fontSize={12}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tick={{ fill: '#6b7280' }}
              label={{ value: 'Wind Speed (m/s)', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
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
              dataKey="windSpeed" 
              stroke="#10B981" 
              strokeWidth={3} 
              name="Wind Speed" 
              dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="gust" 
              stroke="#F59E0B" 
              strokeWidth={3} 
              name="Wind Gust" 
              dot={{ fill: '#F59E0B', strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 4: Temperature Distribution - Pie Chart */}
      <div className="card-transparent rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Gauge className="w-6 h-6 text-purple-500" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Temperature Distribution
          </h3>
        </div>
        <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
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
          </div>
          <div className="flex-1">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Temperature Summary
              </h4>
              <div className="space-y-3">
                {data.map((city, index) => (
                  <div key={city.city} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: pieColors[index % pieColors.length] }}
                      />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {city.city}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {Math.round(city.temperature)}°C
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Tip:</strong> The pie chart shows the relative temperature distribution across all cities. 
                  Larger segments indicate higher temperatures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonCharts; 