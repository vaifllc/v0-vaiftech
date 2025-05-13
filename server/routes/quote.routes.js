import express from 'express'
import quoteController from '../controllers/quote.controller.js'
import { authenticate, restrictTo } from '../middleware/auth.middleware.js'

const router = express.Router()

// Protect all routes
router.use(authenticate)

// Quote routes
router
  .route('/')
  .get(quoteController.getAllQuotes)
  .post(quoteController.createQuote)

router
  .route('/:id')
  .get(quoteController.getQuoteById)
  .patch(quoteController.updateQuote)
  .delete(quoteController.deleteQuote)

// Send quote to client
router.post('/:id/send', quoteController.sendQuote)

// Accept quote
router.post('/:id/accept', quoteController.acceptQuote)

// Decline quote
router.post('/:id/decline', quoteController.declineQuote)

// Mark quote as viewed
router.post('/:id/view', quoteController.markAsViewed)

// Schedule a meeting for a quote
router.post('/:id/meetings', quoteController.scheduleMeeting)

// AI-powered quote builder endpoints
router.post('/analyze', quoteController.analyzeProjectDescription)
router.post('/estimate', quoteController.estimateProjectCost)
router.post('/generate', quoteController.generateQuoteFromEstimate)

export default router
