// src/components/home/CollegeCardSkeleton.jsx
import React from 'react';

export default function CollegeCardSkeleton() {
  return (
    <div className="college-card-skeleton">
      <div className="skeleton-media shimmer"></div>
      <div className="skeleton-body">
        <div className="skeleton-line shimmer sm"></div>
        <div className="skeleton-line shimmer md"></div>
        <div className="skeleton-line shimmer lg"></div>
        <div className="skeleton-tags-wrap">
          <div className="skeleton-pill shimmer"></div>
          <div className="skeleton-pill shimmer"></div>
          <div className="skeleton-pill shimmer"></div>
        </div>
        <div className="skeleton-footer shimmer"></div>
      </div>
    </div>
  );
}