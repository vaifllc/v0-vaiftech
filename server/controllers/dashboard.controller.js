import { catchAsync } from '../utils/error.js'
import { AppError } from '../utils/error.js'
import dashboardUtils from '../utils/dashboard.js'

// Get user dashboard overview
export const getDashboardOverview = catchAsync(async (req, res) => {
  const overview = await dashboardUtils.getUserDashboardOverview(req.user.id)

  res.status(200).json({
    status: 'success',
    data: overview,
  })
})

// Get user quote analytics
export const getQuoteAnalytics = catchAsync(async (req, res) => {
  const { period, startDate, endDate } = req.query

  const quoteAnalytics = await dashboardUtils.getUserQuoteAnalytics(
    req.user.id,
    {
      period,
      startDate,
      endDate,
    },
  )

  res.status(200).json({
    status: 'success',
    data: quoteAnalytics,
  })
})

// Get user payment analytics
export const getPaymentAnalytics = catchAsync(async (req, res) => {
  const { period, startDate, endDate } = req.query

  const paymentAnalytics = await dashboardUtils.getUserPaymentAnalytics(
    req.user.id,
    {
      period,
      startDate,
      endDate,
    },
  )

  res.status(200).json({
    status: 'success',
    data: paymentAnalytics,
  })
})

// Get user document analytics
export const getDocumentAnalytics = catchAsync(async (req, res) => {
  const { period, startDate, endDate } = req.query

  const documentAnalytics = await dashboardUtils.getUserDocumentAnalytics(
    req.user.id,
    {
      period,
      startDate,
      endDate,
    },
  )

  res.status(200).json({
    status: 'success',
    data: documentAnalytics,
  })
})

// Get user meeting analytics
export const getMeetingAnalytics = catchAsync(async (req, res) => {
  const { period, startDate, endDate } = req.query

  const meetingAnalytics = await dashboardUtils.getUserMeetingAnalytics(
    req.user.id,
    {
      period,
      startDate,
      endDate,
    },
  )

  res.status(200).json({
    status: 'success',
    data: meetingAnalytics,
  })
})

export default {
  getDashboardOverview,
  getQuoteAnalytics,
  getPaymentAnalytics,
  getDocumentAnalytics,
  getMeetingAnalytics,
}
