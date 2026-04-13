import React, { useState, useEffect } from 'react';
import './CatComponent.css';

const CatComponent: React.FC = () => {
  const [catState, setCatState] = useState<'IDLE' | 'WALKING' | 'CLIMBING' | 'WATCHING' | 'TAPPING' | 'CLIMBING_DOWN' | 'RETURNING' | 'SURPRISED'>('IDLE');

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

    window.addEventListener('aquarium:cat', handleCatSummon);
    window.addEventListener('aquarium:cat_notice', handleCatNotice);
    return () => {
      window.removeEventListener('aquarium:cat', handleCatSummon);
      window.removeEventListener('aquarium:cat_notice', handleCatNotice);
    };
  }, [catState]);

  return (
    <div className={`munchkin-cat cat-${catState.toLowerCase()}`}>
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
    </div>
  );
};

export default CatComponent;
