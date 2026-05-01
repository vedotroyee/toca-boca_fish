import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  { id: 1, title: 'Fish that fear your cursor', desc: 'Watch them dart away when you get close.', color: '#ff7f50', bg: '#ffe5db', image: '/images/feature_1.png' },
  { id: 2, title: 'A munchkin cat who visits', desc: "Loop-complete break reminder — the cat comes when you've earned it.", color: '#20b2aa', bg: '#e0f4f3', image: '/images/feature_2.png' },
  { id: 3, title: 'Earn fish by focusing', desc: 'Work hard, get rewarded with new species.', color: '#b19cd9', bg: '#f2edfa', image: '/images/feature_3.png' },
  { id: 4, title: 'Real-time cat clock', desc: 'A cozy analog companion judging your time.', color: '#ffbf00', bg: '#fff2cc', image: '/images/feature_4.png' },
  { id: 5, title: 'Feed your fish', desc: 'Drop pellets and watch them go crazy.', color: '#ff69b4', bg: '#ffe1ef', image: '/images/feature_5.png' },
  { id: 6, title: 'Day and night vibes', desc: 'The room lighting changes with your actual time.', color: '#4169e1', bg: '#e8eeff', image: '/images/feature_6.png' },
];

export default function FeaturesSection() {
  const containerRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(cardsRef.current, 
      { y: 100, opacity: 0, scale: 0.9 },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
        }
      }
    );
  }, []);

  return (
    <section ref={containerRef} style={{ backgroundColor: '#f0edff', padding: '120px 20px', position: 'relative' }}>
      <h2 style={{ textAlign: 'center', fontSize: '3rem', color: '#4a148c', marginBottom: '80px' }}>
        Everything your desk deserves.
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '40px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {features.map((feat, i) => (
          <div 
            key={feat.id}
            ref={(el) => { cardsRef.current[i] = el; }}
            className="feature-card"
            style={{
              backgroundColor: feat.bg,
              borderRadius: '30px',
              padding: '40px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'none'
            }}
          >
            <div className="feature-anim-placeholder" style={{
              height: '180px',
              backgroundColor: feat.color,
              borderRadius: '20px',
              marginBottom: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.1)'
            }}>
              <img src={feat.image} alt={feat.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h3 style={{ color: '#4a148c', fontSize: '1.5rem', marginBottom: '10px' }}>{feat.title}</h3>
            <p style={{ color: '#4a148c', fontSize: '1.1rem', opacity: 0.85 }}>{feat.desc}</p>
          </div>
        ))}
      </div>
      
      {/* Wave divider for next section */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path fill="#0d3d4a" fillOpacity="1" d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"></path>
        </svg>
      </div>
    </section>
  );
}
