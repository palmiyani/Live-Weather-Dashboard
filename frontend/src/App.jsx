// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Navigation from './components/Navigation';
import Footer1 from './components/Footer1';
import AnimatedBackground from './components/AnimatedBackground';
import Home from './pages/Home';
import Comparison from './pages/Comparison';
import Charts from './pages/Charts';
import History from './pages/History';
import { useAuth } from './hooks/useAuth';
import { initBarba } from './services/barbaConfig';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [globalWeather, setGlobalWeather] = useState(null);
  const { authState } = useAuth();
  const currentUser = authState.user;

  // Initialize Barba.js when component mounts and DOM is ready
  useEffect(() => {
    setTimeout(() => {
      initBarba();
    }, 0);
  }, []);

  // Function to update global weather (will be passed to Home component)
  const updateGlobalWeather = (weatherData) => {
    setGlobalWeather(weatherData);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home currentUser={currentUser} onWeatherUpdate={updateGlobalWeather} />;
      case 'comparison':
        return <Comparison />;
      case 'charts':
        return <Charts />;
      case 'history':
        return <History />;
      default:
        return <Home currentUser={currentUser} onWeatherUpdate={updateGlobalWeather} />;
    }
  };

  return (
    <div className="min-h-screen text-gray-800 dark:text-white flex flex-col relative overflow-x-hidden">
      {/* Global Animated Background */}
      <AnimatedBackground 
        weatherCondition={globalWeather?.weather?.[0]?.description || 'sunny'}
        temperature={globalWeather?.main?.temp || 25}
      />

      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        className="relative z-40 flex-shrink-0"
      />

      <main className="flex-1 px-4 md:px-8 py-4 relative z-20 overflow-y-auto min-h-0 barba-container">
        <div className="barba-wrapper" data-barba="wrapper">
          <div data-barba="container" data-barba-namespace={activeTab}>
            {renderContent()}
          </div>
        </div>
      </main>

      <Footer1 className="flex-shrink-0 relative z-30" />

      <Toaster position="top-right" />
    </div>
  );
}

export default App;
