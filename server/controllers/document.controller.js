import Document from '../models/document.model.js'
import Template from '../models/template.model.js'
import { catchAsync } from '../utils/error.js'
import { AppError } from '../utils/error.js'
import aiService from '../services/ai.service.js'
import { generateDocumentPdf } from '../utils/pdf.js'
import { sendEmail } from '../utils/email.js'

// Get all documents
export const getAllDocuments = catchAsync(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  const skip = (page - 1) * limit

  // Build query
  const queryObj = { ...req.query }
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'search']
  excludedFields.forEach((el) => delete queryObj[el])

  // Filter by user's own documents or public documents
  if (req.user.role !== 'admin') {
    queryObj.createdBy = req.user.id
  }

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj)
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

  let query = Document.find(JSON.parse(queryStr))

  // Search functionality
  if (req.query.search) {
    query = query.find({
      $text: { $search: req.query.search },
    })
  }

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ')
    query = query.select(fields)
  } else {
    query = query.select('-__v')
  }

  // Execute query with pagination
  const documents = await query
    .skip(skip)
    .limit(limit)
    .populate('createdBy', 'name email')
    .populate('template', 'title category')

  // Get total count for pagination
  const total = await Document.countDocuments(JSON.parse(queryStr))

  res.status(200).json({
    status: 'success',
    results: documents.length,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: {
      documents,
    },
  })
})

// Get document by ID
export const getDocumentById = catchAsync(async (req, res, next) => {
  const document = await Document.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('template', 'title category')

  if (!document) {
    return next(new AppError('No document found with that ID', 404))
  }

  // Check if user is authorized to view this document
  if (
    document.createdBy.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new AppError('You do not have permission to view this document', 403),
    )
  }

  res.status(200).json({
    status: 'success',
    data: {
      document,
    },
  })
})

// Get document by shareable link
export const getDocumentByShareableLink = catchAsync(async (req, res, next) => {
  const document = await Document.findOne({ shareableLink: req.params.link })
    .populate('createdBy', 'name email')
    .populate('template', 'title category')

  if (!document) {
    return next(new AppError('No document found with that link', 404))
  }

  // Check if document is public
  if (!document.isPublic) {
    return next(new AppError('This document is not publicly accessible', 403))
  }

  res.status(200).json({
    status: 'success',
    data: {
      document,
    },
  })
})

// Create a new document
export const createDocument = catchAsync(async (req, res, next) => {
  // Add user ID to request body
  req.body.createdBy = req.user.id

  // Validate required fields
  if (!req.body.title || !req.body.content) {
    return next(new AppError('Title and content are required', 400))
  }

  // Create document
  const newDocument = await Document.create(req.body)

  // Generate PDF if needed
  if (req.body.generatePdf) {
    const pdfBuffer = await generateDocumentPdf(newDocument)
    // Save PDF to file storage and update document with URL
    // This would typically involve uploading to S3 or similar
    // For now, we'll just update the document with a placeholder URL
    newDocument.pdfUrl = `/documents/${newDocument._id}.pdf`
    await newDocument.save()
  }

  res.status(201).json({
    status: 'success',
    data: {
      document: newDocument,
    },
  })
})

// Update a document
export const updateDocument = catchAsync(async (req, res, next) => {
  const document = await Document.findById(req.params.id)

  if (!document) {
    return next(new AppError('No document found with that ID', 404))
  }

  // Check if user is authorized to update this document
  if (
    document.createdBy.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new AppError('You do not have permission to update this document', 403),
    )
  }

  // Update document
  const updatedDocument = await Document.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  )
    .populate('createdBy', 'name email')
    .populate('template', 'title category')

  // Generate PDF if needed
  if (req.body.generatePdf) {
    const pdfBuffer = await generateDocumentPdf(updatedDocument)
    // Save PDF to file storage and update document with URL
    updatedDocument.pdfUrl = `/documents/${updatedDocument._id}.pdf`
    await updatedDocument.save()
  }

  res.status(200).json({
    status: 'success',
    data: {
      document: updatedDocument,
    },
  })
})

// Delete a document
export const deleteDocument = catchAsync(async (req, res, next) => {
  const document = await Document.findById(req.params.id)

  if (!document) {
    return next(new AppError('No document found with that ID', 404))
  }

  // Check if user is authorized to delete this document
  if (
    document.createdBy.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new AppError('You do not have permission to delete this document', 403),
    )
  }

  await Document.findByIdAndDelete(req.params.id)

  res.status(204).json({
    status: 'success',
    data: null,
  })
})

