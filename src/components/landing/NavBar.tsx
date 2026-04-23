import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Fish, Cat } from 'lucide-react';

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="nav-brand">
        <Fish fill="#1a4a4a" strokeWidth={1} size={24} />
        <Cat fill="none" strokeWidth={2} size={24} />
        <span>TocaFish</span>
      </Link>
      <div className="nav-links">
        <a href="#features">Features</a>
        <a href="#clock">Clock</a>
        <a href="#cat">The Cat</a>
        <Link to="/app">Open App</Link>
      </div>
    </nav>
  );
}
