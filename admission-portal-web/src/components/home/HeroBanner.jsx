// src/components/home/HeroBanner.jsx
import React from 'react';

const POPULAR_SEARCHES = ['Engineering', 'Arts & Science', 'Diploma', 'ITI', 'Medical'];

export default function HeroBanner({
  searchQuery = '',
  setSearchQuery = () => {},
  onSearchSubmit = (e) => e?.preventDefault(),
}) {
  return (
    <section className="hero-banner">
      <div className="hero-inner">
        <span className="hero-badge">ADMISSION GUIDANCE</span>

        {/* High-Contrast Bold Italic Serif Heading with Warm Gold Accent */}
        <h1 className="hero-heading">
  Choose Degree, Pick Campus <br />
  <span className="hero-heading-highlight">Start Your Story</span>
</h1>

        {/* Centered Low-Opacity Rounded Pill Search Bar */}
        <form className="hero-search-form" onSubmit={onSearchSubmit}>
          <div className="search-input-group">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1e293b"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by college name, course, or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button type="submit" className="hero-btn-submit">
            Search
          </button>
        </form>

        {/* Popular Quick-Filter Chips */}
        <div className="hero-popular-searches">
          <span className="popular-label">Popular:</span>
          {POPULAR_SEARCHES.map((item) => (
            <button
              key={item}
              type="button"
              className="popular-chip"
              onClick={() => setSearchQuery(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}