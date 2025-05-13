import Comment from '../models/comment.model.js'
import Post from '../models/post.model.js'
import { catchAsync } from '../utils/error.js'
import { AppError } from '../utils/error.js'
import notificationService from '../services/notification.service.js'

// Get all comments for a post
export const getPostComments = catchAsync(async (req, res, next) => {
  const postId = req.params.postId

  // Check if post exists
  const post = await Post.findById(postId)

  if (!post) {
    return next(new AppError('No post found with that ID', 404))
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  const skip = (page - 1) * limit

  // Build query
  const query = {
    post: postId,
    parentComment: null,
  }

  // Filter by approved comments for non-admin users
  if (!req.user || req.user.role !== 'admin') {
    query.status = 'approved'
  }

  // Execute query with pagination
  const comments = await Comment.find(query)
    .sort(req.query.sort || '-createdAt')
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email profileImage')
    .populate({
      path: 'replies',
      match:
        req.user && req.user.role === 'admin' ? {} : { status: 'approved' },
      options: { sort: { createdAt: 1 } },
      populate: {
        path: 'user',
        select: 'name email profileImage',
      },
    })

  // Get total count for pagination
  const total = await Comment.countDocuments(query)

  res.status(200).json({
    status: 'success',
    results: comments.length,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: {
      comments,
    },
  })
})

// Create a new comment
export const createComment = catchAsync(async (req, res, next) => {
  const { postId } = req.params
  const { content, parentComment } = req.body

  // Check if post exists
  const post = await Post.findById(postId)

  if (!post) {
    return next(new AppError('No post found with that ID', 404))
  }

  // Check if post is published
  if (post.status !== 'published') {
    return next(new AppError('Cannot comment on an unpublished post', 400))
  }

  // Check if parent comment exists if provided
  if (parentComment) {
    const parent = await Comment.findById(parentComment)

    if (!parent) {
      return next(new AppError('No parent comment found with that ID', 404))
    }

    // Check if parent comment belongs to the same post
    if (parent.post.toString() !== postId) {
      return next(
        new AppError('Parent comment does not belong to this post', 400),
      )
    }
  }

  // Create comment
  const newComment = await Comment.create({
    post: postId,
    user: req.user.id,
    content,
    parentComment,
    // Auto-approve comments from admins
    status: req.user.role === 'admin' ? 'approved' : 'pending',
  })

  // Populate user
  await newComment.populate('user', 'name email profileImage')

  // Notify post author if not the same as commenter
  if (post.author.toString() !== req.user.id) {
    await notificationService.createNotification({
      userId: post.author,
      title: 'New comment on your post',
      message: `${req.user.name} commented on your post "${post.title}"`,
      type: 'info',
      category: 'post',
      relatedTo: {
        model: 'Post',
        id: post._id,
      },
      link: `/blog/${post.slug}`,
      sendEmail: true,
    })
  }

  // Notify parent comment author if not the same as commenter
  if (parentComment) {
    const parent = await Comment.findById(parentComment).populate(
      'user',
      'name',
    )

    if (parent && parent.user._id.toString() !== req.user.id) {
      await notificationService.createNotification({
        userId: parent.user._id,
        title: 'New reply to your comment',
        message: `${req.user.name} replied to your comment on "${post.title}"`,
        type: 'info',
        category: 'post',
        relatedTo: {
          model: 'Comment',
          id: parent._id,
        },
        link: `/blog/${post.slug}`,
        sendEmail: true,
      })
    }
  }

  res.status(201).json({
    status: 'success',
    data: {
      comment: newComment,
    },
  })
})

// Update a comment
export const updateComment = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const { content } = req.body

  const comment = await Comment.findById(id)

  if (!comment) {
    return next(new AppError('No comment found with that ID', 404))
  }

  // Check if user is authorized to update this comment
  if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new AppError('You do not have permission to update this comment', 403),
    )
  }

  // Update comment
  comment.content = content

  // Reset status to pending if non-admin user updates
  if (req.user.role !== 'admin') {
    comment.status = 'pending'
  }

  await comment.save()

  // Populate user
  await comment.populate('user', 'name email profileImage')

  res.status(200).json({
    status: 'success',
    data: {
      comment,
    },
  })
})

