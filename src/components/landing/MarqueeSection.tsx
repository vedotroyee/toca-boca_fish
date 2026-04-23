import React from 'react';

export default function MarqueeSection() {
  const catsAndFish = [...Array(10)].map((_, i) => (
    <React.Fragment key={i}>
      <div className="marquee-item cat-item">
        <svg width="60" height="60" viewBox="0 0 100 100">
           {/* Simple Cat Silhouette/Vector */}
           <path d="M20,80 Q50,0 80,80 Z" fill="#d2b48c" />
           <circle cx="50" cy="80" r="30" fill="#d2b48c" />
        </svg>
      </div>
      <div className="marquee-separator">🐾</div>
      <div className="marquee-item fish-item">
        <svg width="60" height="40" viewBox="0 0 100 60">
           {/* Simple Fish Vector */}
           <path d="M80,30 Q40,0 10,30 Q40,60 80,30 Z" fill="#ff7f50" />
           <path d="M80,30 L100,15 L95,30 L100,45 Z" fill="#ff7f50" />
        </svg>
      </div>
      <div className="marquee-separator">🫧</div>
    </React.Fragment>
  ));

  const fishSilhouettes = [...Array(15)].map((_, i) => (
    <React.Fragment key={i}>
      <div className="marquee-item">
        <svg width={Math.random() * 40 + 30} height="40" viewBox="0 0 100 60">
           <path d="M80,30 Q40,0 10,30 Q40,60 80,30 Z" fill="#1a4a4a" opacity="0.3" />
           <path d="M80,30 L100,15 L95,30 L100,45 Z" fill="#1a4a4a" opacity="0.3" />
        </svg>
      </div>
    </React.Fragment>
  ));

  return (
    <section className="marquee-section" style={{ backgroundColor: '#fdf6ec', padding: '100px 0', position: 'relative' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <p style={{ color: '#888', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '10px' }}>the cast</p>
        <h2 style={{ fontSize: '3rem', color: '#ff7f50' }}>Meet the residents.</h2>
      </div>

      <div className="marquee-container top-marquee">
        <div className="marquee-track">
          {catsAndFish}
          {catsAndFish} {/* Duplicate for infinite loop */}
        </div>
      </div>

      <div className="marquee-container bottom-marquee" style={{ marginTop: '20px' }}>
        <div className="marquee-track reverse">
          {fishSilhouettes}
          {fishSilhouettes}
        </div>
      </div>
    </section>
  );
}
