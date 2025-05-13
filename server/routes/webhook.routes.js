import express from 'express'
import paymentController from '../controllers/payment.controller.js'

const router = express.Router()

// Stripe webhook
router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  paymentController.stripeWebhook,
)

// Square webhook
router.post(
  '/square',
  express.raw({ type: 'application/json' }),
  paymentController.squareWebhook,
)

export default router
