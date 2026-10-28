const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Mongoose CastError (invalid ID)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path || 'id'}: ${err.value}`
    });
  }

  // Mongoose duplicate key (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(400).json({
      success: false,
      message: `Duplicate value entered for ${field}. Please use another value.`
    });
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors || {}).map(val => ({
      field: val.path,
      message: val.message
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Default: 500
  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error'
  });
};

module.exports = errorHandler;
