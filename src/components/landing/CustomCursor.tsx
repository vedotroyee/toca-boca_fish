import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Follow mouse
    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });
    };

    // Detect hover on clickable elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('a') || target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div ref={cursorRef} className={`custom-cursor ${isHovering ? 'is-hovering' : ''}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g className="fish-cursor-group fish-wiggle">
          {/* Fish Body */}
          <path d="M70,50 Q40,20 10,50 Q40,80 70,50 Z" fill="#ff7f50" />
          {/* Fish Eye */}
          <circle cx="25" cy="45" r="4" fill="#1a4a4a" />
          <circle cx="24" cy="44" r="1.5" fill="#fff" />
          {/* Fish Tail */}
          <path className="tail-flap" d="M70,50 L95,30 L90,50 L95,70 Z" fill="#ff7f50" />
          {/* Fish Fin */}
          <path d="M40,35 Q50,25 60,35 Z" fill="#FFA07A" />
        </g>
        
        <g className="paw-cursor-group">
          {/* Cat Paw */}
          <circle cx="50" cy="55" r="25" fill="#fdf6ec" />
          <circle cx="28" cy="28" r="12" fill="#fdf6ec" />
          <circle cx="50" cy="18" r="14" fill="#fdf6ec" />
          <circle cx="72" cy="28" r="12" fill="#fdf6ec" />
          {/* Beans */}
          <circle cx="50" cy="58" r="12" fill="#ffb6c1" />
          <circle cx="28" cy="28" r="6" fill="#ffb6c1" />
          <circle cx="50" cy="18" r="7" fill="#ffb6c1" />
          <circle cx="72" cy="28" r="6" fill="#ffb6c1" />
        </g>
      </svg>
    </div>
  );
}
