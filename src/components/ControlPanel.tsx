import React, { useState } from 'react';
import { Settings, X, Fish as FishIcon, Droplets, Volume2, Sun, Moon, Cat } from 'lucide-react';
import './ControlPanel.css';

interface Props {
  isNight: boolean;
  setIsNight: (b: boolean) => void;
}

const ControlPanel: React.FC<Props> = ({ isNight, setIsNight }) => {
  const [isOpen, setIsOpen] = useState(false);

  const triggerFeed = () => {
    window.dispatchEvent(new Event('aquarium:feed'));
  };

  const triggerCat = () => {
    window.dispatchEvent(new Event('aquarium:cat'));
  };

  return (
    <>
      <button className="panel-trigger" onClick={() => setIsOpen(true)}>
        <Settings size={24} />
      </button>

      <div className={`control-panel ${isOpen ? 'open' : ''}`}>
        <div className="panel-header">
            <h2>Room Controls</h2>
            <button className="close-btn" onClick={() => setIsOpen(false)}><X size={20}/></button>
        </div>

        <div className="panel-section">
            <h3><FishIcon size={16}/> Fish & Food</h3>
            <div className="button-grid">
               <button onClick={() => window.dispatchEvent(new CustomEvent('aquarium:add_fish', {detail: {type: 'Clownfish'}}))}>Clownfish</button>
               <button onClick={() => window.dispatchEvent(new CustomEvent('aquarium:add_fish', {detail: {type: 'Betta'}}))}>Betta</button>
               <button onClick={() => window.dispatchEvent(new CustomEvent('aquarium:add_fish', {detail: {type: 'Goldfish'}}))}>Goldfish</button>
               <button onClick={() => window.dispatchEvent(new CustomEvent('aquarium:add_fish', {detail: {type: 'Angelfish'}}))}>Angelfish</button>
               <button onClick={() => window.dispatchEvent(new CustomEvent('aquarium:add_fish', {detail: {type: 'Discus'}}))}>Discus</button>
               <button onClick={() => window.dispatchEvent(new CustomEvent('aquarium:add_fish', {detail: {type: 'Neon'}}))}>Neon Tetra</button>
               <button onClick={() => window.dispatchEvent(new CustomEvent('aquarium:add_fish', {detail: {type: 'Corydoras'}}))}>Corydoras</button>
               <button onClick={() => window.dispatchEvent(new CustomEvent('aquarium:add_fish', {detail: {type: 'Jellyfish'}}))}>Jellyfish</button>
               <button onClick={() => window.dispatchEvent(new CustomEvent('aquarium:add_fish', {detail: {type: 'Pufferfish'}}))}>Pufferfish</button>
            </div>
            <button className="big-btn feed-btn" onClick={triggerFeed}>
                <Droplets size={16}/> Feed Fish
            </button>
        </div>

        <div className="panel-section">
            <h3><Cat size={16}/> Munchkin Cat</h3>
            <p className="description">The cat lives here and sometimes gets curious.</p>
            <button className="big-btn cat-btn" onClick={triggerCat}>
                Summon Cat Now
            </button>
            <div className="slider-group">
                <label>Visit Interval</label>
                <input type="range" min="30" max="1800" defaultValue="120" />
            </div>
        </div>

        <div className="panel-section">
            <h3><Sun size={16}/> Ambience</h3>
            <button className="big-btn theme-btn" onClick={() => setIsNight(!isNight)}>
                {isNight ? <Sun size={16} /> : <Moon size={16} />} 
                {isNight ? " Set to Day" : " Set to Night"}
            </button>
            <div className="slider-group mt-15">
                <label><Volume2 size={14}/> Background Ambience</label>
                <input type="range" min="0" max="100" defaultValue="50" onChange={(e) => window.dispatchEvent(new CustomEvent('audio:ambience', {detail: {vol: e.target.value}}))} />
            </div>
        </div>
      </div>
    </>
  );
};

export default ControlPanel;
