import React, { useState, useEffect } from 'react';
import { fetchWeatherByCoords } from '../lib/weather';
import type { WeatherData } from '../lib/weather';
import './WeatherBadge.css';

const WeatherBadge: React.FC = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);

    useEffect(() => {
        let mounted = true;
        
        const loadWeather = () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const data = await fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
                        if (mounted && data) {
                            setWeather(data);
                            window.dispatchEvent(new CustomEvent('weather:update', { detail: data }));
                        }
                    },
                    (error) => {
                        console.warn("Geolocation denied or failed", error);
                    }
                );
            }
        };

        const handleTeleport = ((e: CustomEvent) => {
             // Handle fantasy location teleport or real city teleport
             if (mounted) {
                 const newWeather = e.detail as WeatherData;
                 setWeather(newWeather);
                 window.dispatchEvent(new CustomEvent('weather:update', { detail: newWeather }));
             }
        }) as EventListener;

        const handleReturnHome = () => {
             loadWeather();
             window.dispatchEvent(new CustomEvent('location:return_home'));
        };

        window.addEventListener('location:teleport', handleTeleport);
        window.addEventListener('location:trigger_return', handleReturnHome);

        // Initial load
        loadWeather();

        // Refresh every 30 mins
        const interval = setInterval(() => {
             // Only auto-refresh if we are currently looking at real weather
             setWeather(prev => {
                 if (prev && prev.isReal) {
                     loadWeather();
                 }
                 return prev;
             });
        }, 30 * 60 * 1000);

        return () => {
            mounted = false;
            window.removeEventListener('location:teleport', handleTeleport);
            window.removeEventListener('location:trigger_return', handleReturnHome);
            clearInterval(interval);
        };
    }, []);

    if (!weather) return null;

    return (
        <div className={`weather-badge ${!weather.isReal ? 'fantasy-badge' : ''}`}>
             <div className="weather-icon">
                 {/* OWM icon */}
                 {weather.icon.length === 3 ? (
                     <img src={`https://openweathermap.org/img/wn/${weather.icon}.png`} alt={weather.state} />
                 ) : (
                     <span style={{fontSize: '1.5rem'}}>{weather.icon}</span> // for emojis
                 )}
             </div>
             <div className="weather-info">
                 <span className="weather-temp">{weather.temp}°C</span>
                 <span className="weather-city">{weather.city}</span>
             </div>
             {!weather.isReal && (
                 <button className="return-home-btn" onClick={() => window.dispatchEvent(new Event('location:trigger_return'))}>
                     🏠
                 </button>
             )}
        </div>
    );
};

export default WeatherBadge;
