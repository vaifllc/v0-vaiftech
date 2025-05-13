import express from 'express'
import dashboardController from '../controllers/dashboard.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'

const router = express.Router()

// Protect all routes
router.use(authenticate)

// Dashboard routes
router.get('/overview', dashboardController.getDashboardOverview)
router.get('/quotes', dashboardController.getQuoteAnalytics)
router.get('/payments', dashboardController.getPaymentAnalytics)
router.get('/documents', dashboardController.getDocumentAnalytics)
router.get('/meetings', dashboardController.getMeetingAnalytics)

export default router
