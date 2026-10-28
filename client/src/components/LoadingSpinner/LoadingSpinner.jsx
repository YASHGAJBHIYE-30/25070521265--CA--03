import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({
  fullPage = false,
  size = 'md',
  message = 'Loading...',
  className = ''
}) => {
  if (fullPage) {
    return (
      <div className={`spinner-full-page ${className}`} role="status" aria-live="polite">
        <div className={`spinner-circle size-lg`} />
        {message && <p className="spinner-text">{message}</p>}
      </div>
    );
  }

  return (
    <div
      className={`spinner-circle size-${size} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

export default LoadingSpinner;
