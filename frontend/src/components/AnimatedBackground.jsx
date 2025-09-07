import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const AnimatedBackground = ({ weatherCondition, temperature }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  // Weather condition mapping
  const getWeatherConfig = (condition, temp) => {
    const conditionLower = condition?.toLowerCase() || '';
    
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return {
        type: 'rain',
        particleCount: 100,
        speed: 2,
        color: '#4A90E2',
        size: { min: 1, max: 3 }
      };
    }
    
    if (conditionLower.includes('snow')) {
      return {
        type: 'snow',
        particleCount: 80,
        speed: 1,
        color: '#FFFFFF',
        size: { min: 2, max: 4 }
      };
    }
    
    if (conditionLower.includes('storm') || conditionLower.includes('thunder')) {
      return {
        type: 'storm',
        particleCount: 120,
        speed: 3,
        color: '#2C3E50',
        size: { min: 1, max: 4 }
      };
    }
    
    if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
      return {
        type: 'cloudy',
        particleCount: 60,
        speed: 0.5,
        color: '#BDC3C7',
        size: { min: 3, max: 8 }
      };
    }
    
    // Default sunny
    return {
      type: 'sunny',
      particleCount: 40,
      speed: 0.3,
      color: '#F39C12',
      size: { min: 2, max: 5 }
    };
  };

  // Create particles based on weather
  const createParticles = (config) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const particles = [];

    for (let i = 0; i < config.particleCount; i++) {
      const particle = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (config.size.max - config.size.min) + config.size.min,
        speedX: (Math.random() - 0.5) * config.speed,
        speedY: Math.random() * config.speed + 0.5,
        color: config.color,
        opacity: Math.random() * 0.5 + 0.3
      };
      particles.push(particle);
    }

    return particles;
  };

  // Animate particles
  const animateParticles = (particles, config) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, index) => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Wrap around edges
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y > canvas.height) {
        particle.y = -10;
        particle.x = Math.random() * canvas.width;
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${hexToRgb(particle.color)}, ${particle.opacity})`;
      ctx.fill();

      // Add special effects based on weather type
      if (config.type === 'rain') {
        // Rain streaks
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(particle.x, particle.y + particle.size * 3);
        ctx.strokeStyle = `rgba(${hexToRgb(particle.color)}, ${particle.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      if (config.type === 'snow') {
        // Snowflake effect
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(particle.x + particle.size, particle.y + particle.size);
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(particle.x - particle.size, particle.y + particle.size);
        ctx.strokeStyle = `rgba(${hexToRgb(particle.color)}, ${particle.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    animationRef.current = requestAnimationFrame(() => animateParticles(particles, config));
  };

  // Helper function to convert hex to rgb
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
      '255, 255, 255';
  };

  // Setup canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Update animation when weather changes
  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const config = getWeatherConfig(weatherCondition, temperature);
    const particles = createParticles(config);
    particlesRef.current = particles;

    animateParticles(particles, config);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [weatherCondition, temperature]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1]"
      style={{
        background: getWeatherConfig(weatherCondition, temperature).type === 'sunny' 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : getWeatherConfig(weatherCondition, temperature).type === 'rain'
          ? 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
          : getWeatherConfig(weatherCondition, temperature).type === 'snow'
          ? 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)'
          : getWeatherConfig(weatherCondition, temperature).type === 'storm'
          ? 'linear-gradient(135deg, #2c3e50 0%, #1a252f 100%)'
          : 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)'
      }}
    />
  );
};

export default AnimatedBackground; 