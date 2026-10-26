// src/pages/HomePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import HeroBanner from '../components/home/HeroBanner';
import StreamCategories from '../components/home/StreamCategories';
import FeaturedColleges from '../components/home/FeaturedColleges';
import PlatformHighlights from '../components/home/PlatformHighlights';
import { getHomeFeedColleges, toggleWishlist } from '../api/collegeApi';

export default function HomePage({ onWishlistUpdate }) {
  const [colleges, setColleges] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStream, setSelectedStream] = useState('');

  const fetchColleges = useCallback(async () => {
    try {
      const response = await getHomeFeedColleges({
        searchQuery,
        selectedStream,
      });

      const list = response?.data?.topColleges || response?.data || [];
      setColleges(Array.isArray(list) ? list : []);
    } catch {
      // Offline fallback: sets empty list so placeholder slots render cleanly
      setColleges([]);
    }
  }, [searchQuery, selectedStream]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    fetchColleges();
  };

  const handleSelectStream = (streamId) => {
    setSelectedStream(streamId);
  };

  const handleToggleWishlist = async (collegeId) => {
    setColleges((prev) =>
      prev.map((item) =>
        item.collegeId === collegeId
          ? { ...item, isWishlisted: !item.isWishlisted }
          : item
      )
    );

    try {
      const result = await toggleWishlist(collegeId);
      if (result?.totalWishlistCount !== undefined && onWishlistUpdate) {
        onWishlistUpdate(result.totalWishlistCount);
      }
    } catch {
      // Revert if API fails
      setColleges((prev) =>
        prev.map((item) =>
          item.collegeId === collegeId
            ? { ...item, isWishlisted: !item.isWishlisted }
            : item
        )
      );
    }
  };

  return (
    <div className="homepage-container">
      <HeroBanner
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />
      <StreamCategories
        selectedStream={selectedStream}
        onSelectStream={handleSelectStream}
      />
      <FeaturedColleges
        colleges={colleges}
        selectedStream={selectedStream}
        onToggleWishlist={handleToggleWishlist}
      />
      <PlatformHighlights />
    </div>
  );
}