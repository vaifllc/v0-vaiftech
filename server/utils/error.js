/**
 * Custom error class for API errors
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Async error handler wrapper
 * @param {Function} fn - Async function to wrap
 * @returns {Function} - Express middleware function
 */
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}

/**
 * Handle duplicate key errors from MongoDB
 * @param {Error} err - MongoDB error
 * @returns {AppError} - Formatted error
 */
const handleDuplicateKeyError = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
  const message = `Duplicate field value: ${value}. Please use another value.`
  return new AppError(message, 400)
}

/**
 * Handle validation errors from MongoDB
 * @param {Error} err - MongoDB error
 * @returns {AppError} - Formatted error
 */
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message)
  const message = `Invalid input data. ${errors.join('. ')}`
  return new AppError(message, 400)
}

/**
 * Handle JWT errors
 * @param {Error} err - JWT error
 * @returns {AppError} - Formatted error
 */
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again.', 401)
}

/**
 * Handle JWT expired errors
 * @returns {AppError} - Formatted error
 */
const handleJWTExpiredError = () => {
  return new AppError('Your token has expired. Please log in again.', 401)
}

/**
 * Send error response in development environment
 * @param {Error} err - Error object
 * @param {Object} res - Express response object
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  })
}

/**
 * Send error response in production environment
 * @param {Error} err - Error object
 * @param {Object} res - Express response object
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
  }
  // Programming or other unknown error: don't leak error details
  else {
    // Log error
    console.error('ERROR 💥', err)

    // Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    })
  }
}

/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }
    error.message = err.message

    if (error.code === 11000) error = handleDuplicateKeyError(error)
    if (error.name === 'ValidationError') error = handleValidationError(error)
    if (error.name === 'JsonWebTokenError') error = handleJWTError()
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError()

    sendErrorProd(error, res)
  }
}

export default {
  AppError,
  catchAsync,
  globalErrorHandler,
}
