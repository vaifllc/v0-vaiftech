import Notification from '../models/notification.model.js'
import User from '../models/user.model.js'
import { sendEmail } from '../utils/email.js'

/**
 * Create a notification
 * @param {Object} options - Notification options
 * @param {string} options.userId - User ID
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification message
 * @param {string} options.type - Notification type (info, success, warning, error)
 * @param {string} options.category - Notification category (system, quote, payment, document, meeting, user)
 * @param {Object} options.relatedTo - Related model and ID
 * @param {string} options.link - Link to related resource
 * @param {boolean} options.sendEmail - Whether to send an email notification
 * @returns {Promise<Object>} - Created notification
 */
export const createNotification = async (options) => {
  const {
    userId,
    title,
    message,
    type = 'info',
    category = 'system',
    relatedTo,
    link,
    sendEmail = false,
  } = options

  // Create notification
  const notification = await Notification.create({
    user: userId,
    title,
    message,
    type,
    category,
    relatedTo,
    link,
  })

  // Send email if requested
  if (sendEmail) {
    const user = await User.findById(userId)

    if (user && user.email) {
      await sendEmail({
        to: user.email,
        subject: title,
        template: 'notification',
        data: {
          userName: user.name,
          notificationTitle: title,
          notificationMessage: message,
          notificationType: type,
          notificationCategory: category,
          notificationLink: link ? `${process.env.FRONTEND_URL}${link}` : null,
          companyName: process.env.COMPANY_NAME || 'VAIF TECH',
        },
      })
    }
  }

  return notification
}

/**
 * Create notifications for multiple users
 * @param {Object} options - Notification options
 * @param {Array} options.userIds - Array of user IDs
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification message
 * @param {string} options.type - Notification type (info, success, warning, error)
 * @param {string} options.category - Notification category (system, quote, payment, document, meeting, user)
 * @param {Object} options.relatedTo - Related model and ID
 * @param {string} options.link - Link to related resource
 * @param {boolean} options.sendEmail - Whether to send an email notification
 * @returns {Promise<Array>} - Created notifications
 */
export const createMultipleNotifications = async (options) => {
  const {
    userIds,
    title,
    message,
    type = 'info',
    category = 'system',
    relatedTo,
    link,
    sendEmail = false,
  } = options

  if (!userIds || !userIds.length) {
    return []
  }

  // Create notifications
  const notifications = await Promise.all(
    userIds.map((userId) =>
      createNotification({
        userId,
        title,
        message,
        type,
        category,
        relatedTo,
        link,
        sendEmail,
      }),
    ),
  )

  return notifications
}

/**
 * Create a system notification for all users
 * @param {Object} options - Notification options
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification message
 * @param {string} options.type - Notification type (info, success, warning, error)
 * @param {string} options.link - Link to related resource
 * @param {boolean} options.sendEmail - Whether to send an email notification
 * @returns {Promise<Array>} - Created notifications
 */
export const createSystemNotification = async (options) => {
  const { title, message, type = 'info', link, sendEmail = false } = options

  // Get all active users
  const users = await User.find({ active: true }).select('_id')
  const userIds = users.map((user) => user._id)

  // Create notifications for all users
  const notifications = await createMultipleNotifications({
    userIds,
    title,
    message,
    type,
    category: 'system',
    link,
    sendEmail,
  })

  return notifications
}

export default {
  createNotification,
  createMultipleNotifications,
  createSystemNotification,
}
