const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const Book = require('../models/Book');

// Validation rules
const createBookValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('author')
    .trim()
    .notEmpty()
    .withMessage('Author is required')
    .isLength({ max: 100 })
    .withMessage('Author cannot exceed 100 characters'),
  body('totalPages')
    .notEmpty()
    .withMessage('Total pages is required')
    .isInt({ min: 1 })
    .withMessage('Total pages must be at least 1'),
  body('genre')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Genre cannot exceed 50 characters'),
  body('currentPage')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Current page cannot be negative'),
  body('status')
    .optional()
    .isIn(['want-to-read', 'reading', 'finished'])
    .withMessage('Status must be want-to-read, reading, or finished'),
  body('rating')
    .optional({ nullable: true })
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('review')
    .optional({ nullable: true })
    .isLength({ max: 2000 })
    .withMessage('Review cannot exceed 2000 characters')
];

const updateBookValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('author')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Author cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Author cannot exceed 100 characters'),
  body('totalPages')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Total pages must be at least 1'),
  body('genre')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Genre cannot exceed 50 characters'),
  body('currentPage')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Current page cannot be negative'),
  body('status')
    .optional()
    .isIn(['want-to-read', 'reading', 'finished'])
    .withMessage('Status must be want-to-read, reading, or finished'),
  body('rating')
    .optional({ nullable: true })
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('review')
    .optional({ nullable: true })
    .isLength({ max: 2000 })
    .withMessage('Review cannot exceed 2000 characters')
];

// @desc    Get all books for logged-in user with filters, search, sort, pagination
// @route   GET /api/books
// @access  Private
const getBooks = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };

    // Search query across title and author
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      filter.$or = [{ title: searchRegex }, { author: searchRegex }];
    }

    // Filter by status
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Filter by genre
    if (req.query.genre) {
      filter.genre = req.query.genre;
    }

    // Sorting
    let sort = '-createdAt';
    if (req.query.sort) {
      sort = req.query.sort;
    }

    // Pagination
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 12);
    const skip = (page - 1) * limit;

    const total = await Book.countDocuments(filter);
    const books = await Book.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const pages = total === 0 ? 0 : Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      data: {
        books,
        page,
        pages,
        total
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Private
const getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check ownership
    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this book'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        book
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new book
// @route   POST /api/books
// @access  Private
const createBook = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({
          field: err.path || err.param,
          message: err.msg
        }))
      });
    }

    const {
      title,
      author,
      genre,
      totalPages,
      currentPage,
      status,
      rating,
      review,
      coverUrl,
      startedAt,
      finishedAt
    } = req.body;

    const book = new Book({
      user: req.user._id,
      title,
      author,
      genre,
      totalPages,
      currentPage,
      status,
      rating,
      review,
      coverUrl,
      startedAt,
      finishedAt
    });

    await book.save();

    return res.status(201).json({
      success: true,
      data: {
        book
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private
const updateBook = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({
          field: err.path || err.param,
          message: err.msg
        }))
      });
    }

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check ownership
    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this book'
      });
    }

    const allowedFields = [
      'title',
      'author',
      'genre',
      'totalPages',
      'currentPage',
      'status',
      'rating',
      'review',
      'coverUrl'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        book[field] = req.body[field];
      }
    });

    await book.save();

    return res.status(200).json({
      success: true,
      data: {
        book
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check ownership
    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this book'
      });
    }

    await book.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reading statistics for user
// @route   GET /api/books/stats
// @access  Private
const getStats = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1, 0, 0, 0, 0);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);

    const aggregationResults = await Book.aggregate([
      { $match: { user: userId } },
      {
        $facet: {
          totalBooks: [{ $count: 'count' }],
          finishedThisYear: [
            {
              $match: {
                status: 'finished',
                finishedAt: { $gte: startOfYear, $lte: endOfYear }
              }
            },
            { $count: 'count' }
          ],
          totalPagesRead: [
            {
              $group: {
                _id: null,
                total: { $sum: '$currentPage' }
              }
            }
          ],
          averageRating: [
            {
              $match: {
                rating: { $ne: null, $exists: true, $gt: 0 }
              }
            },
            {
              $group: {
                _id: null,
                avg: { $avg: '$rating' }
              }
            }
          ],
          monthlyFinished: [
            {
              $match: {
                status: 'finished',
                finishedAt: { $gte: startOfYear, $lte: endOfYear }
              }
            },
            {
              $group: {
                _id: { $month: '$finishedAt' },
                count: { $sum: 1 }
              }
            },
            { $sort: { '_id': 1 } }
          ]
        }
      }
    ]);

    const facet = aggregationResults[0] || {};
    const totalBooks = facet.totalBooks?.[0]?.count || 0;
    const finishedThisYear = facet.finishedThisYear?.[0]?.count || 0;
    const totalPagesRead = facet.totalPagesRead?.[0]?.total || 0;
    const rawAvg = facet.averageRating?.[0]?.avg;
    const averageRating = rawAvg ? Math.round(rawAvg * 10) / 10 : 0;

    // Monthly finished array for months 1-12
    const monthCounts = {};
    for (let m = 1; m <= 12; m++) {
      monthCounts[m] = 0;
    }
    if (facet.monthlyFinished) {
      facet.monthlyFinished.forEach(item => {
        if (item._id >= 1 && item._id <= 12) {
          monthCounts[item._id] = item.count;
        }
      });
    }
    const monthlyFinished = [];
    for (let m = 1; m <= 12; m++) {
      monthlyFinished.push({
        month: m,
        count: monthCounts[m]
      });
    }

    // Books currently being read
    const currentlyReading = await Book.find({
      user: userId,
      status: 'reading'
    }).sort('-createdAt');

    // Yearly goal from user profile
    const yearlyGoal = req.user.yearlyGoal !== undefined ? req.user.yearlyGoal : 12;

    return res.status(200).json({
      success: true,
      data: {
        totalBooks,
        finishedThisYear,
        totalPagesRead,
        averageRating,
        monthlyFinished,
        currentlyReading,
        yearlyGoal
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBookValidation,
  updateBookValidation,
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getStats
};
