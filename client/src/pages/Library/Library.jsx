import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Filter,
  Trash2
} from 'lucide-react';
import useBooks from '../../hooks/useBooks';
import { useToast } from '../../context/ToastContext';
import BookCard from '../../components/BookCard/BookCard';
import { BookCardSkeleton } from '../../components/Skeleton/Skeleton';
import EmptyState from '../../components/EmptyState/EmptyState';
import Modal from '../../components/Modal/Modal';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import './Library.css';

const Library = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { books, pagination, loading, fetchBooks, updateBook, deleteBook } = useBooks();

  // URL state
  const searchTerm = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || '';
  const genreFilter = searchParams.get('genre') || '';
  const sortBy = searchParams.get('sort') || 'createdAt:desc';
  const currentPage = Number(searchParams.get('page')) || 1;

  // Local state for search debounce
  const [searchInput, setSearchInput] = useState(searchTerm);

  // Modals state
  const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, bookId: null, title: '' });
  const [progressModalState, setProgressModalState] = useState({
    isOpen: false,
    book: null,
    newPage: 0
  });

  // Keep searchInput synced with URL if changed elsewhere
  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  // Load books based on query parameters
  const loadBooks = useCallback(() => {
    const params = {
      page: currentPage,
      limit: 12
    };
    if (searchTerm) params.search = searchTerm;
    if (statusFilter && statusFilter !== 'All') params.status = statusFilter;
    if (genreFilter && genreFilter !== 'All') params.genre = genreFilter;
    if (sortBy) params.sort = sortBy;

    fetchBooks(params);
  }, [currentPage, searchTerm, statusFilter, genreFilter, sortBy, fetchBooks]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  // Helper to update search params
  const updateParam = (key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value && value !== 'All') {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      next.set('page', '1'); // Reset to page 1 on filter change
      return next;
    });
  };

  // Debounced search input handler
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== searchTerm) {
        updateParam('search', searchInput);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // Distinct genres from loaded books or defaults
  const uniqueGenres = useMemo(() => {
    const genresSet = new Set([
      'Fiction',
      'Non-Fiction',
      'Mystery',
      'Fantasy',
      'Sci-Fi',
      'Biography',
      'Philosophy',
      'History',
      'Classics'
    ]);
    books.forEach((b) => {
      if (b.genre && b.genre.trim()) {
        genresSet.add(b.genre.trim());
      }
    });
    return Array.from(genresSet).sort();
  }, [books]);

  // Handle Edit Action
  const handleEdit = (book) => {
    const id = book._id || book.id;
    navigate(`/books/${id}/edit`);
  };

  // Open Quick Progress Modal
  const handleOpenProgress = (book) => {
    setProgressModalState({
      isOpen: true,
      book,
      newPage: Number(book.currentPage) || 0
    });
  };

  // Submit Quick Progress
  const handleSaveProgress = async (e) => {
    e.preventDefault();
    const { book, newPage } = progressModalState;
    if (!book) return;

    const id = book._id || book.id;
    const pageNum = Number(newPage);
    const total = Number(book.totalPages) || 1;
    const newStatus = pageNum >= total ? 'Finished' : 'Currently Reading';

    try {
      await updateBook(id, {
        currentPage: pageNum,
        status: newStatus
      });
      showToast(
        pageNum >= total
          ? `Congratulations! You finished "${book.title}"!`
          : `Progress updated to page ${pageNum}.`,
        'success'
      );
      setProgressModalState({ isOpen: false, book: null, newPage: 0 });
      loadBooks();
    } catch (err) {
      showToast('Failed to update progress', 'error');
    }
  };

  // Open Delete Confirmation
  const handleOpenDelete = (bookId) => {
    const targetBook = books.find((b) => (b._id || b.id) === bookId);
    setDeleteModalState({
      isOpen: true,
      bookId,
      title: targetBook?.title || 'this book'
    });
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteModalState.bookId) return;
    try {
      await deleteBook(deleteModalState.bookId);
      showToast('Book removed from your library', 'info');
      setDeleteModalState({ isOpen: false, bookId: null, title: '' });
      loadBooks();
    } catch (err) {
      showToast('Failed to delete book', 'error');
    }
  };

  // Change page
  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', newPage.toString());
      return next;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isFiltered = Boolean(searchTerm || statusFilter || genreFilter);

  return (
    <div className="page library-page">
      <div className="container">
        {/* Header */}
        <header className="library-header">
          <div>
            <h1 className="library-title">My Library</h1>
            <p className="library-subtitle">
              Browse, search, and manage your literary collection.
            </p>
          </div>
          <Link to="/books/add" className="btn btn-primary">
            <Plus size={18} />
            <span>Add Book</span>
          </Link>
        </header>

        {/* Filter / Search Bar */}
        <section className="library-filter-bar" aria-label="Book search and filters">
          <div className="search-box-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by title or author..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Search books"
            />
          </div>

          <div className="filter-selects-group">
            {/* Status Filter */}
            <select
              className="filter-select"
              value={statusFilter || 'All'}
              onChange={(e) => updateParam('status', e.target.value)}
              aria-label="Filter by status"
            >
              <option value="All">All Statuses</option>
              <option value="Want to Read">Want to Read</option>
              <option value="Currently Reading">Currently Reading</option>
              <option value="Finished">Finished</option>
            </select>

            {/* Genre Filter */}
            <select
              className="filter-select"
              value={genreFilter || 'All'}
              onChange={(e) => updateParam('genre', e.target.value)}
              aria-label="Filter by genre"
            >
              <option value="All">All Genres</option>
              {uniqueGenres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            {/* Sort Filter */}
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => updateParam('sort', e.target.value)}
              aria-label="Sort books"
            >
              <option value="createdAt:desc">Date Added (Newest)</option>
              <option value="createdAt:asc">Date Added (Oldest)</option>
              <option value="title:asc">Title (A-Z)</option>
              <option value="title:desc">Title (Z-A)</option>
              <option value="rating:desc">Highest Rated</option>
            </select>
          </div>
        </section>

        {/* Book Grid */}
        {loading ? (
          <div className="books-grid">
            {Array.from({ length: 8 }).map((_, idx) => (
              <BookCardSkeleton key={idx} />
            ))}
          </div>
        ) : books && books.length > 0 ? (
          <>
            <div className="books-grid">
              {books.map((book) => (
                <BookCard
                  key={book._id || book.id}
                  book={book}
                  onEdit={handleEdit}
                  onDelete={handleOpenDelete}
                  onUpdateProgress={handleOpenProgress}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <nav className="pagination-wrapper" aria-label="Library pagination">
                <button
                  type="button"
                  className="pagination-btn"
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                <span className="pagination-page-indicator">
                  Page {currentPage} of {pagination.totalPages}
                </span>

                <button
                  type="button"
                  className="pagination-btn"
                  disabled={currentPage >= pagination.totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  aria-label="Next page"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </nav>
            )}
          </>
        ) : (
          <EmptyState
            icon={BookOpen}
            title={isFiltered ? 'No matching books found' : 'Your library is empty'}
            description={
              isFiltered
                ? 'Try adjusting your search keywords or resetting your filters.'
                : 'Start tracking your reading by adding your very first book.'
            }
            actionLabel={isFiltered ? 'Clear Filters' : 'Add Your First Book'}
            onAction={
              isFiltered
                ? () => setSearchParams({})
                : () => navigate('/books/add')
            }
          />
        )}
      </div>

      {/* Quick Progress Modal */}
      <Modal
        isOpen={progressModalState.isOpen}
        onClose={() => setProgressModalState({ isOpen: false, book: null, newPage: 0 })}
        title={`Update Progress: ${progressModalState.book?.title || ''}`}
      >
        {progressModalState.book && (
          <form onSubmit={handleSaveProgress} className="quick-progress-form">
            <p className="text-small text-muted">
              Author: {progressModalState.book.author} • Total Pages:{' '}
              {progressModalState.book.totalPages}
            </p>

            <ProgressBar
              current={progressModalState.newPage}
              total={progressModalState.book.totalPages}
              showLabel
              size="md"
            />

            <div className="input-group" style={{ marginTop: 'var(--space-3)' }}>
              <label className="input-label" htmlFor="quick-current-page">
                Current Page
              </label>
              <input
                id="quick-current-page"
                type="number"
                min="0"
                max={progressModalState.book.totalPages}
                className="input"
                value={progressModalState.newPage}
                onChange={(e) =>
                  setProgressModalState((prev) => ({
                    ...prev,
                    newPage: Number(e.target.value)
                  }))
                }
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() =>
                  setProgressModalState({ isOpen: false, book: null, newPage: 0 })
                }
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Save Progress
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, bookId: null, title: '' })}
        title="Remove Book"
      >
        <p className="text-small" style={{ marginBottom: 'var(--space-6)' }}>
          Are you sure you want to remove <strong>"{deleteModalState.title}"</strong> from your library?
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() =>
              setDeleteModalState({ isOpen: false, bookId: null, title: '' })
            }
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={handleConfirmDelete}
          >
            <Trash2 size={16} />
            <span>Delete Book</span>
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Library;
