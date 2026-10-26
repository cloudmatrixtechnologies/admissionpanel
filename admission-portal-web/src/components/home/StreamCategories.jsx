// src/components/home/StreamCategories.jsx
import React from 'react';

const CORE_STREAMS = [
  { id: 'Engineering', name: 'Engineering', icon: '⚙️' },
  { id: 'Arts & Science', name: 'Arts & Science', icon: '🏛️' },
  { id: 'Medical', name: 'Medical', icon: '🩺' },
  { id: 'Diploma', name: 'Diploma', icon: '✒️' },
  { id: 'ITI', name: 'ITI', icon: '🛠️' }
  
];

export default function StreamCategories({ selectedStream = '', onSelectStream }) {
  return (
    <section className="stream-section">
      <div className="section-title-wrap">
        <div>
          <h2>Explore by College Type</h2>
          <p>
            {selectedStream 
              ? `Filtering by ${selectedStream}. Click again to clear filter.`
              : 'Select a category to filter institutions across Tamil Nadu'}
          </p>
        </div>
        {selectedStream && (
          <button 
            type="button"
            className="section-view-all"
            onClick={() => onSelectStream('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            Clear Filter (Show All) ✕
          </button>
        )}
      </div>

      <div className="stream-cards-grid">
        {CORE_STREAMS.map((stream) => {
          const isSelected = selectedStream.toLowerCase() === stream.id.toLowerCase();

          return (
            <button
              key={stream.id}
              type="button"
              className={`stream-type-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectStream(isSelected ? '' : stream.id)}
              aria-pressed={isSelected}
            >
              <span className="stream-type-icon">{stream.icon}</span>
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span className="stream-type-name">{stream.name}</span>
                {isSelected && (
                  <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600 }}>
                    ● Active Filter
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}