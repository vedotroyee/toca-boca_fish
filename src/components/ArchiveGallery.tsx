import React, { useState, useEffect } from 'react';
import { X, Heart } from 'lucide-react';
import { getArchives, togglePinArchive } from '../lib/db';
import type { TankSnapshot } from '../lib/db';
import './ArchiveGallery.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ArchiveGallery: React.FC<Props> = ({ isOpen, onClose }) => {
  const [archives, setArchives] = useState<TankSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSnapshot, setSelectedSnapshot] = useState<TankSnapshot | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadArchives();
    }
  }, [isOpen]);

  const loadArchives = async () => {
    setLoading(true);
    const data = await getArchives();
    setArchives(data);
    setLoading(false);
  };

  const handlePin = async (e: React.MouseEvent, id: string, currentlyPinned: boolean) => {
    e.stopPropagation();
    await togglePinArchive(id, !currentlyPinned);
    loadArchives();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="archive-overlay" onClick={onClose}>
        <div className="archive-modal" onClick={e => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
          
          <div className="archive-header">
            <h2>Aquarium Archive</h2>
            <p>Your past tanks, preserved exactly as you left them.</p>
          </div>

          <div className="archive-grid">
            {loading ? (
              <div style={{ textAlign: 'center', width: '100%', padding: '40px', color: '#8a4b3d' }}>Loading...</div>
            ) : archives.length === 0 ? (
              <div className="empty-archive">
                 <p>No archives yet.</p>
                 <span style={{ fontSize: '2rem' }}>🐟</span>
                 <p>Your tank is saved automatically each new day!</p>
              </div>
            ) : (
              archives.map(arc => (
                <div key={arc.id} className={`archive-card ${arc.isGolden ? 'golden-card' : ''}`} onClick={() => setSelectedSnapshot(arc)}>
                  <div className={`archive-thumb theme-${arc.theme.toLowerCase()}`}>
                     {arc.isGolden && <div className="golden-star-badge">🌟</div>}
                     {/* Simplified visual representation */}
                     <div className="thumb-stats">
                        <span>🐟 {arc.fishes.length}</span>
                        <span>⏱️ {arc.loopsCompleted}</span>
                     </div>
                     <button 
                        className={`pin-btn ${arc.pinned ? 'pinned' : ''}`}
                        onClick={(e) => handlePin(e, arc.id, arc.pinned)}
                     >
                        <Heart size={16} fill={arc.pinned ? 'currentColor' : 'none'} />
                     </button>
                  </div>
                  <div className="archive-info">
                    <div className="archive-date">{new Date(arc.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                    <div className="archive-theme">{arc.theme}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Snapshot Detail View Overlay */}
      {selectedSnapshot && (
         <div className="snapshot-overlay" onClick={() => setSelectedSnapshot(null)}>
            <div className={`snapshot-container ${selectedSnapshot.isGolden ? 'golden-container' : ''}`} onClick={e => e.stopPropagation()}>
                <button className="snapshot-close-btn" onClick={() => setSelectedSnapshot(null)}><X size={24} /></button>
                <div className={`snapshot-view theme-${selectedSnapshot.theme.toLowerCase()}`}>
                    {selectedSnapshot.isGolden && <div className="golden-star-badge large">🌟</div>}
                    <div className="snapshot-vignette"></div>
                    <div className="snapshot-water-ripple"></div>
                    
                    {/* Render static fish from the snapshot */}
                    {selectedSnapshot.fishes.map((fishType, idx) => (
                        <div 
                          key={idx} 
                          className="snapshot-fish"
                          style={{
                              left: `${20 + Math.random() * 60}%`,
                              top: `${20 + Math.random() * 60}%`,
                              animationDelay: `${Math.random() * 2}s`
                          }}
                        >
                            {/* Simple text representation if no canvas context available */}
                            {fishType === 'Clownfish' && <span style={{ color: '#ff7f50', fontSize: '2rem' }}>🐟</span>}
                            {fishType === 'Betta' && <span style={{ color: '#d45b73', fontSize: '2rem' }}>🐠</span>}
                            {fishType === 'Goldfish' && <span style={{ color: '#ffbf00', fontSize: '2rem' }}>🐡</span>}
                            {/* generic fallback */}
                            {!['Clownfish', 'Betta', 'Goldfish'].includes(fishType) && <span style={{ color: '#888', fontSize: '2rem' }}>🐟</span>}
                        </div>
                    ))}
                    
                    <div className="snapshot-date-badge">
                        {new Date(selectedSnapshot.date).toLocaleDateString()}
                    </div>
                </div>
                <div className="snapshot-caption">
                    <p>You focused <strong>{selectedSnapshot.focusHours} hours</strong> this day and earned <strong>{selectedSnapshot.fishes.length} fish</strong>.</p>
                </div>
            </div>
         </div>
      )}
    </>
  );
};

export default ArchiveGallery;
