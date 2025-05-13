import User from '../models/user.model.js'
import { ApiError, asyncHandler } from '../middleware/error.middleware.js'

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const skip = (page - 1) * limit

  const search = req.query.search
    ? {
        $or: [
          { firstName: { $regex: req.query.search, $options: 'i' } },
          { lastName: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {}

  const users = await User.find(search)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await User.countDocuments(search)

  res.json({
    success: true,
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  })
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.json({
      success: true,
      data: user,
    })
  } else {
    throw new ApiError('User not found', 404)
  }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.firstName = req.body.firstName || user.firstName
    user.lastName = req.body.lastName || user.lastName
    user.email = req.body.email || user.email
    user.role = req.body.role || user.role
    user.company = req.body.company || user.company
    user.position = req.body.position || user.position
    user.isEmailVerified =
      req.body.isEmailVerified !== undefined
        ? req.body.isEmailVerified
        : user.isEmailVerified

    const updatedUser = await user.save()

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        company: updatedUser.company,
        position: updatedUser.position,
        isEmailVerified: updatedUser.isEmailVerified,
      },
      message: 'User updated successfully',
    })
  } else {
    throw new ApiError('User not found', 404)
  }
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.deleteOne()
    res.json({
      success: true,
      message: 'User deleted successfully',
    })
  } else {
    throw new ApiError('User not found', 404)
  }
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      success: true,
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        company: user.company,
        position: user.position,
        phone: user.phone,
        profileImage: user.profileImage,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      },
    })
  } else {
    throw new ApiError('User not found', 404)
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.firstName = req.body.firstName || user.firstName
    user.lastName = req.body.lastName || user.lastName
    user.email = req.body.email || user.email
    user.company = req.body.company || user.company
    user.position = req.body.position || user.position
    user.phone = req.body.phone || user.phone
    user.profileImage = req.body.profileImage || user.profileImage

    // If email is changed, require verification again
    if (req.body.email && req.body.email !== user.email) {
      user.isEmailVerified = false
      // Generate verification token and send email (implementation omitted for brevity)
    }

    const updatedUser = await user.save()

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        company: updatedUser.company,
        position: updatedUser.position,
        phone: updatedUser.phone,
        profileImage: updatedUser.profileImage,
        isEmailVerified: updatedUser.isEmailVerified,
      },
      message: 'Profile updated successfully',
    })
  } else {
    throw new ApiError('User not found', 404)
  }
})

// @desc    Change password
// @route   POST /api/users/change-password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body

  const user = await User.findById(req.user._id)

  if (!user) {
    throw new ApiError('User not found', 404)
  }

  // Check if current password matches
  const isMatch = await user.matchPassword(currentPassword)

  if (!isMatch) {
    throw new ApiError('Current password is incorrect', 401)
  }

  // Set new password
  user.password = newPassword
  await user.save()

  res.json({
    success: true,
    message: 'Password changed successfully',
  })
})
