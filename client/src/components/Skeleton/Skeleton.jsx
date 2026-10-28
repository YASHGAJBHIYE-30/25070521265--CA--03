import React from 'react';
import './Skeleton.css';

export const Skeleton = ({
  width = '100%',
  height = '20px',
  borderRadius = 'var(--radius-sm)',
  className = ''
}) => {
  return (
    <div
      className={`skeleton-box ${className}`}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  );
};

export const BookCardSkeleton = () => {
  return (
    <div className="skeleton-book-card" aria-hidden="true">
      <Skeleton className="skeleton-book-cover" height="180px" />
      <div className="skeleton-book-body">
        <Skeleton className="skeleton-title" />
        <Skeleton className="skeleton-author" />
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Skeleton className="skeleton-progress" />
          <Skeleton className="skeleton-stars" />
        </div>
      </div>
    </div>
  );
};

export const StatCardSkeleton = () => {
  return (
    <div className="skeleton-stat-card" aria-hidden="true">
      <Skeleton className="skeleton-stat-icon" width="48px" height="48px" borderRadius="var(--radius-full)" />
      <div className="skeleton-stat-content">
        <Skeleton className="skeleton-stat-value" />
        <Skeleton className="skeleton-stat-label" />
      </div>
    </div>
  );
};

export default Skeleton;
