import { useState, useCallback } from 'react';
import api from '../services/api';

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalBooks: 0,
    hasMore: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBooks = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/books', { params });
      const data = response.data;

      if (Array.isArray(data)) {
        setBooks(data);
        setPagination({
          page: 1,
          totalPages: 1,
          totalBooks: data.length,
          hasMore: false
        });
      } else if (data && data.books) {
        setBooks(data.books);
        setPagination(
          data.pagination || {
            page: data.page || 1,
            totalPages: data.totalPages || 1,
            totalBooks: data.totalBooks || data.books.length,
            hasMore: data.hasMore || false
          }
        );
      } else {
        setBooks([]);
      }
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch books';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createBook = async (bookData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/books', bookData);
      const newBook = response.data.book || response.data;
      setBooks((prev) => [newBook, ...prev]);
      return newBook;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create book';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async (id, bookData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/books/${id}`, bookData);
      const updated = response.data.book || response.data;
      setBooks((prev) => prev.map((b) => ((b._id || b.id) === id ? updated : b)));
      return updated;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update book';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/books/${id}`);
      setBooks((prev) => prev.filter((b) => (b._id || b.id) !== id));
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete book';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    books,
    setBooks,
    pagination,
    loading,
    error,
    fetchBooks,
    createBook,
    updateBook,
    deleteBook
  };
};

export default useBooks;
