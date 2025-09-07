import React from 'react';
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  Github, 
  Twitter, 
  Linkedin,
  Sun,
  Heart,
  Cloud,
  CloudRain,
  CloudSnow,
  Zap
} from 'lucide-react';


const Footer1 = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();


  const weatherBackgrounds = [
    {
      name: 'sunny',
      gradient: 'from-yellow-400 via-orange-400 to-red-400',
      icon: Sun,
      particles: '☀️',
    },
    {
      name: 'cloudy',
      gradient: 'from-gray-400 via-blue-400 to-gray-500',
      icon: Cloud,
      particles: '☁️',
    },
    {
      name: 'rainy',
      gradient: 'from-blue-600 via-blue-500 to-indigo-600',
      icon: CloudRain,
      particles: '🌧️',
    },
    {
      name: 'snowy',
      gradient: 'from-blue-200 via-white to-blue-300',
      icon: CloudSnow,
      particles: '❄️',
    },
    {
      name: 'stormy',
      gradient: 'from-gray-700 via-purple-600 to-gray-800',
      icon: Zap,
      particles: '⚡',
    },
  ];

  const randomWeather = weatherBackgrounds[Math.floor(Math.random() * weatherBackgrounds.length)];
  const WeatherIcon = randomWeather.icon;

  const supportChannels = [
    {
      icon: Mail,
      label: 'Email',
      contact: 'support@weatherpro.com',
      href: 'mailto:support@weatherpro.com',
      color: 'hover:text-blue-500',
    },
    {
      icon: Phone,
      label: 'Phone',
      contact: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
      color: 'hover:text-green-500',
    },
    {
      icon: MessageCircle,
      label: 'Live Chat',
      contact: 'Available 24/7',
      href: '#',
      color: 'hover:text-purple-500',
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      href: 'https://github.com',
      color: 'hover:text-gray-900 dark:hover:text-white',
    },
    {
      icon: Twitter,
      label: 'Twitter',
      href: 'https://twitter.com',
      color: 'hover:text-blue-400',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: 'https://linkedin.com',
      color: 'hover:text-blue-600',
    },
  ];

  const quickLinks = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'API Documentation', href: '#' },
    { label: 'Weather Data Sources', href: '#' },
  ];

  return (
    <footer className={`relative mt-auto overflow-hidden ${className}`}>
      {/* Animated Weather Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${randomWeather.gradient} opacity-20 dark:opacity-30`}>
        <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm" />

        {/* Floating Weather Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl opacity-30 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              {randomWeather.particles}
            </div>
          ))}
        </div>

        {/* Weather Pattern Overlay */}
        <div className="absolute inset-0">
          <div className="absolute top-4 right-4 p-2 rounded-full bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm">
            <WeatherIcon className="w-6 h-6 text-white drop-shadow-lg" />
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="relative z-10 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className={`bg-gradient-to-r ${randomWeather.gradient} p-3 rounded-xl shadow-lg backdrop-blur-sm`}>
                  <Sun className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Live Weather Dashboard
                </h3>
              </div>
              <p className="text-gray-300 dark:text-gray-200 text-sm leading-relaxed">
                Your comprehensive weather dashboard providing real-time weather information,
                city comparisons, and detailed forecasts worldwide.
              </p>
              <div className="flex items-center space-x-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-gray-300 dark:text-gray-200 transition-colors duration-200 ${social.color}`}
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-300 dark:text-gray-200 hover:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Customer Support
              </h4>
              <div className="space-y-3">
                {supportChannels.map((channel, index) => {
                  const Icon = channel.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <Icon className="w-4 h-4 text-gray-300 dark:text-gray-200" />
                      <a
                        href={channel.href}
                        className={`text-sm text-gray-300 dark:text-gray-200 transition-colors duration-200 ${channel.color}`}
                      >
                        {channel.contact}
                      </a>
                    </div>
                  );
                })}
              </div>
              <div className="pt-2">
                <p className="text-xs text-gray-300 dark:text-gray-200">
                  Response time: Within 24 hours
                </p>
              </div>
            </div>

            {/* Weather Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Weather Data
              </h4>
              <div className="space-y-2 text-sm text-gray-300 dark:text-gray-200">
                <p>• Real-time updates every 10 minutes</p>
                <p>• Powered by OpenWeatherMap API</p>
                <p>• Global coverage with local accuracy</p>
                <p>• Historical data and forecasts</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  <strong>Data Accuracy:</strong> Our weather data is sourced from
                  professional meteorological stations worldwide.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-sm text-gray-300 dark:text-gray-200">
                <span>© {currentYear} Live Weather Dashboard. All rights reserved.</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300 dark:text-gray-200">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500" />
                <span>love for weather enthusiasts</span>
              </div>
              <div className="text-xs text-gray-300 dark:text-gray-200">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer1;
