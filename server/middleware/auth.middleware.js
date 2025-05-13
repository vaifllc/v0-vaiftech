import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import User from '../models/user.model.js'
import { AppError, catchAsync } from '../utils/error.js'

/**
 * Authenticate user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authenticate = catchAsync(async (req, res, next) => {
  // 1) Get token from header
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(
      new AppError('You are not logged in. Please log in to get access.', 401),
    )
  }

  // 2) Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  // 3) Check if user still exists
  const user = await User.findById(decoded.id)
  if (!user) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401),
    )
  }

  // 4) Check if user changed password after the token was issued
  if (user.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password. Please log in again.', 401),
    )
  }

  // Grant access to protected route
  req.user = user
  next()
})

/**
 * Restrict access to certain roles
 * @param {...string} roles - Allowed roles
 * @returns {Function} - Express middleware function
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if user role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403),
      )
    }

    next()
  }
}

/**
 * Check if user is authenticated (optional)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const optionalAuth = catchAsync(async (req, res, next) => {
  // 1) Get token from header
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next()
  }

  try {
    // 2) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    // 3) Check if user still exists
    const user = await User.findById(decoded.id)
    if (!user) {
      return next()
    }

    // 4) Check if user changed password after the token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return next()
    }

    // Add user to request
    req.user = user
    next()
  } catch (error) {
    next()
  }
})

export default {
  authenticate,
  restrictTo,
  optionalAuth,
}
