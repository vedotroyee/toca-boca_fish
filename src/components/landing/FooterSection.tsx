import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export default function FooterSection() {
  const containerRef = useRef<HTMLElement>(null);
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !catRef.current) return;

    // Peeking cat on reaching very bottom
    gsap.to(catRef.current, {
      y: 0,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'bottom bottom', // When bottom of container hits bottom of viewport
        toggleActions: 'play reverse play reverse'
      }
    });

  }, []);

  return (
    <section ref={containerRef} style={{ backgroundColor: '#1a4a4a', padding: '150px 20px 50px', position: 'relative', overflow: 'hidden' }}>
      
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ fontSize: '4rem', color: '#fdf6ec', marginBottom: '30px' }}>
          Your aquarium is waiting.
        </h2>
        <p style={{ fontSize: '1.2rem', color: '#e0f4f3', opacity: 0.8, marginBottom: '50px' }}>
          The fish are already swimming. Focus in loops. The cat keeps score. All you have to do is open the tab.
        </p>

        <Link to="/app" className="landing-btn primary" style={{ position: 'relative', overflow: 'hidden', padding: '20px 40px', fontSize: '1.3rem' }}>
          Open the aquarium
          {/* Fish that swims across on hover via CSS */}
          <div className="btn-hover-fish" style={{ position: 'absolute', top: '50%', left: '-50px', transform: 'translateY(-50%)' }}>
             <svg width="30" height="20" viewBox="0 0 100 60">
               <path d="M80,30 Q40,0 10,30 Q40,60 80,30 Z" fill="#fff" opacity="0.8" />
               <path d="M80,30 L100,15 L95,30 L100,45 Z" fill="#fff" opacity="0.8" />
             </svg>
          </div>
        </Link>
      </div>

      {/* Mini Aquarium Loop */}
      <div style={{
         width: '200px', height: '120px', backgroundColor: '#0d3d4a', borderRadius: '15px',
         margin: '80px auto 100px', position: 'relative', overflow: 'hidden',
         border: '4px solid #4a7a7a'
      }}>
         <div style={{ position: 'absolute', bottom: 10, left: 20, width: 20, height: 40, backgroundColor: '#1b5e20', borderRadius: '10px 10px 0 0', opacity: 0.7 }} />
         <div style={{ position: 'absolute', bottom: 10, right: 30, width: 15, height: 30, backgroundColor: '#2e7d32', borderRadius: '10px 10px 0 0', opacity: 0.7 }} />
         
         {/* Tiny Fish */}
         <div style={{ position: 'absolute', top: '40%', left: '0', animation: 'swimHorizontalRight 8s infinite linear' }}>
            <svg width="20" height="15" viewBox="0 0 100 60">
               <path className="fish-wiggle" d="M80,30 Q40,0 10,30 Q40,60 80,30 Z" fill="#ff7f50" />
               <path className="tail-flap" d="M80,30 L100,15 L95,30 L100,45 Z" fill="#ff7f50" />
            </svg>
         </div>

         {/* Bubbles */}
         <div className="bubble" style={{ left: '20px', width: '5px', height: '5px', animationDuration: '4s' }} />
         <div className="bubble" style={{ left: '150px', width: '8px', height: '8px', animationDuration: '6s', animationDelay: '1s' }} />
      </div>

      {/* Footer Links */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '50px' }}>
        <a href="#" style={{ color: '#fdf6ec', opacity: 0.6, textDecoration: 'none', fontSize: '0.9rem' }}>GitHub</a>
        <a href="#" style={{ color: '#fdf6ec', opacity: 0.6, textDecoration: 'none', fontSize: '0.9rem' }}>About</a>
        <span style={{ color: '#fdf6ec', opacity: 0.4, cursor: 'none' }}>🐾</span>
      </div>

      {/* Peeking Cat */}
      <div ref={catRef} style={{
         position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%) translateY(100px)',
         zIndex: 10
      }}>
         <svg width="120" height="80" viewBox="0 0 120 100">
            <path d="M20,100 Q60,30 100,100 Z" fill="#d2b48c" />
            {/* Ears */}
            <path d="M35,60 L30,30 L50,55" fill="#d2b48c" />
            <path d="M85,60 L90,30 L70,55" fill="#d2b48c" />
            {/* Eyes */}
            <circle cx="45" cy="70" r="6" fill="#3d1f2e" />
            <circle cx="75" cy="70" r="6" fill="#3d1f2e" />
            {/* Nose */}
            <path d="M58,80 L62,80 L60,83 Z" fill="#ffb6c1" />
         </svg>
      </div>

    </section>
  );
}
