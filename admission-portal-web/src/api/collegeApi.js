// src/api/collegeApi.js
import { request } from './apiClient';

/**
 * Fetch colleges for home page feed
 * Aligned with Shreya's GET /api/colleges/home-feed endpoint
 */
export async function getHomeFeedColleges(filters = {}) {
  const params = new URLSearchParams();
  
  if (filters.searchQuery) params.append('q', filters.searchQuery);
  if (filters.selectedDistrict && filters.selectedDistrict !== 'All') {
    params.append('district', filters.selectedDistrict);
  }
  // Sends collegeType matching Shreya's enum schema
  if (filters.selectedStream) {
    params.append('collegeType', filters.selectedStream);
    params.append('stream', filters.selectedStream);
  }

  const queryString = params.toString() ? `?${params.toString()}` : '';
  return request(`/colleges/home-feed${queryString}`);
}

/**
 * Toggle college bookmark status
 * Aligned with Dilep's POST /api/wishlist/toggle endpoint
 */
export async function toggleWishlist(collegeId) {
  return request('/wishlist/toggle', {
    method: 'POST',
    body: JSON.stringify({ collegeId }),
  });
}