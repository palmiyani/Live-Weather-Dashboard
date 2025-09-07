import React from 'react';
import { useHistory } from '../hooks/useHistory';
import { Clock, MapPin, Thermometer, Trash2 } from 'lucide-react';

const History = () => {
  const { history, clearHistory } = useHistory();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const groupedHistory = history.reduce((groups, entry) => {
    const date = new Date(entry.searchTime).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {});

  return (
    <div className="space-y-6 relative z-10 pb-8">
      <div className="text-center py-6 relative z-30">
        <h1 className="text-4xl font-bold text-white mb-4">
          Search History
        </h1>
        <p className="text-lg text-gray-300">
          View your recent weather searches and discoveries
        </p>
      </div>

      {history.length > 0 && (
        <div className="mb-8 flex items-center justify-between relative z-30">
          <div className="flex items-center space-x-2 text-white">
            <Clock className="w-5 h-5" />
            <span>{history.length} searches recorded</span>
          </div>
          <button
            onClick={clearHistory}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        </div>
      )}

      {history.length === 0 ? (
        <div className="text-center py-12 relative z-30">
          <div className="card-transparent rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              No Search History
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your weather searches will appear here. Start exploring to build your history!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="transparent-black p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">
                  Automatic Tracking
                </h3>
                <p className="text-gray-200">
                  Every search is automatically saved for quick access
                </p>
              </div>
              <div className="transparent-black p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">
                  Privacy First
                </h3>
                <p className="text-gray-200">
                  All history is stored locally on your device
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 relative z-30">
          {Object.entries(groupedHistory).map(([date, entries]) => (
            <div key={date} className="card-transparent rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white">{date}</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="transparent-black rounded-lg p-4 hover:bg-white/20 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-white">
                            {entry.city}, {entry.country}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Thermometer className="w-4 h-4 text-blue-500" />
                          <span className="text-lg font-semibold text-blue-400">
                            {Math.round(entry.temperature)}°C
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-200 capitalize">
                          {entry.description}
                        </span>
                        <span className="text-xs text-gray-300">
                          {formatDate(entry.searchTime)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
