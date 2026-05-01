import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ProductivitySection() {
  const containerRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(leftRef.current,
      { x: -100, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
        }
      }
    );

    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      
      const xStart = index % 2 === 0 ? 100 : -100;

      gsap.fromTo(card,
        { x: xStart, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.8,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
          }
        }
      );
    });
  }, []);

  return (
    <section ref={containerRef} style={{ backgroundColor: '#fef3e2', padding: '150px 20px', position: 'relative', overflow: 'hidden' }}>
      <h2 style={{ textAlign: 'center', fontSize: '3.5rem', color: '#1a4a4a', marginBottom: '80px' }}>
        Who said productivity <br/>
        <span className="handwritten" style={{ color: '#ff7f50', fontSize: '4.5rem', transform: 'rotate(-5deg)', display: 'inline-block' }}>can't be adorable?</span>
      </h2>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '60px',
        maxWidth: '1200px',
        margin: '0 auto',
        alignItems: 'center'
      }}>
        {/* Left Side: Mockup */}
        <div ref={leftRef} style={{ flex: '1 1 400px' }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '40px',
            padding: '40px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
            border: '8px solid #333'
          }}>
            <h3 style={{ fontSize: '2rem', color: '#333', marginBottom: '20px' }}>Focus Timer</h3>
            <div style={{
              fontSize: '4rem',
              fontWeight: 800,
              color: '#ff7f50',
              textAlign: 'center',
              marginBottom: '20px',
              fontFamily: 'monospace'
            }}>
              47:00
            </div>
            <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#888' }}>
              47 minutes focused.<br/>
              <strong style={{ color: '#20b2aa' }}>1 fish earned.</strong>
            </p>
          </div>
          
          {/* Peeking Cat */}
          <div style={{ position: 'absolute', bottom: '0', left: '10%' }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <path d="M20,100 Q50,20 80,100 Z" fill="#d2b48c" />
              <circle cx="40" cy="65" r="5" fill="#333" />
              <circle cx="60" cy="65" r="5" fill="#333" />
              <path d="M48,75 L50,80 L52,75" stroke="#333" fill="none" />
            </svg>
          </div>
        </div>

        {/* Right Side: Stats Cards */}
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[
            { id: 1, title: 'Focus interval: your rules', icon: '⏱️' },
            { id: 2, title: 'Tank fills as you work', icon: '🐠' },
            { id: 3, title: 'Streak keeps you coming back', icon: '🔥' },
          ].map((stat, i) => (
            <div 
              key={stat.id}
              ref={(el) => { if (el) cardsRef.current[i] = el; }}
              style={{
                backgroundColor: '#fff5e6',
                border: '2px solid rgba(255,127,80,0.2)',
                borderRadius: '20px',
                padding: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                boxShadow: '0 10px 20px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ fontSize: '2.5rem' }}>{stat.icon}</div>
              <h4 style={{ fontSize: '1.5rem', color: '#333' }}>{stat.title}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* Wave divider for next section */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path fill="#3d1f2e" fillOpacity="1" d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"></path>
        </svg>
      </div>
    </section>
  );
}
