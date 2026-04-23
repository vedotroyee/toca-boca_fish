import React from 'react';
import './StudyDesk.css';
import WallClock from './WallClock';

interface StudyDeskProps {
  isNight?: boolean;
}

const StudyDesk: React.FC<StudyDeskProps> = ({ isNight }) => {
  return (
    <div className="study-desk-wrapper">
      {/* Desk Body */}
      <div className="desk-leg desk-leg-left"></div>
      <div className="desk-drawers">
        <div className="desk-drawer"></div>
        <div className="desk-drawer"></div>
        <div className="desk-drawer"></div>
      </div>
      <div className="desk-top"></div>

      {/* Desk Items */}
      <div className="desk-items">
        {/* Plant */}
        <div className="desk-plant">
          <div className="plant-leaf plant-leaf-1"></div>
          <div className="plant-leaf plant-leaf-2"></div>
          <div className="plant-leaf plant-leaf-3"></div>
          <div className="plant-pot"></div>
        </div>

        {/* Table Clock */}
        <div className="desk-cat-clock">
          {/* Note: It's still using the original WallClock component code, 
              but the CSS has naturally altered it to act as a table clock! */}
          <WallClock isNight={isNight || false} />
        </div>

        {/* Desk Lamp */}
        <div className={`desk-lamp ${isNight ? 'lamp-on' : ''}`}>
          <div className="lamp-base"></div>
          <div className="lamp-stand"></div>
          <div className="lamp-head">
            <div className="lamp-light"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyDesk;
