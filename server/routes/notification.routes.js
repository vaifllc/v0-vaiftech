import express from 'express'
import notificationController from '../controllers/notification.controller.js'
import { authenticate, restrictTo } from '../middleware/auth.middleware.js'

const router = express.Router()

// Protect all routes
router.use(authenticate)

// User notification routes
router.get('/', notificationController.getUserNotifications)
router.get('/:id', notificationController.getNotificationById)
router.patch('/:id/read', notificationController.markAsRead)
router.patch('/read-all', notificationController.markAllAsRead)
router.delete('/:id', notificationController.deleteNotification)
router.delete('/', notificationController.deleteAllNotifications)

// Admin notification routes
router.post('/', restrictTo('admin'), notificationController.createNotification)
router.post(
  '/system',
  restrictTo('admin'),
  notificationController.createSystemNotification,
)

export default router
