import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import './LivingRoom.css';
import CanvasAquarium from './CanvasAquarium';
import ControlPanel from './ControlPanel';
import CatComponent from './CatComponent';
import WallClock from './WallClock';
import StudyDesk from './StudyDesk';
import RoomWindow from './RoomWindow';
import ArchiveGallery from './ArchiveGallery';
import { archiveYesterdayTank } from '../lib/db';

const LivingRoom: React.FC = () => {
  const [isNight, setIsNight] = useState(false);
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
    
    window.addEventListener('aquarium:theme_change', handleThemeChange);
    return () => window.removeEventListener('aquarium:theme_change', handleThemeChange);
  }, []);

  useEffect(() => {
    if (isNight) {
      document.body.classList.add('night-mode');
    } else {
      document.body.classList.remove('night-mode');
    }
  }, [isNight]);

  return (
    <div className="living-room">
      {/* Background Layer */}
      <div className="room-wall">
        {/* Dynamic Window Scene replacing old lamps */}
        <RoomWindow isNight={isNight} />
      </div>
      <div className="room-floor"></div>

      {/* Furniture Background */}

      <div className="skirting-board"></div>

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
      </div>

      <div className="sofa">
        <div className="sofa-cushion-1"></div>
        <div className="sofa-cushion-2"></div>
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
