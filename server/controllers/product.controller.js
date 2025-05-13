import Product from '../models/product.model.js'
import { ApiError, asyncHandler } from '../middleware/error.middleware.js'
import slugify from 'slugify'

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 12
  const skip = (page - 1) * limit

  // Build filter object
  const filter = {}

  // Price range filter
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {}
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice)
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice)
  }

  // Category filter
  if (req.query.category) {
    filter.category = req.query.category
  }

  // Framework filter
  if (req.query.framework) {
    filter.frameworks = { $in: [req.query.framework] }
  }

  // Experience level filter
  if (req.query.experienceLevel) {
    filter.experienceLevel = req.query.experienceLevel
  }

  // Tags filter
  if (req.query.tags) {
    const tags = req.query.tags.split(',')
    filter.tags = { $in: tags }
  }

  // Featured filter
  if (req.query.featured === 'true') {
    filter.featured = true
  }

  // Best seller filter
  if (req.query.bestSeller === 'true') {
    filter.bestSeller = true
  }

  // New release filter
  if (req.query.newRelease === 'true') {
    filter.newRelease = true
  }

  // On sale filter
  if (req.query.onSale === 'true') {
    filter.onSale = true
  }

  // Search query
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
      { tags: { $in: [new RegExp(req.query.search, 'i')] } },
    ]
  }

  // Sort options
  let sortOption = {}
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'price-asc':
        sortOption = { price: 1 }
        break
      case 'price-desc':
        sortOption = { price: -1 }
        break
      case 'newest':
        sortOption = { createdAt: -1 }
        break
      case 'rating':
        sortOption = { 'rating.average': -1 }
        break
      case 'popularity':
        sortOption = { 'rating.count': -1 }
        break
      default:
        sortOption = { createdAt: -1 }
    }
  } else {
    sortOption = { createdAt: -1 }
  }

  const products = await Product.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(limit)

  const total = await Product.countDocuments(filter)

  res.json({
    success: true,
    data: products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  })
})

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 6

  const products = await Product.find({ featured: true })
    .sort({ createdAt: -1 })
    .limit(limit)

  res.json({
    success: true,
    data: products,
  })
})

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 12
  const skip = (page - 1) * limit

  const products = await Product.find({ category: req.params.category })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await Product.countDocuments({ category: req.params.category })

  res.json({
    success: true,
    data: products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  })
})

// @desc    Get products by framework
// @route   GET /api/products/framework/:framework
// @access  Public
export const getProductsByFramework = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 12
  const skip = (page - 1) * limit

  const products = await Product.find({
    frameworks: { $in: [req.params.framework] },
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await Product.countDocuments({
    frameworks: { $in: [req.params.framework] },
  })

  res.json({
    success: true,
    data: products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  })
})

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
export const searchProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 12
  const skip = (page - 1) * limit

  if (!req.query.q) {
    throw new ApiError('Search query is required', 400)
  }

  const searchQuery = req.query.q

  const products = await Product.find({
    $or: [
      { name: { $regex: searchQuery, $options: 'i' } },
      { description: { $regex: searchQuery, $options: 'i' } },
      { tags: { $in: [new RegExp(searchQuery, 'i')] } },
    ],
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await Product.countDocuments({
    $or: [
      { name: { $regex: searchQuery, $options: 'i' } },
      { description: { $regex: searchQuery, $options: 'i' } },
      { tags: { $in: [new RegExp(searchQuery, 'i')] } },
    ],
  })

  res.json({
    success: true,
    data: products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  })
})

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    res.json({
      success: true,
      data: product,
    })
  } else {
    throw new ApiError('Product not found', 404)
  }
})

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    shortDescription,
    price,
    salePrice,
    onSale,
    category,
    frameworks,
    experienceLevel,
    features,
    technicalSpecs,
    mainImage,
    images,
    tags,
    downloadable,
    downloadUrl,
    demoUrl,
    license,
    featured,
    bestSeller,
    newRelease,
    stock,
  } = req.body

  // Create slug from name
  const slug = slugify(name, { lower: true })

  // Check if product with same slug exists
  const productExists = await Product.findOne({ slug })

  if (productExists) {
    throw new ApiError('Product with this name already exists', 400)
  }

  const product = await Product.create({
    name,
    slug,
    description,
    shortDescription,
    price,
    salePrice,
    onSale,
    category,
    frameworks,
    experienceLevel,
    features,
    technicalSpecs,
    mainImage,
    images,
    tags,
    downloadable,
    downloadUrl,
    demoUrl,
    license,
    featured,
    bestSeller,
    newRelease,
    stock,
  })

  if (product) {
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully',
    })
  } else {
    throw new ApiError('Invalid product data', 400)
  }
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    throw new ApiError('Product not found', 404)
  }

  // If name is changed, update slug
  if (req.body.name && req.body.name !== product.name) {
    req.body.slug = slugify(req.body.name, { lower: true })

    // Check if product with same slug exists
    const productExists = await Product.findOne({
      slug: req.body.slug,
      _id: { $ne: req.params.id },
    })

    if (productExists) {
      throw new ApiError('Product with this name already exists', 400)
    }
  }

  // Update product
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true },
  )

  res.json({
    success: true,
    data: updatedProduct,
    message: 'Product updated successfully',
  })
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    throw new ApiError('Product not found', 404)
  }

  await product.deleteOne()

  res.json({
    success: true,
    message: 'Product deleted successfully',
  })
})
