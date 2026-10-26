// src/components/common/Navbar.jsx
import React, { useState } from 'react';

export default function Navbar({ wishlistCount = 0 }) {
  const [activeTab, setActiveTab] = useState('Home');

  const navItems = ['Home', 'Colleges', 'Courses', 'About', 'Contact'];

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Left: Brand Logo */}
        {/* Left Corner Brand */}
<a href="/" className="navbar-brand">
  <svg 
  className="brand-icon"
  width="32" 
  height="32" 
  viewBox="0 0 32 32" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <linearGradient id="brandGrad" x1="2" y1="4" x2="30" y2="28" gradientUnits="userSpaceOnUse">
      <stop stopColor="#2563eb" />
      <stop offset="1" stopColor="#1d4ed8" />
    </linearGradient>
  </defs>

  {/* Cap diamond */}
  <path 
    d="M16 4L3 10.5L16 17L29 10.5L16 4Z" 
    fill="url(#brandGrad)" 
  />
  {/* Gold accent tassel */}
  <path 
    d="M26 12V18.5C26 19.3 25.3 20 24.5 20C23.7 20 23 19.3 23 18.5V13.5" 
    stroke="#fbbf24" 
    strokeWidth="2" 
    strokeLinecap="round" 
  />
  {/* Gateway portal arch */}
  <path 
    d="M8 15V23C8 25.2 11.6 27 16 27C20.4 27 24 25.2 24 23V15" 
    stroke="#1e40af" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
  />
</svg>
  <div className="brand-text">
    <span className="brand-title">Admission Panel</span>
    <span className="brand-subtitle">Find Your Right College</span>
  </div>
</a>

        {/* Center: Rounded Pill Capsule */}
        <nav className="nav-pill-capsule" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = activeTab === item;
            const path = item === 'Home' ? '/' : `/${item.toLowerCase()}`;
            return (
              <a
                key={item}
                href={path}
                onClick={(e) => {
                  setActiveTab(item);
                }}
                className={`nav-pill-link ${isActive ? 'active' : ''}`}
              >
                <span>{item}</span>
                {isActive && <span className="nav-pill-indicator" />}
              </a>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="nav-controls">
          {/* Wishlist Button */}
          <a href="/wishlist" className="wishlist-btn-animated" title="View Wishlist">
            <div className="flaticon-bookmark-wrapper">
              <svg
                className="flaticon-bookmark-svg"
                width="28"
                height="28"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <clipPath id="unfoldedRibbonClip">
                    <path d="M 26 14 H 62 C 67 14 70 17 70 22 V 96 L 48 87 L 26 96 V 32 H 16 C 13 32 11 30 11 27 V 23 C 11 17 16 14 22 14 Z" />
                  </clipPath>
                </defs>

                <g className="always-unfolded-ribbon">
                  <path
                    d="M 26 14 H 62 C 67 14 70 17 70 22 V 76 L 48 68 L 26 76 V 32 H 16 C 13 32 11 30 11 27 V 23 C 11 17 16 14 22 14 Z"
                    fill="#52cde2"
                    stroke="#0d276b"
                    strokeWidth="6"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="68"
                    cy="46"
                    r="24"
                    fill="#38abbd"
                    clipPath="url(#unfoldedRibbonClip)"
                  />
                </g>

                <path
                  d="M 26 20 H 22 C 18 20 16 22 16 25.5 V 32 H 26 Z"
                  fill="#ffffff"
                  stroke="#0d276b"
                  strokeWidth="5"
                  strokeLinejoin="round"
                />

                <g className="bookmark-star-coin">
                  <circle
                    cx="68"
                    cy="46"
                    r="21"
                    fill="#ff8800"
                    stroke="#0d276b"
                    strokeWidth="6"
                  />
                  <path
                    d="M 68 35.5 L 71.5 42.8 L 79.5 44 L 73.7 49.7 L 75.1 57.6 L 68 53.8 L 60.9 57.6 L 62.3 49.7 L 56.5 44 L 64.5 42.8 Z"
                    fill="#ffd152"
                    stroke="#ffd152"
                    strokeWidth="2.8"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </g>
              </svg>
            </div>

            <span className="wishlist-text-label">Wishlist</span>

            {wishlistCount > 0 && (
              <span className="wishlist-pill-animated">
                <span className="pill-ping"></span>
                <span className="pill-number">{wishlistCount}</span>
              </span>
            )}
          </a>

          {/* Sign In Button */}
          <a href="/login" className="btn-signin-modern">
            <span className="btn-signin-glow"></span>
            <span className="btn-signin-content">
              <svg
                className="user-profile-svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Sign In</span>
              <svg
                className="arrow-right-svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}