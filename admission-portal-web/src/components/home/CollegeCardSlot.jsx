// src/components/home/CollegeCardSlot.jsx
import React from 'react';

export default function CollegeCardSlot({ slotIndex = 1, activeStream = '' }) {
  const displayCategory = activeStream || 'College';

  return (
    <div className="college-card college-slot-card">
      <div className="card-top-media slot-media-placeholder">
        <div className="slot-badge-placeholder">{displayCategory} Slot #{slotIndex}</div>
        <div className="slot-heart-placeholder">🤍</div>
      </div>

      <div className="card-content-body">
        <div className="card-location-meta slot-text-sub">
          📍 Location / City, State
        </div>

        <h3 className="card-institution-name slot-title-placeholder">
          {activeStream ? `${activeStream} Institution Available Soon` : 'College Name Available Soon'}
        </h3>

        <div className="card-rating-strip">
          <span className="rating-score slot-pill">★ --</span>
          <span className="review-count">(-- reviews)</span>
          <span className="institution-type-tag slot-pill">
            {activeStream || 'Institution'}
          </span>
        </div>

        <div className="card-badges-list">
          <span className="accreditation-pill slot-pill">Accreditation</span>
          <span className="accreditation-pill slot-pill">Affiliation</span>
          <span className="accreditation-pill slot-pill">{activeStream || 'Stream'}</span>
        </div>

        <div className="card-specs-footer">
          <div>
            <span className="specs-label">ANNUAL FEE</span>
            <span className="specs-val slot-fee">₹ --,---</span>
          </div>
          <div className="specs-right">
            <span className="specs-label">SEATS</span>
            <span className="specs-val slot-seats">--- Seats</span>
          </div>
        </div>
      </div>

      <div className="card-button-actions">
        <button disabled className="btn-card-details slot-btn">View Details</button>
        <button disabled className="btn-card-courses slot-btn">View Courses</button>
      </div>
    </div>
  );
}