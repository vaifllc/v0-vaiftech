import express from 'express'
import projectMetadataController from '../controllers/project-metadata.controller.js'
import { authenticate, restrictTo } from '../middleware/auth.middleware.js'

const router = express.Router()

// Protect all routes
router.use(authenticate)

// Get all metadata
router.get('/project-types', projectMetadataController.getAllProjectTypes)
router.get(
  '/project-categories',
  projectMetadataController.getAllProjectCategories,
)
router.get('/industries', projectMetadataController.getAllIndustries)
router.get('/features', projectMetadataController.getAllFeatures)
router.get('/technologies', projectMetadataController.getAllTechnologies)
router.get('/timelines', projectMetadataController.getAllTimelines)

// Get compatible features for a project type
router.get(
  '/project-types/:typeCode/features',
  projectMetadataController.getCompatibleFeatures,
)

// Get compatible project types for a category
router.get(
  '/project-categories/:categoryCode/project-types',
  projectMetadataController.getCompatibleProjectTypes,
)

// Admin routes for managing metadata
router.post(
  '/project-types',
  restrictTo('admin'),
  projectMetadataController.createProjectType,
)
router.patch(
  '/project-types/:code',
  restrictTo('admin'),
  projectMetadataController.updateProjectType,
)
router.delete(
  '/project-types/:code',
  restrictTo('admin'),
  projectMetadataController.deleteProjectType,
)

// Add similar routes for other metadata models...

export default router
