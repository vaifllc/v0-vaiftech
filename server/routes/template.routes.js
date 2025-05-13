import express from 'express'
import templateController from '../controllers/template.controller.js'
import { authenticate, restrictTo } from '../middleware/auth.middleware.js'

const router = express.Router()

// Protect all routes
router.use(authenticate)

// Extract variables from template content
router.post('/extract-variables', templateController.extractVariables)

// Template routes
router
  .route('/')
  .get(templateController.getAllTemplates)
  .post(restrictTo('admin'), templateController.createTemplate)

router
  .route('/:id')
  .get(templateController.getTemplateById)
  .patch(restrictTo('admin'), templateController.updateTemplate)
  .delete(restrictTo('admin'), templateController.deleteTemplate)

export default router
