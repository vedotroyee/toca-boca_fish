import React, { useState, useEffect } from 'react';
import './RoomWindow.css';

import type { WeatherData } from '../lib/weather';
import { MoonScene, MarsScene, SaturnScene, DeepSpaceScene, SunScene } from './scenes/SpaceScenes';
import { ParisScene, TokyoScene, KolkataScene, IcelandScene, SaharaScene, LondonScene, CanadaScene } from './scenes/EarthScenes';
interface RoomWindowProps {
  isNight: boolean;
}

// Calculate the moon phase based on the current date
// Returns a value between 0.0 (new moon) and 1.0 (full moon to new moon)
function getMoonPhase() {
  const date = new Date();
  const synodicMonthSecs = 2551442.8;
  const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14, 0)).getTime() / 1000;
  const now = date.getTime() / 1000;
  const phaseSecs = (now - knownNewMoon) % synodicMonthSecs;
  return phaseSecs / synodicMonthSecs;
}

const RoomWindow: React.FC<RoomWindowProps> = ({ isNight }) => {
  const [phase, setPhase] = useState(0);
  const [weatherState, setWeatherState] = useState<WeatherData | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setPhase(getMoonPhase());
    const interval = setInterval(() => {
      setPhase(getMoonPhase());
    }, 1000 * 60 * 60);

    const handleWeatherUpdate = ((e: CustomEvent) => {
      setWeatherState(e.detail as WeatherData);
    }) as EventListener;

    window.addEventListener('weather:update', handleWeatherUpdate);
    window.addEventListener('location:teleport', handleWeatherUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('weather:update', handleWeatherUpdate);
      window.removeEventListener('location:teleport', handleWeatherUpdate);
    };
  }, []);

  // Map phase (0-1) to an SVG path or overlay position
  // 0 = New Moon (dark)
  // 0.25 = First Quarter (right half visible)
  // 0.5 = Full Moon (fully visible)
  // 0.75 = Last Quarter (left half visible)

  // We can use a trick: 
  // Base circle is Moon Color (#ffefb5).
  // Shadow circle is Sky Color (#0A0A2A, or #1A1A3A).
  // The shadow circle moves across the moon.

  // Actually, SVG path is much more robust for realistic crescents.
  // We'll generate an SVG with a bright moon and a dark shadow masking it.

  const getMoonShadowOffset = () => {
    // Phase 0 -> shadow exactly covers moon (offset 0)
    // Phase 0.25 -> shadow is offset to the left (-50px)
    // Phase 0.5 -> shadow is completely off screen (-100px or positive)
    // Phase 0.75 -> shadow comes from the right (50px)
    // Phase 1 -> shadow covers moon (offset 0)

    // Convert phase to a linear movement from -100 to 100 roughly
    // 0 -> 0 overlay (new moon)
    // 0..0.5 -> offset moves left from 0 to -100
    // 0.5..1.0 -> offset moves left from 100 to 0 (coming from right)

    if (phase < 0.5) {
      // 0 to 0.5
      // at 0: offset = 0
      // at 0.5: offset = -120 (completely off left)
      return -(phase * 2 * 120);
    } else {
      // 0.5 to 1.0
      // at 0.5: offset = 120 (completely off right)
      // at 1.0: offset = 0
      return 120 - ((phase - 0.5) * 2 * 120);
    }
  };

  const renderSceneContent = () => {
    const city = weatherState?.city || 'Default';
    const isSpace = ['Moon', 'Mars', 'Saturn', 'Deep Space', 'Inside the Sun'].includes(city);

    if (isSpace) {
      switch (city) {
        case 'Moon': return <MoonScene isRightOffset={false} />;
        case 'Mars': return <MarsScene isRightOffset={false} />;
        case 'Saturn': return <SaturnScene isRightOffset={false} />;
        case 'Deep Space': return <DeepSpaceScene isRightOffset={false} />;
        case 'Inside the Sun': return <SunScene isRightOffset={false} />;
        default: return <DeepSpaceScene isRightOffset={false} />;
      }
    } else {
      switch (city) {
        case 'Paris': return <ParisScene isRightOffset={false} isNight={isNight} />;
        case 'Japan': return <TokyoScene isRightOffset={false} isNight={isNight} />;
        case 'Kolkata': return <KolkataScene isRightOffset={false} isNight={isNight} weatherState={weatherState} />;
        case 'Iceland': return <IcelandScene isRightOffset={false} isNight={isNight} />;
        case 'Sahara': return <SaharaScene isRightOffset={false} isNight={isNight} />;
        case 'London': return <LondonScene isRightOffset={false} isNight={isNight} />;
        case 'Canada': return <CanadaScene isRightOffset={false} isNight={isNight} />;
        default:
          // Fallback to basic nature scene
          return (
            <div className={`scene-content ${isNight ? 'night-sky' : 'day-sky'}`}>
              <div className={`celestial-body`}>
                {isNight ? (
                  <div className="moon">
                    <div className="moon-base">
                      <div className="moon-crater c1"></div>
                      <div className="moon-crater c2"></div>
                      <div className="moon-crater c3"></div>
                      <div className="moon-crater c4"></div>
                    </div>
                    <div className="moon-shadow" style={{ transform: `translateX(${getMoonShadowOffset()}%)` }}></div>
                    <div className="star" style={{ top: '10px', left: '-30px' }}></div>
                    <div className="star" style={{ top: '50px', left: '100px' }}></div>
                  </div>
                ) : (
                  <div className="sun">
                    <div className="sun-core"></div>
                    <div className="sun-rays"></div>
                  </div>
                )}
              </div>
              <div className={`clouds`}>
                <div className="cloud cloud-1"></div>
                <div className="cloud cloud-2"></div>
              </div>
              <div className={`landscape`}>
                <div className="mountain m-back"></div>
                <div className="mountain m-front"></div>
                <div className="trees"></div>
              </div>
              {weatherState?.state === 'Rainy' || weatherState?.state === 'Thunderstorm' ? (
                <div className={`rain-overlay`}></div>
              ) : null}
              {weatherState?.state === 'Snowy' ? (
                <div className={`snow-overlay`}></div>
              ) : null}
            </div>
          );
      }
    }
  };

  return (
    <div className={`room-window ${isNight ? 'is-night' : 'is-day'}`}>
      <div className="window-frame-outer" onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>

        <div className="window-pane full-pane">
          <div className="window-glass">
            {renderSceneContent()}
          </div>

          <div className="window-panels-container">
            {/* Left Panel */}
            <div className={`hinge-panel left-panel ${isOpen ? 'is-open' : ''}`}>
              <svg width="100%" height="100%" viewBox="0 0 150 400" preserveAspectRatio="none">
                <line x1="75" y1="0" x2="75" y2="400" stroke="#fdfbf7" strokeWidth="6" />
                <line x1="6" y1="137.3" x2="144" y2="137.3" stroke="#fdfbf7" strokeWidth="6" />
                <line x1="6" y1="262.6" x2="144" y2="262.6" stroke="#fdfbf7" strokeWidth="6" />
                <rect x="6" y="6" width="138" height="388" fill="none" stroke="#fdfbf7" strokeWidth="12" />
                <g transform="translate(141, 180)">
                  <rect x="0" y="2" width="6" height="8" rx="2" fill="#997a30" />
                  <rect x="0" y="30" width="6" height="8" rx="2" fill="#997a30" />
                  <rect x="1" y="0" width="4" height="40" rx="2" fill="#d4af37" />
                </g>
              </svg>
            </div>

            {/* Right Panel */}
            <div className={`hinge-panel right-panel ${isOpen ? 'is-open' : ''}`}>
              <svg width="100%" height="100%" viewBox="0 0 150 400" preserveAspectRatio="none">
                <line x1="75" y1="0" x2="75" y2="400" stroke="#ebe9e4" strokeWidth="6" />
                <line x1="6" y1="137.3" x2="144" y2="137.3" stroke="#ebe9e4" strokeWidth="6" />
                <line x1="6" y1="262.6" x2="144" y2="262.6" stroke="#ebe9e4" strokeWidth="6" />
                <rect x="6" y="6" width="138" height="388" fill="none" stroke="#ebe9e4" strokeWidth="12" />
                <g transform="translate(3, 180)">
                  <rect x="0" y="2" width="6" height="8" rx="2" fill="#997a30" />
                  <rect x="0" y="30" width="6" height="8" rx="2" fill="#997a30" />
                  <rect x="1" y="0" width="4" height="40" rx="2" fill="#d4af37" />
                </g>
              </svg>
            </div>
          </div>

          <div className="glass-reflection"></div>
        </div>
      </div>
      <div className="window-sill"></div>
    </div>
  );
};

export default RoomWindow;
