import User from '../models/user.model.js'
import Product from '../models/product.model.js'
import Payment from '../models/payment.model.js'
import Portfolio from '../models/portfolio.model.js'
import Comparison from '../models/comparison.model.js'
import mongoose from 'mongoose'

/**
 * Get user registration analytics
 * @param {Object} options - Options for analytics
 * @param {string} options.period - Time period (day, week, month, year)
 * @param {Date} options.startDate - Start date for custom period
 * @param {Date} options.endDate - End date for custom period
 * @returns {Promise<Object>} - User registration analytics
 */
export const getUserRegistrationAnalytics = async (options = {}) => {
  const { period = 'month', startDate, endDate } = options

  let matchStage = {}
  const now = new Date()

  if (startDate && endDate) {
    matchStage = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }
  } else {
    switch (period) {
      case 'day':
        matchStage = {
          createdAt: {
            $gte: new Date(now.setHours(0, 0, 0, 0)),
            $lte: new Date(),
          },
        }
        break
      case 'week':
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - now.getDay())
        weekStart.setHours(0, 0, 0, 0)
        matchStage = {
          createdAt: {
            $gte: weekStart,
            $lte: new Date(),
          },
        }
        break
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        matchStage = {
          createdAt: {
            $gte: monthStart,
            $lte: new Date(),
          },
        }
        break
      case 'year':
        const yearStart = new Date(now.getFullYear(), 0, 1)
        matchStage = {
          createdAt: {
            $gte: yearStart,
            $lte: new Date(),
          },
        }
        break
      default:
        const defaultStart = new Date()
        defaultStart.setDate(defaultStart.getDate() - 30)
        matchStage = {
          createdAt: {
            $gte: defaultStart,
            $lte: new Date(),
          },
        }
    }
  }

  // Get total users
  const totalUsers = await User.countDocuments()

  // Get new users in period
  const newUsers = await User.countDocuments(matchStage)

  // Get user registration trend
  let groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }

  if (period === 'year') {
    groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
  }

  const registrationTrend = await User.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: groupBy,
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ])

  // Get user roles distribution
  const roleDistribution = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
      },
    },
  ])

  return {
    totalUsers,
    newUsers,
    registrationTrend,
    roleDistribution,
  }
}

/**
 * Get revenue analytics
 * @param {Object} options - Options for analytics
 * @param {string} options.period - Time period (day, week, month, year)
 * @param {Date} options.startDate - Start date for custom period
 * @param {Date} options.endDate - End date for custom period
 * @returns {Promise<Object>} - Revenue analytics
 */
export const getRevenueAnalytics = async (options = {}) => {
  const { period = 'month', startDate, endDate } = options

  let matchStage = { status: 'completed' }
  const now = new Date()

  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    }
  } else {
    switch (period) {
      case 'day':
        matchStage.createdAt = {
          $gte: new Date(now.setHours(0, 0, 0, 0)),
          $lte: new Date(),
        }
        break
      case 'week':
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - now.getDay())
        weekStart.setHours(0, 0, 0, 0)
        matchStage.createdAt = {
          $gte: weekStart,
          $lte: new Date(),
        }
        break
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        matchStage.createdAt = {
          $gte: monthStart,
          $lte: new Date(),
        }
        break
      case 'year':
        const yearStart = new Date(now.getFullYear(), 0, 1)
        matchStage.createdAt = {
          $gte: yearStart,
          $lte: new Date(),
        }
        break
      default:
        const defaultStart = new Date()
        defaultStart.setDate(defaultStart.getDate() - 30)
        matchStage.createdAt = {
          $gte: defaultStart,
          $lte: new Date(),
        }
    }
  }

  // Get total revenue
  const totalRevenue = await Payment.aggregate([
    { $match: { status: 'completed' } },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
      },
    },
  ])

  // Get revenue in period
  const periodRevenue = await Payment.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
      },
    },
  ])

  // Get revenue trend
  let groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }

  if (period === 'year') {
    groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
  }

  const revenueTrend = await Payment.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: groupBy,
        total: { $sum: '$amount' },
      },
    },
    { $sort: { _id: 1 } },
  ])

  // Get revenue by payment method
  const revenueByMethod = await Payment.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$paymentMethod',
        total: { $sum: '$amount' },
      },
    },
  ])

  return {
    totalRevenue: totalRevenue.length ? totalRevenue[0].total : 0,
    periodRevenue: periodRevenue.length ? periodRevenue[0].total : 0,
    revenueTrend,
    revenueByMethod,
  }
}

/**
 * Get product analytics
 * @param {Object} options - Options for analytics
 * @param {string} options.period - Time period (day, week, month, year)
 * @param {Date} options.startDate - Start date for custom period
 * @param {Date} options.endDate - End date for custom period
 * @returns {Promise<Object>} - Product analytics
 */
