import User from '../models/user.model.js'
import Quote from '../models/quote.model.js'
import Document from '../models/document.model.js'
import Payment from '../models/payment.model.js'
import Meeting from '../models/meeting.model.js'
import mongoose from 'mongoose'

/**
 * Get user dashboard overview
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Dashboard overview data
 */
export const getUserDashboardOverview = async (userId) => {
  // Get user quotes
  const quotes = await Quote.find({ user: userId }).sort('-createdAt').limit(5)

  // Get quote statistics
  const quoteStats = await Quote.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        total: { $sum: '$total' },
      },
    },
  ])

  // Format quote statistics
  const formattedQuoteStats = {
    draft: { count: 0, total: 0 },
    sent: { count: 0, total: 0 },
    accepted: { count: 0, total: 0 },
    declined: { count: 0, total: 0 },
    expired: { count: 0, total: 0 },
  }

  quoteStats.forEach((stat) => {
    formattedQuoteStats[stat._id] = {
      count: stat.count,
      total: stat.total,
    }
  })

  // Get user documents
  const documents = await Document.find({ createdBy: userId })
    .sort('-createdAt')
    .limit(5)

  // Get document statistics
  const documentStats = await Document.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ])

  // Format document statistics
  const formattedDocumentStats = {
    draft: { count: 0 },
    published: { count: 0 },
    archived: { count: 0 },
  }

  documentStats.forEach((stat) => {
    formattedDocumentStats[stat._id] = {
      count: stat.count,
    }
  })

  // Get user payments
  const payments = await Payment.find({ user: userId })
    .sort('-createdAt')
    .limit(5)

  // Get payment statistics
  const paymentStats = await Payment.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        total: { $sum: '$amount' },
      },
    },
  ])

  // Format payment statistics
  const formattedPaymentStats = {
    pending: { count: 0, total: 0 },
    completed: { count: 0, total: 0 },
    failed: { count: 0, total: 0 },
    refunded: { count: 0, total: 0 },
  }

  paymentStats.forEach((stat) => {
    formattedPaymentStats[stat._id] = {
      count: stat.count,
      total: stat.total,
    }
  })

  // Get upcoming meetings
  const now = new Date()
  const user = await User.findById(userId) // Fetch the user
  const upcomingMeetings = await Meeting.find({
    $or: [{ user: userId }, { 'attendees.email': user.email }],
    startTime: { $gte: now },
    status: 'scheduled',
  })
    .sort('startTime')
    .limit(5)

  return {
    quotes: {
      recent: quotes,
      stats: formattedQuoteStats,
    },
    documents: {
      recent: documents,
      stats: formattedDocumentStats,
    },
    payments: {
      recent: payments,
      stats: formattedPaymentStats,
    },
    meetings: {
      upcoming: upcomingMeetings,
    },
  }
}

/**
 * Get user quote analytics
 * @param {string} userId - User ID
 * @param {Object} options - Options for analytics
 * @param {string} options.period - Time period (day, week, month, year)
 * @param {Date} options.startDate - Start date for custom period
 * @param {Date} options.endDate - End date for custom period
 * @returns {Promise<Object>} - Quote analytics
 */
export const getUserQuoteAnalytics = async (userId, options = {}) => {
  const { period = 'month', startDate, endDate } = options

  let matchStage = { user: new mongoose.Types.ObjectId(userId) }
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

  // Get total quotes
  const totalQuotes = await Quote.countDocuments({ user: userId })

  // Get quotes in period
  const periodQuotes = await Quote.countDocuments(matchStage)

  // Get quote trend
  let groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }

  if (period === 'year') {
    groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
  }

  const quoteTrend = await Quote.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: groupBy,
        count: { $sum: 1 },
        total: { $sum: '$total' },
      },
    },
    { $sort: { _id: 1 } },
  ])

  // Get quote status distribution
  const statusDistribution = await Quote.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        total: { $sum: '$total' },
      },
    },
  ])

  // Get conversion rate (accepted / sent)
  const sentQuotes = await Quote.countDocuments({
    user: userId,
    status: { $in: ['sent', 'accepted', 'declined', 'expired'] },
  })

  const acceptedQuotes = await Quote.countDocuments({
    user: userId,
    status: 'accepted',
  })

  const conversionRate =
    sentQuotes > 0 ? (acceptedQuotes / sentQuotes) * 100 : 0

  return {
    totalQuotes,
    periodQuotes,
    quoteTrend,
    statusDistribution,
    conversionRate,
  }
}

/**
 * Get user payment analytics
 * @param {string} userId - User ID
 * @param {Object} options - Options for analytics
 * @param {string} options.period - Time period (day, week, month, year)
 * @param {Date} options.startDate - Start date for custom period
 * @param {Date} options.endDate - End date for custom period
 * @returns {Promise<Object>} - Payment analytics
 */
