import express from 'express'
import documentController from '../controllers/document.controller.js'
import {
  authenticate,
  restrictTo,
  optionalAuth,
} from '../middleware/auth.middleware.js'

const router = express.Router()

// Public routes with optional authentication
router.get(
  '/share/:link',
  optionalAuth,
  documentController.getDocumentByShareableLink,
)

// Protected routes
router.use(authenticate)

// Document routes
router
  .route('/')
  .get(documentController.getAllDocuments)
  .post(documentController.createDocument)

router
  .route('/:id')
  .get(documentController.getDocumentById)
  .patch(documentController.updateDocument)
  .delete(documentController.deleteDocument)

// Generate document from template
router.post('/generate/template', documentController.generateFromTemplate)

// Generate document using AI (admin only)
router.post(
  '/generate/ai',
  restrictTo('admin'),
  documentController.generateWithAI,
)

// Share document via email
router.post('/:id/share', documentController.shareDocument)

// Analyze document
router.post('/:id/analyze', documentController.analyzeDocument)

export default router
