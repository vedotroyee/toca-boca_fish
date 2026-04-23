import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TimerSection() {
  const containerRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!containerRef.current || !wordRef.current) return;

    // Bounce "cat"
    gsap.fromTo(wordRef.current,
      { y: 50, opacity: 0, scale: 0.5 },
      {
        y: 0, opacity: 1, scale: 1,
        duration: 1,
        ease: 'elastic.out(1, 0.3)',
        scrollTrigger: {
          trigger: wordRef.current,
          start: 'top 80%',
        }
      }
    );

    // Button wiggle
    const wiggle = gsap.to(buttonRef.current, {
      rotation: 5,
      yoyo: true,
      repeat: 3,
      duration: 0.1,
      paused: true
    });

    const interval = setInterval(() => {
      wiggle.restart();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={containerRef} style={{ backgroundColor: '#e8f5e0', padding: '120px 20px', position: 'relative' }}>
      
      <h2 style={{ textAlign: 'center', fontSize: '4rem', color: '#8b4513', marginBottom: '80px' }}>
        Set a timer.<br/>
        Get a <span ref={wordRef} style={{ display: 'inline-block', color: '#ff7f50' }}>cat.</span>
      </h2>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '60px',
        maxWidth: '1200px',
        margin: '0 auto',
        alignItems: 'center'
      }}>
        
        {/* Left: Animation Sequence Mockup */}
        <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            width: '100%', 
            maxWidth: '500px', 
            height: '350px', 
            backgroundColor: '#c8e6c9', 
            borderRadius: '40px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.05)'
          }}>
            {/* Sleeping Cat Graphic */}
            <div className="sleeping-cat-loop" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
               <svg width="150" height="100" viewBox="0 0 150 100">
                 <path d="M20,80 Q75,30 130,80 Z" fill="#d2b48c" />
                 <circle cx="50" cy="70" r="25" fill="#d2b48c" />
                 <path d="M40,65 L50,65" stroke="#4a3b32" strokeWidth="2" strokeLinecap="round" />
                 <text x="100" y="40" fill="#4a3b32" fontSize="20" fontFamily="Comic Sans MS, cursive" className="zzz-anim">Zzz...</text>
               </svg>
            </div>
          </div>
        </div>

        {/* Right: Timer Mockup */}
        <div style={{ flex: '1 1 400px' }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '30px',
            padding: '40px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
            marginBottom: '40px'
          }}>
            <h3 style={{ fontSize: '1.5rem', color: '#8b4513', marginBottom: '20px' }}>Timer Length</h3>
            <div style={{ 
              width: '100%', 
              height: '20px', 
              backgroundColor: '#e8f5e0', 
              borderRadius: '10px',
              position: 'relative',
              marginBottom: '20px'
            }}>
              <div style={{ width: '20%', height: '100%', backgroundColor: '#ff7f50', borderRadius: '10px' }} />
              <div style={{ 
                position: 'absolute', top: '50%', left: '20%', transform: 'translate(-50%, -50%)',
                width: '30px', height: '30px', backgroundColor: '#fff', borderRadius: '50%',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)', border: '2px solid #ff7f50'
              }} />
            </div>
            <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#555', marginBottom: '30px' }}>
              Summon in: <strong>5 minutes</strong>
            </p>
            
            <button ref={buttonRef} className="landing-btn primary" style={{ width: '100%', justifyContent: 'center' }}>
              Summon now
            </button>
          </div>

          {/* Testimonials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {[
              { text: "I set it to every 5 minutes. No regrets.", author: "CatLover99" },
              { text: "My tank has 9 fish. I have never been more productive.", author: "CodeNinja" },
              { text: "The cat tapped the glass at the exact moment my deadline hit. Felt personal.", author: "DeadlineDash" }
            ].map((quote, i) => (
              <div key={i} style={{ backgroundColor: '#fdf6ec', borderLeft: '4px solid #e2725b', padding: '15px', borderRadius: '0 10px 10px 0' }}>
                <p style={{ fontSize: '1rem', color: '#555', fontStyle: 'italic', marginBottom: '5px' }}>"{quote.text}"</p>
                <div style={{ fontSize: '0.8rem', color: '#8b4513', fontWeight: 'bold' }}>- {quote.author}</div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Wave divider for next section */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path fill="#1a4a4a" fillOpacity="1" d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"></path>
        </svg>
      </div>

    </section>
  );
}
