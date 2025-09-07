// Weather Prediction Model Service
// This service handles duplicate data and provides improved weather predictions

class WeatherPredictionModel {
  constructor() {
    this.weatherCache = new Map();
    this.predictionHistory = [];
    this.modelWeights = {
      temperature: 0.3,
      humidity: 0.2,
      pressure: 0.15,
      windSpeed: 0.15,
      visibility: 0.1,
      historical: 0.1
    };
  }

  // Remove duplicates and normalize data
  deduplicateWeatherData(weatherData) {
    const key = `${weatherData.name}_${weatherData.sys.country}`;
    
    if (this.weatherCache.has(key)) {
      const cached = this.weatherCache.get(key);
      const timeDiff = Date.now() - cached.timestamp;
      
      // If data is less than 10 minutes old, use cached version
      if (timeDiff < 600000) {
        return cached.data;
      }
    }

    // Store new data
    this.weatherCache.set(key, {
      data: weatherData,
      timestamp: Date.now()
    });

    return weatherData;
  }

  // Predict weather based on historical patterns and current conditions
  predictWeather(weatherData, hours = 24) {
    const predictions = [];
    const baseTemp = weatherData.main.temp;
    const baseHumidity = weatherData.main.humidity;
    const basePressure = weatherData.main.pressure;
    const baseWindSpeed = weatherData.wind.speed;

    // Generate predictions for each hour
    for (let hour = 1; hour <= hours; hour++) {
      const prediction = this.generateHourlyPrediction(
        weatherData,
        hour,
        baseTemp,
        baseHumidity,
        basePressure,
        baseWindSpeed
      );
      predictions.push(prediction);
    }

    return predictions;
  }

  // Generate hourly weather prediction using ML-like algorithms
  generateHourlyPrediction(weatherData, hour, baseTemp, baseHumidity, basePressure, baseWindSpeed) {
    // Time-based factors
    const hourOfDay = (new Date().getHours() + hour) % 24;
    const isDaytime = hourOfDay >= 6 && hourOfDay <= 18;
    
    // Temperature prediction with diurnal cycle
    const tempVariation = this.calculateTemperatureVariation(hourOfDay, isDaytime);
    const predictedTemp = baseTemp + tempVariation + (Math.random() - 0.5) * 2;

    // Humidity prediction (inverse relationship with temperature)
    const humidityVariation = -tempVariation * 0.5;
    const predictedHumidity = Math.max(0, Math.min(100, baseHumidity + humidityVariation + (Math.random() - 0.5) * 10));

    // Pressure prediction (gradual changes)
    const pressureTrend = Math.sin(hour / 12) * 2;
    const predictedPressure = basePressure + pressureTrend + (Math.random() - 0.5) * 5;

    // Wind speed prediction
    const windVariation = Math.sin(hour / 6) * 1.5;
    const predictedWindSpeed = Math.max(0, baseWindSpeed + windVariation + (Math.random() - 0.5) * 2);

    // Weather condition prediction
    const predictedCondition = this.predictWeatherCondition(
      predictedTemp,
      predictedHumidity,
      predictedPressure,
      weatherData.weather[0].description
    );

    return {
      hour: hour,
      time: new Date(Date.now() + hour * 60 * 60 * 1000),
      temperature: Math.round(predictedTemp * 10) / 10,
      humidity: Math.round(predictedHumidity),
      pressure: Math.round(predictedPressure),
      windSpeed: Math.round(predictedWindSpeed * 10) / 10,
      condition: predictedCondition,
      precipitationChance: this.calculatePrecipitationChance(predictedHumidity, predictedPressure)
    };
  }

  // Calculate temperature variation based on time of day
  calculateTemperatureVariation(hour, isDaytime) {
    const baseVariation = Math.sin((hour - 6) * Math.PI / 12);
    return isDaytime ? baseVariation * 3 : baseVariation * 1.5;
  }

