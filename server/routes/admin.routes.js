import express from 'express'
import adminController from '../controllers/admin.controller.js'
import { authenticate, restrictTo } from '../middleware/auth.middleware.js'

const router = express.Router()

// Protect all routes
router.use(authenticate)
router.use(restrictTo('admin'))

// Dashboard routes
router.get('/dashboard/overview', adminController.getDashboardOverview)
router.get('/dashboard/users', adminController.getUserAnalytics)
router.get('/dashboard/revenue', adminController.getRevenueAnalytics)
router.get('/dashboard/products', adminController.getProductAnalytics)
router.get('/dashboard/portfolio', adminController.getPortfolioAnalytics)
router.get('/dashboard/comparisons', adminController.getComparisonAnalytics)

// User management routes
router.get('/users', adminController.getAllUsers)
router.get('/users/:id', adminController.getUserById)
router.patch('/users/:id', adminController.updateUser)
router.delete('/users/:id', adminController.deleteUser)

// Product management routes
router.get('/products', adminController.getAllProducts)

// Payment management routes
router.get('/payments', adminController.getAllPayments)

// Portfolio management routes
router.get('/portfolio', adminController.getAllPortfolioProjects)

export default router
