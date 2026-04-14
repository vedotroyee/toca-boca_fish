import React from 'react';
import './StudyDesk.css';

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

        {/* Books */}
        <div className="desk-books">
          <div className="book book-1"></div>
          <div className="book book-2"></div>
          <div className="book book-3"></div>
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
