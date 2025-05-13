import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import File from '../models/file.model.js'

const unlinkAsync = promisify(fs.unlink)

// Get the base URL for file access
export const getFileBaseUrl = (req) => {
  const protocol = req.protocol
  const host = req.get('host')
  return `${protocol}://${host}`
}

// Get the full URL for a file
export const getFileUrl = (req, file) => {
  const baseUrl = getFileBaseUrl(req)
  return `${baseUrl}/api/files/${file._id}/download`
}

// Delete a file from disk and database
export const deleteFileById = async (fileId) => {
  try {
    const file = await File.findById(fileId)

    if (!file) {
      throw new Error('File not found')
    }

    // Delete file from disk if it exists
    if (fs.existsSync(file.path)) {
      await unlinkAsync(file.path)
    }

    // Delete file record from database
    await File.findByIdAndDelete(fileId)

    return true
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}

// Delete multiple files
export const deleteMultipleFiles = async (fileIds) => {
  try {
    const deletePromises = fileIds.map((id) => deleteFileById(id))
    await Promise.all(deletePromises)
    return true
  } catch (error) {
    console.error('Error deleting multiple files:', error)
    throw error
  }
}

// Delete files related to an entity
export const deleteRelatedFiles = async (model, id) => {
  try {
    const files = await File.find({
      'relatedTo.model': model,
      'relatedTo.id': id,
    })

    const fileIds = files.map((file) => file._id)
    await deleteMultipleFiles(fileIds)

    return true
  } catch (error) {
    console.error('Error deleting related files:', error)
    throw error
  }
}

// Create a temporary file
export const createTempFile = async (content, extension = '.txt') => {
  const tempDir = path.join(process.cwd(), 'uploads', 'temp')

  // Create temp directory if it doesn't exist
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }

  const tempFilePath = path.join(tempDir, `temp-${Date.now()}${extension}`)

  // Write content to file
  await promisify(fs.writeFile)(tempFilePath, content)

  return tempFilePath
}

// Clean up temporary files older than a certain age
export const cleanupTempFiles = async (maxAgeHours = 24) => {
  const tempDir = path.join(process.cwd(), 'uploads', 'temp')

  if (!fs.existsSync(tempDir)) {
    return
  }

  const files = fs.readdirSync(tempDir)
  const now = Date.now()
  const maxAgeMs = maxAgeHours * 60 * 60 * 1000

  for (const file of files) {
    const filePath = path.join(tempDir, file)
    const stats = fs.statSync(filePath)
    const fileAgeMs = now - stats.mtimeMs

    if (fileAgeMs > maxAgeMs) {
      try {
        await unlinkAsync(filePath)
        console.log(`Deleted temp file: ${filePath}`)
      } catch (error) {
        console.error(`Error deleting temp file ${filePath}:`, error)
      }
    }
  }
}
