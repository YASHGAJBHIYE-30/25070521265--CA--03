import axios from 'axios';

/**
 * Axios instance + an adapter layer.
 *
 * The backend replies with `{ success, data: {...} }` and stores book status as
 * `want-to-read | reading | finished`, while the UI works with readable labels
 * ("Want to Read", "Currently Reading", "Finished"). This file translates
 * between the two so the rest of the app never has to care.
 */

const LABEL_TO_STATUS = {
  'Want to Read': 'want-to-read',
  'Currently Reading': 'reading',
  Finished: 'finished'
};

const STATUS_TO_LABEL = {
  'want-to-read': 'Want to Read',
  reading: 'Currently Reading',
  finished: 'Finished'
};

const toBackendStatus = (s) => LABEL_TO_STATUS[s] || s;
const toLabelStatus = (s) => STATUS_TO_LABEL[s] || s;

// "createdAt:desc" -> "-createdAt", "title:asc" -> "title"
const toBackendSort = (sort) => {
  if (!sort || !sort.includes(':')) return sort;
  const [field, dir] = sort.split(':');
  return dir === 'desc' ? `-${field}` : field;
};

const adaptBook = (book) => {
  if (!book || typeof book !== 'object') return book;
  return {
    ...book,
    status: toLabelStatus(book.status),
    coverImage: book.coverImage || book.coverUrl || ''
  };
};

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pageturn_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Query params: status label + sort format
    if (config.params) {
      const params = { ...config.params };
      if (params.status) params.status = toBackendStatus(params.status);
      if (params.sort) params.sort = toBackendSort(params.sort);
      config.params = params;
    }

    // Request body: status label + "no rating" -> null
    if (config.data && typeof config.data === 'object') {
      const body = { ...config.data };
      if (body.status) body.status = toBackendStatus(body.status);
      if ('rating' in body && !Number(body.rating)) body.rating = null;
      if ('coverImage' in body) delete body.coverImage;
      config.data = body;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    // Unwrap { success, data } envelope
    let payload = response.data;
    if (payload && typeof payload === 'object' && 'success' in payload && 'data' in payload) {
      payload = payload.data;
    }

    if (payload && typeof payload === 'object') {
      // Single book
      if (payload.book) {
        payload = { ...payload, book: adaptBook(payload.book) };
      }

      // Book list + pagination
      if (Array.isArray(payload.books)) {
        payload = {
          ...payload,
          books: payload.books.map(adaptBook),
          pagination: {
            page: payload.page || 1,
            totalPages: payload.pages || 1,
            totalBooks: payload.total || payload.books.length,
            hasMore: (payload.page || 1) < (payload.pages || 1)
          }
        };
      }

      // Dashboard stats
      if ('totalBooks' in payload && 'monthlyFinished' in payload) {
        payload = {
          ...payload,
          pagesRead: payload.totalPagesRead ?? payload.pagesRead ?? 0,
          monthlyFinished: Array.isArray(payload.monthlyFinished)
            ? payload.monthlyFinished.map((m) => (typeof m === 'object' ? m.count : m))
            : Array(12).fill(0),
          currentlyReading: (payload.currentlyReading || []).map(adaptBook)
        };
      }
    }

    response.data = payload;
    return response;
  },
  (error) => {
    // Show the first specific validation message instead of a generic one
    const body = error.response && error.response.data;
    if (body && Array.isArray(body.errors) && body.errors[0] && body.errors[0].message) {
      body.message = body.errors[0].message;
    }
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('pageturn_token');
      if (
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register' &&
        window.location.pathname !== '/'
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
