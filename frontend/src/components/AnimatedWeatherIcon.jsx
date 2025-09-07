import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  Snowflake, 
  Wind,
  CloudFog
} from 'lucide-react';

const AnimatedWeatherIcon = ({ condition, size = 64, className = '' }) => {
  const iconRef = useRef(null);
  const animationRef = useRef(null);

  const getWeatherIcon = (condition) => {
    const conditionLower = condition?.toLowerCase() || '';
    
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return CloudRain;
    }
    
    if (conditionLower.includes('snow')) {
      return Snowflake;
    }
    
    if (conditionLower.includes('storm') || conditionLower.includes('thunder')) {
      return CloudLightning;
    }
    
    if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
      return Cloud;
    }
    
    if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
      return CloudFog;
    }
    
    if (conditionLower.includes('wind')) {
      return Wind;
    }
    
    // Default sunny
    return Sun;
  };

  const getAnimationConfig = (condition) => {
    const conditionLower = condition?.toLowerCase() || '';
    
    if (conditionLower.includes('rain')) {
      return {
        type: 'rain',
        duration: 2,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1
      };
    }
    
    if (conditionLower.includes('snow')) {
      return {
        type: 'snow',
        duration: 3,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1
      };
    }
    
    if (conditionLower.includes('storm')) {
      return {
        type: 'storm',
        duration: 0.5,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1
      };
    }
    
    if (conditionLower.includes('cloud')) {
      return {
        type: 'cloud',
        duration: 4,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1
      };
    }
    
    // Default sunny
    return {
      type: 'sunny',
      duration: 6,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1
    };
  };

  useEffect(() => {
    if (!iconRef.current) return;

    const config = getAnimationConfig(condition);
    const icon = iconRef.current;

    // Kill any existing animation
    if (animationRef.current) {
      animationRef.current.kill();
    }

    // Reset to initial state
    gsap.set(icon, { 
      scale: 1, 
      rotation: 0, 
      opacity: 1,
      y: 0 
    });

    // Create new animation based on weather type
    switch (config.type) {
      case 'rain':
        animationRef.current = gsap.timeline({ repeat: -1 })
          .to(icon, { 
            y: 5, 
            duration: 0.5, 
            ease: 'power2.inOut' 
          })
          .to(icon, { 
            y: 0, 
            duration: 0.5, 
            ease: 'power2.inOut' 
          }, '-=0.3');
        break;

      case 'snow':
        animationRef.current = gsap.timeline({ repeat: -1 })
          .to(icon, { 
            rotation: 360, 
            duration: 3, 
            ease: 'power1.inOut' 
          })
          .to(icon, { 
            y: -3, 
            duration: 1.5, 
            ease: 'power1.inOut' 
          }, 0)
          .to(icon, { 
            y: 0, 
            duration: 1.5, 
            ease: 'power1.inOut' 
          }, 1.5);
        break;

      case 'storm':
        animationRef.current = gsap.timeline({ repeat: -1 })
          .to(icon, { 
            scale: 1.1, 
            duration: 0.2, 
            ease: 'power2.inOut' 
          })
          .to(icon, { 
            scale: 1, 
            duration: 0.2, 
            ease: 'power2.inOut' 
          })
          .to(icon, { 
            rotation: 5, 
            duration: 0.1, 
            ease: 'power2.inOut' 
          }, '-=0.1')
          .to(icon, { 
            rotation: -5, 
            duration: 0.1, 
            ease: 'power2.inOut' 
          })
          .to(icon, { 
            rotation: 0, 
            duration: 0.1, 
            ease: 'power2.inOut' 
          });
        break;

      case 'cloud':
        animationRef.current = gsap.timeline({ repeat: -1 })
          .to(icon, { 
            x: 3, 
            duration: 2, 
            ease: 'power1.inOut' 
          })
          .to(icon, { 
            x: -3, 
            duration: 2, 
            ease: 'power1.inOut' 
          })
          .to(icon, { 
            x: 0, 
            duration: 2, 
            ease: 'power1.inOut' 
          });
        break;

      default: // sunny
        animationRef.current = gsap.timeline({ repeat: -1 })
          .to(icon, { 
            rotation: 360, 
            duration: 6, 
            ease: 'power1.inOut' 
          })
          .to(icon, { 
            scale: 1.05, 
            duration: 1, 
            ease: 'power1.inOut' 
          }, 0)
          .to(icon, { 
            scale: 1, 
            duration: 1, 
            ease: 'power1.inOut' 
          }, 1);
        break;
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [condition]);

  const WeatherIcon = getWeatherIcon(condition);

  return (
    <div 
      ref={iconRef}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <WeatherIcon size={size} />
    </div>
  );
};

export default AnimatedWeatherIcon; 