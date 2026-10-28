import React from 'react';
import { BookOpen } from 'lucide-react';
import './EmptyState.css';

const EmptyState = ({
  icon: Icon = BookOpen,
  title = 'No items found',
  description = 'There are no items to display at this moment.',
  actionLabel = null,
  onAction = null,
  className = ''
}) => {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-state-icon">
        <Icon size={36} strokeWidth={1.5} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          className="btn btn-primary btn-md"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
