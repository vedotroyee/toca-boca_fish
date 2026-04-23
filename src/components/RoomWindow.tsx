import React, { useState, useEffect } from 'react';
import './RoomWindow.css';

interface RoomWindowProps {
  isNight: boolean;
}

// Calculate the moon phase based on the current date
// Returns a value between 0.0 (new moon) and 1.0 (full moon to new moon)
function getMoonPhase() {
  const date = new Date();
  // Known new moon: Jan 6, 2000, 18:14 UTC
  // Synodic month: 29.53058867 days -> 2551442.8 seconds
  const synodicMonthSecs = 2551442.8;
  const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14, 0)).getTime() / 1000;
  const now = date.getTime() / 1000;
  
  const phaseSecs = (now - knownNewMoon) % synodicMonthSecs;
  const phase = phaseSecs / synodicMonthSecs;
  return phase; // 0.0 to 1.0
}

const RoomWindow: React.FC<RoomWindowProps> = ({ isNight }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    setPhase(getMoonPhase());
    // Could update exactly at midnight, but once on mount is fine for realtime day
    const interval = setInterval(() => {
      setPhase(getMoonPhase());
    }, 1000 * 60 * 60); // update every hour
    return () => clearInterval(interval);
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

  return (
    <div className={`room-window ${isNight ? 'is-night' : 'is-day'}`}>
      <div className="window-frame-outer">
        <div className="window-pane left-pane">
          <div className="window-glass">
            <div className="window-scene-content">
              {/* Day/Night Sky Background handled via CSS */}
              {/* Sun/Moon */}
              <div className="celestial-body">
                {isNight ? (
                  <div className="moon">
                    <div className="moon-base"></div>
                    {/* Shadow overlay matching the sky color to carve out the crescent */}
                    <div 
                      className="moon-shadow" 
                      style={{ transform: `translateX(${getMoonShadowOffset()}%)` }}
                    ></div>
                    {/* Tiny glowing stars around moon */}
                    <div className="star" style={{ top: '10px', left: '-30px' }}></div>
                    <div className="star" style={{ top: '50px', left: '100px' }}></div>
                    <div className="star" style={{ top: '-20px', left: '60px' }}></div>
                  </div>
                ) : (
                  <div className="sun">
                     <div className="sun-core"></div>
                     <div className="sun-rays"></div>
                  </div>
                )}
              </div>
              
              {/* Clouds */}
              <div className="clouds">
                <div className="cloud cloud-1"></div>
                <div className="cloud cloud-2"></div>
                <div className="cloud cloud-3"></div>
              </div>

              {/* Mountains/Trees Background */}
              <div className="landscape">
                <div className="mountain m-back"></div>
                <div className="mountain m-front"></div>
                <div className="trees"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="window-pane right-pane">
          <div className="window-glass">
            <div className="window-scene-content right-offset">
              {/* The right pane shows the same scene, just offset to simulate continuous window! */}
              <div className="celestial-body right-offset">
                {isNight ? (
                  <div className="moon">
                    <div className="moon-base"></div>
                    <div 
                      className="moon-shadow" 
                      style={{ transform: `translateX(${getMoonShadowOffset()}%)` }}
                    ></div>
                    <div className="star" style={{ top: '10px', left: '-30px' }}></div>
                    <div className="star" style={{ top: '50px', left: '100px' }}></div>
                    <div className="star" style={{ top: '-20px', left: '60px' }}></div>
                  </div>
                ) : (
                  <div className="sun">
                     <div className="sun-core"></div>
                     <div className="sun-rays"></div>
                  </div>
                )}
              </div>
              
              <div className="clouds right-offset">
                <div className="cloud cloud-1"></div>
                <div className="cloud cloud-2"></div>
                <div className="cloud cloud-3"></div>
              </div>

              <div className="landscape right-offset">
                <div className="mountain m-back"></div>
                <div className="mountain m-front"></div>
                <div className="trees"></div>
              </div>
            </div>
          </div>
        </div>
        {/* Middle strut */}
        <div className="window-strut-v"></div>
      </div>
      <div className="window-sill"></div>
    </div>
  );
};

export default RoomWindow;
