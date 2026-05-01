import React, { useState, useEffect } from 'react';
import type { WeatherData } from '../lib/weather';
import './CatComponent.css';

const CatComponent: React.FC = () => {
  const [catState, setCatState] = useState<'IDLE' | 'WALKING' | 'CLIMBING' | 'WATCHING' | 'TAPPING' | 'CLIMBING_DOWN' | 'RETURNING' | 'SURPRISED' | 'ENTHUSIASTIC_TAPPING' | 'EATING' | 'WATCHING_BREAK' | 'PERK_UP' | 'FALLING_OFF_SOFA' | 'HEATWAVE_SPRAWL' | 'THUNDERSTORM_HIDING' | 'SPACE_HYPNOTIZED' | 'ZERO_GRAVITY_FLOAT'>('IDLE');
  const [breed, setBreed] = useState(localStorage.getItem('toca_cat_breed') || 'Munchkin');

  useEffect(() => {
    const handleCatSummon = () => {
      if (catState !== 'IDLE') return;
      
      // Sequence: IDLE -> WALKING -> CLIMBING -> WATCHING -> TAPPING -> CLIMBING_DOWN -> RETURNING -> IDLE
      setCatState('WALKING');
      
      setTimeout(() => {
        setCatState('CLIMBING');
        setTimeout(() => {
            setCatState('WATCHING');
            setTimeout(() => {
                setCatState('TAPPING');
                window.dispatchEvent(new Event('aquarium:cat_tap'));
                
                setTimeout(() => {
                    setCatState('CLIMBING_DOWN');
                    setTimeout(() => {
                        setCatState('RETURNING');
                        setTimeout(() => {
                            setCatState('IDLE');
                        }, 4000);
                    }, 2000);
                }, 2000);
            }, 2000);
        }, 2000);
      }, 3000);
    };

    const handleCatNotice = () => {
      // Only get surprised if idle or watching
      if (catState === 'IDLE' || catState === 'WATCHING') {
          const prevState = catState;
          setCatState('SURPRISED');
          setTimeout(() => {
              setCatState(prevState); // Return to previous state
          }, 3000);
      }
    };

    const handleLoopComplete = () => {
      // Sequence: IDLE -> WALKING -> CLIMBING -> ENTHUSIASTIC_TAPPING -> EATING -> WATCHING_BREAK
      setCatState('WALKING');
      setTimeout(() => {
          setCatState('CLIMBING');
          setTimeout(() => {
              setCatState('ENTHUSIASTIC_TAPPING');
              window.dispatchEvent(new Event('aquarium:cat_tap'));
              setTimeout(() => {
                  window.dispatchEvent(new Event('aquarium:cat_tap'));
              }, 400);
              setTimeout(() => {
                  window.dispatchEvent(new Event('aquarium:cat_tap'));
              }, 800);
              
              setTimeout(() => {
                  // Break started, auto feed and eat
                  setCatState('EATING');
                  window.dispatchEvent(new Event('aquarium:feed')); // Auto feed fish
                  
                  setTimeout(() => {
                      setCatState('WATCHING_BREAK');
                  }, 6000); // Eats for 6 seconds
              }, 2000);
          }, 2000);
      }, 3000);
    };

    const handleBreakEnd = () => {
      if (catState === 'EATING' || catState === 'WATCHING_BREAK' || catState === 'ENTHUSIASTIC_TAPPING') {
          setCatState('CLIMBING_DOWN');
          setTimeout(() => {
              setCatState('RETURNING');
              setTimeout(() => {
                  setCatState('IDLE');
              }, 4000);
          }, 2000);
      }
    };

    const handleBreedChange = ((e: CustomEvent) => {
        const newBreed = e.detail.breed;
        // Small animation logic for breed swap
        if (catState === 'IDLE') {
            setCatState('WALKING');
            setTimeout(() => {
                setBreed(newBreed);
                setCatState('RETURNING');
                setTimeout(() => setCatState('IDLE'), 2000);
            }, 2000);
        } else {
            setBreed(newBreed);
        }
    }) as EventListener;

    const handleDiscusReward = () => {
        if (catState === 'IDLE' || catState === 'WATCHING') {
            const prevState = catState;
            setCatState('PERK_UP');
            setTimeout(() => {
                setCatState(prevState);
            }, 4000);
        }
    };

    const handleLegendaryReward = () => {
        setCatState('FALLING_OFF_SOFA');
        setTimeout(() => {
            // Reset to IDLE after it falls
            setCatState('IDLE');
        }, 5000);
    };

    const handleWeatherUpdate = ((e: CustomEvent) => {
        const weather = e.detail as WeatherData;
        if (weather.state === 'Hot') {
             setCatState('HEATWAVE_SPRAWL');
        } else if (weather.state === 'Thunderstorm') {
             setCatState('THUNDERSTORM_HIDING');
        } else if (!weather.isReal) {
             if (weather.city === 'Deep Space') {
                 setCatState('SPACE_HYPNOTIZED');
             } else if (weather.city === 'Moon') {
                 setCatState('ZERO_GRAVITY_FLOAT');
             } else {
                 setCatState('IDLE');
             }
        } else {
             setCatState('IDLE');
        }
    }) as EventListener;

    window.addEventListener('aquarium:cat', handleCatSummon);
    window.addEventListener('aquarium:cat_notice', handleCatNotice);
    window.addEventListener('aquarium:loop_complete', handleLoopComplete);
    window.addEventListener('aquarium:break_end', handleBreakEnd);
    window.addEventListener('aquarium:cat_breed_change', handleBreedChange);
    window.addEventListener('aquarium:discus_reward', handleDiscusReward);
    window.addEventListener('aquarium:legendary_reward', handleLegendaryReward);
    window.addEventListener('weather:update', handleWeatherUpdate);
    return () => {
      window.removeEventListener('aquarium:cat', handleCatSummon);
      window.removeEventListener('aquarium:cat_notice', handleCatNotice);
      window.removeEventListener('aquarium:loop_complete', handleLoopComplete);
      window.removeEventListener('aquarium:break_end', handleBreakEnd);
      window.removeEventListener('aquarium:cat_breed_change', handleBreedChange);
      window.removeEventListener('aquarium:discus_reward', handleDiscusReward);
      window.removeEventListener('aquarium:legendary_reward', handleLegendaryReward);
      window.removeEventListener('weather:update', handleWeatherUpdate);
    };
  }, [catState]);

  const breedClass = `breed-${breed.toLowerCase().replace(' ', '-')}`;

  return (
    <div className={`munchkin-cat cat-${catState.toLowerCase()} ${breedClass}`}>
        <div className="cat-body">
            <div className="cat-head">
                <div className="cat-ear ear-l"></div>
                <div className="cat-ear ear-r"></div>
                <div className="cat-eye eye-l"></div>
                <div className="cat-eye eye-r"></div>
                <div className="cat-nose"></div>
            </div>
            <div className="cat-leg leg-fl"></div>
            <div className="cat-leg leg-fr"></div>
            <div className="cat-leg leg-bl"></div>
            <div className="cat-leg leg-br"></div>
            <div className="cat-tail"></div>
        </div>
        {catState === 'IDLE' && <div className="cat-zzz">Zzz</div>}
        {catState === 'SURPRISED' && <div className="cat-exclamation">!</div>}
        {catState === 'EATING' && (
            <div className="cat-food-bowl">
                <div className="food-kibbles"></div>
            </div>
        )}
    </div>
  );
};

export default CatComponent;
