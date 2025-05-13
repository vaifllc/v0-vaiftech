import Template from '../models/template.model.js'
import { catchAsync } from '../utils/error.js'
import { AppError } from '../utils/error.js'
import aiService from '../services/ai.service.js'

// Get all templates
export const getAllTemplates = catchAsync(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  const skip = (page - 1) * limit

  // Build query
  const queryObj = { ...req.query }
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'search']
  excludedFields.forEach((el) => delete queryObj[el])

  // Filter by public templates or user's own templates
  if (req.user.role !== 'admin') {
    queryObj.$or = [{ isPublic: true }, { createdBy: req.user.id }]
  }

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj)
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

  let query = Template.find(JSON.parse(queryStr))

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
  const templates = await query
    .skip(skip)
    .limit(limit)
    .populate('createdBy', 'name email')

  // Get total count for pagination
  const total = await Template.countDocuments(JSON.parse(queryStr))

  res.status(200).json({
    status: 'success',
    results: templates.length,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: {
      templates,
    },
  })
})

// Get template by ID
export const getTemplateById = catchAsync(async (req, res, next) => {
  const template = await Template.findById(req.params.id).populate(
    'createdBy',
    'name email',
  )

  if (!template) {
    return next(new AppError('No template found with that ID', 404))
  }

  // Check if user is authorized to view this template
  if (
    !template.isPublic &&
    template.createdBy.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new AppError('You do not have permission to view this template', 403),
    )
  }

  res.status(200).json({
    status: 'success',
    data: {
      template,
    },
  })
})

// Create a new template
export const createTemplate = catchAsync(async (req, res, next) => {
  // Add user ID to request body
  req.body.createdBy = req.user.id

  // Validate required fields
  if (!req.body.title || !req.body.content || !req.body.category) {
    return next(new AppError('Title, content, and category are required', 400))
  }

  // Extract variables from template content if not provided
  if (!req.body.variables || !req.body.variables.length) {
    const extractedVariables = await aiService.extractTemplateVariables(
      req.body.content,
    )
    req.body.variables = extractedVariables
  }

  // Create template
  const newTemplate = await Template.create(req.body)

  res.status(201).json({
    status: 'success',
    data: {
      template: newTemplate,
    },
  })
})

// Update a template
export const updateTemplate = catchAsync(async (req, res, next) => {
  const template = await Template.findById(req.params.id)

  if (!template) {
    return next(new AppError('No template found with that ID', 404))
  }

  // Check if user is authorized to update this template
  if (
    template.createdBy.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new AppError('You do not have permission to update this template', 403),
    )
  }

  // Extract variables from template content if content is updated and variables not provided
  if (req.body.content && (!req.body.variables || !req.body.variables.length)) {
    const extractedVariables = await aiService.extractTemplateVariables(
      req.body.content,
    )
    req.body.variables = extractedVariables
  }

  // Update template
  const updatedTemplate = await Template.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  ).populate('createdBy', 'name email')

  res.status(200).json({
    status: 'success',
    data: {
      template: updatedTemplate,
    },
  })
})

// Delete a template
export const deleteTemplate = catchAsync(async (req, res, next) => {
  const template = await Template.findById(req.params.id)

  if (!template) {
    return next(new AppError('No template found with that ID', 404))
  }

  // Check if user is authorized to delete this template
  if (
    template.createdBy.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new AppError('You do not have permission to delete this template', 403),
    )
  }

  await Template.findByIdAndDelete(req.params.id)

  res.status(204).json({
    status: 'success',
    data: null,
  })
})

// Extract variables from template content
export const extractVariables = catchAsync(async (req, res, next) => {
  const { content } = req.body

  if (!content) {
    return next(new AppError('Template content is required', 400))
  }

  const variables = await aiService.extractTemplateVariables(content)

  res.status(200).json({
    status: 'success',
    data: {
      variables,
    },
  })
})

export default {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  extractVariables,
}
