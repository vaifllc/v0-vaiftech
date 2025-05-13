import express from 'express'
import { protect, restrictTo } from '../middleware/auth.middleware.js'
import upload, { handleUploadErrors } from '../middleware/upload.middleware.js'
import {
  uploadFile,
  uploadMultipleFiles,
  getAllFiles,
  getFileById,
  downloadFile,
  deleteFile,
  updateFile,
  getFilesByRelatedEntity,
} from '../controllers/file.controller.js'

const router = express.Router()

// Protect all routes
router.use(protect)

// Upload routes
router.post('/upload', upload.single('file'), handleUploadErrors, uploadFile)

router.post(
  '/upload-multiple',
  upload.array('files', 10), // Allow up to 10 files
  handleUploadErrors,
  uploadMultipleFiles,
)

// File management routes
router.get('/', getAllFiles)
router.get('/:id', getFileById)
router.get('/:id/download', downloadFile)
router.delete('/:id', deleteFile)
router.patch('/:id', updateFile)

// Get files by related entity
router.get('/related/:model/:id', getFilesByRelatedEntity)

// Admin-only routes
router.use(restrictTo('admin'))
// Add any admin-specific file routes here

export default router
