import React, { useRef, useEffect, useState } from 'react';
import { Engine } from '../game/Engine';
import './CanvasAquarium.css';

const CanvasAquarium: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [engine, setEngine] = useState<Engine | null>(null);
  const [showLegendary, setShowLegendary] = useState(false);
  const [jellyfishGlow, setJellyfishGlow] = useState(false);
  const [discusConfetti, setDiscusConfetti] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Initialize the Canvas Render Engine
    const newEngine = new Engine(canvasRef.current, containerRef.current);
    newEngine.start();
    setEngine(newEngine);

    // Restore state
    const savedTankStr = localStorage.getItem('toca_current_tank');
    if (savedTankStr) {
        const savedTank = JSON.parse(savedTankStr);
        if (savedTank.fishes && Array.isArray(savedTank.fishes)) {
            import('../game/Fish').then(({ Fish }) => {
                savedTank.fishes.forEach((type: string) => {
                    newEngine.fishes.push(new Fish(Math.random() * newEngine.width, Math.random() * newEngine.height, newEngine.fishes.length, type));
                });
            });
        }
    }

    const saveState = async () => {
        const types = newEngine.fishes.map(f => f.type);
        const theme = localStorage.getItem('toca_theme') || 'Ocean';
        
        const { supabase } = await import('../lib/supabase');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
            const { saveTankState } = await import('../lib/db');
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            await saveTankState(session.user.id, timezone, {
                fish_list: types,
                theme: theme
            });
        }
    };

    const handleFeed = () => {
      newEngine.dropFood();
    };

    const handleFishAdded = () => {
        setTimeout(saveState, 100);
    };

    const handleVolume = ((e: CustomEvent) => {
        import('../game/Audio').then(({audio}) => {
            audio.init();
            audio.setAmbienceVolume(e.detail.vol);
        });
    }) as EventListener;

    const handleSoundTheme = ((e: CustomEvent) => {
        import('../game/Audio').then(({audio}) => {
            audio.init();
            audio.setTheme(e.detail.sound);
        });
    }) as EventListener;

    const handleLegendary = () => {
        setShowLegendary(true);
        setTimeout(() => setShowLegendary(false), 3000);
        const tankStr = localStorage.getItem('toca_current_tank');
        if (tankStr) {
            const tank = JSON.parse(tankStr);
            tank.isGolden = true;
            localStorage.setItem('toca_current_tank', JSON.stringify(tank));
        }
    };
    
    const handleJellyfish = () => {
        setJellyfishGlow(true);
        setTimeout(() => setJellyfishGlow(false), 4000);
    };

    const handleDiscus = () => {
        setDiscusConfetti(true);
        setTimeout(() => setDiscusConfetti(false), 3000);
    };
    
    window.addEventListener('aquarium:feed', handleFeed);
    window.addEventListener('audio:ambience', handleVolume);
    window.addEventListener('aquarium:sound_theme_change', handleSoundTheme);
    window.addEventListener('aquarium:add_fish', handleFishAdded);
    window.addEventListener('aquarium:add_timer_fish', handleFishAdded);
    window.addEventListener('aquarium:legendary_reward', handleLegendary);
    window.addEventListener('aquarium:jellyfish_reward', handleJellyfish);
    window.addEventListener('aquarium:discus_reward', handleDiscus);

    const saveInterval = setInterval(saveState, 2 * 60 * 1000);
    const handleBeforeUnload = () => {
        saveState();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      newEngine.stop();
      clearInterval(saveInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('aquarium:feed', handleFeed);
      window.removeEventListener('audio:ambience', handleVolume);
      window.removeEventListener('aquarium:sound_theme_change', handleSoundTheme);
      window.removeEventListener('aquarium:add_fish', handleFishAdded);
      window.removeEventListener('aquarium:add_timer_fish', handleFishAdded);
      window.removeEventListener('aquarium:legendary_reward', handleLegendary);
      window.removeEventListener('aquarium:jellyfish_reward', handleJellyfish);
      window.removeEventListener('aquarium:discus_reward', handleDiscus);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!engine || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    engine.updateCursor(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handlePointerLeave = () => {
    if (engine) {
      engine.updateCursor(-1000, -1000); // Move cursor far away
    }
  };

  return (
    <div className={`canvas-wrapper ${jellyfishGlow ? 'jellyfish-glow' : ''}`} ref={containerRef}>
      <canvas 
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="aquarium-canvas"
      />
      {showLegendary && (
          <div className="legendary-badge">
              <div className="badge-content">
                  <h2>🌟 LEGENDARY 🌟</h2>
                  <p>2 Hours Focused!</p>
              </div>
          </div>
      )}
      {discusConfetti && (
          <div className="confetti-container">
             {[...Array(60)].map((_, i) => (
                 <div key={i} className="confetti-piece" style={{ 
                     left: `${Math.random() * 100}%`, 
                     animationDelay: `${Math.random() * 0.5}s`,
                     backgroundColor: ['#ff6b6b', '#55c8c5', '#feca57', '#b19cd9'][Math.floor(Math.random() * 4)]
                 }} />
             ))}
          </div>
      )}
    </div>
  );
};

export default CanvasAquarium;
