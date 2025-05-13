import Comparison from '../models/comparison.model.js'
import ProductRating from '../models/product-rating.model.js'
import Product from '../models/product.model.js'
import { catchAsync } from '../utils/error.js'
import { AppError } from '../utils/error.js'

// Get all comparisons for a user
export const getUserComparisons = catchAsync(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  const skip = (page - 1) * limit

  // Build query
  const query = { user: req.user.id }

  // Execute query with pagination
  const comparisons = await Comparison.find(query)
    .sort('-updatedAt')
    .skip(skip)
    .limit(limit)
    .populate('products', 'name price thumbnail description')

  // Get total count for pagination
  const total = await Comparison.countDocuments(query)

  res.status(200).json({
    status: 'success',
    results: comparisons.length,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: {
      comparisons,
    },
  })
})

// Get a single comparison by ID
export const getComparisonById = catchAsync(async (req, res, next) => {
  const comparison = await Comparison.findById(req.params.id)
    .populate(
      'products',
      'name price thumbnail description features specifications category tags',
    )
    .populate('user', 'name')

  if (!comparison) {
    return next(new AppError('No comparison found with that ID', 404))
  }

  // Check if user is authorized to view this comparison
  if (
    !comparison.isPublic &&
    comparison.user.id !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new AppError('You do not have permission to view this comparison', 403),
    )
  }

  // Get product ratings for this comparison
  const productRatings = await ProductRating.find({
    comparison: comparison._id,
    user: req.user.id,
  })

  // Update last viewed timestamp
  comparison.lastViewed = Date.now()
  await comparison.save({ validateBeforeSave: false })

  res.status(200).json({
    status: 'success',
    data: {
      comparison,
      productRatings,
    },
  })
})

// Get a comparison by shareable link
export const getComparisonByShareableLink = catchAsync(
  async (req, res, next) => {
    const comparison = await Comparison.findOne({
      shareableLink: req.params.link,
    })
      .populate(
        'products',
        'name price thumbnail description features specifications category tags',
      )
      .populate('user', 'name')

    if (!comparison) {
      return next(new AppError('No comparison found with that link', 404))
    }

    // Check if comparison is public
    if (!comparison.isPublic) {
      return next(new AppError('This comparison is no longer public', 403))
    }

    // Get product ratings for this comparison (if user is authenticated)
    let productRatings = []
    if (req.user) {
      productRatings = await ProductRating.find({
        comparison: comparison._id,
        user: req.user.id,
      })
    }

    res.status(200).json({
      status: 'success',
      data: {
        comparison,
        productRatings,
      },
    })
  },
)

// Create a new comparison
export const createComparison = catchAsync(async (req, res, next) => {
  // Check if products exist
  if (!req.body.products || !req.body.products.length) {
    return next(
      new AppError('Please provide at least one product for comparison', 400),
    )
  }

  // Validate products
  const productIds = req.body.products
  const products = await Product.find({ _id: { $in: productIds } })

  if (products.length !== productIds.length) {
    return next(new AppError('One or more products not found', 404))
  }

  // Create comparison
  const newComparison = await Comparison.create({
    user: req.user.id,
    title: req.body.title || 'My Comparison',
    products: productIds,
    criteria: req.body.criteria || [
      { name: 'Features', weight: 1 },
      { name: 'Performance', weight: 1 },
      { name: 'Value for Money', weight: 1 },
      { name: 'Quality', weight: 1 },
      { name: 'Support', weight: 1 },
    ],
    notes: req.body.notes,
    isPublic: req.body.isPublic || false,
  })

  res.status(201).json({
    status: 'success',
    data: {
      comparison: newComparison,
    },
  })
})

// Update a comparison
export const updateComparison = catchAsync(async (req, res, next) => {
  const comparison = await Comparison.findById(req.params.id)

  if (!comparison) {
    return next(new AppError('No comparison found with that ID', 404))
  }

  // Check if user is authorized to update this comparison
  if (comparison.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new AppError('You do not have permission to update this comparison', 403),
    )
  }

  // Update comparison
  const updatedComparison = await Comparison.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      products: req.body.products,
      criteria: req.body.criteria,
      notes: req.body.notes,
      isPublic: req.body.isPublic,
    },
    {
      new: true,
      runValidators: true,
    },
  ).populate('products', 'name price thumbnail description')

  res.status(200).json({
    status: 'success',
    data: {
      comparison: updatedComparison,
    },
  })
})

