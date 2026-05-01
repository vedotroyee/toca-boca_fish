import React, { useState, useEffect } from 'react';
import './LivingRoom.css';
import CanvasAquarium from './CanvasAquarium';
import ControlPanel from './ControlPanel';
import CatComponent from './CatComponent';
import StudyDesk from './StudyDesk';
import RoomWindow from './RoomWindow';
import ArchiveGallery from './ArchiveGallery';
import WeatherBadge from './WeatherBadge';
import type { WeatherData } from '../lib/weather';
import { archiveYesterdayTank } from '../lib/db';

const LivingRoom: React.FC = () => {
  const [isNight, setIsNight] = useState(false);
  const [weatherState, setWeatherState] = useState<WeatherData | null>(null);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('toca_theme') || 'Ocean');
  const [rippling, setRippling] = useState(false);

  useEffect(() => {
    // Run daily archive check on mount
    archiveYesterdayTank();

    const handleThemeChange = ((e: CustomEvent) => {
        setRippling(true);
        setTimeout(() => setRippling(false), 1500);
        setTheme(e.detail.theme);
    }) as EventListener;

    const handleWeatherUpdate = ((e: CustomEvent) => {
        const data = e.detail as WeatherData;
        setWeatherState(data);
        if (data.state === 'Night') setIsNight(true);
        else if (data.state === 'Sunny' && data.isReal) setIsNight(false);
        // Special locations logic
        if (!data.isReal && data.city === 'Maldives') {
            setTheme('Coral Reef');
            window.dispatchEvent(new CustomEvent('aquarium:theme_change', {detail: {theme: 'Coral Reef'}}));
        }
    }) as EventListener;
    
    window.addEventListener('aquarium:theme_change', handleThemeChange);
    window.addEventListener('weather:update', handleWeatherUpdate);
    return () => {
        window.removeEventListener('aquarium:theme_change', handleThemeChange);
        window.removeEventListener('weather:update', handleWeatherUpdate);
    };
  }, []);

  useEffect(() => {
    if (isNight) {
      document.body.classList.add('night-mode');
    } else {
      document.body.classList.remove('night-mode');
    }
  }, [isNight]);

  // Determine dynamic classes based on weather
  const weatherClass = weatherState ? `weather-${weatherState.state.toLowerCase()}` : '';
  const locClass = weatherState && !weatherState.isReal ? `loc-${weatherState.city.toLowerCase().replace(/\s+/g, '-')}` : '';

  return (
    <div className={`living-room ${weatherClass} ${locClass}`}>
      <WeatherBadge />
      {/* Background Layer */}
      <div className="room-wall">
        {/* Dynamic Window Scene replacing old lamps */}
        <RoomWindow isNight={isNight} />
      </div>
      <div className="room-floor"></div>

      {/* Furniture Background */}

      <div className="skirting-board"></div>

      {weatherState?.state === 'Hot' && (
          <div className="desk-fan">
             <div className="fan-blades"></div>
          </div>
      )}

      {/* Tank Layer (Middle) */}
      <div className="aquarium-stand-wrapper">
        <div className="aquarium-glow"></div>
        {/* The Black Frame & Canvas */}
        <div className="aquarium-frame">
          <div className={`aquarium-glass theme-${theme.toLowerCase().replace(' ', '-')}`}>
            <div className={`theme-ripple ${rippling ? 'active' : ''}`}></div>
            <CanvasAquarium />
          </div>
          <div className="aquarium-hood"></div>
        </div>
        {/* The Wooden Base */}
        <div className="aquarium-cabinet">
          <div className="cab-door"></div>
          <div className="cab-drawer"></div>
          <div className="cab-door"></div>
        </div>
      </div>

      {/* Foreground Layer */}
      <div className="jute-rug"></div>
      <div className="coffee-table">
        <div className="table-items"></div>
        {weatherState?.state === 'Snowy' && (
            <div className="hot-chocolate">
               <div className="steam steam-1"></div>
               <div className="steam steam-2"></div>
            </div>
        )}
        {weatherState?.state === 'Thunderstorm' && (
            <div className="flickering-candle"></div>
        )}
        {weatherState?.city === 'Kolkata' && (
            <div className="jasmine-flower">🌸</div>
        )}
        {weatherState?.city === 'Mars' && (
            <div className="mars-rover"></div>
        )}
      </div>

      <div className="sofa">
        <div className="sofa-cushion-1"></div>
        <div className="sofa-cushion-2"></div>
        {weatherState?.state === 'Rainy' && (
            <div className="cozy-blanket"></div>
        )}
      </div>

      {/* The Study Desk */}
      <StudyDesk isNight={isNight} />

      {/* The Cat */}
      <CatComponent />

      {/* Controls */}
      <ControlPanel isNight={isNight} setIsNight={setIsNight} />
      
      {/* Archive Button (Vintage Photo Frame) */}
      <div className="archive-trigger-frame" onClick={() => setIsArchiveOpen(true)}>
          <div className="frame-wood">
              <div className="frame-inner">
                 <span className="frame-icon">📸</span>
              </div>
          </div>
          <div className="frame-label">Archive</div>
      </div>

      <ArchiveGallery isOpen={isArchiveOpen} onClose={() => setIsArchiveOpen(false)} />
    </div>
  );
};

export default LivingRoom;
