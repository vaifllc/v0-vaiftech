import express from 'express'
import comparisonController from '../controllers/comparison.controller.js'
import {
  authenticate,
  restrictTo,
  optionalAuth,
} from '../middleware/auth.middleware.js'

const router = express.Router()

// Public routes with optional authentication
router.get('/public', comparisonController.getPublicComparisons)
router.get(
  '/share/:link',
  optionalAuth,
  comparisonController.getComparisonByShareableLink,
)

// Protected routes
router.use(authenticate)

// User routes
router.get('/', comparisonController.getUserComparisons)
router.get('/stats', comparisonController.getComparisonStats)
router.post('/', comparisonController.createComparison)

router
  .route('/:id')
  .get(comparisonController.getComparisonById)
  .patch(comparisonController.updateComparison)
  .delete(comparisonController.deleteComparison)

router.post('/:id/products', comparisonController.addProductToComparison)
router.delete(
  '/:id/products/:productId',
  comparisonController.removeProductFromComparison,
)
router.post('/:id/rate', comparisonController.rateProduct)
router.get('/:id/ratings', comparisonController.getProductRatings)
router.patch('/:id/toggle-public', comparisonController.togglePublicStatus)

export default router
