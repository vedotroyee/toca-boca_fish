import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const fishes = [
  { id: 1, name: 'Clownfish', trait: 'Bouncy and energetic', top: '20%', speed: '15s', color: '#ff7f50', dir: 1 },
  { id: 2, name: 'Betta Fish', trait: 'Regal and unbothered', top: '40%', speed: '25s', color: '#ff69b4', dir: -1 },
  { id: 3, name: 'Moon Jelly', trait: 'Drifting gracefully', top: '60%', speed: '35s', color: '#e0ffff', dir: 1 },
  { id: 4, name: 'Angelfish', trait: 'Elegant and slow', top: '80%', speed: '30s', color: '#ffeb3b', dir: -1 },
];

export default function FishGallerySection() {
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [hoveredFish, setHoveredFish] = useState<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || !headingRef.current) return;

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      pin: headingRef.current,
    });
  }, []);

  return (
    <section ref={containerRef} style={{
      backgroundColor: '#0d3d4a',
      minHeight: '150vh',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background gradients and bubbles */}
      {/* Background gradients removed to let the global continuous gradient shine through */}

      {/* Light rays */}
      <div className="light-rays" />

      <h2 ref={headingRef} style={{
        position: 'absolute',
        top: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#fdf6ec',
        fontSize: '4rem',
        zIndex: 10,
        textAlign: 'center',
        margin: 0
      }}>
        8 species.<br/>
        <span style={{ fontSize: '2.5rem', opacity: 0.8, fontWeight: 400 }}>Infinite chill.</span>
      </h2>

      <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '150vh', zIndex: 5 }}>
        {fishes.map((fish) => (
          <div 
            key={fish.id}
            className={`gallery-fish ${hoveredFish === fish.id ? 'paused' : ''}`}
            onMouseEnter={() => setHoveredFish(fish.id)}
            onMouseLeave={() => setHoveredFish(null)}
            style={{
              position: 'absolute',
              top: fish.top,
              left: fish.dir === 1 ? '-200px' : '100%',
              animation: `swimHorizontal${fish.dir === 1 ? 'Right' : 'Left'} ${fish.speed} infinite linear`,
              animationPlayState: hoveredFish === fish.id ? 'paused' : 'running',
              cursor: 'none'
            }}
          >
            {/* Hover Card */}
            <div style={{
              position: 'absolute',
              top: '-80px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#fdf6ec',
              padding: '10px 20px',
              borderRadius: '15px',
              opacity: hoveredFish === fish.id ? 1 : 0,
              visibility: hoveredFish === fish.id ? 'visible' : 'hidden',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
              boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
            }}>
              <strong style={{ color: '#0d3d4a', display: 'block' }}>{fish.name}</strong>
              <span style={{ color: '#555', fontSize: '0.9rem' }}>"{fish.trait}"</span>
            </div>

            {/* Fish SVG Placeholder */}
            <svg width="100" height="60" viewBox="0 0 100 60" style={{ transform: fish.dir === -1 ? 'scaleX(-1)' : 'none' }}>
              <path className="fish-wiggle" d="M80,30 Q40,0 10,30 Q40,60 80,30 Z" fill={fish.color} />
              <path className="tail-flap" d="M80,30 L100,15 L95,30 L100,45 Z" fill={fish.color} />
            </svg>
          </div>
        ))}
      </div>

      {/* Wave divider for next section */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path fill="#fef3e2" fillOpacity="1" d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"></path>
        </svg>
      </div>
    </section>
  );
}
