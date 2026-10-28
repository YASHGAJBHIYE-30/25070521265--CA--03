const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getStats,
  createBookValidation,
  updateBookValidation
} = require('../controllers/bookController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// All routes are protected
router.use(protect);

// GET /stats MUST be before /:id route to prevent 'stats' being parsed as an ID
router.get('/stats', getStats);
router.get('/', getBooks);
router.post('/', createBookValidation, validate, createBook);
router.get('/:id', getBook);
router.put('/:id', updateBookValidation, validate, updateBook);
router.delete('/:id', deleteBook);

module.exports = router;