// Delete a comment
export const deleteComment = catchAsync(async (req, res, next) => {
  const { id } = req.params

  const comment = await Comment.findById(id)

  if (!comment) {
    return next(new AppError('No comment found with that ID', 404))
  }

  // Check if user is authorized to delete this comment
  if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new AppError('You do not have permission to delete this comment', 403),
    )
  }

  // Delete all replies if this is a parent comment
  if (!comment.parentComment) {
    await Comment.deleteMany({ parentComment: id })
  }

  // Delete comment
  await Comment.findByIdAndDelete(id)

  res.status(204).json({
    status: 'success',
    data: null,
  })
})

// Approve a comment (admin only)
export const approveComment = catchAsync(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return next(new AppError('Only admins can approve comments', 403))
  }

  const { id } = req.params

  const comment = await Comment.findById(id)

  if (!comment) {
    return next(new AppError('No comment found with that ID', 404))
  }

  // Update comment status
  comment.status = 'approved'
  await comment.save()

  // Populate user
  await comment.populate('user', 'name email profileImage')

  // Notify comment author
  await notificationService.createNotification({
    userId: comment.user._id,
    title: 'Your comment has been approved',
    message: 'Your comment has been approved and is now visible to others.',
    type: 'success',
    category: 'post',
    relatedTo: {
      model: 'Comment',
      id: comment._id,
    },
    link: `/blog/${(await Post.findById(comment.post)).slug}`,
    sendEmail: true,
  })

  res.status(200).json({
    status: 'success',
    data: {
      comment,
    },
  })
})

// Reject a comment (admin only)
export const rejectComment = catchAsync(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return next(new AppError('Only admins can reject comments', 403))
  }

  const { id } = req.params

  const comment = await Comment.findById(id)

  if (!comment) {
    return next(new AppError('No comment found with that ID', 404))
  }

  // Update comment status
  comment.status = 'rejected'
  await comment.save()

  // Populate user
  await comment.populate('user', 'name email profileImage')

  // Notify comment author
  await notificationService.createNotification({
    userId: comment.user._id,
    title: 'Your comment has been rejected',
    message:
      'Your comment has been rejected and will not be visible to others.',
    type: 'error',
    category: 'post',
    relatedTo: {
      model: 'Comment',
      id: comment._id,
    },
    sendEmail: true,
  })

  res.status(200).json({
    status: 'success',
    data: {
      comment,
    },
  })
})

// Like a comment
export const likeComment = catchAsync(async (req, res, next) => {
  const { id } = req.params

  const comment = await Comment.findById(id)

  if (!comment) {
    return next(new AppError('No comment found with that ID', 404))
  }

  // Check if comment is approved
  if (comment.status !== 'approved') {
    return next(new AppError('Cannot like an unapproved comment', 400))
  }

  // Increment like count
  comment.likeCount += 1
  await comment.save({ validateBeforeSave: false })

  res.status(200).json({
    status: 'success',
    data: {
      likeCount: comment.likeCount,
    },
  })
})

// Get pending comments (admin only)
export const getPendingComments = catchAsync(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return next(new AppError('Only admins can view pending comments', 403))
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  const skip = (page - 1) * limit

  // Execute query with pagination
  const comments = await Comment.find({ status: 'pending' })
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email profileImage')
    .populate('post', 'title slug')

  // Get total count for pagination
  const total = await Comment.countDocuments({ status: 'pending' })

  res.status(200).json({
    status: 'success',
    results: comments.length,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: {
      comments,
    },
  })
})

export default {
  getPostComments,
  createComment,
  updateComment,
  deleteComment,
  approveComment,
  rejectComment,
  likeComment,
  getPendingComments,
}
