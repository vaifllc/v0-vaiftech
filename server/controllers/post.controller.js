import Post from '../models/post.model.js';
import Comment from '../models/comment.model.js';
import { catchAsync } from '../utils/error.js';
import { AppError } from '../utils/error.js';
import notificationService from '../services/notification.service.js';

// Get all posts
export const getAllPosts = catchAsync(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Build query
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
  excludedFields.forEach(el => delete queryObj[el]);

  // Filter by published posts for non-admin users
  if (!req.user || req.user.role !== 'admin') {
    queryObj.status = 'published';
  }

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

  let query = Post.find(JSON.parse(queryStr));

  // Search functionality
  if (req.query.search) {
    query = query.find({
      $text: { $search: req.query.search }
    });
  }

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-publishedAt -createdAt');
  }

  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  // Execute query with pagination
  const posts = await query
    .skip(skip)
    .limit(limit)
    .populate('author', 'name email profileImage');

  // Get total count for pagination
  const total = await Post.countDocuments(JSON.parse(queryStr));

  res.status(200).json({
    status: 'success',
    results: posts.length,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit)
    },
    data: {
      posts
    }
  });
});

// Get post by ID or slug
export const getPost = catchAsync(async (req, res, next) => {
  const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: req.params.id }
    : { slug: req.params.id };

  // Add status filter for non-admin users
  if (!req.user || req.user.role !== 'admin') {
    query.status = 'published';
  }

  const post = await Post.findOne(query)
    .populate('author', 'name email profileImage')
    .populate({
      path: 'comments',
      match: { parentComment: null, status: 'approved' },
      options: { sort: { createdAt: -1 } },
      populate: [
        {
          path: 'user',
          select: 'name email profileImage'
        },
        {
          path: 'replies',
          match: { status: 'approved' },
          options: { sort: { createdAt: 1 } },
          populate: {
            path: 'user',
            select: 'name email profileImage'
          }
        }
      ]
    });

  if (!post) {
    return next(new AppError('No post found with that ID or slug', 404));
  }

  // Increment view count
  if (req.query.view === 'true') {
    post.viewCount += 1;
    await post.save({ validateBeforeSave: false });
  }

  res.status(200).json({
    status: 'success',
    data: {
      post
    }
  });
});

// Create a new post
export const createPost = catchAsync(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return next(new AppError('Only admins can create posts', 403));
  }

  // Add author to request body
  req.body.author = req.user.id;

  // Create post
  const newPost = await Post.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      post: newPost
    }
  });
});

// Update a post
export const updatePost = catchAsync(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return next(new AppError('Only admins can update posts', 403));
  }

  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  // Update post
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  ).populate('author', 'name email profileImage');

  res.status(200).json({
    status: 'success',
    data: {
      post: updatedPost
    }
  });
});

// Delete a post
export const deletePost = catchAsync(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return next(new AppError('Only admins can delete posts', 403));
  }

  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  // Delete all comments associated with the post
  await Comment.deleteMany({ post: req.params.id });

  // Delete post
  await Post.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Like a post
export const likePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  // Check if post is published
  if (post.status !== 'published') {
    return next(new AppError('Cannot like an unpublished post', 400));
  }

  // Increment like count
  post.likeCount += 1;
  await post.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    data: {
      likeCount: post.likeCount
    }
  });
});

// Get post categories
export const getCategories = catchAsync(async (req, res) => {
  const categories = await Post.aggregate([
    { $match: { status: 'published' } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      categories: categories.map(cat => ({
        name: cat._id,
        count: cat.count
      }))
    }
  });
});

// Get post tags
export const getTags = catchAsync(async (req, res) => {
  const tags = await Post.aggregate([
    { $match: { status: 'published' } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  res.status(200).json({
    status: 'success',
    results: tags.length,
    data: {
      tags: tags.map(tag => ({
        name: tag._id,
        count: tag.count
      }))
    }
  });
});

export default {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getCategories,
  getTags
};