import React, { useRef, useEffect, useState } from 'react';
import { Engine } from '../game/Engine';
import './CanvasAquarium.css';

const CanvasAquarium: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [engine, setEngine] = useState<Engine | null>(null);

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
    
    window.addEventListener('aquarium:feed', handleFeed);
    window.addEventListener('audio:ambience', handleVolume);
    window.addEventListener('aquarium:sound_theme_change', handleSoundTheme);
    window.addEventListener('aquarium:add_fish', handleFishAdded);
    window.addEventListener('aquarium:add_timer_fish', handleFishAdded);

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
    <div className="canvas-wrapper" ref={containerRef}>
      <canvas 
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="aquarium-canvas"
      />
    </div>
  );
};

export default CanvasAquarium;
