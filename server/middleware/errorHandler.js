const multer = require('multer');

// 404 for unknown API routes
const notFound = (req, res) => {
  res.status(404).json({ message: 'Route not found' });
};

// Central error handler: converts known errors into clean JSON responses
const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Maximum image size is 5 MB' : err.message;
    return res.status(400).json({ message });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: Object.values(err.errors).map((e) => e.message)
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'This email is already registered' });
  }

  if (err.name === 'CastError') {
    return res.status(404).json({ message: 'Resource not found' });
  }

  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }

  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
};

module.exports = { notFound, errorHandler };
