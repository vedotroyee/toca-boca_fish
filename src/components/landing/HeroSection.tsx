import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sceneRef.current || !containerRef.current) return;

    // Parallax on scroll
    gsap.to(sceneRef.current, {
      y: -150,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }, []);

  return (
    <section 
      ref={containerRef}
      className="hero-section"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '80px'
      }}
    >
      {/* Background bubbles */}
      <div className="hero-bubbles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="bubble" style={{
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 40 + 10}px`,
            height: `${Math.random() * 40 + 10}px`,
            animationDuration: `${Math.random() * 10 + 10}s`,
            animationDelay: `${Math.random() * 5}s`
          }} />
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '800px', padding: '0 20px' }}>
        <h1 style={{ color: '#fdf6ec', fontSize: 'clamp(48px, 8vw, 96px)', marginBottom: '20px' }}>
          Your <span className="color-cycle">happiest</span> tab. Ever.
        </h1>
        <p style={{ color: '#fdf6ec', fontSize: '1.2rem', opacity: 0.9, marginBottom: '40px' }}>
          A living room. A giant aquarium. A munchkin cat. And fish that reward your focus.
        </p>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '60px' }}>
          <Link to="/app" className="landing-btn primary">
            Open the app
          </Link>
          <a href="#demo" className="landing-btn secondary">
            <Play fill="currentColor" size={20} /> Watch it swim
          </a>
        </div>
      </div>

      {/* Hero Scene Illustration (SVG) */}
      <div ref={sceneRef} className="hero-scene" style={{ width: '80%', maxWidth: '900px', zIndex: 5 }}>
        <svg viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', dropShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
          {/* Room Background */}
          <rect width="800" height="400" rx="30" fill="#2d5a5a" />
          
          {/* Aquarium Outer */}
          <rect x="250" y="80" width="300" height="200" rx="15" fill="#0d3d4a" stroke="#4a7a7a" strokeWidth="8" />
          {/* Water effect */}
          <rect x="254" y="90" width="292" height="186" rx="10" fill="rgba(32, 178, 170, 0.3)" />
          
          {/* Plants in Aquarium */}
          <path d="M280,270 Q290,220 280,180 Q270,220 280,270" fill="#1b5e20" opacity="0.8" />
          <path d="M500,270 Q490,200 520,150 Q510,210 500,270" fill="#2e7d32" opacity="0.8" />

          {/* Simple Fish Path Animations */}
          <g className="fish-loop-1">
            <path d="M350,150 Q320,120 290,150 Q320,180 350,150 Z" fill="#ff7f50" />
            <path d="M350,150 L370,140 L365,150 L370,160 Z" fill="#ff7f50" />
          </g>

          <g className="fish-loop-2">
            <path d="M450,200 Q430,180 410,200 Q430,220 450,200 Z" fill="#ffb6c1" />
            <path d="M450,200 L465,195 L460,200 L465,205 Z" fill="#ffb6c1" />
          </g>

          {/* Table under aquarium */}
          <rect x="230" y="280" width="340" height="40" rx="5" fill="#8B4513" />
          <rect x="250" y="320" width="30" height="80" fill="#A0522D" />
          <rect x="520" y="320" width="30" height="80" fill="#A0522D" />

          {/* Munchkin Cat on Sofa */}
          <path d="M120,300 C120,250 180,250 180,300 Z" fill="#d2b48c" />
          <circle cx="150" cy="250" r="25" fill="#d2b48c" />
          {/* Cat Ears */}
          <path d="M135,230 L130,210 L145,225" fill="#d2b48c" />
          <path d="M165,230 L170,210 L155,225" fill="#d2b48c" />
          {/* Sofa */}
          <rect x="50" y="300" width="180" height="60" rx="20" fill="#cd5c5c" />
          <rect x="40" y="260" width="40" height="100" rx="10" fill="#bc4a4a" />
        </svg>
      </div>

      {/* Wave Divider Next Section */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path fill="#fdf6ec" fillOpacity="1" d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"></path>
        </svg>
      </div>
    </section>
  );
}