// Generate document from template
export const generateFromTemplate = catchAsync(async (req, res, next) => {
  const { templateId, variables, title } = req.body

  if (!templateId) {
    return next(new AppError('Template ID is required', 400))
  }

  // Get template
  const template = await Template.findById(templateId)

  if (!template) {
    return next(new AppError('No template found with that ID', 404))
  }

  // Check if user is authorized to use this template
  if (
    !template.isPublic &&
    template.createdBy.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new AppError('You do not have permission to use this template', 403),
    )
  }

  // Process template content with variables
  let content = template.content

  if (variables) {
    // Replace variables in content
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}|\\[${key}\\]|<${key}>`, 'g')
      content = content.replace(regex, value)
    }
  }

  // Create document
  const newDocument = await Document.create({
    title: title || template.title,
    content,
    template: template._id,
    variables,
    category: template.category,
    createdBy: req.user.id,
  })

  // Generate PDF
  const pdfBuffer = await generateDocumentPdf(newDocument)
  // Save PDF to file storage and update document with URL
  newDocument.pdfUrl = `/documents/${newDocument._id}.pdf`
  await newDocument.save()

  res.status(201).json({
    status: 'success',
    data: {
      document: newDocument,
    },
  })
})

// Generate document using AI
export const generateWithAI = catchAsync(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return next(new AppError('Only admins can use AI document generation', 403))
  }

  const { prompt, documentType, variables } = req.body

  if (!prompt) {
    return next(
      new AppError('Prompt is required for AI document generation', 400),
    )
  }

  // Generate document content using AI
  const content = await aiService.generateDocumentContent({
    prompt,
    documentType,
    variables,
  })

  // Generate document title using AI
  const title = await aiService.generateDocumentTitle(content)

  // Create document
  const newDocument = await Document.create({
    title,
    content,
    category: documentType || 'other',
    createdBy: req.user.id,
    variables: variables || {},
  })

  // Generate PDF
  const pdfBuffer = await generateDocumentPdf(newDocument)
  // Save PDF to file storage and update document with URL
  newDocument.pdfUrl = `/documents/${newDocument._id}.pdf`
  await newDocument.save()

  res.status(201).json({
    status: 'success',
    data: {
      document: newDocument,
    },
  })
})

// Share document via email
export const shareDocument = catchAsync(async (req, res, next) => {
  const { email, message } = req.body
  const document = await Document.findById(req.params.id)

  if (!document) {
    return next(new AppError('No document found with that ID', 404))
  }

  // Check if user is authorized to share this document
  if (
    document.createdBy.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new AppError('You do not have permission to share this document', 403),
    )
  }

  // Make document public and generate shareable link if not already
  if (!document.isPublic) {
    document.isPublic = true
    document.shareableLink = `doc-${document._id}-${Math.random()
      .toString(36)
      .substring(2, 8)}`
    await document.save()
  }

  // Send email
  await sendEmail({
    to: email,
    subject: `${req.user.name} shared a document with you: ${document.title}`,
    template: 'document-share',
    data: {
      senderName: req.user.name,
      recipientEmail: email,
      documentTitle: document.title,
      documentLink: `${process.env.FRONTEND_URL}/documents/view/${document.shareableLink}`,
      message: message || '',
      companyName: process.env.COMPANY_NAME || 'VAIF TECH',
    },
    attachments: document.pdfUrl
      ? [
          {
            filename: `${document.title}.pdf`,
            path: document.pdfUrl,
          },
        ]
      : [],
  })

  res.status(200).json({
    status: 'success',
    message: `Document shared with ${email}`,
    data: {
      document,
    },
  })
})

// Analyze document
export const analyzeDocument = catchAsync(async (req, res, next) => {
  const document = await Document.findById(req.params.id)

  if (!document) {
    return next(new AppError('No document found with that ID', 404))
  }

  // Check if user is authorized to analyze this document
  if (
    document.createdBy.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new AppError('You do not have permission to analyze this document', 403),
    )
  }

  // Analyze document using AI
  const analysis = await aiService.analyzeDocument(document.content)

  res.status(200).json({
    status: 'success',
    data: {
      analysis,
    },
  })
})

export default {
  getAllDocuments,
  getDocumentById,
  getDocumentByShareableLink,
  createDocument,
  updateDocument,
  deleteDocument,
  generateFromTemplate,
  generateWithAI,
  shareDocument,
  analyzeDocument,
}
