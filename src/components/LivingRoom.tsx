import React, { useState, useEffect } from 'react';
import './LivingRoom.css';
import CanvasAquarium from './CanvasAquarium';
import ControlPanel from './ControlPanel';
import CatComponent from './CatComponent';

const LivingRoom: React.FC = () => {
  const [isNight, setIsNight] = useState(false);

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
        {/* Subtle texture via CSS */}
        <div className="wall-quotes">
           <div className="quote">"Just keep swimming."</div>
           <div className="quote sub-quote">♡ home is where the water is ♡</div>
        </div>
        <div className="wall-lamp"></div>
        <div className="pendant-lamp"></div>
      </div>
      <div className="room-floor"></div>
      
      {/* Furniture Background */}

      <div className="skirting-board"></div>

      {/* Tank Layer (Middle) */}
      <div className="aquarium-stand-wrapper">
        <div className="aquarium-glow"></div>
        {/* The Black Frame & Canvas */}
        <div className="aquarium-frame">
          <div className="aquarium-glass">
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

      {/* The Cat */}
      <CatComponent />

      {/* Controls */}
      <ControlPanel isNight={isNight} setIsNight={setIsNight} />
    </div>
  );
};

export default LivingRoom;
