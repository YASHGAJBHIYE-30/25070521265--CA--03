import { useState, useCallback } from 'react';
import api from '../services/api';

export const useDashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    finishedThisYear: 0,
    pagesRead: 0,
    averageRating: 0,
    currentlyReading: [],
    monthlyFinished: Array(12).fill(0),
    yearlyGoal: 12
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/books/stats');
      const data = response.data.stats || response.data;
      setStats((prev) => ({
        ...prev,
        ...data,
        // Ensure monthlyFinished has 12 items
        monthlyFinished: Array.isArray(data.monthlyFinished) && data.monthlyFinished.length === 12
          ? data.monthlyFinished
          : prev.monthlyFinished
      }));
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch dashboard stats';
      setError(msg);
      // Return null or throw depending on consumer
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stats,
    setStats,
    loading,
    error,
    fetchStats
  };
};

export default useDashboard;
