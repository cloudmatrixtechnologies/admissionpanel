// src/components/home/FeaturedColleges.jsx
import React from 'react';
import CollegeCard from './CollegeCard';
import CollegeCardSlot from './CollegeCardSlot';

export default function FeaturedColleges({ 
  colleges = [], 
  selectedStream = '', 
  onToggleWishlist 
}) {
  const hasColleges = colleges && colleges.length > 0;

  return (
    <section className="featured-colleges-section">
      <div className="section-title-wrap">
        <div>
          <h2>
            {selectedStream 
              ? `Top ${selectedStream} Colleges in Tamil Nadu` 
              : 'Top Colleges in Tamil Nadu'}
          </h2>
          <p>
            {selectedStream
              ? `Showing verified institutions offering ${selectedStream} programs`
              : 'Discover accredited universities, government, and autonomous colleges'}
          </p>
        </div>
        <a href="/colleges" className="section-view-all">View All Colleges →</a>
      </div>

      <div className="colleges-grid-container">
        {hasColleges ? (
          colleges.map((college) => (
            <CollegeCard
              key={college.collegeId}
              college={college}
              onToggleWishlist={onToggleWishlist}
            />
          ))
        ) : (
          // Renders 6 structured empty slots aligned with the active stream
          [...Array(6)].map((_, index) => (
            <CollegeCardSlot 
              key={index} 
              slotIndex={index + 1} 
              activeStream={selectedStream} 
            />
          ))
        )}
      </div>
    </section>
  );
}