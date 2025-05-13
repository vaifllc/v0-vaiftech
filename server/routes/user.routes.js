import express from 'express'
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
} from '../controllers/user.controller.js'
import { protect, admin } from '../middleware/auth.middleware.js'

const router = express.Router()

// Admin routes
router.route('/').get(protect, admin, getUsers)

router
  .route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser)

// User profile routes
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)

router.route('/change-password').post(protect, changePassword)

export default router
