import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, BookOpen } from 'lucide-react';
import api from '../../services/api';
import useBooks from '../../hooks/useBooks';
import { useToast } from '../../context/ToastContext';
import StarRating from '../../components/StarRating/StarRating';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './BookForm.css';

const GENRES = [
  'Fiction',
  'Non-Fiction',
  'Mystery',
  'Fantasy',
  'Science Fiction',
  'Biography',
  'Philosophy',
  'Romance',
  'Historical Fiction',
  'History',
  'Thriller',
  'Self-Help',
  'Poetry',
  'Classics'
];

const BookForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { createBook, updateBook } = useBooks();

  const [loadingBook, setLoadingBook] = useState(isEdit || Boolean(id));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: 'Fiction',
    totalPages: '',
    currentPage: '0',
    status: 'Want to Read',
    coverImage: '',
    rating: 0,
    review: ''
  });

  const [errors, setErrors] = useState({});
  const [coverPreviewError, setCoverPreviewError] = useState(false);

  // Fetch book if editing
  useEffect(() => {
    if (id) {
      const fetchBookData = async () => {
        try {
          setLoadingBook(true);
          const res = await api.get(`/books/${id}`);
          const book = res.data.book || res.data;
          setFormData({
            title: book.title || '',
            author: book.author || '',
            genre: book.genre || 'Fiction',
            totalPages: book.totalPages ? String(book.totalPages) : '',
            currentPage: book.currentPage !== undefined ? String(book.currentPage) : '0',
            status: book.status || 'Want to Read',
            coverImage: book.coverImage || book.coverUrl || '',
            rating: Number(book.rating) || 0,
            review: book.review || ''
          });
        } catch (err) {
          showToast('Failed to load book details for editing', 'error');
          navigate('/library');
        } finally {
          setLoadingBook(false);
        }
      };

      fetchBookData();
    }
  }, [id, navigate, showToast]);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Title is required';
    }
    if (!formData.author.trim()) {
      errs.author = 'Author is required';
    }
    const total = Number(formData.totalPages);
    if (!formData.totalPages || isNaN(total) || total < 1) {
      errs.totalPages = 'Total pages must be at least 1';
    }
    const current = Number(formData.currentPage);
    if (isNaN(current) || current < 0) {
      errs.currentPage = 'Current page cannot be negative';
    } else if (total && current > total) {
      errs.currentPage = `Current page cannot exceed total pages (${total})`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };

    // Auto synchronize status and page counts
    if (name === 'currentPage') {
      const current = Number(value);
      const total = Number(formData.totalPages);
      if (total > 0 && current >= total) {
        updated.status = 'Finished';
      } else if (current > 0 && updated.status === 'Want to Read') {
        updated.status = 'Currently Reading';
      }
    } else if (name === 'status') {
      const total = Number(formData.totalPages);
      if (value === 'Finished' && total > 0) {
        updated.currentPage = String(total);
      } else if (value === 'Want to Read') {
        updated.currentPage = '0';
      }
    } else if (name === 'coverImage') {
      setCoverPreviewError(false);
    }

    setFormData(updated);

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRatingChange = (newRating) => {
    setFormData((prev) => ({ ...prev, rating: newRating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      genre: formData.genre.trim(),
      totalPages: Number(formData.totalPages),
      currentPage: Number(formData.currentPage) || 0,
      status: formData.status,
      coverImage: formData.coverImage.trim(),
      coverUrl: formData.coverImage.trim(),
      rating: Number(formData.rating) || 0,
      review: formData.review.trim()
    };

    try {
      setIsSubmitting(true);
      if (id) {
        await updateBook(id, payload);
        showToast('Book updated successfully!', 'success');
        navigate(`/books/${id}`);
      } else {
        await createBook(payload);
        showToast('New book added to your library!', 'success');
        navigate('/library');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save book', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingBook) {
    return <LoadingSpinner fullPage message="Loading book details..." />;
  }

  const isEditing = Boolean(id);

  return (
    <div className="page book-form-page">
      <div className="container book-form-container">
        {/* Header */}
        <div className="form-header">
          <div className="flex items-center gap-3">
            <Link
              to={isEditing ? `/books/${id}` : '/library'}
              className="btn btn-icon btn-ghost"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="form-header-title">
              {isEditing ? 'Edit Book' : 'Add a New Book'}
            </h1>
          </div>
        </div>

        {/* Card Form */}
        <form onSubmit={handleSubmit} className="form-card" noValidate>
          {/* Title & Author */}
          <div className="form-grid-2">
            <div className="input-group">
              <label className="input-label" htmlFor="title">
                Book Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. Pride and Prejudice"
                className={`input ${errors.title ? 'input-error' : ''}`}
                value={formData.title}
                onChange={handleChange}
                required
              />
              {errors.title && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {errors.title}
                </span>
              )}
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="author">
                Author *
              </label>
              <input
                id="author"
                name="author"
                type="text"
                placeholder="e.g. Jane Austen"
                className={`input ${errors.author ? 'input-error' : ''}`}
                value={formData.author}
                onChange={handleChange}
                required
              />
              {errors.author && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {errors.author}
                </span>
              )}
            </div>
          </div>

          {/* Genre & Status */}
          <div className="form-grid-2">
            <div className="input-group">
              <label className="input-label" htmlFor="genre">
                Genre
              </label>
              <select
                id="genre"
                name="genre"
                className="select"
                value={formData.genre}
                onChange={handleChange}
              >
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="status">
                Reading Status
              </label>
              <select
                id="status"
                name="status"
                className="select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Want to Read">Want to Read</option>
                <option value="Currently Reading">Currently Reading</option>
                <option value="Finished">Finished</option>
              </select>
            </div>
          </div>

          {/* Total Pages & Current Page */}
          <div className="form-grid-2">
            <div className="input-group">
              <label className="input-label" htmlFor="totalPages">
                Total Pages *
              </label>
              <input
                id="totalPages"
                name="totalPages"
                type="number"
                min="1"
                placeholder="e.g. 432"
                className={`input ${errors.totalPages ? 'input-error' : ''}`}
                value={formData.totalPages}
                onChange={handleChange}
                required
              />
              {errors.totalPages && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {errors.totalPages}
                </span>
              )}
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="currentPage">
                Current Page
              </label>
              <input
                id="currentPage"
                name="currentPage"
                type="number"
                min="0"
                placeholder="e.g. 120"
                className={`input ${errors.currentPage ? 'input-error' : ''}`}
                value={formData.currentPage}
                onChange={handleChange}
              />
              {errors.currentPage && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {errors.currentPage}
                </span>
              )}
            </div>
          </div>

          {/* Cover Image URL with Live Preview */}
          <div className="input-group">
            <label className="input-label" htmlFor="coverImage">
              Cover Image URL (optional)
            </label>
            <div className="cover-preview-wrapper">
              <div className="cover-preview-box">
                {formData.coverImage && !coverPreviewError ? (
                  <img
                    src={formData.coverImage}
                    alt="Cover preview"
                    className="cover-preview-img"
                    onError={() => setCoverPreviewError(true)}
                  />
                ) : (
                  <span className="cover-preview-placeholder">
                    {formData.coverImage ? 'Invalid URL' : 'Preview'}
                  </span>
                )}
              </div>
              <div className="cover-input-side">
                <input
                  id="coverImage"
                  name="coverImage"
                  type="url"
                  placeholder="https://images-na.ssl-images-amazon.com/..."
                  className="input"
                  value={formData.coverImage}
                  onChange={handleChange}
                />
                <span className="input-helper">
                  Paste a direct link to an image cover (JPEG, PNG, WebP)
                </span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="rating-form-group">
            <label className="input-label">Your Rating</label>
            <StarRating
              value={formData.rating}
              onChange={handleRatingChange}
              size={24}
              showValue
            />
          </div>

          {/* Review */}
          <div className="input-group">
            <label className="input-label" htmlFor="review">
              Notes & Review (optional)
            </label>
            <textarea
              id="review"
              name="review"
              placeholder="What made this story special? Key themes, quotes, or personal reflections..."
              className="textarea"
              rows={4}
              value={formData.review}
              onChange={handleChange}
            />
          </div>

          {/* Form Actions */}
          <div className="form-actions-row">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate(isEditing ? `/books/${id}` : '/library')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" />
                  <span>Saving Book...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>{isEditing ? 'Save Changes' : 'Add to Library'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
