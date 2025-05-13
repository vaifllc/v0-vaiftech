import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import User from '../models/user.model.js'
import { ApiError, asyncHandler } from '../middleware/error.middleware.js'
import { sendEmail } from '../utils/email.js'

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, company, position } = req.body

  // Check if user already exists
  const userExists = await User.findOne({ email })
  if (userExists) {
    throw new ApiError('User already exists', 400)
  }

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex')
  const verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    company,
    position,
    verificationToken,
    verificationTokenExpiry,
  })

  if (user) {
    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`
    await sendEmail({
      to: user.email,
      subject: 'Verify your email address',
      text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
      html: `<p>Please verify your email by clicking on the following link: <a href="${verificationUrl}">${verificationUrl}</a></p>`,
    })

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        token,
      },
      message: 'Registration successful. Please verify your email.',
    })
  } else {
    throw new ApiError('Invalid user data', 400)
  }
})

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Check for user email
  const user = await User.findOne({ email })

  if (!user) {
    throw new ApiError('Invalid email or password', 401)
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    throw new ApiError('Invalid email or password', 401)
  }

  // Update last login
  user.lastLogin = Date.now()
  await user.save()

  // Generate token
  const token = generateToken(user._id)

  res.json({
    success: true,
    data: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      token,
    },
  })
})

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' })
})

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    throw new ApiError('Refresh token is required', 400)
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      throw new ApiError('User not found', 404)
    }

    const token = generateToken(user._id)

    res.json({
      success: true,
      data: {
        token,
      },
    })
  } catch (error) {
    throw new ApiError('Invalid refresh token', 401)
  }
})

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    throw new ApiError('User not found', 404)
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex')
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
  user.resetPasswordExpiry = Date.now() + 10 * 60 * 1000 // 10 minutes

  await user.save()

  // Create reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Please go to: ${resetUrl}`,
      html: `<p>You requested a password reset. Please click the link below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you didn't request this, please ignore this email.</p>`,
    })

    res.json({
      success: true,
      message: 'Password reset email sent',
    })
  } catch (error) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpiry = undefined
    await user.save()

    throw new ApiError('Email could not be sent', 500)
  }
})

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body
  const { token } = req.params

  // Hash token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpiry: { $gt: Date.now() },
  })

  if (!user) {
    throw new ApiError('Invalid or expired token', 400)
  }

  // Set new password
  user.password = password
  user.resetPasswordToken = undefined
  user.resetPasswordExpiry = undefined
  await user.save()

  res.json({
    success: true,
    message: 'Password reset successful',
  })
})

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params

  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpiry: { $gt: Date.now() },
  })

  if (!user) {
    throw new ApiError('Invalid or expired token', 400)
  }

  user.isEmailVerified = true
  user.verificationToken = undefined
  user.verificationTokenExpiry = undefined
  await user.save()

  res.json({
    success: true,
    message: 'Email verified successfully',
  })
})