// Delete a comparison
export const deleteComparison = catchAsync(async (req, res, next) => {
  const comparison = await Comparison.findById(req.params.id)

  if (!comparison) {
    return next(new AppError('No comparison found with that ID', 404))
  }

  // Check if user is authorized to delete this comparison
  if (comparison.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new AppError('You do not have permission to delete this comparison', 403),
    )
  }

  // Delete comparison
  await Comparison.findByIdAndDelete(req.params.id)

  // Delete related product ratings
  await ProductRating.deleteMany({ comparison: req.params.id })

  res.status(204).json({
    status: 'success',
    data: null,
  })
})

// Add a product to a comparison
export const addProductToComparison = catchAsync(async (req, res, next) => {
  const { productId } = req.body

  if (!productId) {
    return next(new AppError('Please provide a product ID', 400))
  }

  // Check if product exists
  const product = await Product.findById(productId)

  if (!product) {
    return next(new AppError('No product found with that ID', 404))
  }

  // Get comparison
  const comparison = await Comparison.findById(req.params.id)

  if (!comparison) {
    return next(new AppError('No comparison found with that ID', 404))
  }

  // Check if user is authorized to update this comparison
  if (comparison.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new AppError('You do not have permission to update this comparison', 403),
    )
  }

  // Check if product is already in the comparison
  if (comparison.products.includes(productId)) {
    return next(new AppError('Product is already in the comparison', 400))
  }

  // Check if comparison already has maximum number of products
  if (comparison.products.length >= 10) {
    return next(
      new AppError('Comparison cannot have more than 10 products', 400),
    )
  }

  // Add product to comparison
  comparison.products.push(productId)
  await comparison.save()

  // Populate products for response
  const updatedComparison = await Comparison.findById(req.params.id).populate(
    'products',
    'name price thumbnail description',
  )

  res.status(200).json({
    status: 'success',
    data: {
      comparison: updatedComparison,
    },
  })
})

// Remove a product from a comparison
export const removeProductFromComparison = catchAsync(
  async (req, res, next) => {
    const { productId } = req.params

    // Get comparison
    const comparison = await Comparison.findById(req.params.id)

    if (!comparison) {
      return next(new AppError('No comparison found with that ID', 404))
    }

    // Check if user is authorized to update this comparison
    if (
      comparison.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(
        new AppError(
          'You do not have permission to update this comparison',
          403,
        ),
      )
    }

    // Check if product is in the comparison
    if (!comparison.products.includes(productId)) {
      return next(new AppError('Product is not in the comparison', 400))
    }

    // Check if comparison would have at least one product after removal
    if (comparison.products.length <= 1) {
      return next(
        new AppError('Comparison must have at least one product', 400),
      )
    }

    // Remove product from comparison
    comparison.products = comparison.products.filter(
      (product) => product.toString() !== productId,
    )
    await comparison.save()

    // Populate products for response
    const updatedComparison = await Comparison.findById(req.params.id).populate(
      'products',
      'name price thumbnail description',
    )

    res.status(200).json({
      status: 'success',
      data: {
        comparison: updatedComparison,
      },
    })
  },
)