export const getUserPaymentAnalytics = async (userId, options = {}) => {
  const { period = 'month', startDate, endDate } = options

  let matchStage = {
    user: new mongoose.Types.ObjectId(userId),
    status: 'completed',
  }
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
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        status: 'completed',
      },
    },
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

  // Get payment method distribution
  const methodDistribution = await Payment.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        status: 'completed',
      },
    },
    {
      $group: {
        _id: '$paymentMethod',
        count: { $sum: 1 },
        total: { $sum: '$amount' },
      },
    },
  ])

  return {
    totalRevenue: totalRevenue.length ? totalRevenue[0].total : 0,
    periodRevenue: periodRevenue.length ? periodRevenue[0].total : 0,
    revenueTrend,
    methodDistribution,
  }
}

/**
 * Get user document analytics
 * @param {string} userId - User ID
 * @param {Object} options - Options for analytics
 * @param {string} options.period - Time period (day, week, month, year)
 * @param {Date} options.startDate - Start date for custom period
 * @param {Date} options.endDate - End date for custom period
 * @returns {Promise<Object>} - Document analytics
 */
export const getUserDocumentAnalytics = async (userId, options = {}) => {
  const { period = 'month', startDate, endDate } = options

  let matchStage = { createdBy: new mongoose.Types.ObjectId(userId) }
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

  // Get total documents
  const totalDocuments = await Document.countDocuments({ createdBy: userId })

  // Get documents in period
  const periodDocuments = await Document.countDocuments(matchStage)

  // Get document trend
  let groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }

  if (period === 'year') {
    groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
  }

  const documentTrend = await Document.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: groupBy,
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ])

  // Get document category distribution
  const categoryDistribution = await Document.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
  ])

  // Get document status distribution
  const statusDistribution = await Document.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ])

  return {
    totalDocuments,
    periodDocuments,
    documentTrend,
    categoryDistribution,
    statusDistribution,
  }
}

/**
 * Get user meeting analytics
 * @param {string} userId - User ID
 * @param {Object} options - Options for analytics
 * @param {string} options.period - Time period (day, week, month, year)
 * @param {Date} options.startDate - Start date for custom period
 * @param {Date} options.endDate - End date for custom period
 * @returns {Promise<Object>} - Meeting analytics
 */
export const getUserMeetingAnalytics = async (userId, options = {}) => {
  const { period = 'month', startDate, endDate } = options

  const user = await User.findById(userId)
  if (!user) {
    throw new Error('User not found')
  }

  let matchStage = {
    $or: [
      { user: new mongoose.Types.ObjectId(userId) },
      { 'attendees.email': user.email },
    ],
  }
  const now = new Date()

  if (startDate && endDate) {
    matchStage.startTime = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    }
  } else {
    switch (period) {
      case 'day':
        matchStage.startTime = {
          $gte: new Date(now.setHours(0, 0, 0, 0)),
          $lte: new Date(now.setHours(23, 59, 59, 999)),
        }
        break
      case 'week':
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - now.getDay())
        weekStart.setHours(0, 0, 0, 0)
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        weekEnd.setHours(23, 59, 59, 999)
        matchStage.startTime = {
          $gte: weekStart,
          $lte: weekEnd,
        }
        break
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const monthEnd = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59,
          999,
        )
        matchStage.startTime = {
          $gte: monthStart,
          $lte: monthEnd,
        }
        break
      case 'year':
        const yearStart = new Date(now.getFullYear(), 0, 1)
        const yearEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999)
        matchStage.startTime = {
          $gte: yearStart,
          $lte: yearEnd,
        }
        break
      default:
        const defaultStart = new Date()
        defaultStart.setDate(defaultStart.getDate() - 30)
        matchStage.startTime = {
          $gte: defaultStart,
          $lte: new Date(),
        }
    }
  }

  // Get total meetings
  const totalMeetings = await Meeting.countDocuments({
    $or: [{ user: userId }, { 'attendees.email': user.email }],
  })

  // Get meetings in period
  const periodMeetings = await Meeting.countDocuments(matchStage)

  // Get upcoming meetings
  const upcomingMeetings = await Meeting.countDocuments({
    $or: [{ user: userId }, { 'attendees.email': user.email }],
    startTime: { $gte: now },
    status: 'scheduled',
  })

  // Get meeting trend
  let groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } }

  if (period === 'year') {
    groupBy = { $dateToString: { format: '%Y-%m', date: '$startTime' } }
  }

  const meetingTrend = await Meeting.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: groupBy,
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ])

  // Get meeting status distribution
  const statusDistribution = await Meeting.aggregate([
    {
      $match: {
        $or: [
          { user: new mongoose.Types.ObjectId(userId) },
          { 'attendees.email': user.email },
        ],
      },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ])

  return {
    totalMeetings,
    periodMeetings,
    upcomingMeetings,
    meetingTrend,
    statusDistribution,
  }
}

export default {
  getUserDashboardOverview,
  getUserQuoteAnalytics,
  getUserPaymentAnalytics,
  getUserDocumentAnalytics,
  getUserMeetingAnalytics,
}
