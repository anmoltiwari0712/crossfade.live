import { useState, useEffect } from 'react';

const DEFAULT_STATS = {
  installs: '400+',
  impressions: '2,500+',
  activeUsers: '400+',
  rating: '5.0',
  ratingCount: '12',
  period: 'last 7 days',
};

export function useStoreStats() {
  const [stats, setStats] = useState(DEFAULT_STATS);

  useEffect(() => {
    let isMounted = true;

    fetch('/api/stats')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && isMounted) {
          setStats((prev) => ({
            ...prev,
            ...data,
          }));
        }
      })
      .catch(() => {
        // Silently use defaults if offline or build preview
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return stats;
}
