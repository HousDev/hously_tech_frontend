// components/VisitorTracker.tsx
import { useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const VisitorTracker = () => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Only track on production or when explicitly enabled
        if (import.meta.env.PROD || import.meta.env.VITE_TRACK_VISITS === 'true') {
          await axios.post(`${API_BASE_URL}/analytics/track-visit`, {
            page_url: window.location.href,
            referrer: document.referrer
          });
        }
      } catch (error) {
        console.error('Failed to track visit:', error);
        // Silently fail - don't affect user experience
      }
    };

    trackVisit();
  }, []);

  // This component doesn't render anything
  return null;
};

export default VisitorTracker;