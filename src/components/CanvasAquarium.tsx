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

    const handleFeed = () => {
      newEngine.dropFood();
    };



    const handleVolume = ((e: CustomEvent) => {
        import('../game/Audio').then(({audio}) => {
            audio.init();
            audio.setAmbienceVolume(e.detail.vol);
        });
    }) as EventListener;
    
    window.addEventListener('aquarium:feed', handleFeed);
    // window.addEventListener('aquarium:cat', handleCat); // The Cat is handled by DOM
    window.addEventListener('audio:ambience', handleVolume);

    return () => {
      newEngine.stop();
      window.removeEventListener('aquarium:feed', handleFeed);
      window.removeEventListener('audio:ambience', handleVolume);
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
