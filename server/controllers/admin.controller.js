import User from '../models/user.model.js'
import Product from '../models/product.model.js'
import Payment from '../models/payment.model.js'
import Portfolio from '../models/portfolio.model.js'
import Comparison from '../models/comparison.model.js'
import { catchAsync } from '../utils/error.js'
import { AppError } from '../utils/error.js'
import analyticsUtils from '../utils/analytics.js'

// Get dashboard overview
export const getDashboardOverview = catchAsync(async (req, res) => {
  const overview = await analyticsUtils.getDashboardOverview()

  res.status(200).json({
    status: 'success',
    data: overview,
  })
})

// Get user analytics
export const getUserAnalytics = catchAsync(async (req, res) => {
  const { period, startDate, endDate } = req.query

  const userAnalytics = await analyticsUtils.getUserRegistrationAnalytics({
    period,
    startDate,
    endDate,
  })

  res.status(200).json({
    status: 'success',
    data: userAnalytics,
  })
})

// Get revenue analytics
export const getRevenueAnalytics = catchAsync(async (req, res) => {
  const { period, startDate, endDate } = req.query

  const revenueAnalytics = await analyticsUtils.getRevenueAnalytics({
    period,
    startDate,
    endDate,
  })

  res.status(200).json({
    status: 'success',
    data: revenueAnalytics,
  })
})

// Get product analytics
export const getProductAnalytics = catchAsync(async (req, res) => {
  const { period, startDate, endDate } = req.query

  const productAnalytics = await analyticsUtils.getProductAnalytics({
    period,
    startDate,
    endDate,
  })

  res.status(200).json({
    status: 'success',
    data: productAnalytics,
  })
})

// Get portfolio analytics
export const getPortfolioAnalytics = catchAsync(async (req, res) => {
  const portfolioAnalytics = await analyticsUtils.getPortfolioAnalytics()

  res.status(200).json({
    status: 'success',
    data: portfolioAnalytics,
  })
})

// Get comparison analytics
export const getComparisonAnalytics = catchAsync(async (req, res) => {
  const comparisonAnalytics = await analyticsUtils.getComparisonAnalytics()

  res.status(200).json({
    status: 'success',
    data: comparisonAnalytics,
  })
})

// Get all users (with filtering and pagination)
export const getAllUsers = catchAsync(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  const skip = (page - 1) * limit

  // Build query
  const queryObj = { ...req.query }
  const excludedFields = ['page', 'sort', 'limit', 'fields']
  excludedFields.forEach((el) => delete queryObj[el])

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj)
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

  let query = User.find(JSON.parse(queryStr))

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ')
    query = query.select(fields)
  } else {
    query = query.select('-__v -password')
  }

  // Execute query with pagination
  const users = await query.skip(skip).limit(limit)

  // Get total count for pagination
  const total = await User.countDocuments(JSON.parse(queryStr))

  res.status(200).json({
    status: 'success',
    results: users.length,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: {
      users,
    },
  })
})

// Get user by ID
export const getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password')

  if (!user) {
    return next(new AppError('No user found with that ID', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  })
})

// Update user
export const updateUser = catchAsync(async (req, res, next) => {
  // Prevent password update through this route
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updatePassword.',
        400,
      ),
    )
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      phone: req.body.phone,
      address: req.body.address,
      company: req.body.company,
      profileImage: req.body.profileImage,
      active: req.body.active,
    },
    {
      new: true,
      runValidators: true,
    },
  ).select('-password')

  if (!user) {
    return next(new AppError('No user found with that ID', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  })
})

// Delete user
export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id)

  if (!user) {
    return next(new AppError('No user found with that ID', 404))
  }

  res.status(204).json({
    status: 'success',
    data: null,
  })
})

// Get all products (with filtering and pagination)
export const getAllProducts = catchAsync(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  const skip = (page - 1) * limit

  // Build query
  const queryObj = { ...req.query }
  const excludedFields = ['page', 'sort', 'limit', 'fields']
  excludedFields.forEach((el) => delete queryObj[el])

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj)
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

  let query = Product.find(JSON.parse(queryStr))

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ')
    query = query.select(fields)
  } else {
    query = query.select('-__v')
  }

  // Execute query with pagination
  const products = await query.skip(skip).limit(limit)

  // Get total count for pagination
  const total = await Product.countDocuments(JSON.parse(queryStr))

  res.status(200).json({
    status: 'success',
    results: products.length,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: {
      products,
    },
  })
})

// Get all payments (with filtering and pagination)
export const getAllPayments = catchAsync(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  const skip = (page - 1) * limit

  // Build query
  const queryObj = { ...req.query }
  const excludedFields = ['page', 'sort', 'limit', 'fields']
  excludedFields.forEach((el) => delete queryObj[el])

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj)
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

  let query = Payment.find(JSON.parse(queryStr))

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ')
    query = query.select(fields)
  } else {
    query = query.select('-__v')
  }

  // Execute query with pagination
  const payments = await query
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email')

  // Get total count for pagination
  const total = await Payment.countDocuments(JSON.parse(queryStr))

  res.status(200).json({
    status: 'success',
    results: payments.length,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: {
      payments,
    },
  })
})

// Get all portfolio projects (with filtering and pagination)
export const getAllPortfolioProjects = catchAsync(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  const skip = (page - 1) * limit

  // Build query
  const queryObj = { ...req.query }
  const excludedFields = ['page', 'sort', 'limit', 'fields']
  excludedFields.forEach((el) => delete queryObj[el])

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj)
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

  let query = Portfolio.find(JSON.parse(queryStr))

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ')
    query = query.select(fields)
  } else {
    query = query.select('-__v')
  }

  // Execute query with pagination
  const portfolioProjects = await query
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email')

  // Get total count for pagination
  const total = await Portfolio.countDocuments(JSON.parse(queryStr))

  res.status(200).json({
    status: 'success',
    results: portfolioProjects.length,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: {
      portfolioProjects,
    },
  })
})

export default {
  getDashboardOverview,
  getUserAnalytics,
  getRevenueAnalytics,
  getProductAnalytics,
  getPortfolioAnalytics,
  getComparisonAnalytics,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllProducts,
  getAllPayments,
  getAllPortfolioProjects,
}
