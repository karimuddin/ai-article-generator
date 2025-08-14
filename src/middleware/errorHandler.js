const config = require('../config/config');

const errorHandler = (err, req, res, next) => {
  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  
  // Log error details
  console.error(`Error: ${message}`);
  console.error(`Status: ${statusCode}`);
  console.error(`Stack: ${err.stack}`);
  
  // Specific error handling
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message = 'File too large';
  }

  // Error response format
  const errorResponse = {
    success: false,
    message,
    ...(config.nodeEnv === 'development' && { stack: err.stack })
  };

  // Add validation errors if they exist
  if (err.errors) {
    errorResponse.errors = err.errors;
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
