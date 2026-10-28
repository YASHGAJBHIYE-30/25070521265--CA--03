const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      maxlength: [100, 'Author cannot exceed 100 characters']
    },
    genre: {
      type: String,
      trim: true,
      maxlength: [50, 'Genre cannot exceed 50 characters']
    },
    totalPages: {
      type: Number,
      required: [true, 'Total pages is required'],
      min: [1, 'Total pages must be at least 1']
    },
    currentPage: {
      type: Number,
      default: 0,
      min: [0, 'Current page cannot be negative']
    },
    status: {
      type: String,
      enum: ['want-to-read', 'reading', 'finished'],
      default: 'want-to-read'
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      default: null
    },
    review: {
      type: String,
      maxlength: [2000, 'Review cannot exceed 2000 characters']
    },
    coverUrl: {
      type: String,
      trim: true
    },
    startedAt: {
      type: Date
    },
    finishedAt: {
      type: Date
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Compound index: { user: 1, status: 1 }
bookSchema.index({ user: 1, status: 1 });

// Pre-save hook with auto-rules
bookSchema.pre('save', function (next) {
  const isPageModified = this.isModified('currentPage') || this.isModified('totalPages') || this.isNew;
  const isStatusModified = this.isModified('status') || this.isNew;

  // Auto-rule 1: If currentPage >= totalPages
  if (this.totalPages && this.currentPage >= this.totalPages) {
    this.currentPage = this.totalPages;
    this.status = 'finished';
    if (!this.finishedAt) {
      this.finishedAt = new Date();
    }
    if (!this.startedAt) {
      this.startedAt = this.finishedAt || new Date();
    }
  } else if (this.status === 'want-to-read' && (isStatusModified || isPageModified)) {
    // Auto-rule 3: If status is 'want-to-read': currentPage = 0, clear startedAt and finishedAt
    this.currentPage = 0;
    this.startedAt = undefined;
    this.finishedAt = undefined;
  } else if (this.status === 'reading') {
    // Auto-rule 2: If status changed to 'reading' and currentPage > 0 and !startedAt: set startedAt = now
    if ((isStatusModified || isPageModified) && this.currentPage > 0 && !this.startedAt) {
      this.startedAt = new Date();
    }
    if (isStatusModified && this.finishedAt) {
      this.finishedAt = undefined;
    }
  } else if (this.status === 'finished' && (isStatusModified || isPageModified)) {
    if (this.totalPages && this.currentPage < this.totalPages) {
      this.currentPage = this.totalPages;
    }
    if (!this.finishedAt) {
      this.finishedAt = new Date();
    }
    if (!this.startedAt) {
      this.startedAt = this.finishedAt || new Date();
    }
  }

  next();
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
