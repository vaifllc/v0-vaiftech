import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import File from '../models/file.model.js'

const unlinkAsync = promisify(fs.unlink)

// Upload a file
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      })
    }

    // Create a new file record
    const file = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      category: req.body.category || 'other',
      uploadedBy: req.user.id,
      relatedTo: {
        model: req.body.relatedModel || 'None',
        id: req.body.relatedId || null,
      },
      isPublic: req.body.isPublic === 'true',
    })

    await file.save()

    res.status(201).json({
      success: true,
      data: file,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message,
    })
  }
}

// Upload multiple files
export const uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      })
    }

    const filePromises = req.files.map((file) => {
      const newFile = new File({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
        category: req.body.category || 'other',
        uploadedBy: req.user.id,
        relatedTo: {
          model: req.body.relatedModel || 'None',
          id: req.body.relatedId || null,
        },
        isPublic: req.body.isPublic === 'true',
      })

      return newFile.save()
    })

    const savedFiles = await Promise.all(filePromises)

    res.status(201).json({
      success: true,
      data: savedFiles,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading files',
      error: error.message,
    })
  }
}

// Get all files (with filtering)
export const getAllFiles = async (req, res) => {
  try {
    const query = {}

    // Apply filters if provided
    if (req.query.category) {
      query.category = req.query.category
    }

    if (req.query.relatedModel) {
      query['relatedTo.model'] = req.query.relatedModel
    }

    if (req.query.relatedId) {
      query['relatedTo.id'] = req.query.relatedId
    }

    // Only admins can see all files, regular users can only see their own or public files
    if (!req.user.isAdmin) {
      query.$or = [{ uploadedBy: req.user.id }, { isPublic: true }]
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const skip = (page - 1) * limit

    const files = await File.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('uploadedBy', 'name email')

    const total = await File.countDocuments(query)

    res.status(200).json({
      success: true,
      count: files.length,
      total,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
      data: files,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving files',
      error: error.message,
    })
  }
}

// Get a single file by ID
export const getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id).populate(
      'uploadedBy',
      'name email',
    )

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      })
    }

    // Check if user has permission to access this file
    if (
      !file.isPublic &&
      !req.user.isAdmin &&
      file.uploadedBy._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this file',
      })
    }

    res.status(200).json({
      success: true,
      data: file,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving file',
      error: error.message,
    })
  }
}

// Download a file
export const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id)

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      })
    }

    // Check if user has permission to access this file
    if (
      !file.isPublic &&
      !req.user.isAdmin &&
      file.uploadedBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this file',
      })
    }

    // Check if file exists on disk
    if (!fs.existsSync(file.path)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server',
      })
    }

    // Set appropriate headers
    res.setHeader('Content-Type', file.mimetype)
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${file.originalName}"`,
    )

    // Stream the file
    const fileStream = fs.createReadStream(file.path)
    fileStream.pipe(res)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error downloading file',
      error: error.message,
    })
  }
}

// Delete a file
export const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id)

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      })
    }

    // Check if user has permission to delete this file
    if (!req.user.isAdmin && file.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this file',
      })
    }

    // Delete file from disk if it exists
    if (fs.existsSync(file.path)) {
      await unlinkAsync(file.path)
    }

    // Delete file record from database
    await File.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: 'File deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting file',
      error: error.message,
    })
  }
}

// Update file details
export const updateFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id)

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      })
    }

    // Check if user has permission to update this file
    if (!req.user.isAdmin && file.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this file',
      })
    }

    // Update allowed fields
    const allowedUpdates = ['category', 'isPublic', 'relatedTo']
    const updates = {}

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        if (key === 'relatedTo') {
          updates.relatedTo = {
            model: req.body.relatedTo.model || file.relatedTo.model,
            id: req.body.relatedTo.id || file.relatedTo.id,
          }
        } else {
          updates[key] = req.body[key]
        }
      }
    })

    const updatedFile = await File.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    )

    res.status(200).json({
      success: true,
      data: updatedFile,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating file',
      error: error.message,
    })
  }
}

// Get files by related entity
export const getFilesByRelatedEntity = async (req, res) => {
  try {
    const { model, id } = req.params

    const query = {
      'relatedTo.model': model,
      'relatedTo.id': id,
    }

    // Regular users can only see their own or public files
    if (!req.user.isAdmin) {
      query.$or = [{ uploadedBy: req.user.id }, { isPublic: true }]
    }

    const files = await File.find(query).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: files.length,
      data: files,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving files',
      error: error.message,
    })
  }
}
