import express from 'express'
import postController from '../controllers/post.controller.js'
import commentController from '../controllers/comment.controller.js'
import {
  authenticate,
  restrictTo,
  optionalAuth,
} from '../middleware/auth.middleware.js'

const router = express.Router()

// Public routes with optional authentication
router.get('/', optionalAuth, postController.getAllPosts)
router.get('/categories', postController.getCategories)
router.get('/tags', postController.getTags)
router.get('/:id', optionalAuth, postController.getPost)

// Protected routes
router.use(authenticate)

// Post routes
router.post('/', restrictTo('admin'), postController.createPost)
router.patch('/:id', restrictTo('admin'), postController.updatePost)
router.delete('/:id', restrictTo('admin'), postController.deletePost)
router.post('/:id/like', postController.likePost)

// Comment routes
router.get('/:postId/comments', commentController.getPostComments)
router.post('/:postId/comments', commentController.createComment)
router.patch('/comments/:id', commentController.updateComment)
router.delete('/comments/:id', commentController.deleteComment)
router.post('/comments/:id/like', commentController.likeComment)

// Admin comment routes
router.get(
  '/admin/comments/pending',
  restrictTo('admin'),
  commentController.getPendingComments,
)
router.patch(
  '/comments/:id/approve',
  restrictTo('admin'),
  commentController.approveComment,
)
router.patch(
  '/comments/:id/reject',
  restrictTo('admin'),
  commentController.rejectComment,
)

export default router