export const getProductAnalytics = async (options = {}) => {
  const { period = 'month', startDate, endDate } = options

  let matchStage = { status: 'completed' }
  const now = new Date()

  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    }
  } else {
    switch (period) {
      case 'day':
        matchStage.createdAt = {
          $gte: new Date(now.setHours(0, 0, 0, 0)),
          $lte: new Date(),
        }
        break
      case 'week':
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - now.getDay())
        weekStart.setHours(0, 0, 0, 0)
        matchStage.createdAt = {
          $gte: weekStart,
          $lte: new Date(),
        }
        break
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        matchStage.createdAt = {
          $gte: monthStart,
          $lte: new Date(),
        }
        break
      case 'year':
        const yearStart = new Date(now.getFullYear(), 0, 1)
        matchStage.createdAt = {
          $gte: yearStart,
          $lte: new Date(),
        }
        break
      default:
        const defaultStart = new Date()
        defaultStart.setDate(defaultStart.getDate() - 30)
        matchStage.createdAt = {
          $gte: defaultStart,
          $lte: new Date(),
        }
    }
  }

  // Get total products
  const totalProducts = await Product.countDocuments()

  // Get top selling products
  const topSellingProducts = await Payment.aggregate([
    { $match: matchStage },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        name: { $first: '$items.name' },
        totalQuantity: { $sum: '$items.quantity' },
        totalRevenue: {
          $sum: { $multiply: ['$items.price', '$items.quantity'] },
        },
      },
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    { $unwind: { path: '$productDetails', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        name: 1,
        totalQuantity: 1,
        totalRevenue: 1,
        thumbnail: '$productDetails.thumbnail',
      },
    },
  ])

  // Get product category distribution
  const categoryDistribution = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ])

  // Get recently added products
  const recentProducts = await Product.find()
    .sort('-createdAt')
    .limit(5)
    .select('name price thumbnail createdAt')

  return {
    totalProducts,
    topSellingProducts,
    categoryDistribution,
    recentProducts,
  }
}

/**
 * Get portfolio analytics
 * @returns {Promise<Object>} - Portfolio analytics
 */
export const getPortfolioAnalytics = async () => {
  // Get total portfolio projects
  const totalProjects = await Portfolio.countDocuments()

  // Get project type distribution
  const projectTypeDistribution = await Portfolio.aggregate([
    {
      $group: {
        _id: '$projectType',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ])

  // Get technology distribution
  const technologyDistribution = await Portfolio.aggregate([
    { $unwind: '$technologies' },
    {
      $group: {
        _id: '$technologies',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ])

  // Get featured projects count
  const featuredProjects = await Portfolio.countDocuments({ isFeatured: true })

  return {
    totalProjects,
    projectTypeDistribution,
    technologyDistribution,
    featuredProjects,
  }
}

/**
 * Get comparison analytics
 * @returns {Promise<Object>} - Comparison analytics
 */
export const getComparisonAnalytics = async () => {
  // Get total comparisons
  const totalComparisons = await Comparison.countDocuments()

  // Get public comparisons
  const publicComparisons = await Comparison.countDocuments({ isPublic: true })

  // Get most compared products
  const mostComparedProducts = await Comparison.aggregate([
    { $unwind: '$products' },
    {
      $group: {
        _id: '$products',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    { $unwind: { path: '$productDetails', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        count: 1,
        name: '$productDetails.name',
        thumbnail: '$productDetails.thumbnail',
      },
    },
  ])

  return {
    totalComparisons,
    publicComparisons,
    mostComparedProducts,
  }
}

/**
 * Get dashboard overview analytics
 * @returns {Promise<Object>} - Dashboard overview analytics
 */
export const getDashboardOverview = async () => {
  // Get total users
  const totalUsers = await User.countDocuments()

  // Get total revenue
  const totalRevenue = await Payment.aggregate([
    { $match: { status: 'completed' } },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
      },
    },
  ])

  // Get total products
  const totalProducts = await Product.countDocuments()

  // Get total portfolio projects
  const totalProjects = await Portfolio.countDocuments()

  // Get recent payments
  const recentPayments = await Payment.find({ status: 'completed' })
    .sort('-createdAt')
    .limit(5)
    .populate('user', 'name email')
    .select('amount currency status createdAt user')

  // Get recent users
  const recentUsers = await User.find()
    .sort('-createdAt')
    .limit(5)
    .select('name email createdAt')

  // Get monthly revenue trend for current year
  const currentYear = new Date().getFullYear()
  const yearStart = new Date(currentYear, 0, 1)
  const yearEnd = new Date(currentYear, 11, 31)

  const monthlyRevenue = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        createdAt: {
          $gte: yearStart,
          $lte: yearEnd,
        },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        total: { $sum: '$amount' },
      },
    },
    { $sort: { _id: 1 } },
  ])

  // Format monthly revenue for all months
  const monthlyRevenueTrend = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    const monthData = monthlyRevenue.find((item) => item._id === month)
    return {
      month,
      total: monthData ? monthData.total : 0,
    }
  })

  return {
    totalUsers,
    totalRevenue: totalRevenue.length ? totalRevenue[0].total : 0,
    totalProducts,
    totalProjects,
    recentPayments,
    recentUsers,
    monthlyRevenueTrend,
  }
}

export default {
  getUserRegistrationAnalytics,
  getRevenueAnalytics,
  getProductAnalytics,
  getPortfolioAnalytics,
  getComparisonAnalytics,
  getDashboardOverview,
}
