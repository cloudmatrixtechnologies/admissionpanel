// src/components/common/Footer.jsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-brand-box">
          <div className="footer-title">🎓 Admission Panel</div>
          <p className="footer-tagline">
            Integrated admission portal assisting students and parents across Tamil Nadu with verified details, transparent fees, and dedicated guidance.
          </p>
          <div className="footer-location">Head Office: Salem, Tamil Nadu, India</div>
        </div>

        <div className="footer-links-col">
          <h4>Program Streams</h4>
          <ul>
            <li><a href="/colleges?stream=engineering">Engineering Colleges</a></li>
            <li><a href="/colleges?stream=arts_science">Arts & Science Colleges</a></li>
            <li><a href="/colleges?stream=medical">Medical Institutions</a></li>
            <li><a href="/colleges?stream=diploma">Diploma / Polytechnic</a></li>
            <li><a href="/colleges?stream=iti">ITI Institutes</a></li>
            
          </ul>
        </div>

        <div className="footer-links-col">
          <h4>Support & Legal</h4>
          <ul>
            <li><a href="/contact">Help & Contact</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms & Conditions</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Admission Panel. All rights reserved.</p>
      </div>
    </footer>
  );
}