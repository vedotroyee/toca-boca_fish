import React from 'react';
import './Scenes.css';
import './EarthScenes.css';
import type { WeatherData } from '../../lib/weather';

interface SceneProps {
    isRightOffset: boolean;
    isNight: boolean;
    weatherState?: WeatherData | null;
}

export const ParisScene: React.FC<SceneProps> = ({ isNight }) => {
    return (
        <div className={`scene-content`}>
            <div className={`bg-image-scene ${isNight ? 'paris-night-bg' : 'paris-day-bg'}`}></div>
        </div>
    );
};

export const TokyoScene: React.FC<SceneProps> = ({ isNight }) => {
    return (
        <div className={`scene-content`}>
            <div className={`bg-image-scene ${isNight ? 'japan-night-bg' : 'japan-day-bg'}`}></div>
            {/* Falling blossoms */}
            {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="tokyo-blossom" style={{
                    top: `${Math.random() * -50}px`,
                    left: `${Math.random() * 150}%`,
                    animationDelay: `${Math.random() * 8}s`,
                    animationDuration: `${5 + Math.random() * 5}s`
                }}></div>
            ))}
        </div>
    );
};

export const KolkataScene: React.FC<SceneProps> = ({ isNight, weatherState }) => {
    const isRaining = weatherState?.state === 'Rainy' || weatherState?.state === 'Thunderstorm';
    return (
        <div className={`scene-content`}>
            <div className={`bg-image-scene ${isNight ? 'kolkata-night-bg' : 'kolkata-day-bg'}`}></div>
            {isRaining && (
                <div style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', background:'rgba(52, 73, 94, 0.2)'}}>
                     {Array.from({ length: 30 }).map((_, i) => (
                        <div key={i} className="london-rain" style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random()}s`,
                            animationDuration: `${0.5 + Math.random() * 0.5}s`
                        }}></div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const IcelandScene: React.FC<SceneProps> = ({ isNight }) => {
    return (
        <div className={`scene-content`}>
            <div className={`bg-image-scene ${isNight ? 'iceland-night-bg' : 'iceland-day-bg'}`}></div>
            {/* No CSS aurora here since the night generated image already has aurora! */}
        </div>
    );
};

export const SaharaScene: React.FC<SceneProps> = ({ isNight }) => {
    return (
        <div className={`scene-content`}>
            <div className={`bg-image-scene ${isNight ? 'sahara-night-bg' : 'sahara-day-bg'}`}></div>
            {!isNight && <div className="heat-shimmer"></div>}
        </div>
    );
};

export const LondonScene: React.FC<SceneProps> = ({ isNight }) => {
    return (
        <div className={`scene-content`}>
            <div className={`bg-image-scene ${isNight ? 'london-night-bg' : 'london-day-bg'}`}></div>
            {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="london-rain" style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random()}s`,
                    animationDuration: `${0.4 + Math.random() * 0.4}s`
                }}></div>
            ))}
        </div>
    );
};

export const CanadaScene: React.FC<SceneProps> = ({ isNight }) => {
    return (
        <div className={`scene-content`}>
            <div className={`bg-image-scene ${isNight ? 'canada-night-bg' : 'canada-day-bg'}`}></div>
            {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="canada-leaf" style={{
                    left: `${Math.random() * 100}%`,
                    top: `${-10 - Math.random() * 20}px`,
                    background: i % 2 === 0 ? '#e74c3c' : '#f39c12',
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${6 + Math.random() * 4}s`
                }}></div>
            ))}
        </div>
    );
};
