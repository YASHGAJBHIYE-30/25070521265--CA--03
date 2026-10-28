import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle,
  FileText,
  Star,
  Plus,
  ArrowRight,
  TrendingUp,
  Target
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import useDashboard from '../../hooks/useDashboard';
import useBooks from '../../hooks/useBooks';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import { StatCardSkeleton } from '../../components/Skeleton/Skeleton';
import EmptyState from '../../components/EmptyState/EmptyState';
import './Dashboard.css';

// Animated Count-Up Hook
const useCountUp = (targetValue, duration = 1000) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const end = Number(targetValue) || 0;
    if (end === 0) {
      setDisplayValue(0);
      return;
    }

    const startTime = performance.now();
    let frameId;

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const current = Math.floor(progress * end);
      setDisplayValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(updateCount);
      } else {
        setDisplayValue(end);
      }
    };

    frameId = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(frameId);
  }, [targetValue, duration]);

  return displayValue;
};

const Dashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { stats, loading, fetchStats } = useDashboard();
  const { updateBook } = useBooks();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const animatedTotal = useCountUp(stats?.totalBooks || 0);
  const animatedFinished = useCountUp(stats?.finishedThisYear || 0);
  const animatedPages = useCountUp(stats?.pagesRead || 0);

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  // Quick increment reading book page
  const handleQuickIncrement = async (book, e) => {
    e.stopPropagation();
    const id = book._id || book.id;
    const current = Number(book.currentPage) || 0;
    const total = Number(book.totalPages) || current + 1;
    const newPage = Math.min(current + 10, total);
    const newStatus = newPage >= total ? 'Finished' : 'Currently Reading';

    try {
      await updateBook(id, {
        currentPage: newPage,
        status: newStatus
      });
      showToast(
        newPage >= total
          ? `Congratulations! You finished "${book.title}"!`
          : `Updated "${book.title}" to page ${newPage}`,
        'success'
      );
      fetchStats();
    } catch (err) {
      showToast('Could not update progress', 'error');
    }
  };

  // Yearly Goal calculations
  const yearlyGoal = user?.yearlyGoal || stats?.yearlyGoal || 12;
  const finishedCount = stats?.finishedThisYear || 0;
  const goalPercentage = Math.min(Math.round((finishedCount / yearlyGoal) * 100), 100);

  // SVG Ring calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (goalPercentage / 100) * circumference;

  const getRingColor = (pct) => {
    if (pct >= 80) return 'var(--color-success)';
    if (pct >= 50) return 'var(--color-secondary)';
    return 'var(--color-primary)';
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyData = stats?.monthlyFinished || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const maxMonthValue = Math.max(...monthlyData, 4);

  return (
    <div className="page dashboard-page">
      <div className="container">
        {/* Welcome Header */}
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              Welcome back, {user?.name || 'Reader'}
            </h1>
            <p className="dashboard-date">{formattedDate}</p>
          </div>
          <Link to="/books/add" className="btn btn-primary">
            <Plus size={18} />
            <span>Add Book</span>
          </Link>
        </header>

        {/* 4 Stat Cards */}
        <section className="dashboard-stats-grid" aria-label="Reading Statistics">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <div className="stat-card">
                <div className="stat-card-icon stat-icon-primary">
                  <BookOpen size={24} />
                </div>
                <div className="stat-card-content">
                  <span className="stat-card-value">{animatedTotal}</span>
                  <span className="stat-card-label">Total Books</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-icon stat-icon-success">
                  <CheckCircle size={24} />
                </div>
                <div className="stat-card-content">
                  <span className="stat-card-value">{animatedFinished}</span>
                  <span className="stat-card-label">Finished This Year</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-icon stat-icon-secondary">
                  <FileText size={24} />
                </div>
                <div className="stat-card-content">
                  <span className="stat-card-value">{animatedPages.toLocaleString()}</span>
                  <span className="stat-card-label">Pages Read</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-icon stat-icon-secondary">
                  <Star size={24} />
                </div>
                <div className="stat-card-content">
                  <span className="stat-card-value">
                    {stats?.averageRating ? Number(stats.averageRating).toFixed(1) : '0.0'}
                  </span>
                  <span className="stat-card-label">Average Rating</span>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Middle Section: Currently Reading + Goal Ring */}
        <div className="dashboard-middle-grid">
          {/* Currently Reading */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title">Currently Reading</h2>
              <Link to="/library?status=Currently Reading" className="btn btn-ghost btn-sm">
                <span>View Library</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {stats?.currentlyReading && stats.currentlyReading.length > 0 ? (
              <div className="currently-reading-list">
                {stats.currentlyReading.map((book) => {
                  const id = book._id || book.id;
                  const cover = book.coverImage || book.coverUrl;
                  const current = Number(book.currentPage) || 0;
                  const total = Number(book.totalPages) || 0;

                  return (
                    <div
                      key={id}
                      className="reading-item"
                      onClick={() => navigate(`/books/${id}`)}
                      role="button"
                      tabIndex={0}
                    >
                      {cover ? (
                        <img
                          src={cover}
                          alt={book.title}
                          className="reading-item-cover"
                        />
                      ) : (
                        <div className="reading-item-cover-fallback">
                          {book.title?.charAt(0) || 'B'}
                        </div>
                      )}

                      <div className="reading-item-details">
                        <span className="reading-item-title">{book.title}</span>
                        <span className="reading-item-author">{book.author}</span>
                        {total > 0 && (
                          <ProgressBar
                            current={current}
                            total={total}
                            showLabel
                            size="sm"
                          />
                        )}
                      </div>

                      <div className="reading-item-actions">
                        <button
                          type="button"
                          className="quick-inc-btn"
                          onClick={(e) => handleQuickIncrement(book, e)}
                          title="Quick add +10 pages"
                          aria-label={`Add 10 pages to ${book.title}`}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={BookOpen}
                title="No books in progress"
                description="Pick a book from your library or add a new one to start tracking your reading."
                actionLabel="Explore Library"
                onAction={() => navigate('/library')}
              />
            )}
          </div>

          {/* Reading Goal Progress Ring */}
          <div className="section-card goal-ring-card">
            <h2 className="section-card-title">
              {new Date().getFullYear()} Reading Goal
            </h2>

            <div className="goal-svg-container">
              <svg className="goal-svg" viewBox="0 0 160 160">
                <circle
                  className="goal-svg-bg"
                  cx="80"
                  cy="80"
                  r={radius}
                  strokeWidth="12"
                />
                <circle
                  className="goal-svg-progress"
                  cx="80"
                  cy="80"
                  r={radius}
                  strokeWidth="12"
                  stroke={getRingColor(goalPercentage)}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>

              <div className="goal-center-text">
                <span className="goal-center-count">
                  {finishedCount} of {yearlyGoal}
                </span>
                <span className="goal-center-sub">books completed</span>
              </div>
            </div>

            <p className="goal-tagline">
              {goalPercentage >= 100
                ? '🎉 Fantastic! You achieved your yearly reading target!'
                : `${goalPercentage}% completed towards your annual milestone.`}
            </p>
          </div>
        </div>

        {/* Monthly Reading Chart */}
        <section className="monthly-chart-card">
          <div className="chart-header">
            <div>
              <h2 className="chart-title">Monthly Reading Activity</h2>
              <span className="chart-subtitle">Books completed per month in {new Date().getFullYear()}</span>
            </div>
          </div>

          <div className="chart-container" role="img" aria-label="Monthly books read chart">
            {months.map((month, idx) => {
              const val = monthlyData[idx] || 0;
              const barHeightPct = Math.round((val / maxMonthValue) * 100);

              return (
                <div key={month} className="chart-column">
                  <div className="chart-tooltip">
                    {val} book{val === 1 ? '' : 's'}
                  </div>
                  <div className="chart-bar-wrap">
                    <div
                      className={`chart-bar ${val > 0 ? 'active' : ''}`}
                      style={{ height: `${Math.max(barHeightPct, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="chart-month-labels">
            {months.map((month) => (
              <span key={month} className="chart-month-label">
                {month}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
