import { useEffect, useState } from 'react';

export default function CatClockSection() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondDegrees = (seconds / 60) * 360;
  const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
  const hourDegrees = ((hours % 12 + minutes / 60) / 12) * 360;

  return (
    <section style={{ backgroundColor: '#3d1f2e', padding: '150px 20px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Soft floating shapes */}
      <div style={{ position: 'absolute', top: '20%', left: '10%', opacity: 0.1 }}>
        <svg width="50" height="50" viewBox="0 0 100 100">
          <path d="M50,0 Q60,40 100,50 Q60,60 50,100 Q40,60 0,50 Q40,40 50,0 Z" fill="#fdf6ec" />
        </svg>
      </div>
      <div style={{ position: 'absolute', bottom: '20%', right: '10%', opacity: 0.1 }}>
        <svg width="40" height="40" viewBox="0 0 100 100">
          <circle cx="20" cy="50" r="10" fill="#fdf6ec" />
          <circle cx="50" cy="20" r="12" fill="#fdf6ec" />
          <circle cx="80" cy="50" r="10" fill="#fdf6ec" />
          <circle cx="50" cy="65" r="25" fill="#fdf6ec" />
        </svg>
      </div>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '60px',
        flexWrap: 'wrap' 
      }}>
        
        {/* Left Side: Text */}
        <div style={{ flex: '1 1 400px' }}>
          <h2 style={{ fontSize: '4rem', color: '#fdf6ec', marginBottom: '20px', lineHeight: 1.1 }}>
            Time never looked <br/>
            <span style={{ color: '#ffb6c1' }}>this cute.</span>
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#e0c0c8', opacity: 0.8, maxWidth: '400px' }}>
            A real-time analog clock lives on your wall. Cat-faced. Always watching. Quietly judging.
          </p>
        </div>

        {/* Right Side: Cat Clock Wrapper */}
        <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
          <div className="cat-clock-pulse" style={{ position: 'relative' }}>
            
            {/* Hanging String/Chain */}
            <div style={{ position: 'absolute', top: '-100px', left: '50%', width: '4px', height: '100px', backgroundColor: '#5c3a4a', transform: 'translateX(-2px)' }} />

            {/* Clock Face container */}
            <div style={{ 
              width: '300px', 
              height: '300px', 
              backgroundColor: '#fdf6ec', 
              borderRadius: '50%',
              position: 'relative',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3), inset 0 10px 20px rgba(0,0,0,0.05)',
              border: '15px solid #d2b48c'
            }}>
              
              {/* Cat Ears */}
              <div style={{
                position: 'absolute', top: '-30px', left: '20px',
                width: 0, height: 0, borderLeft: '40px solid transparent', borderRight: '40px solid transparent', borderBottom: '60px solid #d2b48c', transform: 'rotate(-20deg)', zIndex: -1
              }} />
              <div style={{
                position: 'absolute', top: '-30px', right: '20px',
                width: 0, height: 0, borderLeft: '40px solid transparent', borderRight: '40px solid transparent', borderBottom: '60px solid #d2b48c', transform: 'rotate(20deg)', zIndex: -1
              }} />

              {/* Paw Print Markers */}
              {[...Array(12)].map((_, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  top: '10px',
                  left: '50%',
                  transformOrigin: '50% 140px',
                  transform: `translateX(-50%) rotate(${i * 30}deg)`,
                }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: '#3d1f2e', borderRadius: '50%', opacity: 0.5 }} />
                </div>
              ))}

              {/* Sleeping Cat Center */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 5
              }}>
                 <svg width="60" height="40" viewBox="0 0 100 60">
                   <path d="M10,50 Q50,20 90,50 Z" fill="#3d1f2e" />
                   <circle cx="30" cy="40" r="15" fill="#3d1f2e" />
                   <path d="M25,40 L35,40" stroke="#fdf6ec" strokeLinecap="round" />
                 </svg>
              </div>

              {/* Hands */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%', width: '10px', height: '80px',
                backgroundColor: '#3d1f2e', borderRadius: '10px',
                transformOrigin: 'bottom center',
                transform: `translateX(-50%) translateY(-100%) rotate(${hourDegrees}deg)`,
                zIndex: 2
              }} />
              
              <div style={{
                position: 'absolute', top: '50%', left: '50%', width: '6px', height: '110px',
                backgroundColor: '#3d1f2e', borderRadius: '6px',
                transformOrigin: 'bottom center',
                transform: `translateX(-50%) translateY(-100%) rotate(${minuteDegrees}deg)`,
                zIndex: 3
              }} />
              
              <div style={{
                position: 'absolute', top: '50%', left: '50%', width: '4px', height: '120px',
                backgroundColor: '#ffb6c1', borderRadius: '4px',
                transformOrigin: 'bottom center',
                transform: `translateX(-50%) translateY(-100%) rotate(${secondDegrees}deg)`,
                zIndex: 4,
                transition: 'transform 0.1s cubic-bezier(0.4, 2.08, 0.55, 0.44)'
              }} />

            </div>

            {/* Pendulum */}
            <div className="pendulum-swing" style={{
              position: 'absolute', top: '300px', left: '50%',
              transformOrigin: 'top center', zIndex: -2
            }}>
              <div style={{ width: '10px', height: '100px', backgroundColor: '#d2b48c', margin: '0 auto' }} />
              <div style={{ width: '40px', height: '40px', backgroundColor: '#ffb6c1', borderRadius: '50%', margin: '0 auto', transform: 'translateY(-10px)' }} />
            </div>

          </div>
        </div>
      </div>

      {/* Wave divider for next section */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path fill="#e8f5e0" fillOpacity="1" d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"></path>
        </svg>
      </div>
    </section>
  );
}
