import React, { useState, useEffect } from 'react';
import './ProgressBar.css';

const ProgressBar = ({
  current = 0,
  total = 0,
  showLabel = false,
  labelFormat = 'pages', // 'pages' | 'percentage' | 'both'
  size = 'md',
  className = ''
}) => {
  const [animatedWidth, setAnimatedWidth] = useState(0);

  const safeTotal = Number(total) > 0 ? Number(total) : 1;
  const safeCurrent = Math.min(Math.max(Number(current) || 0, 0), safeTotal);
  const percentage = Math.round((safeCurrent / safeTotal) * 100);

  useEffect(() => {
    // Trigger animation smoothly on mount or prop update
    const timer = setTimeout(() => {
      setAnimatedWidth(percentage);
    }, 50);
    return () => clearTimeout(timer);
  }, [percentage]);

  const getStatusClass = (pct) => {
    if (pct >= 100) return 'status-complete';
    if (pct >= 50) return 'status-mid';
    return 'status-low';
  };

  return (
    <div className={`progress-bar-wrapper ${className}`}>
      {showLabel && (
        <div className="progress-bar-label">
          {labelFormat === 'pages' && (
            <span>
              {safeCurrent} of {safeTotal} pages ({percentage}%)
            </span>
          )}
          {labelFormat === 'percentage' && <span>{percentage}%</span>}
          {labelFormat === 'both' && (
            <>
              <span>
                {safeCurrent} / {safeTotal} pages
              </span>
              <span>{percentage}%</span>
            </>
          )}
        </div>
      )}
      <div
        className={`progress-bar-track size-${size}`}
        role="progressbar"
        aria-valuenow={safeCurrent}
        aria-valuemin="0"
        aria-valuemax={safeTotal}
        aria-label="Reading progress"
      >
        <div
          className={`progress-bar-fill ${getStatusClass(percentage)}`}
          style={{ width: `${animatedWidth}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