// Rate a product in a comparison
export const rateProduct = catchAsync(async (req, res, next) => {
  const { productId, criteria, notes, overallScore } = req.body

  if (!productId || !criteria) {
    return next(
      new AppError('Please provide product ID and criteria ratings', 400),
    )
  }

  // Check if product exists
  const product = await Product.findById(productId)

  if (!product) {
    return next(new AppError('No product found with that ID', 404))
  }

  // Get comparison
  const comparison = await Comparison.findById(req.params.id)

  if (!comparison) {
    return next(new AppError('No comparison found with that ID', 404))
  }

  // Check if user is authorized to update this comparison
  if (comparison.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new AppError('You do not have permission to update this comparison', 403),
    )
  }

  // Check if product is in the comparison
  if (!comparison.products.includes(productId)) {
    return next(new AppError('Product is not in the comparison', 400))
  }

  // Check if rating already exists
  let productRating = await ProductRating.findOne({
    user: req.user.id,
    product: productId,
    comparison: comparison._id,
  })

  if (productRating) {
    // Update existing rating
    productRating.criteria = criteria
    productRating.notes = notes
    productRating.overallScore = overallScore
    await productRating.save()
  } else {
    // Create new rating
    productRating = await ProductRating.create({
      user: req.user.id,
      product: productId,
      comparison: comparison._id,
      criteria,
      notes,
      overallScore,
    })
  }

  res.status(200).json({
    status: 'success',
    data: {
      productRating,
    },
  })
})

// Get product ratings for a comparison
export const getProductRatings = catchAsync(async (req, res, next) => {
  const comparison = await Comparison.findById(req.params.id)

  if (!comparison) {
    return next(new AppError('No comparison found with that ID', 404))
  }

  // Check if user is authorized to view this comparison
  if (
    !comparison.isPublic &&
    comparison.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new AppError('You do not have permission to view this comparison', 403),
    )
  }

  // Get product ratings for this comparison
  const productRatings = await ProductRating.find({
    comparison: comparison._id,
    user: req.user.id,
  })

  res.status(200).json({
    status: 'success',
    results: productRatings.length,
    data: {
      productRatings,
    },
  })
})

// Toggle public status of a comparison
export const togglePublicStatus = catchAsync(async (req, res, next) => {
  const comparison = await Comparison.findById(req.params.id)

  if (!comparison) {
    return next(new AppError('No comparison found with that ID', 404))
  }

  // Check if user is authorized to update this comparison
  if (comparison.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new AppError('You do not have permission to update this comparison', 403),
    )
  }

  // Toggle public status
  comparison.isPublic = !comparison.isPublic
  await comparison.save()

  res.status(200).json({
    status: 'success',
    data: {
      comparison,
    },
  })
})

// Get public comparisons
export const getPublicComparisons = catchAsync(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  const skip = (page - 1) * limit

  // Build query
  const query = { isPublic: true }

  // Execute query with pagination
  const comparisons = await Comparison.find(query)
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)
    .populate('products', 'name price thumbnail')
    .populate('user', 'name')

  // Get total count for pagination
  const total = await Comparison.countDocuments(query)

  res.status(200).json({
    status: 'success',
    results: comparisons.length,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: {
      comparisons,
    },
  })
})

// Get comparison statistics
export const getComparisonStats = catchAsync(async (req, res) => {
  // Get total number of comparisons for user
  const totalComparisons = await Comparison.countDocuments({
    user: req.user.id,
  })

  // Get total number of public comparisons for user
  const publicComparisons = await Comparison.countDocuments({
    user: req.user.id,
    isPublic: true,
  })

  // Get most compared products
  const mostComparedProducts = await Comparison.aggregate([
    { $match: { user: req.user._id } },
    { $unwind: '$products' },
    { $group: { _id: '$products', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    { $unwind: '$productDetails' },
    {
      $project: {
        _id: 1,
        count: 1,
        name: '$productDetails.name',
        thumbnail: '$productDetails.thumbnail',
      },
    },
  ])

  // Get recent comparisons
  const recentComparisons = await Comparison.find({ user: req.user.id })
    .sort('-updatedAt')
    .limit(5)
    .populate('products', 'name thumbnail')

  res.status(200).json({
    status: 'success',
    data: {
      totalComparisons,
      publicComparisons,
      mostComparedProducts,
      recentComparisons,
    },
  })
})

export default {
  getUserComparisons,
  getComparisonById,
  getComparisonByShareableLink,
  createComparison,
  updateComparison,
  deleteComparison,
  addProductToComparison,
  removeProductFromComparison,
  rateProduct,
  getProductRatings,
  togglePublicStatus,
  getPublicComparisons,
  getComparisonStats,
}
