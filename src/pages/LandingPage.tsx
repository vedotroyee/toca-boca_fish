import './landing.css';
import CustomCursor from '../components/landing/CustomCursor';
import ScrollProgressBar from '../components/landing/ScrollProgressBar';
import NavBar from '../components/landing/NavBar';
import HeroSection from '../components/landing/HeroSection';
import MarqueeSection from '../components/landing/MarqueeSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import FishGallerySection from '../components/landing/FishGallerySection';
import ProductivitySection from '../components/landing/ProductivitySection';
import TheLoopSection from '../components/landing/TheLoopSection';
import CatClockSection from '../components/landing/CatClockSection';
import TimerSection from '../components/landing/TimerSection';
import FooterSection from '../components/landing/FooterSection';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <CustomCursor />
      <ScrollProgressBar />
      <NavBar />

      <main>
        <HeroSection />
        <MarqueeSection />
        <div id="features">
          <FeaturesSection />
        </div>
        <FishGallerySection />
        <ProductivitySection />
        <div id="the-loop">
          <TheLoopSection />
        </div>
        <div id="clock">
          <CatClockSection />
        </div>
        <div id="cat">
          <TimerSection />
        </div>
        <FooterSection />
      </main>
    </div>
  );
}
