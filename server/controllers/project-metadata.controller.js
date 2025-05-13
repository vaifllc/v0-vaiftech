import { catchAsync } from '../utils/error.js'
import { AppError } from '../utils/error.js'
import {
  ProjectType,
  ProjectCategory,
  Industry,
  Feature,
  Technology,
  Timeline,
} from '../models/project-metadata.model.js'

// Get all project types
export const getAllProjectTypes = catchAsync(async (req, res) => {
  const projectTypes = await ProjectType.find({ active: true })

  res.status(200).json({
    status: 'success',
    results: projectTypes.length,
    data: {
      projectTypes,
    },
  })
})

// Get all project categories
export const getAllProjectCategories = catchAsync(async (req, res) => {
  const projectCategories = await ProjectCategory.find({ active: true })

  res.status(200).json({
    status: 'success',
    results: projectCategories.length,
    data: {
      projectCategories,
    },
  })
})

// Get all industries
export const getAllIndustries = catchAsync(async (req, res) => {
  const industries = await Industry.find({ active: true })

  res.status(200).json({
    status: 'success',
    results: industries.length,
    data: {
      industries,
    },
  })
})

// Get all features
export const getAllFeatures = catchAsync(async (req, res) => {
  const features = await Feature.find({ active: true })

  res.status(200).json({
    status: 'success',
    results: features.length,
    data: {
      features,
    },
  })
})

// Get all technologies
export const getAllTechnologies = catchAsync(async (req, res) => {
  const technologies = await Technology.find({ active: true })

  res.status(200).json({
    status: 'success',
    results: technologies.length,
    data: {
      technologies,
    },
  })
})

// Get all timelines
export const getAllTimelines = catchAsync(async (req, res) => {
  const timelines = await Timeline.find({ active: true })

  res.status(200).json({
    status: 'success',
    results: timelines.length,
    data: {
      timelines,
    },
  })
})

// Get compatible features for a project type
export const getCompatibleFeatures = catchAsync(async (req, res, next) => {
  const { typeCode } = req.params

  if (!typeCode) {
    return next(new AppError('Project type code is required', 400))
  }

  const features = await Feature.find({
    compatibleTypes: typeCode,
    active: true,
  })

  res.status(200).json({
    status: 'success',
    results: features.length,
    data: {
      features,
    },
  })
})

// Get compatible project types for a category
export const getCompatibleProjectTypes = catchAsync(async (req, res, next) => {
  const { categoryCode } = req.params

  if (!categoryCode) {
    return next(new AppError('Project category code is required', 400))
  }

  const category = await ProjectCategory.findOne({
    code: categoryCode,
    active: true,
  })

  if (!category) {
    return next(new AppError('Project category not found', 404))
  }

  const projectTypes = await ProjectType.find({
    code: { $in: category.compatibleTypes },
    active: true,
  })

  res.status(200).json({
    status: 'success',
    results: projectTypes.length,
    data: {
      projectTypes,
    },
  })
})

// CRUD operations for project types (admin only)
export const createProjectType = catchAsync(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return next(new AppError('Only admins can create project types', 403))
  }

  const newProjectType = await ProjectType.create(req.body)

  res.status(201).json({
    status: 'success',
    data: {
      projectType: newProjectType,
    },
  })
})

export const updateProjectType = catchAsync(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return next(new AppError('Only admins can update project types', 403))
  }

  const projectType = await ProjectType.findOneAndUpdate(
    { code: req.params.code },
    req.body,
    {
      new: true,
      runValidators: true,
    },
  )

  if (!projectType) {
    return next(new AppError('No project type found with that code', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      projectType,
    },
  })
})

export const deleteProjectType = catchAsync(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return next(new AppError('Only admins can delete project types', 403))
  }

  const projectType = await ProjectType.findOneAndUpdate(
    { code: req.params.code },
    { active: false },
    { new: true },
  )

  if (!projectType) {
    return next(new AppError('No project type found with that code', 404))
  }

  res.status(200).json({
    status: 'success',
    data: null,
  })
})

// Similar CRUD operations for other metadata models...

export default {
  getAllProjectTypes,
  getAllProjectCategories,
  getAllIndustries,
  getAllFeatures,
  getAllTechnologies,
  getAllTimelines,
  getCompatibleFeatures,
  getCompatibleProjectTypes,
  createProjectType,
  updateProjectType,
  deleteProjectType,
  // Add other CRUD operations for other metadata models
}
