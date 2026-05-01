import React, { useState, useEffect } from 'react';
import { Settings, X, Fish as FishIcon, Droplets, Volume2, Sun, Moon, Cat, Timer, Play, Pause, RotateCcw, Globe } from 'lucide-react';
import LocationPicker from './LocationPicker';
import './ControlPanel.css';

interface Props {
  isNight: boolean;
  setIsNight: (b: boolean) => void;
}

const ControlPanel: React.FC<Props> = ({ isNight, setIsNight }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);

  // Timer State
  const [timerRunning, setTimerRunning] = useState(false);
  const [intervalMins, setIntervalMins] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [totalLoops, setTotalLoops] = useState(4);
  const [completedIntervals, setCompletedIntervals] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [breakLength, setBreakLength] = useState(5);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Session Stats
  const [focusTime, setFocusTime] = useState(0); 
  const [fishEarned, setFishEarned] = useState(0);
  const [streak, setStreak] = useState(0);
  const [earnedFishes, setEarnedFishes] = useState<string[]>([]);

  // Tiers
  const TIERS = [5, 10, 15, 25, 30, 45, 60, 90, 120];
  const FISH_REWARDS: Record<number, {name: string, type: string, count: number}> = {
    5: {name: 'Guppy', type: 'Guppy', count: 1},
    10: {name: 'Neon Tetra', type: 'Neon', count: 3},
    15: {name: 'Clownfish', type: 'Clownfish', count: 1},
    25: {name: 'Betta Fish', type: 'Betta', count: 1},
    30: {name: 'Goldfish', type: 'Goldfish', count: 1},
    45: {name: 'Angelfish', type: 'Angelfish', count: 1},
    60: {name: 'Discus Fish', type: 'Discus', count: 1},
    90: {name: 'Jellyfish', type: 'Jellyfish', count: 1},
    120: {name: 'Giant Oarfish', type: 'Oarfish', count: 1},
  };

  // Customization
  const [tankTheme, setTankTheme] = useState(localStorage.getItem('toca_theme') || 'Ocean');
  const [catBreed, setCatBreed] = useState(localStorage.getItem('toca_cat_breed') || 'Munchkin');
  const [soundTheme, setSoundTheme] = useState(localStorage.getItem('toca_sound_theme') || 'Underwater');



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
     setEarnedFishes(JSON.parse(localStorage.getItem('toca_earned_fishes') || '[]'));
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
         if (!isBreak) {
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

             const reward = FISH_REWARDS[intervalMins] || FISH_REWARDS[25];
             for (let i = 0; i < reward.count; i++) {
                 setTimeout(() => window.dispatchEvent(new CustomEvent('aquarium:add_timer_fish', {detail: {type: reward.type}})), i * 500);
             }
             
             if (!earnedFishes.includes(reward.type)) {
                 const newEarned = [...earnedFishes, reward.type];
                 setEarnedFishes(newEarned);
                 localStorage.setItem('toca_earned_fishes', JSON.stringify(newEarned));
             }

             if (intervalMins >= 120) {
                 window.dispatchEvent(new Event('aquarium:legendary_reward'));
             } else if (intervalMins >= 90) {
                 window.dispatchEvent(new Event('aquarium:jellyfish_reward'));
             } else if (intervalMins >= 60) {
                 window.dispatchEvent(new Event('aquarium:discus_reward'));
             }
             
             if (completedIntervals + 1 < totalLoops) {
                 setCompletedIntervals(c => c + 1);
                 setTimeLeft(intervalMins * 60);
             } else {
                 // Full Loop Complete
                 setCompletedIntervals(totalLoops);
                 setIsBreak(true);
                 setTimeLeft(breakLength * 60);
                 
                 // Increment total loops completed
                 const totalLoopsCompleted = parseInt(localStorage.getItem('toca_total_loops') || '0') + 1;
                 localStorage.setItem('toca_total_loops', totalLoopsCompleted.toString());
                 
                 // Trigger events
                 window.dispatchEvent(new Event('aquarium:loop_complete'));
                 setToastMessage("Loop complete! Time for a break 🐾");
                 setTimeout(() => setToastMessage(null), 5000);
             }
         } else {
             // Break is over
             setIsBreak(false);
             setCompletedIntervals(0);
             setTimeLeft(intervalMins * 60);
             window.dispatchEvent(new Event('aquarium:break_end'));
         }
     }

     return () => clearInterval(interval);
  }, [timerRunning, timeLeft, intervalMins, fishEarned, streak, completedIntervals, totalLoops, isBreak, breakLength]);

  const toggleTimer = () => setTimerRunning(!timerRunning);
  const resetTimer = () => {
      setTimerRunning(false);
      setIsBreak(false);
      setTimeLeft(intervalMins * 60);
      setCompletedIntervals(0);
      window.dispatchEvent(new Event('aquarium:break_end'));
  };
  const skipBreak = () => {
      setIsBreak(false);
      setCompletedIntervals(0);
      setTimeLeft(intervalMins * 60);
      window.dispatchEvent(new Event('aquarium:break_end'));
  };
  const handleIntervalChange = (val: number) => {
      setIntervalMins(val);
      if (!timerRunning && !isBreak) setTimeLeft(val * 60);
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

  const handleThemeChange = (theme: string) => {
      setTankTheme(theme);
      localStorage.setItem('toca_theme', theme);
      window.dispatchEvent(new CustomEvent('aquarium:theme_change', {detail: { theme }}));
  };

  const handleCatBreedChange = (breed: string) => {
      setCatBreed(breed);
      localStorage.setItem('toca_cat_breed', breed);
      window.dispatchEvent(new CustomEvent('aquarium:cat_breed_change', {detail: { breed }}));
  };

  const handleSoundThemeChange = (sound: string) => {
      setSoundTheme(sound);
      localStorage.setItem('toca_sound_theme', sound);
      window.dispatchEvent(new CustomEvent('aquarium:sound_theme_change', {detail: { sound }}));
  };

  return (
    <>
      <div className="panel-triggers">
        <button className="panel-trigger" onClick={() => setIsLocationPickerOpen(true)} title="Teleport to a new location">
          <Globe size={24} />
        </button>
        <button className="panel-trigger" onClick={() => setIsOpen(true)}>
          <Settings size={24} />
        </button>
      </div>

      <LocationPicker isOpen={isLocationPickerOpen} onClose={() => setIsLocationPickerOpen(false)} />

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
               <button onClick={() => window.dispatchEvent(new CustomEvent('aquarium:add_fish', {detail: {type: 'Guppy'}}))}>Guppy</button>
               <button onClick={() => window.dispatchEvent(new CustomEvent('aquarium:add_fish', {detail: {type: 'Oarfish'}}))}>Oarfish</button>
            </div>
            <button className="big-btn feed-btn" onClick={triggerFeed}>
                <Droplets size={16}/> Feed Fish
            </button>
        </div>

        <div className="panel-section timer-section">
            <h3><Timer size={16}/> Focus Timer</h3>
            <p className="description">{isBreak ? "Break time! Relax." : "Work and earn fish! Next fish in:"}</p>
            
            <div className="timer-display">
               <div className="countdown">{formatTime(timeLeft)}</div>
               <div className="progress-bar">
                   <div className={`progress-fill ${isBreak ? 'break-fill' : ''}`} style={{ width: `${100 - (timeLeft / ((isBreak ? breakLength : intervalMins) * 60) * 100)}%`}}></div>
               </div>
               
               <div className="loop-progress">
                   {[...Array(totalLoops)].map((_, i) => (
                       <div key={i} className={`loop-dot ${i < completedIntervals ? 'filled' : ''}`}></div>
                   ))}
               </div>
            </div>

            <div className="timer-controls">
                <button className={`timer-btn ${timerRunning ? 'pause-btn' : 'play-btn'}`} onClick={toggleTimer}>
                    {timerRunning ? <Pause size={18}/> : <Play size={18}/>}
                </button>
                <button className="timer-btn reset-btn" onClick={resetTimer}>
                    <RotateCcw size={16}/>
                </button>
                {isBreak && (
                    <button className="timer-btn skip-btn" onClick={skipBreak}>
                        Skip
                    </button>
                )}
            </div>

            <div className="slider-group mt-15">
                <label>Work Interval: {intervalMins} min</label>
                <input type="range" min="0" max={TIERS.length - 1} step="1" value={TIERS.indexOf(intervalMins) === -1 ? 3 : TIERS.indexOf(intervalMins)} onChange={(e) => handleIntervalChange(TIERS[parseInt(e.target.value)])} />
            </div>

            <div className="fish-legend mt-15">
                <h4>Reward Tiers</h4>
                <div className="tier-grid">
                    {TIERS.map(t => {
                        const r = FISH_REWARDS[t];
                        const isUnlocked = earnedFishes.includes(r.type);
                        return (
                            <div key={t} className={`tier-item ${isUnlocked ? 'unlocked' : 'locked'}`}>
                                <div className="tier-icon"><FishIcon size={16}/></div>
                                <div className="tier-info">
                                    <span className="tier-time">{t}m</span>
                                    <span className="tier-name">{r.name}</span>
                                </div>
                                {isUnlocked && <div className="tier-check">⭐</div>}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="slider-group mt-15">
                <label>Loop Count: {totalLoops}</label>
                <input type="range" min="2" max="6" step="1" value={totalLoops} onChange={(e) => { setTotalLoops(parseInt(e.target.value)); setCompletedIntervals(0); }} />
            </div>

            <div className="break-toggle-group mt-15">
                <label>Break Length:</label>
                <div className="toggle-buttons">
                    <button className={breakLength === 5 ? 'active' : ''} onClick={() => { setBreakLength(5); if(isBreak && !timerRunning) setTimeLeft(5*60); }}>5 min</button>
                    <button className={breakLength === 10 ? 'active' : ''} onClick={() => { setBreakLength(10); if(isBreak && !timerRunning) setTimeLeft(10*60); }}>10 min</button>
                </div>
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
            <h3><Sun size={16}/> Customization & Ambience</h3>

            <div className="slider-group mb-15">
                <label>Tank Theme</label>
                <select className="custom-select" value={tankTheme} onChange={(e) => handleThemeChange(e.target.value)}>
                    <option value="Ocean">Ocean</option>
                    <option value="Coral Reef">Coral Reef</option>
                    <option value="Arctic">Arctic</option>
                    <option value="Midnight">Midnight</option>
                    <option value="Sakura Pond">Sakura Pond</option>
                </select>
            </div>

            <div className="slider-group mb-15">
                <label>Cat Breed</label>
                <select className="custom-select" value={catBreed} onChange={(e) => handleCatBreedChange(e.target.value)}>
                    <option value="Munchkin">Munchkin (Cream Tabby)</option>
                    <option value="Scottish Fold">Scottish Fold (Grey)</option>
                    <option value="Orange Tabby">Orange Tabby (Chaotic)</option>
                    <option value="Tuxedo">Tuxedo (Formal)</option>
                    <option value="Siamese">Siamese (Dramatic)</option>
                </select>
            </div>

            <div className="slider-group mb-15">
                <label>Sound Theme</label>
                <select className="custom-select" value={soundTheme} onChange={(e) => handleSoundThemeChange(e.target.value)}>
                    <option value="Underwater">Underwater</option>
                    <option value="Rainy Day">Rainy Day</option>
                    <option value="Lo-fi Cafe">Lo-fi Cafe</option>
                    <option value="Forest Stream">Forest Stream</option>
                    <option value="Deep Ocean">Deep Ocean</option>
                </select>
            </div>

            <button className="big-btn theme-btn mt-15" onClick={() => setIsNight(!isNight)}>
                {isNight ? <Sun size={16} /> : <Moon size={16} />} 
                {isNight ? " Set to Day" : " Set to Night"}
            </button>
            <div className="slider-group mt-15">
                <label><Volume2 size={14}/> Background Ambience</label>
                <input type="range" min="0" max="100" defaultValue="50" onChange={(e) => window.dispatchEvent(new CustomEvent('audio:ambience', {detail: {vol: e.target.value}}))} />
            </div>
        </div>
      </div>

      {toastMessage && (
          <div className="toast-notification">
              {toastMessage}
          </div>
      )}
    </>
  );
};

export default ControlPanel;
