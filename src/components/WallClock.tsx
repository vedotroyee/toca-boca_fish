import React, { useState, useEffect } from 'react';
import './WallClock.css';

interface Props {
  isNight: boolean;
}

const WallClock: React.FC<Props> = ({ isNight }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const secDeg = seconds * 6;
  const minDeg = minutes * 6 + seconds * 0.1;
  const hrDeg = (hours % 12) * 30 + minutes * 0.5;

  return (
    <div className={`wall-clock-wrapper ${isNight ? 'clock-night' : ''}`}>
      {/* Table clock little feet */}
      <div className="clock-feet">
        <div className="clock-foot foot-left"></div>
        <div className="clock-foot foot-right"></div>
      </div>
      
      {/* Cat ears for the body of the clock! */}
      <div className="clock-ears">
        <div className="clock-ear ear-left"></div>
        <div className="clock-ear ear-right"></div>
      </div>
      
      <div className="clock-rim">
        <div className="clock-face">
          {/* Hour markers (tiny paws) */}
          {[...Array(12)].map((_, i) => (
            <div key={i} className="clock-marker-container" style={{ transform: `rotate(${i * 30}deg)` }}>
              <div className="paw-marker">
                <div className="toe toe-1"></div>
                <div className="toe toe-2"></div>
                <div className="toe toe-3"></div>
                <div className="pad"></div>
              </div>
            </div>
          ))}

          {/* Center sleeping cat face */}
          <div className="cat-center-face">
            <div className="closed-eye eye-left"></div>
            <div className="closed-eye eye-right"></div>
            <div className="pink-nose"></div>
          </div>

          {/* Clock Hands */}
          <div className="clock-hand hour-hand" style={{ transform: `rotate(${hrDeg}deg)` }}></div>
          <div className="clock-hand min-hand" style={{ transform: `rotate(${minDeg}deg)` }}></div>
          <div className="clock-hand sec-hand" style={{ transform: `rotate(${secDeg}deg)` }}></div>
          
          <div className="center-pin"></div>

          {/* Digital Readout */}
          <div className="digital-readout">
            {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WallClock;
