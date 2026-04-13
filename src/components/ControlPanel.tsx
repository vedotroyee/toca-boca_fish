import React, { useState, useEffect } from 'react';
import { Settings, X, Fish as FishIcon, Droplets, Volume2, Sun, Moon, Cat, Timer, Play, Pause, RotateCcw } from 'lucide-react';
import './ControlPanel.css';

interface Props {
  isNight: boolean;
  setIsNight: (b: boolean) => void;
}

const ControlPanel: React.FC<Props> = ({ isNight, setIsNight }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Timer State
  const [timerRunning, setTimerRunning] = useState(false);
  const [intervalMins, setIntervalMins] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [totalLoops, setTotalLoops] = useState(1);
  const [currentLoop, setCurrentLoop] = useState(1);

  // Session Stats
  const [focusTime, setFocusTime] = useState(0); 
  const [fishEarned, setFishEarned] = useState(0);
  const [streak, setStreak] = useState(0);

  const randomTimerFish = () => {
     const types = ['Clownfish', 'Betta', 'Goldfish', 'Angelfish', 'Discus', 'Neon', 'Corydoras'];
     return types[Math.floor(Math.random() * types.length)];
  };

  useEffect(() => {
     const today = new Date().toDateString();
     const storedDate = localStorage.getItem('toca_last_session_date');
     let currentStreak = parseInt(localStorage.getItem('toca_streak') || '0');
     
     if (storedDate !== today) {
         if (storedDate === new Date(Date.now() - 86400000).toDateString()) {
             // Streak continues
         } else if (storedDate) {
             currentStreak = 0; // Streak broken
         }
     }
     
     setStreak(currentStreak);
     setFocusTime(parseInt(localStorage.getItem('toca_focus_today') || '0'));
     setFishEarned(parseInt(localStorage.getItem('toca_fish_today') || '0'));
  }, []);

  useEffect(() => {
     let interval: any;
     if (timerRunning && timeLeft > 0) {
         interval = setInterval(() => {
             setTimeLeft(t => t - 1);
             setFocusTime(f => {
                const newF = f + 1;
                if (newF % 10 === 0) localStorage.setItem('toca_focus_today', newF.toString()); // optimize saving
                return newF;
             });
         }, 1000);
     } else if (timerRunning && timeLeft <= 0) {
         const newEarned = fishEarned + 1;
         setFishEarned(newEarned);
         localStorage.setItem('toca_fish_today', newEarned.toString());
         
         const todayDate = new Date().toDateString();
         if (localStorage.getItem('toca_last_session_date') !== todayDate) {
             const newStreak = streak + 1;
             setStreak(newStreak);
             localStorage.setItem('toca_streak', newStreak.toString());
             localStorage.setItem('toca_last_session_date', todayDate);
         }

         window.dispatchEvent(new CustomEvent('aquarium:add_timer_fish', {detail: {type: randomTimerFish()}}));
         
         if (currentLoop < totalLoops) {
             setCurrentLoop(c => c + 1);
             setTimeLeft(intervalMins * 60);
         } else {
             setTimerRunning(false);
             setTimeLeft(intervalMins * 60);
             setCurrentLoop(1);
         }
     }

     return () => clearInterval(interval);
  }, [timerRunning, timeLeft, intervalMins, fishEarned, streak, currentLoop, totalLoops]);

  const toggleTimer = () => setTimerRunning(!timerRunning);
  const resetTimer = () => {
      setTimerRunning(false);
      setTimeLeft(intervalMins * 60);
      setCurrentLoop(1);
  };
  const handleIntervalChange = (val: number) => {
      setIntervalMins(val);
      if (!timerRunning) setTimeLeft(val * 60);
  };

  const formatTime = (secs: number) => {
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatHrs = (secs: number) => {
      const h = Math.floor(secs / 3600);
      const m = Math.floor((secs % 3600) / 60);
      if (h > 0) return `${h}h ${m}m`;
      return `${m}m`;
  };

  const triggerFeed = () => {
    window.dispatchEvent(new Event('aquarium:feed'));
  };

  const triggerCat = () => {
    // Initialize audio system early so the meow MP3 can download before the tap
    import('../game/Audio').then(({audio}) => audio.init());
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

        <div className="panel-section timer-section">
            <h3><Timer size={16}/> Focus Timer</h3>
            <p className="description">Work and earn fish! Next fish in:</p>
            
            <div className="timer-display">
               <div className="countdown">{formatTime(timeLeft)}</div>
               <div className="progress-bar">
                   <div className="progress-fill" style={{ width: `${100 - (timeLeft / (intervalMins * 60) * 100)}%`}}></div>
               </div>
               {totalLoops > 1 && (
                   <div className="description mt-15" style={{ marginBottom: 0, marginTop: '8px', fontWeight: 'bold' }}>Session {currentLoop} of {totalLoops}</div>
               )}
            </div>

            <div className="timer-controls">
                <button className={`timer-btn ${timerRunning ? 'pause-btn' : 'play-btn'}`} onClick={toggleTimer}>
                    {timerRunning ? <Pause size={18}/> : <Play size={18}/>}
                </button>
                <button className="timer-btn reset-btn" onClick={resetTimer}>
                    <RotateCcw size={16}/>
                </button>
            </div>

            <div className="slider-group mt-15">
                <label>Fish Interval: {intervalMins} min</label>
                <input type="range" min="5" max="120" step="5" value={intervalMins} onChange={(e) => handleIntervalChange(parseInt(e.target.value))} />
            </div>

            <div className="slider-group mt-15">
                <label>Loop Sequence: {totalLoops} session{totalLoops > 1 ? 's' : ''}</label>
                <input type="range" min="1" max="10" step="1" value={totalLoops} onChange={(e) => { setTotalLoops(parseInt(e.target.value)); setCurrentLoop(1); }} />
            </div>

            <div className="session-stats mt-15">
                <div className="stat-row"><span>Today's Focus:</span> <strong>{formatHrs(focusTime)}</strong></div>
                <div className="stat-row"><span>Fish Earned:</span> <strong>{fishEarned}</strong></div>
                <div className="stat-row"><span>Current Streak:</span> <strong>{streak} days 🔥</strong></div>
                {fishEarned > 0 && (
                    <div className="trophy-shelf mt-15">
                        {[...Array(Math.min(fishEarned, 15))].map((_, i) => <FishIcon key={i} size={14} className="earned-fish-icon"/>)}
                        {fishEarned > 15 && <span className="plus-more">+{fishEarned - 15}</span>}
                    </div>
                )}
            </div>
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
