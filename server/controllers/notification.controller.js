import Notification from '../models/notification.model.js'
import { catchAsync } from '../utils/error.js'
import { AppError } from '../utils/error.js'
import notificationService from '../services/notification.service.js'

// Get all notifications for a user
export const getUserNotifications = catchAsync(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  const skip = (page - 1) * limit

  // Build query
  const query = { user: req.user.id }

  // Add filters if provided
  if (req.query.isRead) {
    query.isRead = req.query.isRead === 'true'
  }

  if (req.query.category) {
    query.category = req.query.category
  }

  if (req.query.type) {
    query.type = req.query.type
  }

  // Execute query with pagination
  const notifications = await Notification.find(query)
    .sort(req.query.sort || '-createdAt')
    .skip(skip)
    .limit(limit)

  // Get total count for pagination
  const total = await Notification.countDocuments(query)

  // Get unread count
  const unreadCount = await Notification.countDocuments({
    user: req.user.id,
    isRead: false,
  })

  res.status(200).json({
    status: 'success',
    results: notifications.length,
    total,
    unreadCount,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: {
      notifications,
    },
  })
})

// Get a single notification by ID
export const getNotificationById = catchAsync(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id)

  if (!notification) {
    return next(new AppError('No notification found with that ID', 404))
  }

  // Check if user is authorized to view this notification
  if (notification.user.toString() !== req.user.id) {
    return next(
      new AppError('You do not have permission to view this notification', 403),
    )
  }

  res.status(200).json({
    status: 'success',
    data: {
      notification,
    },
  })
})

// Mark a notification as read
export const markAsRead = catchAsync(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id)

  if (!notification) {
    return next(new AppError('No notification found with that ID', 404))
  }

  // Check if user is authorized to update this notification
  if (notification.user.toString() !== req.user.id) {
    return next(
      new AppError(
        'You do not have permission to update this notification',
        403,
      ),
    )
  }

  // Update notification
  notification.isRead = true
  await notification.save()

  res.status(200).json({
    status: 'success',
    data: {
      notification,
    },
  })
})

// Mark all notifications as read
export const markAllAsRead = catchAsync(async (req, res) => {
  await Notification.updateMany(
    { user: req.user.id, isRead: false },
    { isRead: true },
  )

  res.status(200).json({
    status: 'success',
    message: 'All notifications marked as read',
  })
})

// Delete a notification
export const deleteNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id)

  if (!notification) {
    return next(new AppError('No notification found with that ID', 404))
  }

  // Check if user is authorized to delete this notification
  if (notification.user.toString() !== req.user.id) {
    return next(
      new AppError(
        'You do not have permission to delete this notification',
        403,
      ),
    )
  }

  await Notification.findByIdAndDelete(req.params.id)

  res.status(204).json({
    status: 'success',
    data: null,
  })
})

// Delete all notifications
export const deleteAllNotifications = catchAsync(async (req, res) => {
  await Notification.deleteMany({ user: req.user.id })

  res.status(204).json({
    status: 'success',
    data: null,
  })
})

// Create a notification (admin only)
export const createNotification = catchAsync(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return next(new AppError('Only admins can create notifications', 403))
  }

  const { userId, title, message, type, category, relatedTo, link, sendEmail } =
    req.body

  if (!userId || !title || !message) {
    return next(new AppError('User ID, title, and message are required', 400))
  }

  // Create notification
  const notification = await notificationService.createNotification({
    userId,
    title,
    message,
    type,
    category,
    relatedTo,
    link,
    sendEmail,
  })

  res.status(201).json({
    status: 'success',
    data: {
      notification,
    },
  })
})

// Create a system notification for all users (admin only)
export const createSystemNotification = catchAsync(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return next(
      new AppError('Only admins can create system notifications', 403),
    )
  }

  const { title, message, type, link, sendEmail } = req.body

  if (!title || !message) {
    return next(new AppError('Title and message are required', 400))
  }

  // Create system notification
  const notifications = await notificationService.createSystemNotification({
    title,
    message,
    type,
    link,
    sendEmail,
  })

  res.status(201).json({
    status: 'success',
    results: notifications.length,
    data: {
      notifications,
    },
  })
})

export default {
  getUserNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  createNotification,
  createSystemNotification,
}
