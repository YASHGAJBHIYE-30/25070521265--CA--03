import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, BookOpen, Trash2 } from 'lucide-react';
import ProgressBar from '../ProgressBar/ProgressBar';
import StarRating from '../StarRating/StarRating';
import './BookCard.css';

const BookCard = ({
  book,
  onEdit = null,
  onDelete = null,
  onUpdateProgress = null
}) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const id = book._id || book.id;
  const title = book.title || 'Untitled Book';
  const author = book.author || 'Unknown Author';
  const status = book.status || 'Want to Read';
  const coverImage = book.coverImage || book.coverUrl;
  const currentPage = Number(book.currentPage) || 0;
  const totalPages = Number(book.totalPages) || 0;
  const rating = Number(book.rating) || 0;

  const handleCardClick = () => {
    navigate(`/books/${id}`);
  };

  const getStatusBadge = (st) => {
    const normalized = st.toLowerCase().replace(/\s+/g, '-');
    if (normalized.includes('reading')) {
      return <span className="badge badge-reading">Reading</span>;
    }
    if (normalized.includes('finish') || normalized.includes('read')) {
      return <span className="badge badge-finished">Finished</span>;
    }
    return <span className="badge badge-want-to-read">Want to Read</span>;
  };

  const getInitials = (text) => {
    return text
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('');
  };

  return (
    <div
      className="book-card"
      onClick={handleCardClick}
      role="article"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleCardClick();
      }}
      aria-label={`Book: ${title} by ${author}`}
    >
      <div className="book-cover-container">
        <div className="book-badge-wrapper">{getStatusBadge(status)}</div>

        {coverImage && !imgError ? (
          <img
            src={coverImage}
            alt={title}
            className="book-cover-img"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="book-cover-fallback">
            <span className="fallback-initials">{getInitials(title)}</span>
            <span className="fallback-title">{title}</span>
          </div>
        )}

        {/* Quick Action Overlay on Hover */}
        <div
          className="book-quick-actions"
          onClick={(e) => e.stopPropagation()}
        >
          {onEdit && (
            <button
              type="button"
              className="quick-action-btn btn-edit"
              onClick={() => onEdit(book)}
              aria-label="Edit book"
              title="Edit book"
            >
              <Pencil size={16} />
            </button>
          )}

          {onUpdateProgress && status !== 'Finished' && (
            <button
              type="button"
              className="quick-action-btn btn-progress"
              onClick={() => onUpdateProgress(book)}
              aria-label="Update progress"
              title="Update progress"
            >
              <BookOpen size={16} />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              className="quick-action-btn btn-delete"
              onClick={() => onDelete(id)}
              aria-label="Delete book"
              title="Delete book"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="book-info">
        <h4 className="book-title" title={title}>
          {title}
        </h4>
        <p className="book-author" title={author}>
          {author}
        </p>

        <div className="book-card-footer">
          {totalPages > 0 && (
            <ProgressBar
              current={currentPage}
              total={totalPages}
              showLabel={true}
              size="sm"
            />
          )}

          {rating > 0 && (
            <div className="book-card-rating">
              <StarRating value={rating} readonly={true} size={14} showValue />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
