import React, { useState } from 'react';
import { X, Search, MapPin, Rocket } from 'lucide-react';
import { fetchWeatherByCity } from '../lib/weather';
import type { WeatherData, WeatherState } from '../lib/weather';
import './LocationPicker.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LocationPicker: React.FC<Props> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isTeleporting, setIsTeleporting] = useState(false);

  if (!isOpen) return null;

  const teleport = (data: WeatherData) => {
      setIsTeleporting(true);
      
      // Emit the teleport transition event
      window.dispatchEvent(new Event('location:transition_start'));
      
      setTimeout(() => {
          window.dispatchEvent(new CustomEvent('location:teleport', { detail: data }));
          setIsTeleporting(false);
          onClose();
      }, 1500); // 1.5s for transition
  };

  const handleSearch = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchQuery) return;
      setIsSearching(true);
      const data = await fetchWeatherByCity(searchQuery);
      if (data) {
          teleport(data);
      } else {
          alert('City not found or API error.');
      }
      setIsSearching(false);
  };

  const quickPicks: {name: string, icon: string, state: WeatherState, temp: number, flag: string}[] = [
      { name: 'Paris', icon: '🗼', state: 'Sunny', temp: 22, flag: '🇫🇷' },
      { name: 'Japan', icon: '🌸', state: 'Sunny', temp: 20, flag: '🇯🇵' },
      { name: 'Kolkata', icon: '🌺', state: 'Sunny', temp: 35, flag: '🇮🇳' },
      { name: 'Iceland', icon: '❄️', state: 'Snowy', temp: -5, flag: '🇮🇸' },
      { name: 'Sahara', icon: '🌵', state: 'Hot', temp: 42, flag: '🏜️' },
      { name: 'London', icon: '🌧️', state: 'Rainy', temp: 15, flag: '🇬🇧' },
      { name: 'Canada', icon: '🍁', state: 'Windy', temp: 12, flag: '🇨🇦' },
      { name: 'Maldives', icon: '🏝️', state: 'Sunny', temp: 30, flag: '🇲🇻' },
  ];

  const spacePicks: {name: string, icon: string, state: WeatherState, temp: number}[] = [
      { name: 'Moon', icon: '🌙', state: 'Night', temp: -150 },
      { name: 'Mars', icon: '🔴', state: 'Sunny', temp: -60 },
      { name: 'Saturn', icon: '🪐', state: 'Night', temp: -140 },
      { name: 'Deep Space', icon: '✨', state: 'Night', temp: -270 },
      { name: 'Inside the Sun', icon: '☀️', state: 'Hot', temp: 5500 },
  ];

  return (
    <>
      <div className="location-picker-overlay" onClick={onClose}>
        <div className={`passport-modal ${isTeleporting ? 'teleporting' : ''}`} onClick={e => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
          
          <div className="passport-header">
              <div className="passport-emblem">🌍</div>
              <h2>World Teleporter</h2>
              <p>Passport to any climate</p>
          </div>

          <div className="passport-body">
              <form className="search-bar" onSubmit={handleSearch}>
                  <MapPin size={18} className="search-icon" />
                  <input 
                      type="text" 
                      placeholder="Search any city..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" disabled={isSearching}>
                      {isSearching ? '...' : <Search size={18} />}
                  </button>
              </form>

              <div className="destinations-section">
                  <h3>Earth Destinations</h3>
                  <div className="destinations-grid">
                      {quickPicks.map(p => (
                          <button key={p.name} className="dest-btn" onClick={() => teleport({
                              city: p.name,
                              icon: p.flag,
                              temp: p.temp,
                              state: p.state,
                              isReal: false
                          })}>
                              <span className="dest-icon">{p.icon}</span>
                              <span className="dest-name">{p.name}</span>
                          </button>
                      ))}
                  </div>
              </div>

              <div className="destinations-section space-section">
                  <h3>Beyond Earth 🚀</h3>
                  <div className="destinations-grid">
                      {spacePicks.map(p => (
                          <button key={p.name} className="dest-btn space-btn" onClick={() => teleport({
                              city: p.name,
                              icon: p.icon,
                              temp: p.temp,
                              state: p.state, // the logic for space renders will be driven by city name
                              isReal: false
                          })}>
                              <span className="dest-icon">{p.icon}</span>
                              <span className="dest-name">{p.name}</span>
                          </button>
                      ))}
                  </div>
              </div>
          </div>
        </div>
      </div>

      {isTeleporting && (
          <div className="teleport-transition">
              <Rocket size={64} className="teleport-icon" />
          </div>
      )}
    </>
  );
};

export default LocationPicker;