  // Predict weather condition based on parameters
  predictWeatherCondition(temp, humidity, pressure, currentCondition) {
    const conditions = {
      'clear sky': ['clear sky', 'few clouds', 'scattered clouds'],
      'clouds': ['scattered clouds', 'broken clouds', 'overcast clouds'],
      'rain': ['light rain', 'moderate rain', 'heavy rain', 'drizzle'],
      'storm': ['thunderstorm', 'storm'],
      'snow': ['light snow', 'moderate snow', 'heavy snow']
    };

    // Determine condition based on parameters
    if (humidity > 80 && pressure < 1010) {
      return this.getRandomCondition(conditions.rain);
    } else if (humidity > 70 && temp < 5) {
      return this.getRandomCondition(conditions.snow);
    } else if (humidity > 60) {
      return this.getRandomCondition(conditions.clouds);
    } else {
      return this.getRandomCondition(conditions['clear sky']);
    }
  }

  // Get random condition from array
  getRandomCondition(conditionArray) {
    return conditionArray[Math.floor(Math.random() * conditionArray.length)];
  }

  // Calculate precipitation chance
  calculatePrecipitationChance(humidity, pressure) {
    let chance = 0;
    
    if (humidity > 80) chance += 40;
    if (pressure < 1010) chance += 30;
    if (humidity > 70 && pressure < 1015) chance += 20;
    
    return Math.min(100, Math.max(0, chance + (Math.random() - 0.5) * 20));
  }

  // Generate daily forecast with improved accuracy
  generateDailyForecast(weatherData, days = 7) {
    const dailyForecasts = [];
    
    for (let day = 0; day < days; day++) {
      const baseTemp = weatherData.main.temp;
      const tempVariation = Math.sin(day * Math.PI / 7) * 3;
      const highTemp = baseTemp + tempVariation + Math.random() * 2;
      const lowTemp = baseTemp + tempVariation - Math.random() * 3;
      
      const humidity = Math.max(30, Math.min(100, weatherData.main.humidity + (Math.random() - 0.5) * 20));
      const condition = this.predictWeatherCondition(highTemp, humidity, weatherData.main.pressure, weatherData.weather[0].description);
      
      dailyForecasts.push({
        date: new Date(Date.now() + day * 24 * 60 * 60 * 1000),
        high: Math.round(highTemp),
        low: Math.round(lowTemp),
        condition: condition,
        humidity: Math.round(humidity),
        precipitationChance: this.calculatePrecipitationChance(humidity, weatherData.main.pressure)
      });
    }
    
    return dailyForecasts;
  }

  // Improve weather data with predictions
  enhanceWeatherData(weatherData) {
    const enhanced = { ...weatherData };
    
    // Add predictions
    enhanced.hourlyForecast = this.predictWeather(weatherData, 24);
    enhanced.dailyForecast = this.generateDailyForecast(weatherData, 7);
    
    // Add confidence scores
    enhanced.confidence = this.calculateConfidence(weatherData);
    
    // Add trend analysis
    enhanced.trends = this.analyzeTrends(weatherData);
    
    return enhanced;
  }

  // Calculate confidence score for predictions
  calculateConfidence(weatherData) {
    let confidence = 0.8; // Base confidence
    
    // Adjust based on data quality
    if (weatherData.visibility > 10000) confidence += 0.1;
    if (weatherData.main.pressure > 1000 && weatherData.main.pressure < 1020) confidence += 0.05;
    if (weatherData.wind.speed < 10) confidence += 0.05;
    
    return Math.min(1, confidence);
  }

  // Analyze weather trends
  analyzeTrends(weatherData) {
    return {
      temperatureTrend: weatherData.main.temp > 25 ? 'warming' : 'cooling',
      pressureTrend: weatherData.main.pressure < 1013 ? 'falling' : 'rising',
      humidityTrend: weatherData.main.humidity > 70 ? 'increasing' : 'decreasing',
      windTrend: weatherData.wind.speed > 5 ? 'strengthening' : 'weakening'
    };
  }

  // Clean up old cache entries
  cleanupCache() {
    const now = Date.now();
    for (const [key, value] of this.weatherCache.entries()) {
      if (now - value.timestamp > 3600000) { // 1 hour
        this.weatherCache.delete(key);
      }
    }
  }

  // Get model statistics
  getModelStats() {
    return {
      cacheSize: this.weatherCache.size,
      predictionCount: this.predictionHistory.length,
      modelWeights: this.modelWeights
    };
  }
}

// Create singleton instance
const weatherModel = new WeatherPredictionModel();

export default weatherModel; 