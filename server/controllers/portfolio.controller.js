import Portfolio from '../models/portfolio.model.js'
import { catchAsync } from '../utils/error.js'
import { AppError } from '../utils/error.js'
import { deleteRelatedFiles } from '../utils/file.js'

// Get all portfolio projects
export const getAllProjects = catchAsync(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  const skip = (page - 1) * limit

  // Build query
  const queryObj = { ...req.query }
  const excludedFields = ['page', 'sort', 'limit', 'fields']
  excludedFields.forEach((el) => delete queryObj[el])

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj)
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

  let query = Portfolio.find(JSON.parse(queryStr))

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
  const projects = await query.skip(skip).limit(limit)

  // Get total count for pagination
  const total = await Portfolio.countDocuments(JSON.parse(queryStr))

  res.status(200).json({
    status: 'success',
    results: projects.length,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: {
      projects,
    },
  })
})

// Get featured portfolio projects
export const getFeaturedProjects = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 6

  const projects = await Portfolio.find({ isFeatured: true })
    .sort('order -createdAt')
    .limit(limit)
    .select(
      'title shortDescription thumbnail projectType technologies slug client.name startDate endDate',
    )

  res.status(200).json({
    status: 'success',
    results: projects.length,
    data: {
      projects,
    },
  })
})

// Get portfolio project by ID
export const getProjectById = catchAsync(async (req, res, next) => {
  const project = await Portfolio.findById(req.params.id)

  if (!project) {
    return next(new AppError('No project found with that ID', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      project,
    },
  })
})

// Get portfolio project by slug
export const getProjectBySlug = catchAsync(async (req, res, next) => {
  const project = await Portfolio.findOne({ slug: req.params.slug })

  if (!project) {
    return next(new AppError('No project found with that slug', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      project,
    },
  })
})

// Create a new portfolio project
export const createProject = catchAsync(async (req, res) => {
  // Add user ID to request body
  req.body.user = req.user.id

  const newProject = await Portfolio.create(req.body)

  res.status(201).json({
    status: 'success',
    data: {
      project: newProject,
    },
  })
})

// Update portfolio project
export const updateProject = catchAsync(async (req, res, next) => {
  const project = await Portfolio.findById(req.params.id)

  if (!project) {
    return next(new AppError('No project found with that ID', 404))
  }

  // Check if user is authorized to update this project
  if (project.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new AppError('You do not have permission to update this project', 403),
    )
  }

  // Update project
  const updatedProject = await Portfolio.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  )

  res.status(200).json({
    status: 'success',
    data: {
      project: updatedProject,
    },
  })
})

// Delete portfolio project
export const deleteProject = catchAsync(async (req, res, next) => {
  const project = await Portfolio.findById(req.params.id)

  if (!project) {
    return next(new AppError('No project found with that ID', 404))
  }

  // Check if user is authorized to delete this project
  if (project.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new AppError('You do not have permission to delete this project', 403),
    )
  }

  // Delete project
  await Portfolio.findByIdAndDelete(req.params.id)

  // Delete related files (images, etc.)
  await deleteRelatedFiles('portfolio', req.params.id)

  res.status(204).json({
    status: 'success',
    data: null,
  })
})

// Get user portfolio projects
export const getUserProjects = catchAsync(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  const skip = (page - 1) * limit

  // Build query
  const query = { user: req.user.id }

  // Add filters if provided
  if (req.query.projectType) {
    query.projectType = req.query.projectType
  }

  if (req.query.status) {
    query.status = req.query.status
  }

  if (req.query.isFeatured) {
    query.isFeatured = req.query.isFeatured === 'true'
  }

  // Execute query with pagination
  const projects = await Portfolio.find(query)
    .sort(req.query.sort || '-createdAt')
    .skip(skip)
    .limit(limit)

  // Get total count for pagination
  const total = await Portfolio.countDocuments(query)

  res.status(200).json({
    status: 'success',
    results: projects.length,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: {
      projects,
    },
  })
})

// Toggle featured status
export const toggleFeatured = catchAsync(async (req, res, next) => {
  const project = await Portfolio.findById(req.params.id)

  if (!project) {
    return next(new AppError('No project found with that ID', 404))
  }

  // Check if user is authorized to update this project
  if (project.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new AppError('You do not have permission to update this project', 403),
    )
  }

  // Toggle featured status
  project.isFeatured = !project.isFeatured
  await project.save()

  res.status(200).json({
    status: 'success',
    data: {
      project,
    },
  })
})

// Update project order
export const updateProjectOrder = catchAsync(async (req, res, next) => {
  const { order } = req.body

  if (!order) {
    return next(new AppError('Order is required', 400))
  }

  const project = await Portfolio.findById(req.params.id)

  if (!project) {
    return next(new AppError('No project found with that ID', 404))
  }

  // Check if user is authorized to update this project
  if (project.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new AppError('You do not have permission to update this project', 403),
    )
  }

  // Update order
  project.order = order
  await project.save()

  res.status(200).json({
    status: 'success',
    data: {
      project,
    },
  })
})

// Get projects by technology
export const getProjectsByTechnology = catchAsync(async (req, res) => {
  const { technology } = req.params

  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  const skip = (page - 1) * limit

  // Build query
  const query = { technologies: technology }

  // Execute query with pagination
  const projects = await Portfolio.find(query)
    .sort(req.query.sort || '-createdAt')
    .skip(skip)
    .limit(limit)

  // Get total count for pagination
  const total = await Portfolio.countDocuments(query)

  res.status(200).json({
    status: 'success',
    results: projects.length,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: {
      projects,
    },
  })
})

// Get projects by type
export const getProjectsByType = catchAsync(async (req, res) => {
  const { type } = req.params

  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  const skip = (page - 1) * limit

  // Build query
  const query = { projectType: type }

  // Execute query with pagination
  const projects = await Portfolio.find(query)
    .sort(req.query.sort || '-createdAt')
    .skip(skip)
    .limit(limit)

  // Get total count for pagination
  const total = await Portfolio.countDocuments(query)

  res.status(200).json({
    status: 'success',
    results: projects.length,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: {
      projects,
    },
  })
})

// Get project statistics
export const getProjectStats = catchAsync(async (req, res) => {
  const stats = await Portfolio.aggregate([
    {
      $match: { user: req.user._id },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgDuration: { $avg: '$durationInDays' },
      },
    },
    {
      $sort: { count: -1 },
    },
  ])

  // Get technology stats
  const techStats = await Portfolio.aggregate([
    {
      $match: { user: req.user._id },
    },
    {
      $unwind: '$technologies',
    },
    {
      $group: {
        _id: '$technologies',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 10,
    },
  ])

  // Get project type stats
  const typeStats = await Portfolio.aggregate([
    {
      $match: { user: req.user._id },
    },
    {
      $group: {
        _id: '$projectType',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ])

  res.status(200).json({
    status: 'success',
    data: {
      statusStats: stats,
      techStats,
      typeStats,
    },
  })
})

export default {
  getAllProjects,
  getFeaturedProjects,
  getProjectById,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  getUserProjects,
  toggleFeatured,
  updateProjectOrder,
  getProjectsByTechnology,
  getProjectsByType,
  getProjectStats,
}
