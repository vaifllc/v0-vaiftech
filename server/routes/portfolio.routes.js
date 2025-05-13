import express from 'express'
import portfolioController from '../controllers/portfolio.controller.js'
import { authenticate, restrictTo } from '../middleware/auth.middleware.js'

const router = express.Router()

// Public routes
router.get('/featured', portfolioController.getFeaturedProjects)
router.get('/slug/:slug', portfolioController.getProjectBySlug)
router.get(
  '/technology/:technology',
  portfolioController.getProjectsByTechnology,
)
router.get('/type/:type', portfolioController.getProjectsByType)

// Protect all routes after this middleware
router.use(authenticate)

// User routes
router.get('/user', portfolioController.getUserProjects)
router.get('/stats', portfolioController.getProjectStats)
router.post('/', portfolioController.createProject)

router
  .route('/:id')
  .get(portfolioController.getProjectById)
  .patch(portfolioController.updateProject)
  .delete(portfolioController.deleteProject)

router.patch('/:id/featured', portfolioController.toggleFeatured)
router.patch('/:id/order', portfolioController.updateProjectOrder)

// Admin routes
router.use(restrictTo('admin'))
router.get('/', portfolioController.getAllProjects)

export default router
