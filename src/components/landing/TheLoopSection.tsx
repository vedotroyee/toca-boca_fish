import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TheLoopSection() {
  const containerRef = useRef<HTMLElement>(null);
  const ringsRef = useRef<(HTMLDivElement | null)[]>([]);
  const catWalkRef = useRef<HTMLDivElement>(null);
  const speechBubbleRef = useRef<HTMLDivElement>(null);
  const featurePillsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current || !catWalkRef.current || !speechBubbleRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 50%',
        toggleActions: 'play none none reverse'
      }
    });

    // Fill the rings sequentially
    ringsRef.current.forEach((ring, index) => {
      if (ring) {
        tl.fromTo(ring, 
          { '--progress': '0deg', scale: 0.8, opacity: 0 },
          { '--progress': '360deg', scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' }
        );
      }
    });

    // Cat walks across
    tl.fromTo(catWalkRef.current,
      { x: '-20%', opacity: 0 },
      { x: '80%', opacity: 1, duration: 1.5, ease: 'power1.inOut' }
    );

    // Cat taps aquarium and speech bubble appears
    tl.fromTo(speechBubbleRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' }
    );

    // Feature pills pop in
    tl.fromTo(featurePillsRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.15, ease: 'power2.out' },
      "-=0.5"
    );

  }, []);

  return (
    <section ref={containerRef} style={{ backgroundColor: '#fff4e6', padding: '120px 20px', position: 'relative', overflow: 'hidden' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{ fontSize: '3.5rem', color: '#d97757', marginBottom: '20px' }}>
          Work in loops. Break with cats.
        </h2>
        <p style={{ fontSize: '1.2rem', color: '#8a4b3d', opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>
          The Pomodoro technique, but better. Focus for a set time, earn fish, and let the cat tell you when it's time to step away.
        </p>
      </div>

      {/* The Animated Diagram */}
      <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto 80px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Progress Rings */}
        <div style={{ display: 'flex', gap: '40px', position: 'relative', zIndex: 2 }}>
          {[1, 2, 3, 4].map((num, i) => (
            <div key={num} style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
              <div 
                ref={el => ringsRef.current[i] = el}
                className="loop-ring"
                style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: `conic-gradient(#d97757 var(--progress), #fceadd 0deg)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 5px 15px rgba(217, 119, 87, 0.2)',
                  position: 'relative'
                }}
              >
                <div style={{ width: '64px', height: '64px', backgroundColor: '#fff4e6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97757', fontWeight: 'bold', fontSize: '1.5rem' }}>
                  {num}
                </div>
              </div>
              
              {/* Paw print trail between rings */}
              {i < 3 && (
                <div style={{ display: 'flex', gap: '10px', opacity: 0.5 }}>
                  <span style={{ color: '#d97757', fontSize: '1.2rem', transform: 'rotate(15deg)' }}>🐾</span>
                  <span style={{ color: '#d97757', fontSize: '1.2rem', transform: 'rotate(-15deg) translateY(-5px)' }}>🐾</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Aquarium Illustration (End Goal) */}
        <div style={{ position: 'absolute', right: '-40px', top: '50%', transform: 'translateY(-50%)', width: '100px', height: '80px', backgroundColor: '#a8dadc', borderRadius: '15px', border: '4px solid #4a7a7a', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
            <span style={{ fontSize: '2rem' }}>🐟</span>
        </div>

        {/* Walking Cat & Speech Bubble */}
        <div ref={catWalkRef} style={{ position: 'absolute', left: '0', top: '20px', zIndex: 3 }}>
          <div style={{ position: 'relative' }}>
            <span style={{ fontSize: '3rem', transform: 'scaleX(-1)', display: 'inline-block' }}>🐈</span>
            
            <div ref={speechBubbleRef} style={{
              position: 'absolute', top: '-40px', right: '-60px',
              backgroundColor: 'white', padding: '10px 15px', borderRadius: '20px',
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)', color: '#d97757', fontWeight: 'bold',
              whiteSpace: 'nowrap', fontSize: '0.9rem'
            }}>
              Break time!
              <div style={{ position: 'absolute', bottom: '-8px', left: '20px', width: '0', height: '0', borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '10px solid white' }}></div>
            </div>
          </div>
        </div>

      </div>

      {/* Feature Pills */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        {[
          { text: "Custom intervals", icon: "⏱️" },
          { text: "Auto break timer", icon: "☕" },
          { text: "Cat-powered reminder", icon: "🐾" }
        ].map((pill, i) => (
          <div 
            key={i}
            ref={el => featurePillsRef.current[i] = el}
            style={{
              backgroundColor: 'white',
              padding: '12px 24px',
              borderRadius: '30px',
              color: '#d97757',
              fontWeight: 'bold',
              boxShadow: '0 4px 10px rgba(217, 119, 87, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span>{pill.icon}</span> {pill.text}
          </div>
        ))}
      </div>

    </section>
  );
}
