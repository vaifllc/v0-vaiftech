import express from 'express'
import paymentController from '../controllers/payment.controller.js'
import { authenticate, restrictTo } from '../middleware/auth.middleware.js'

const router = express.Router()

// Protect all routes after this middleware
router.use(authenticate)

// Routes for both users and admins
router.post(
  '/stripe/create-payment-intent',
  paymentController.createStripePaymentIntent,
)
router.post('/square/create-payment', paymentController.createSquarePayment)
router.get('/user', paymentController.getUserPayments)
router.get('/invoices/user', paymentController.getUserInvoices)
router.post('/invoices', paymentController.createInvoice)
router.get('/:id', paymentController.getPaymentById)
router.get('/invoices/:id', paymentController.getInvoiceById)

// Admin only routes
router.use(restrictTo('admin'))
router.get('/', paymentController.getAllPayments)
router.get('/invoices', paymentController.getAllInvoices)
router.patch('/:id/status', paymentController.updatePaymentStatus)
router.patch('/invoices/:id/status', paymentController.updateInvoiceStatus)
router.post('/invoices/:id/send', paymentController.sendInvoiceByEmail)

export default router
