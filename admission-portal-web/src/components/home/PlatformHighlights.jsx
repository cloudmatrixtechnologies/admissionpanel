// src/components/home/PlatformHighlights.jsx
import React from 'react';

const HIGHLIGHTS = [
  { title: 'College Information', desc: 'Detailed data on courses, fees, eligibility, and facilities.' },
  { title: 'Course Details', desc: 'Eligibility, duration, semester curriculum, and career scope.' },
  { title: 'Eligibility Guidance', desc: 'Check entry criteria for 10th, 12th, Diploma, and ITI students.' },
  { title: 'Admissions', desc: 'Clear guidelines and document checklists for smooth admissions.' },
  { title: 'Compare Options', desc: 'Compare fees, infrastructure, and ratings across institutions.' },
  { title: 'Trusted Sources', desc: 'Regularly updated and verified data from official councils.' },
  { title: 'State-wide Reach', desc: 'Directory of institutions across all districts of Tamil Nadu.' },
  { title: 'Student & Parent Portal', desc: 'Intuitive interface designed for quick and clear decision making.' },
];

export default function PlatformHighlights() {
  return (
    <section className="highlights-section">
      <div className="highlights-intro">
        <span className="highlights-pill">WHAT WE PROVIDE</span>
        <h2>Our Platform Details</h2>
        <p>Complete tools and data to support your college discovery.</p>
      </div>

      <div className="highlights-grid">
        {HIGHLIGHTS.map((item, index) => (
          <div key={index} className="highlight-item-card">
            <span className="highlight-check">✓</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}