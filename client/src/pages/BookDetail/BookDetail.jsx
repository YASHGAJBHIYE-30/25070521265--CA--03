import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Calendar,
  BookOpen,
  Check,
  Save,
  MessageSquare
} from 'lucide-react';
import api from '../../services/api';
import useBooks from '../../hooks/useBooks';
import { useToast } from '../../context/ToastContext';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import StarRating from '../../components/StarRating/StarRating';
import Modal from '../../components/Modal/Modal';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './BookDetail.css';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { updateBook, deleteBook } = useBooks();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverImgError, setCoverImgError] = useState(false);

  // Quick page progress state
  const [pageInput, setPageInput] = useState('');
  const [isUpdatingPage, setIsUpdatingPage] = useState(false);

  // Review editing state
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [reviewInput, setReviewInput] = useState('');
  const [isSavingReview, setIsSavingReview] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/books/${id}`);
        const data = res.data.book || res.data;
        setBook(data);
        setPageInput(String(data.currentPage || 0));
        setReviewInput(data.review || '');
      } catch (err) {
        showToast('Book not found or failed to load', 'error');
        navigate('/library');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id, navigate, showToast]);

  if (loading) {
    return <LoadingSpinner fullPage message="Loading book details..." />;
  }

  if (!book) {
    return null;
  }

  const cover = book.coverImage || book.coverUrl;
  const currentPage = Number(book.currentPage) || 0;
  const totalPages = Number(book.totalPages) || 1;
  const rating = Number(book.rating) || 0;

  // Handle interactive rating change directly on details page
  const handleRatingChange = async (newRating) => {
    try {
      const updated = await updateBook(id, { rating: newRating });
      setBook((prev) => ({ ...prev, rating: newRating }));
      showToast(`Rating set to ${newRating} star${newRating === 1 ? '' : 's'}!`, 'success');
    } catch (err) {
      showToast('Failed to update rating', 'error');
    }
  };

  // Handle progress page update
  const handleUpdatePageProgress = async (e) => {
    e.preventDefault();
    const newPageNum = Number(pageInput);
    if (isNaN(newPageNum) || newPageNum < 0 || newPageNum > totalPages) {
      showToast(`Page must be between 0 and ${totalPages}`, 'error');
      return;
    }

    const newStatus = newPageNum >= totalPages ? 'Finished' : 'Currently Reading';

    try {
      setIsUpdatingPage(true);
      await updateBook(id, {
        currentPage: newPageNum,
        status: newStatus
      });
      setBook((prev) => ({
        ...prev,
        currentPage: newPageNum,
        status: newStatus
      }));
      showToast(
        newPageNum >= totalPages
          ? `🎉 You finished "${book.title}"!`
          : `Progress updated to page ${newPageNum}.`,
        'success'
      );
    } catch (err) {
      showToast('Failed to update progress', 'error');
    } finally {
      setIsUpdatingPage(false);
    }
  };

  // Handle Review save
  const handleSaveReview = async () => {
    try {
      setIsSavingReview(true);
      await updateBook(id, { review: reviewInput.trim() });
      setBook((prev) => ({ ...prev, review: reviewInput.trim() }));
      setIsEditingReview(false);
      showToast('Review updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to save review', 'error');
    } finally {
      setIsSavingReview(false);
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteBook(id);
      showToast('Book removed from your library', 'info');
      navigate('/library');
    } catch (err) {
      showToast('Failed to delete book', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (st) => {
    const normalized = (st || '').toLowerCase().replace(/\s+/g, '-');
    if (normalized.includes('reading')) {
      return <span className="badge badge-reading">Currently Reading</span>;
    }
    if (normalized.includes('finish') || normalized.includes('read')) {
      return <span className="badge badge-finished">Finished</span>;
    }
    return <span className="badge badge-want-to-read">Want to Read</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="page book-detail-page">
      <div className="container book-detail-container">
        {/* Navigation Row */}
        <div className="book-detail-nav">
          <Link to="/library" className="btn btn-ghost btn-sm">
            <ArrowLeft size={16} />
            <span>Back to Library</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to={`/books/${id}/edit`} className="btn btn-outline btn-sm">
              <Pencil size={15} />
              <span>Edit</span>
            </Link>
            <button
              type="button"
              className="btn btn-ghost btn-sm text-error"
              onClick={() => setDeleteModalOpen(true)}
              aria-label="Delete book"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Main Book Detail Grid */}
        <div className="book-detail-grid">
          {/* Left Column: Cover & Quick Actions */}
          <div className="detail-cover-side">
            <div className="detail-cover-box">
              {cover && !coverImgError ? (
                <img
                  src={cover}
                  alt={book.title}
                  className="detail-cover-img"
                  onError={() => setCoverImgError(true)}
                />
              ) : (
                <div className="detail-cover-fallback">
                  <span className="detail-fallback-initials">
                    {book.title?.slice(0, 2).toUpperCase() || 'BK'}
                  </span>
                  <span className="detail-fallback-title">{book.title}</span>
                </div>
              )}
            </div>

            <div className="detail-actions-stacked">
              <Link to={`/books/${id}/edit`} className="btn btn-primary btn-md">
                <Pencil size={16} />
                <span>Edit Book Details</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Information, Progress, Review */}
          <div className="detail-content-side">
            <div className="detail-header-block">
              <div className="detail-badges-row">
                {getStatusBadge(book.status)}
                {book.genre && <span className="genre-tag">{book.genre}</span>}
              </div>

              <h1 className="detail-title">{book.title}</h1>
              <p className="detail-author">by {book.author}</p>
            </div>

            {/* Interactive Rating */}
            <div className="detail-section">
              <span className="detail-section-title">Your Rating</span>
              <StarRating
                value={rating}
                onChange={handleRatingChange}
                size={28}
                showValue
              />
            </div>

            {/* Reading Progress */}
            <div className="detail-section">
              <span className="detail-section-title">
                <BookOpen size={16} />
                <span>Reading Progress</span>
              </span>

              <ProgressBar
                current={currentPage}
                total={totalPages}
                showLabel
                labelFormat="both"
                size="lg"
              />

              <form onSubmit={handleUpdatePageProgress} className="progress-control-row">
                <div className="page-input-wrapper">
                  <label htmlFor="detail-current-page" className="text-small text-muted">
                    Update Page:
                  </label>
                  <input
                    id="detail-current-page"
                    type="number"
                    min="0"
                    max={totalPages}
                    className="page-num-input"
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                  />
                  <span className="text-small text-muted">/ {totalPages}</span>
                </div>

                <button
                  type="submit"
                  className="btn btn-secondary btn-sm"
                  disabled={isUpdatingPage || Number(pageInput) === currentPage}
                >
                  {isUpdatingPage ? <span className="spinner" /> : <Check size={16} />}
                  <span>Save Page</span>
                </button>
              </form>
            </div>

            {/* Dates Row */}
            {(book.startDate || book.finishDate || book.createdAt) && (
              <div className="dates-meta-row">
                {book.startDate && (
                  <span className="date-meta-item">
                    <Calendar size={14} />
                    Started: {formatDate(book.startDate)}
                  </span>
                )}
                {book.finishDate && (
                  <span className="date-meta-item">
                    <Calendar size={14} />
                    Finished: {formatDate(book.finishDate)}
                  </span>
                )}
                {book.createdAt && (
                  <span className="date-meta-item">
                    Added to library: {formatDate(book.createdAt)}
                  </span>
                )}
              </div>
            )}

            {/* Review Section */}
            <div className="detail-section">
              <div className="flex justify-between items-center">
                <span className="detail-section-title">
                  <MessageSquare size={16} />
                  <span>Notes & Reflections</span>
                </span>
                {!isEditingReview && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setIsEditingReview(true)}
                  >
                    <Pencil size={14} />
                    <span>{book.review ? 'Edit Review' : 'Add Review'}</span>
                  </button>
                )}
              </div>

              {isEditingReview ? (
                <div className="flex flex-col gap-3 mt-2">
                  <textarea
                    rows={5}
                    className="textarea"
                    placeholder="Write your notes, favourite quotes, or review here..."
                    value={reviewInput}
                    onChange={(e) => setReviewInput(e.target.value)}
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setReviewInput(book.review || '');
                        setIsEditingReview(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleSaveReview}
                      disabled={isSavingReview}
                    >
                      {isSavingReview ? <span className="spinner" /> : <Save size={14} />}
                      <span>Save Review</span>
                    </button>
                  </div>
                </div>
              ) : book.review ? (
                <p className="review-display-text">“{book.review}”</p>
              ) : (
                <p className="text-small text-muted">
                  No notes or review written yet. Click above to jot down your thoughts!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Book"
      >
        <p className="text-small" style={{ marginBottom: 'var(--space-6)' }}>
          Are you sure you want to permanently delete <strong>"{book.title}"</strong>?
          All associated reading progress and notes will be removed.
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setDeleteModalOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <span className="spinner" /> : <Trash2 size={16} />}
            <span>Delete Book</span>
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default BookDetail;
