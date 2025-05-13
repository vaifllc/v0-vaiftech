import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

// Ensure upload directories exist
const createUploadDirectories = () => {
  const dirs = [
    './uploads',
    './uploads/profile',
    './uploads/products',
    './uploads/documents',
    './uploads/templates',
    './uploads/portfolio',
  ]

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  })
}

createUploadDirectories()

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine the appropriate folder based on file type or route
    let uploadPath = './uploads'

    if (req.baseUrl.includes('/users') || req.path.includes('/profile')) {
      uploadPath = './uploads/profile'
    } else if (req.baseUrl.includes('/products')) {
      uploadPath = './uploads/products'
    } else if (req.baseUrl.includes('/documents')) {
      uploadPath = './uploads/documents'
    } else if (req.baseUrl.includes('/templates')) {
      uploadPath = './uploads/templates'
    } else if (req.baseUrl.includes('/portfolio')) {
      uploadPath = './uploads/portfolio'
    }

    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with original extension
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueFilename)
  },
})

// File filter
const fileFilter = (req, file, cb) => {
  // Define allowed file types
  const allowedFileTypes = {
    image: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
    document: ['.pdf', '.doc', '.docx', '.txt', '.md', '.rtf'],
    spreadsheet: ['.xls', '.xlsx', '.csv'],
    presentation: ['.ppt', '.pptx'],
    archive: ['.zip', '.rar', '.7z'],
  }

  // Get file extension
  const ext = path.extname(file.originalname).toLowerCase()

  // Check if the file type is allowed
  const isAllowed = Object.values(allowedFileTypes).some((types) =>
    types.includes(ext),
  )

  if (isAllowed) {
    cb(null, true)
  } else {
    cb(new Error('File type not allowed'), false)
  }
}

// Create multer upload instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
})

// Middleware for handling file upload errors
export const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.',
      })
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
    })
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    })
  }
  next()
}

export default upload
