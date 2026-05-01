import React from 'react';
import './Scenes.css';
import type { WeatherData } from '../../lib/weather';

interface SceneProps {
    isRightOffset: boolean;
    weatherState?: WeatherData | null;
}

// Generate stable random stars
const DIAMOND_STARS = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 5 + 3, // 3px to 8px
    delay: Math.random() * 5
}));

const renderStars = (isDense: boolean) => (
    <div className={`stars-container${isDense ? ' dense' : ''}`}>
        {DIAMOND_STARS.slice(0, isDense ? 30 : 15).map(star => (
            <div 
                key={star.id} 
                className="diamond-star" 
                style={{
                    top: star.top, 
                    left: star.left, 
                    width: `${star.size}px`, 
                    height: `${star.size}px`,
                    animationDelay: `${star.delay}s`
                }} 
            />
        ))}
    </div>
);

export const MoonScene: React.FC<SceneProps> = ({ isRightOffset }) => {
    const offsetClass = isRightOffset ? " right-offset" : "";
    return (
        <div className={`scene-content moon-scene${offsetClass}`}>
            {renderStars(false)}
            <div className="moon-earth"></div>
            <div className="lunar-surface">
                <div className="lunar-crater" style={{ width: '40px', height: '10px', top: '20px', left: '30px' }}></div>
                <div className="lunar-crater" style={{ width: '60px', height: '15px', top: '50px', left: '150px' }}></div>
                <div className="lunar-crater" style={{ width: '25px', height: '6px', top: '80px', left: '80px' }}></div>
            </div>
            {/* Simple SVG Lander */}
            <svg className="apollo-lander" viewBox="0 0 100 100">
                <path d="M 30,70 L 20,100 M 70,70 L 80,100 M 50,70 L 50,100" stroke="#888" strokeWidth="5" />
                <rect x="30" y="50" width="40" height="30" fill="#f4d03f" rx="5" />
                <path d="M 20,50 L 80,50 L 60,30 L 40,30 Z" fill="#ccc" />
            </svg>
            <div className="astronaut">🧑‍🚀</div>
        </div>
    );
};

export const MarsScene: React.FC<SceneProps> = ({ isRightOffset }) => {
    const offsetClass = isRightOffset ? " right-offset" : "";
    return (
        <div className={`scene-content mars-scene${offsetClass}`}>
            <div className="mars-sky"></div>
            <div className="mars-moon-1"></div>
            <div className="mars-moon-2"></div>
            <div className="mars-bg-mountain"></div>
            <div className="mars-surface"></div>
            {/* Tiny SVG Rover */}
            <svg className="mars-rover" viewBox="0 0 100 100">
                <rect x="20" y="50" width="60" height="20" fill="#ccc" rx="3" />
                <circle cx="30" cy="80" r="10" fill="#333" />
                <circle cx="50" cy="80" r="10" fill="#333" />
                <circle cx="70" cy="80" r="10" fill="#333" />
                <rect x="40" y="30" width="20" height="20" fill="#fff" />
                <line x1="50" y1="30" x2="60" y2="10" stroke="#888" strokeWidth="3" />
            </svg>
            <div className="dust-devil"></div>
            <div className="dust-storm-overlay"></div>
        </div>
    );
};

export const SaturnScene: React.FC<SceneProps> = ({ isRightOffset }) => {
    const offsetClass = isRightOffset ? " right-offset" : "";
    return (
        <div className={`scene-content saturn-scene${offsetClass}`}>
            {renderStars(false)}
            <div className="saturn-rings-outer"></div>
            <div className="saturn-rings-inner"></div>
            <div className="saturn-body"></div>
            <div className="icy-moon-foreground"></div>
        </div>
    );
};

export const DeepSpaceScene: React.FC<SceneProps> = ({ isRightOffset }) => {
    const offsetClass = isRightOffset ? " right-offset" : "";
    return (
        <div className={`scene-content deep-space-scene${offsetClass}`}>
            {renderStars(true)}
            <div className="nebula-layer"></div>
            <div className="galaxy-spiral"></div>
            <div className="pulsing-star"></div>
            <div className="shooting-star"></div>
        </div>
    );
};

export const SunScene: React.FC<SceneProps> = ({ isRightOffset }) => {
    const offsetClass = isRightOffset ? " right-offset" : "";
    return (
        <div className={`scene-content sun-scene${offsetClass}`}>
            <div className="plasma-bg"></div>
            <div className="solar-flare"></div>
            <div className="solar-flare" style={{ left: '70%', animationDelay: '4s', transform: 'scaleX(-1)' }}></div>
            <div className="sun-heartbeat"></div>
        </div>
    );
};
