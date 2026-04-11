import React, { useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { X, Minus, Square, Sun, Moon } from 'lucide-react';
import './AquariumWindow.css';
import CanvasAquarium from './CanvasAquarium';

interface AquariumWindowProps {
  onClose?: () => void;
}

const AquariumWindow: React.FC<AquariumWindowProps> = ({ onClose }) => {
  const [isNight, setIsNight] = useState(false);
  const nodeRef = React.useRef(null);

  useEffect(() => {
    if (isNight) {
      document.body.classList.add('night-mode');
    } else {
      document.body.classList.remove('night-mode');
    }
  }, [isNight]);

  return (
    <Draggable nodeRef={nodeRef} handle=".window-titlebar" bounds="parent" defaultPosition={{x: 100, y: 100}}>
      <div ref={nodeRef} className="aquarium-window">
        {/* Title Bar */}
        <div className="window-titlebar">
          <div className="titlebar-left">
            <span className="window-emoji">🐟</span>
            <span className="window-title">My Aquarium</span>
          </div>
          <div className="titlebar-right">
            <button className="tb-btn minimize-btn"><Minus size={14} /></button>
            <button className="tb-btn maximize-btn"><Square size={12} /></button>
            <button className="tb-btn close-btn" onClick={onClose}><X size={14} /></button>
          </div>
        </div>

        {/* Content Area */}
        <div className="window-content">
          <div className="aquarium-sidebar">
             <div className="sidebar-header">Fish Menu</div>
             <div className="sidebar-tools">
               <button className="tool-btn food-btn" onClick={() => window.dispatchEvent(new Event('aquarium:feed'))}>🍼 Feed</button>
               <button className="tool-btn clean-btn" onClick={() => window.dispatchEvent(new Event('aquarium:cat'))}>🐾 Cat</button>
               <button className="tool-btn theme-btn" onClick={() => setIsNight(!isNight)}>
                 {isNight ? <Sun size={18} /> : <Moon size={18} />} Theme
               </button>
             </div>
          </div>
          <div className="canvas-container">
             <CanvasAquarium />
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default AquariumWindow;
